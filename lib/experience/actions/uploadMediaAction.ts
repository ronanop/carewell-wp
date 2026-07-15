"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

import { auth } from "@/auth";
import { requirePermission } from "@/lib/experience/rbac";
import type { MediaRef } from "@/types/wordpress-media";

export type UploadSizedImageResult =
  | { ok: true; data: MediaRef }
  | { ok: false; message: string };

function wordpressRestBase(): string | null {
  const graphql = process.env.WORDPRESS_GRAPHQL_ENDPOINT?.trim();
  if (!graphql) return null;
  try {
    const url = new URL(graphql);
    return `${url.origin}/wp-json/wp/v2`;
  } catch {
    return null;
  }
}

function hasWordpressUploadCreds(): boolean {
  return Boolean(
    process.env.WORDPRESS_USERNAME?.trim() &&
      process.env.WORDPRESS_APPLICATION_PASSWORD?.trim(),
  );
}

async function uploadToWordPress(input: {
  bytes: Buffer;
  filename: string;
  mimeType: string;
  alt: string;
  width: number;
  height: number;
}): Promise<MediaRef> {
  const base = wordpressRestBase();
  const username = process.env.WORDPRESS_USERNAME?.trim();
  const password = process.env.WORDPRESS_APPLICATION_PASSWORD?.trim();
  if (!base || !username || !password) {
    throw new Error("WordPress upload credentials are not configured");
  }

  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  const response = await fetch(`${base}/media`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Disposition": `attachment; filename="${input.filename}"`,
      "Content-Type": input.mimeType,
    },
    body: new Uint8Array(input.bytes),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `WordPress media upload failed (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  const json = (await response.json()) as {
    id: number;
    source_url?: string;
    title?: { rendered?: string };
    alt_text?: string;
    mime_type?: string;
    media_details?: { width?: number; height?: number };
  };

  if (input.alt) {
    await fetch(`${base}/media/${json.id}`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ alt_text: input.alt }),
    }).catch(() => undefined);
  }

  return {
    mediaId: json.id,
    title: json.title?.rendered || input.filename,
    alt: input.alt || json.alt_text || "",
    mimeType: json.mime_type || input.mimeType,
    sourceUrl: json.source_url || "",
    width: json.media_details?.width ?? input.width,
    height: json.media_details?.height ?? input.height,
    lastSyncedAt: new Date().toISOString(),
    missing: false,
  };
}

async function uploadToLocalPublic(input: {
  bytes: Buffer;
  filename: string;
  mimeType: string;
  alt: string;
  width: number;
  height: number;
}): Promise<MediaRef> {
  const dir = path.join(process.cwd(), "public", "studio-uploads");
  await mkdir(dir, { recursive: true });
  const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const unique = `${Date.now()}-${randomBytes(4).toString("hex")}-${safeName}`;
  const abs = path.join(dir, unique);
  await writeFile(abs, input.bytes);
  const sourceUrl = `/studio-uploads/${unique}`;

  // Synthetic mediaId for local uploads (negative range avoids WP collisions).
  const mediaId = -Math.abs(
    Number.parseInt(randomBytes(4).toString("hex"), 16) || Date.now(),
  );

  return {
    mediaId,
    title: input.filename,
    alt: input.alt,
    mimeType: input.mimeType,
    sourceUrl,
    width: input.width,
    height: input.height,
    lastSyncedAt: new Date().toISOString(),
    missing: false,
  };
}

/**
 * Uploads a pre-resized image for static-page / studio overrides.
 * Prefers WordPress Media Library when Application Password is configured;
 * otherwise stores under /public/studio-uploads.
 */
export async function uploadSizedStudioImageAction(input: {
  dataUrl: string;
  filename: string;
  alt?: string;
  width: number;
  height: number;
}): Promise<UploadSizedImageResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    requirePermission(session.user.role, "media:write");
  } catch {
    return { ok: false, message: "Missing media:write permission" };
  }

  if (
    !Number.isFinite(input.width) ||
    !Number.isFinite(input.height) ||
    input.width < 1 ||
    input.height < 1 ||
    input.width > 8000 ||
    input.height > 8000
  ) {
    return { ok: false, message: "Invalid target image dimensions" };
  }

  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i.exec(
    input.dataUrl,
  );
  if (!match) {
    return { ok: false, message: "Invalid image payload" };
  }

  const mimeType = match[1].toLowerCase();
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.byteLength > 12 * 1024 * 1024) {
    return { ok: false, message: "Image exceeds 12MB limit" };
  }

  const ext =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : "jpg";
  const filename = input.filename.replace(/\.[^.]+$/, "") + `.${ext}`;

  try {
    const data = hasWordpressUploadCreds()
      ? await uploadToWordPress({
          bytes,
          filename,
          mimeType,
          alt: input.alt?.trim() || "",
          width: input.width,
          height: input.height,
        })
      : await uploadToLocalPublic({
          bytes,
          filename,
          mimeType,
          alt: input.alt?.trim() || "",
          width: input.width,
          height: input.height,
        });

    if (!data.sourceUrl) {
      return { ok: false, message: "Upload succeeded but no URL was returned" };
    }

    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

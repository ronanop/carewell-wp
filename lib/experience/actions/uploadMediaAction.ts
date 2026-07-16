"use server";

import { auth } from "@/auth";
import { getAssetService } from "@/lib/assets/services/assetService";
import { requirePermission } from "@/lib/experience/rbac";
import type { MediaRef } from "@/types/wordpress-media";

export type UploadSizedImageResult =
  | { ok: true; data: MediaRef }
  | { ok: false; message: string };

/**
 * Uploads a pre-resized image for static-page / studio overrides.
 * Always stores in WordPress Media Library via AssetService (ADR-018).
 * Never writes to Next.js public/ or PostgreSQL.
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
    const asset = await getAssetService().upload(
      {
        bytes,
        filename,
        mimeType,
        alt: input.alt?.trim() || "",
        title: filename,
      },
      { userId: session.user.id },
    );

    const data = getAssetService().toRef(asset);
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

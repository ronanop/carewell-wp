import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { createClient } from "@sanity/client";

import { sanityProjectId, sanityDataset } from "@/lib/sanity/client";

/**
 * Enables Next.js Draft Mode for Sanity Presentation / preview.
 * Requires a valid Sanity preview-url secret (not merely a token existing in env).
 */
export async function GET(request: Request) {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    return new NextResponse("Missing SANITY_API_TOKEN (Viewer) for preview", {
      status: 401,
    });
  }

  const client = createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: "2025-01-01",
    useCdn: false,
    token,
  });

  let isValid = false;
  let redirectTo: string | null = null;
  try {
    const result = await validatePreviewUrl(client, request.url);
    isValid = result.isValid;
    redirectTo = result.redirectTo ?? null;
  } catch (error) {
    console.error("[draft-mode/enable] validatePreviewUrl failed", error);
    return new NextResponse("Invalid preview request", { status: 401 });
  }

  if (!isValid) {
    return new NextResponse("Invalid or expired preview secret", {
      status: 401,
    });
  }

  const safePath = sanitizeRedirectPath(redirectTo);
  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(safePath, request.url));
}

/** Same-origin relative path only — blocks open redirects. */
function sanitizeRedirectPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "/";
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/";
  if (trimmed.includes("://") || trimmed.includes("\\")) return "/";
  try {
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.origin !== "http://localhost") return "/";
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
  } catch {
    return "/";
  }
}

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { resolvePublicOrigin } from "@/lib/seo/public-origin";

function safePath(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  if (trimmed.includes("://") || trimmed.includes("\\")) return null;
  try {
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.origin !== "http://localhost") return null;
    return `${parsed.pathname}${parsed.search}` || "/";
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const origin = resolvePublicOrigin(request);
  const url = new URL(request.url);
  const fromQuery = safePath(url.searchParams.get("redirect"));
  const referer = request.headers.get("referer");
  let fromReferer: string | null = null;
  if (referer) {
    try {
      const parsed = new URL(referer);
      if (parsed.origin === origin || parsed.origin === url.origin) {
        fromReferer = `${parsed.pathname}${parsed.search}` || "/";
      }
    } catch {
      fromReferer = null;
    }
  }

  const next = fromQuery || fromReferer || "/";
  return NextResponse.redirect(new URL(next, origin));
}

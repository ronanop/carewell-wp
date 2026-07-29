import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Enables Next.js Draft Mode for Sanity Presentation / preview.
 * Studio Presentation Tool calls this with a redirect back to the preview URL.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") || "/hair-transplant-in-delhi/";

  // Sanity Presentation may send a secret; accept token presence for local preview.
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    return new NextResponse("Missing SANITY_API_TOKEN", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

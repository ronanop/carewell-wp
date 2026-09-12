import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** Lightweight status for the client DraftPreviewBar (keeps root layout static). */
export async function GET() {
  const { isEnabled } = await draftMode();
  return NextResponse.json(
    { enabled: isEnabled },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

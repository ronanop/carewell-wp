import { NextResponse } from "next/server";
import { z } from "zod";

import { recordPageView } from "@/lib/analytics/record";
import {
  checkRateLimit,
  clientIpFromHeaders,
} from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const bodySchema = z.object({
  path: z.string().min(1).max(512),
  visitorId: z.string().min(8).max(64),
  sessionId: z.string().min(8).max(64),
  referrer: z.string().max(512).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const ip = clientIpFromHeaders(request.headers);
    const limited = checkRateLimit(`analytics:${ip}`, 60, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const text = await request.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await recordPageView(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

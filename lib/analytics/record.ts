import "server-only";

import { getPrisma } from "@/lib/db/prisma";

const SKIP_PREFIXES = [
  "/admin",
  "/api",
  "/_next",
  "/studio",
  "/sanity",
  "/favicon",
];

export function shouldTrackPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  return !SKIP_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(prefix),
  );
}

export function normalizeTrackedPath(raw: string): string | null {
  try {
    const url = raw.startsWith("http")
      ? new URL(raw)
      : new URL(raw, "http://localhost");
    let path = url.pathname || "/";
    if (path.length > 1 && path.endsWith("/")) {
      // keep trailing slash style consistent with public URLs
    } else if (path !== "/" && !path.includes(".")) {
      path = `${path}/`;
    }
    if (path.length > 512) path = path.slice(0, 512);
    if (!shouldTrackPath(path)) return null;
    return path;
  } catch {
    return null;
  }
}

export async function recordPageView(input: {
  path: string;
  visitorId: string;
  sessionId: string;
  referrer?: string | null;
}): Promise<void> {
  const path = normalizeTrackedPath(input.path);
  if (!path) return;

  const visitorId = input.visitorId.trim().slice(0, 64);
  const sessionId = input.sessionId.trim().slice(0, 64);
  if (!visitorId || !sessionId) return;

  const referrer = input.referrer?.trim().slice(0, 512) || null;

  const prisma = getPrisma();

  // Dedupe rapid refreshes / Strict Mode double-mount for same session+path
  const recent = await prisma.sitePageView.findFirst({
    where: {
      sessionId,
      path,
      createdAt: { gte: new Date(Date.now() - 15_000) },
    },
    select: { id: true },
  });
  if (recent) return;

  await prisma.sitePageView.create({
    data: {
      path,
      visitorId,
      sessionId,
      referrer,
    },
  });
}

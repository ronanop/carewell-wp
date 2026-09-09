import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";
import { fetchSanityRedirectsEdge } from "@/lib/sanity/redirectsEdge";

const { auth } = NextAuth(authConfig);

let redirectCache:
  | { at: number; map: Map<string, { to: string; permanent: boolean }> }
  | null = null;

const REDIRECT_TTL_MS = 5 * 60 * 1000;

const BLOCKED_PREFIXES = [
  "/dev",
  "/design",
  "/sanity-test",
  "/sanity/service",
] as const;

const CANONICAL_ORIGIN = "https://www.carewellmedicalcentre.com";

function isLocalHost(host: string): boolean {
  const name = host.split(":")[0]?.replace(/^\[|\]$/g, "").toLowerCase() ?? "";
  return name === "localhost" || name === "127.0.0.1" || name === "::1";
}

/**
 * Behind Hostinger the Node process sees itself as localhost:3000.
 * Never send public visitors there.
 */
function publicOrigin(req: {
  nextUrl: URL;
  headers: Headers;
}): string {
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.headers.get("host")?.trim() || "";
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto === "http" || forwardedProto === "https" ? forwardedProto : "https";

  if (host && !isLocalHost(host)) {
    return `${proto}://${host}`;
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured && !isLocalHost(configured)) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") return CANONICAL_ORIGIN;
  return req.nextUrl.origin;
}

function normalizePath(pathname: string): string {
  if (!pathname.startsWith("/")) return `/${pathname}`;
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname;
  if (pathname === "/") return pathname;
  return `${pathname}/`;
}

function isBlockedInternalRoute(pathname: string): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const path = pathname.toLowerCase();
  return BLOCKED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

async function getRedirectMap() {
  const now = Date.now();
  if (redirectCache && now - redirectCache.at < REDIRECT_TTL_MS) {
    return redirectCache.map;
  }

  const rows = await fetchSanityRedirectsEdge();
  const map = new Map<string, { to: string; permanent: boolean }>();
  for (const row of rows) {
    const from = normalizePath(row.from.trim());
    map.set(from, {
      to: row.to.trim(),
      permanent: row.permanent !== false,
    });
  }
  redirectCache = { at: now, map };
  return map;
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  if (isBlockedInternalRoute(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Public CMS redirects (skip admin + API)
  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    try {
      const map = await getRedirectMap();
      const hit =
        map.get(normalizePath(pathname)) ||
        map.get(pathname) ||
        map.get(pathname.replace(/\/$/, "") || "/");
      if (hit) {
        const target = hit.to.startsWith("http")
          ? hit.to
          : new URL(
              hit.to.startsWith("/") ? hit.to : `/${hit.to}`,
              publicOrigin(req),
            ).toString();
        return NextResponse.redirect(target, hit.permanent ? 301 : 302);
      }
    } catch {
      // Fail open — never block the site if Sanity redirects fail
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};

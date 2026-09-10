import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";
import {
  fetchSanityRedirectByFromEdge,
  fetchSanityRedirectsEdge,
} from "@/lib/sanity/redirectsEdge";
import { resolvePublicOrigin } from "@/lib/seo/public-origin";

const { auth } = NextAuth(authConfig);

type RedirectHit = { to: string; permanent: boolean };

let redirectCache:
  | {
      at: number;
      map: Map<string, RedirectHit>;
      /** Paths already confirmed to have no redirect (avoids Sanity spam on 404s). */
      misses: Set<string>;
    }
  | null = null;

/** Full redirect map refresh interval. */
const REDIRECT_TTL_MS = 60 * 1000;

const BLOCKED_PREFIXES = [
  "/dev",
  "/design",
  "/sanity-test",
  "/sanity/service",
] as const;

function normalizePath(pathname: string): string {
  if (!pathname.startsWith("/")) return `/${pathname}`;
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname;
  if (pathname === "/") return pathname;
  return `${pathname}/`;
}

function pathLookupKeys(pathname: string): string[] {
  const normalized = normalizePath(pathname);
  const bare = pathname.replace(/\/$/, "") || "/";
  return [...new Set([normalized, pathname, bare])];
}

function isBlockedInternalRoute(pathname: string): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const path = pathname.toLowerCase();
  return BLOCKED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

async function getRedirectCache() {
  const now = Date.now();
  if (redirectCache && now - redirectCache.at < REDIRECT_TTL_MS) {
    return redirectCache;
  }

  const rows = await fetchSanityRedirectsEdge();
  const map = new Map<string, RedirectHit>();
  for (const row of rows) {
    const from = normalizePath(row.from.trim());
    map.set(from, {
      to: row.to.trim(),
      permanent: row.permanent !== false,
    });
  }
  redirectCache = { at: now, map, misses: new Set() };
  return redirectCache;
}

function hitFromMap(
  map: Map<string, RedirectHit>,
  keys: string[],
): RedirectHit | undefined {
  for (const key of keys) {
    const hit = map.get(key);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Resolve a CMS redirect. Uses the cached map first; on miss, does a live
 * Sanity lookup so newly published Studio redirects work before the TTL refresh.
 */
async function resolveRedirect(pathname: string): Promise<RedirectHit | null> {
  const cache = await getRedirectCache();
  const keys = pathLookupKeys(pathname);
  const cached = hitFromMap(cache.map, keys);
  if (cached) return cached;

  const missKey = normalizePath(pathname);
  if (cache.misses.has(missKey)) return null;

  const live = await fetchSanityRedirectByFromEdge(keys);
  if (!live) {
    cache.misses.add(missKey);
    return null;
  }

  const hit: RedirectHit = {
    to: live.to.trim(),
    permanent: live.permanent !== false,
  };
  cache.map.set(normalizePath(live.from.trim()), hit);
  return hit;
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
      const hit = await resolveRedirect(pathname);
      if (hit) {
        const target = hit.to.startsWith("http")
          ? hit.to
          : new URL(
              hit.to.startsWith("/") ? hit.to : `/${hit.to}`,
              resolvePublicOrigin(req),
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

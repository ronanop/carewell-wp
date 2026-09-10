import { CANONICAL_SITE_URL } from "@/lib/seo/constants";

/** Loopback / bind-all hosts that must never appear in public redirects. */
export function isLoopbackHost(hostOrUrl: string): boolean {
  let hostname = hostOrUrl.trim();
  try {
    if (/^https?:\/\//i.test(hostname)) {
      hostname = new URL(hostname).hostname;
    } else {
      hostname = hostname.split(":")[0] ?? hostname;
    }
  } catch {
    hostname = hostname.split(":")[0] ?? hostname;
  }
  hostname = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1"
  );
}

/**
 * Public site origin for redirects (draft preview, CMS redirects, etc.).
 * Hostinger Node binds to 0.0.0.0:3000 — never use that as the Location host.
 */
export function resolvePublicOrigin(request: {
  url?: string;
  nextUrl?: URL;
  headers: Headers;
}): string {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const host =
    forwardedHost || request.headers.get("host")?.trim() || "";
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const proto =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : "https";

  if (host && !isLoopbackHost(host)) {
    return `${proto}://${host}`;
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured && !isLoopbackHost(configured)) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    return CANONICAL_SITE_URL;
  }

  const raw = request.url ?? request.nextUrl?.href;
  if (raw) {
    try {
      const origin = new URL(raw).origin;
      if (!isLoopbackHost(origin)) return origin;
      // Local `next start -H 0.0.0.0` → still usable in the browser as localhost
      return origin.replace("://0.0.0.0", "://localhost");
    } catch {
      /* fall through */
    }
  }

  return "http://localhost:3000";
}

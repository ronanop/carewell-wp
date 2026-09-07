/**
 * In-memory sliding-window rate limiter (single Node process).
 * Good enough for Hostinger single-instance go-live; use Redis later for multi-node.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true };
}

/** Best-effort client IP from proxy headers. */
export function clientIpFromHeaders(headerStore: Headers): string {
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return headerStore.get("x-real-ip")?.trim() || "unknown";
}

/** Allow only relative /admin paths (no open redirects). */
export function safeAdminCallbackUrl(raw: string | null | undefined): string {
  const fallback = "/admin/leads";
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("://") || value.includes("\\")) return fallback;
  if (!value.startsWith("/admin")) return fallback;
  try {
    const parsed = new URL(value, "http://localhost");
    if (parsed.origin !== "http://localhost") return fallback;
    const path = `${parsed.pathname}${parsed.search}` || fallback;
    return path.startsWith("/admin") ? path : fallback;
  } catch {
    return fallback;
  }
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const VISITOR_KEY = "cw_vid";
const SESSION_KEY = "cw_sid";

function ensureId(storage: Storage, key: string): string {
  const existing = storage.getItem(key);
  if (existing && existing.length >= 8) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `cw_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  storage.setItem(key, id);
  return id;
}

function shouldSkip(path: string): boolean {
  return (
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/_next")
  );
}

/**
 * First-party pageview beacon for the admin dashboard.
 * Anonymous visitor/session ids only — no PII.
 */
export function SiteAnalyticsBeacon() {
  const pathname = usePathname() || "/";
  const lastSent = useRef<string>("");

  useEffect(() => {
    if (shouldSkip(pathname)) return;

    const trackPath =
      pathname.endsWith("/") || pathname.includes(".")
        ? pathname
        : `${pathname}/`;

    if (lastSent.current === trackPath) return;
    lastSent.current = trackPath;

    try {
      const visitorId = ensureId(window.localStorage, VISITOR_KEY);
      const sessionId = ensureId(window.sessionStorage, SESSION_KEY);
      const payload = JSON.stringify({
        path: trackPath,
        visitorId,
        sessionId,
        referrer: document.referrer || null,
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/collect", blob);
      } else {
        void fetch("/api/analytics/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}

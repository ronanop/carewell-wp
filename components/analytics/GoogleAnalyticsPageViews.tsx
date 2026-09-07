"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackGaPageView } from "@/lib/analytics/ga";

function shouldSkip(path: string): boolean {
  return (
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/_next")
  );
}

/** Sends GA4 page_view on App Router navigations (incl. first paint). */
export function GoogleAnalyticsPageViews() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const lastSent = useRef<string>("");

  useEffect(() => {
    if (shouldSkip(pathname)) return;

    const search = searchParams?.toString();
    const path =
      (pathname.endsWith("/") || pathname.includes(".")
        ? pathname
        : `${pathname}/`) + (search ? `?${search}` : "");

    if (lastSent.current === path) return;
    lastSent.current = path;

    trackGaPageView(path);
  }, [pathname, searchParams]);

  return null;
}

"use client";

import { Suspense } from "react";

import { SiteAnalyticsBeacon } from "@/components/analytics/SiteAnalyticsBeacon";

/** First-party pageview beacon for the admin dashboard. */
export function SiteAnalytics() {
  return (
    <Suspense fallback={null}>
      <SiteAnalyticsBeacon />
    </Suspense>
  );
}

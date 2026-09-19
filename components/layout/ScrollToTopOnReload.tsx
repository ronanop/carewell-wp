"use client";

import { useEffect } from "react";

/**
 * Browsers restore scroll after a hard reload. Disable that so refreshes
 * always start at the top. Inline script in root layout covers pre-hydration;
 * this keeps the preference if the browser resets it later.
 */
export function ScrollToTopOnReload() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;

    if (nav?.type === "reload") {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}

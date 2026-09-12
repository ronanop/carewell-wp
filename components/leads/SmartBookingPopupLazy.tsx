"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SmartBookingPopup = dynamic(
  () =>
    import("@/components/leads/SmartBookingPopup").then(
      (m) => m.SmartBookingPopup,
    ),
  { ssr: false },
);

/**
 * Idle-deferred booking popup — waits longer on mobile so LCP/INP stay clear.
 */
export function SmartBookingPopupLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const show = () => {
      if (!cancelled) setReady(true);
    };

    const isNarrow =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    const idleTimeout = isNarrow ? 6000 : 3500;
    const fallbackMs = isNarrow ? 4500 : 2200;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(show, { timeout: idleTimeout });
    } else {
      timeoutId = setTimeout(show, fallbackMs);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;
  return <SmartBookingPopup />;
}

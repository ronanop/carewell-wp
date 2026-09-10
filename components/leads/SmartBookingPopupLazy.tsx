"use client";

import dynamic from "next/dynamic";

/** Client-only lazy load — `ssr: false` is illegal in Server Component layouts. */
export const SmartBookingPopupLazy = dynamic(
  () =>
    import("@/components/leads/SmartBookingPopup").then(
      (m) => m.SmartBookingPopup,
    ),
  { ssr: false },
);

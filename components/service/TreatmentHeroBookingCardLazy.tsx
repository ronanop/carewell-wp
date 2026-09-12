"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { ResolvedConsultationChrome } from "@/types/page-chrome";
import { cn } from "@/lib/utils";

const TreatmentHeroBookingCard = dynamic(
  () =>
    import("@/components/service/TreatmentHeroBookingCard").then(
      (m) => m.TreatmentHeroBookingCard,
    ),
  {
    ssr: false,
    loading: () => <BookingCardSkeleton />,
  },
);

function BookingCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-lg backdrop-blur-sm"
      aria-hidden
    >
      <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 space-y-3">
        <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="mt-4 h-12 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

/**
 * Defers RHF/zod booking card until after first paint so it does not compete
 * with hero LCP. Mobile waits longer; desktop still loads quickly for conversion.
 */
export function TreatmentHeroBookingCardLazy({
  chrome,
  className,
}: {
  chrome: ResolvedConsultationChrome;
  className?: string;
}) {
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
      window.matchMedia("(max-width: 1023px)").matches;
    const idleTimeout = isNarrow ? 4500 : 1800;
    const fallbackMs = isNarrow ? 2800 : 900;

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

  if (!ready) {
    return (
      <div className={cn(className)}>
        <BookingCardSkeleton />
      </div>
    );
  }

  return <TreatmentHeroBookingCard chrome={chrome} className={className} />;
}

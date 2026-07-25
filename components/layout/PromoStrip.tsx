"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Desktop promo messages — edit this array to update the announcement strip.
 * Keep tone calm and clinical; avoid flashy marketing language.
 */
export const PROMO_MESSAGES = [
  "Free consultation this week · Book your appointment today",
  "Doctor-led aesthetic care with natural-looking results",
  "Same-week slots available for laser and skin treatments",
] as const;

const SEPARATOR = "  ·  ";

export function PromoStrip() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (dismissed) return null;

  const sequence = PROMO_MESSAGES.join(SEPARATOR);

  return (
    <div
      className="hidden h-9 border-b border-white/10 bg-[#0A2540] text-white lg:block"
      role="region"
      aria-label="Current promotions"
    >
      <div className="container-content flex h-full items-center justify-between gap-4">
        <div className="min-w-0 flex-1 overflow-hidden">
          {reducedMotion ? (
            <p className="truncate text-[13px] font-medium leading-none tracking-wide text-white/95">
              {PROMO_MESSAGES[0]}
            </p>
          ) : (
            <div className="promo-marquee group/marquee">
              <div className="promo-marquee-track">
                <span className="promo-marquee-segment">{sequence}</span>
                <span className="promo-marquee-segment" aria-hidden>
                  {sequence}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/contact"
            className="text-[13px] font-semibold text-white/95 no-underline transition-colors hover:text-white hover:underline"
          >
            Book now
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Close promotions"
            className="inline-flex size-7 items-center justify-center rounded-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

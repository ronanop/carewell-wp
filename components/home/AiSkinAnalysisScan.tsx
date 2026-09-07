"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Circular portrait with a vertical scan-line animation (UI only). */
export function AiSkinAnalysisScan() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className={cn(
        // Mobile: phone-sized accent (not a shrunk desktop circle)
        "relative size-24 shrink-0 overflow-hidden rounded-full sm:size-36",
        // Desktop (lg+): original scale
        "lg:size-56",
        "border-[3px] border-white shadow-[0_8px_28px_rgb(10_37_64/0.12)]",
        "ring-1 ring-[#0A2540]/10",
      )}
      aria-hidden
    >
      <Image
        src="/images/hero-portrait.png"
        alt=""
        fill
        className="object-cover object-[center_20%]"
        sizes="(max-width: 639px) 6rem, (max-width: 1023px) 9rem, 14rem"
      />

      {/* Soft vignette so the scan line reads clearly on skin */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A2540]/10 via-transparent to-[#0A2540]/15" />

      <div
        className={cn(
          "pointer-events-none absolute inset-x-[6%] top-0 h-[2px] rounded-full",
          "bg-[#7DC4DC]",
          "shadow-[0_0_10px_2px_rgb(125_196_220/0.85),0_0_22px_4px_rgb(125_196_220/0.45)]",
        )}
        style={
          reducedMotion
            ? { transform: "translateY(calc(50% - 1px))" }
            : { animation: "cw-skin-scan 2.8s ease-in-out infinite" }
        }
      />

      {!reducedMotion ? (
        <style>{`
          @keyframes cw-skin-scan {
            0%, 100% { transform: translateY(8%); }
            50% { transform: translateY(calc(90% - 2px)); }
          }
        `}</style>
      ) : null}
    </div>
  );
}

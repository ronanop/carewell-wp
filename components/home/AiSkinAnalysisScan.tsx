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
        "relative size-48 shrink-0 overflow-hidden rounded-full sm:size-52 md:size-56",
        "border-[3px] border-white shadow-[0_8px_28px_rgb(10_37_64/0.12)]",
        "ring-1 ring-[#0A2540]/10"
      )}
      aria-hidden
    >
      <Image
        src="/images/hero-portrait.png"
        alt=""
        fill
        className="object-cover object-[center_20%]"
        sizes="(max-width: 768px) 12rem, 14rem"
      />

      {/* Soft vignette so the scan line reads clearly on skin */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A2540]/10 via-transparent to-[#0A2540]/15" />

      <div
        className={cn(
          "pointer-events-none absolute inset-x-[6%] h-[2px] rounded-full",
          "bg-[#7DC4DC]",
          "shadow-[0_0_10px_2px_rgb(125_196_220/0.85),0_0_22px_4px_rgb(125_196_220/0.45)]"
        )}
        style={
          reducedMotion
            ? { top: "50%", transform: "translateY(-50%)" }
            : { animation: "cw-skin-scan 2.8s ease-in-out infinite" }
        }
      />

      {!reducedMotion ? (
        <style>{`
          @keyframes cw-skin-scan {
            0%, 100% { top: 8%; }
            50% { top: 90%; }
          }
        `}</style>
      ) : null}
    </div>
  );
}

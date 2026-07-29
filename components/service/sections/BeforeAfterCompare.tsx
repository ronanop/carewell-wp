"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export type BeforeAfterCompareProps = {
  beforeSrc?: string | null;
  afterSrc?: string | null;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
};

/**
 * Interactive before/after reveal — native range for keyboard + screen readers.
 * No external slider deps.
 */
export function BeforeAfterCompare({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
}: BeforeAfterCompareProps) {
  const [pos, setPos] = useState(50);
  const labelId = useId();
  const hasBefore = Boolean(beforeSrc);
  const hasAfter = Boolean(afterSrc);
  const compareLabel = `Compare ${beforeAlt} and ${afterAlt}`;

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden bg-slate-100 select-none",
        className,
      )}
    >
      {/* After (base layer) */}
      {hasAfter ? (
        <Image
          src={afterSrc!}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 360px"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-400">
          After
        </div>
      )}

      {/* Before (clipped overlay) — decorative; compare control announces state */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden
      >
        {hasBefore ? (
          <Image
            src={beforeSrc!}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 360px"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200/90 text-sm font-medium text-slate-500">
            Before
          </div>
        )}
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute top-3 left-3 rounded-md bg-[#0A2E52]/85 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-md bg-[#1557A0]/90 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
        After
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_8px_rgba(10,46,82,0.35)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        aria-hidden
      >
        <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#1557A0] shadow-md">
          <span className="flex gap-0.5" aria-hidden>
            <span className="h-3 w-0.5 rounded-full bg-white/90" />
            <span className="h-3 w-0.5 rounded-full bg-white/90" />
          </span>
        </span>
      </div>

      <label htmlFor={labelId} className="sr-only">
        {compareLabel}
      </label>
      <input
        id={labelId}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className={cn(
          "absolute inset-0 z-10 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent",
          "[&::-webkit-slider-thumb]:size-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent",
          "[&::-moz-range-thumb]:size-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent",
          "[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent",
        )}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pos}
        aria-valuetext={`${pos}% before reveal`}
      />
    </div>
  );
}

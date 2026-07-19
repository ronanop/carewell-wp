"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface ReadingProgressProps {
  className?: string;
  /** CSS selector for the scroll target (article body). */
  targetSelector?: string;
}

/**
 * Thin brand-colored reading progress bar fixed to the top of the viewport.
 * Tracks scroll through the article/main content (0% → 100%).
 */
export function ReadingProgress({
  className,
  targetSelector = "[data-content-enhancer-article]",
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const measure = () => {
      ticking = false;
      const target = document.querySelector(targetSelector);
      if (!target) {
        // Fall back to document scroll when no article marker is present.
        const el = document.documentElement;
        const scrollable = el.scrollHeight - window.innerHeight;
        setProgress(
          scrollable <= 0
            ? 100
            : Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)),
        );
        return;
      }

      const rect = target.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 100 : 0);
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      setProgress((scrolled / scrollable) * 100);
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [targetSelector]);

  const value = Math.round(progress);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label="Reading progress"
    >
      <div
        className={cn(
          "h-full origin-left bg-primary",
          !reduceMotion && "transition-[width] duration-150 ease-out",
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/** Alias for shared editorial chrome. */
export const ReadingProgressBar = ReadingProgress;

"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface ReadingProgressProps {
  className?: string;
  /** CSS selector for the scroll target (article body). */
  targetSelector?: string;
}

/**
 * Thin brand-colored reading progress bar. Hidden on small screens.
 */
export function ReadingProgress({
  className,
  targetSelector = "[data-content-enhancer-article]",
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = document.querySelector(targetSelector);
      if (!target) {
        setProgress(0);
        return;
      }

      const rect = target.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 100 : 0);
        return;
      }

      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        scrollable,
      );
      setProgress((scrolled / scrollable) * 100);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetSelector]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-0.5 md:block",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Reading progress"
    >
      <div
        className="h-full origin-left bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

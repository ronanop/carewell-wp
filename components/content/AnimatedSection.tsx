"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** When true, observes H2 chapters for one-time reveal. */
  revealChapters?: boolean;
}

/**
 * Editorial motion helper. Respects prefers-reduced-motion.
 * Marks H2 chapters in-view for CSS chapter reveals (no HTML parsing).
 *
 * Does not opacity-hide the article wrapper — tall WordPress pages cannot
 * satisfy Framer `whileInView` amount thresholds and would stay invisible.
 */
export function AnimatedSection({
  children,
  className,
  revealChapters = true,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revealChapters || prefersReducedMotion) {
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }

    root.setAttribute("data-enhance-motion", "true");
    root
      .closest(".content-enhancer")
      ?.setAttribute("data-enhance-motion", "true");

    const headings = root.querySelectorAll<HTMLElement>(
      ".rich-content > h2",
    );

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [prefersReducedMotion, revealChapters]);

  return (
    <div ref={rootRef} className={cn(className)}>
      {children}
    </div>
  );
}

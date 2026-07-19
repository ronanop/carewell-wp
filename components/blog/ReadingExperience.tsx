"use client";

import { useEffect, useState } from "react";

import { ReadingProgress } from "@/components/content/ReadingProgress";
import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import { cn } from "@/lib/utils";
import type { ArticleTocItem } from "@/types/article-ast";

export type ReadingExperienceProps = {
  toc: ArticleTocItem[];
  readingTimeMinutes: number;
  className?: string;
};

/**
 * Persistent reading chrome — shared top progress bar plus active section / time remaining.
 */
export function ReadingExperienceBar({
  toc,
  readingTimeMinutes,
  className,
}: ReadingExperienceProps) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);
  const [milestones] = useState(() => new Set<number>());

  useEffect(() => {
    const article = document.querySelector("[data-content-enhancer-article]");
    if (!article) return;

    let rafId = 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        ticking = false;
        const rect = article.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const pct =
          scrollable <= 0
            ? 100
            : Math.min(100, Math.max(0, (-rect.top / scrollable) * 100));
        setProgress(pct);

        for (const mark of [25, 50, 75, 100]) {
          if (pct >= mark && !milestones.has(mark)) {
            milestones.add(mark);
            emitEditorialEvent({ type: "reading_completed", percent: mark });
          }
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [milestones]);

  useEffect(() => {
    if (!toc.length) return;
    const elements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  const remaining = Math.max(
    1,
    Math.ceil(readingTimeMinutes * (1 - progress / 100)),
  );
  const activeLabel = toc.find((t) => t.id === activeId)?.text;

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden>
      <ReadingProgress />
      {activeLabel ? (
        <div className="pointer-events-none fixed inset-x-0 top-1 z-[60] mx-auto flex max-w-6xl justify-end px-4 pt-2 md:block">
          <div className="rounded-full border border-border/60 bg-surface/90 px-3 py-1 text-[0.6875rem] text-muted-foreground shadow-sm backdrop-blur">
            <span className="font-medium text-foreground/80">{activeLabel}</span>
            <span className="mx-1.5 opacity-40">·</span>
            <span>{remaining} min left</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

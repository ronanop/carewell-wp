"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { ProcessStep } from "./types";

type Props = {
  steps: ProcessStep[];
  /** CMS label template prefix, e.g. "Step" → "Step 1" */
  stepLabel?: string;
};

/**
 * Animated process steps — highlights one step at a time.
 * Grid auto-fits any step count (3, 4, 5, 6+).
 */
export function HowItWorksSteps({ steps, stepLabel = "Step" }: Props) {
  const list = steps.filter((s) => s.title?.trim());
  const count = list.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (count < 2 || paused || !inView) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 2800);
    return () => window.clearInterval(id);
  }, [count, paused, inView]);

  if (!count) return null;

  return (
    <ol
      ref={rootRef}
      className={cn(
        "grid gap-4",
        // Mobile: stacked. Tablet+: auto-fit so 3–7 steps stay balanced.
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:[grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr))]",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {list.map((step, i) => {
        const isActive = i === active;
        const isDone = i < active;
        return (
          <li key={`${step.title}-${i}`} className="relative min-w-0">
            <button
              type="button"
              onClick={() => {
                setActive(i);
                setPaused(true);
              }}
              className={cn(
                "group flex h-full w-full cursor-pointer flex-col rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35",
                isActive
                  ? "border-[#1557A0]/35 bg-white shadow-[0_14px_36px_-18px_rgba(21,87,160,0.55)] ring-1 ring-[#1557A0]/20"
                  : "border-slate-200/90 bg-white/70 hover:border-[#1557A0]/20 hover:bg-white",
                isDone && !isActive ? "opacity-90" : undefined,
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="relative z-10 mb-3 flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                    isActive
                      ? "scale-110 bg-[#1557A0] text-white shadow-md shadow-[#1557A0]/35"
                      : isDone
                        ? "bg-[#1557A0]/15 text-[#1557A0]"
                        : "bg-slate-100 text-slate-500 group-hover:bg-[#1557A0]/10 group-hover:text-[#1557A0]",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-[0.6875rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-300",
                    isActive ? "text-[#1557A0]" : "text-slate-400",
                  )}
                >
                  {stepLabel} {i + 1}
                </span>
              </span>

              <span
                className={cn(
                  "font-heading text-base font-semibold tracking-tight transition-colors duration-300",
                  isActive ? "text-[#0A2E52]" : "text-slate-800",
                )}
              >
                {step.title}
              </span>

              {step.description ? (
                <span
                  className={cn(
                    "mt-2 text-sm leading-relaxed transition-colors duration-300",
                    isActive ? "text-slate-600" : "text-slate-500",
                  )}
                >
                  {step.description}
                </span>
              ) : null}

              {/* Active progress bar */}
              <span
                className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-slate-100"
                aria-hidden
              >
                <span
                  key={isActive ? `bar-${active}-${paused}` : `idle-${i}`}
                  className={cn(
                    "block h-full w-full origin-left rounded-full bg-[#1557A0]",
                    isActive && inView && !paused
                      ? "animate-[howItWorksBar_2.8s_linear_forwards]"
                      : isActive
                        ? "scale-x-100"
                        : "scale-x-0",
                  )}
                />
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

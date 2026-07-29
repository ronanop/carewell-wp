import { Check, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type InsightCalloutProps = SectionBaseProps & {
  /** CMS: overview.insightsEyebrow */
  eyebrow?: string;
  /** CMS: overview.insightsTitle — blank hides the heading */
  title?: string;
  /** CMS: overview.insights */
  items?: string[];
  /**
   * `card` — nested panel (inside Overview).
   * `band` — full-width mid-page section.
   */
  layout?: "card" | "band";
};

/**
 * Insight list shell — React owns layout; CMS owns copy.
 * Empty `items` → null.
 */
export function InsightCallout({
  id = "insights",
  eyebrow,
  title,
  items = [],
  layout = "card",
  className,
}: InsightCalloutProps) {
  const list = (items ?? []).map((s) => s.trim()).filter(Boolean);
  if (!list.length) return null;

  const listBlock = (
    <ul className="grid gap-3 sm:grid-cols-1">
      {list.map((item, i) => (
        <li
          key={`${i}-${item.slice(0, 24)}`}
          className={cn(
            "flex gap-3 rounded-xl bg-white/80 p-3.5",
            "ring-1 ring-[#1557A0]/10",
            layout === "band" && "sm:p-4",
          )}
        >
          <span
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1557A0] text-white"
            aria-hidden
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span className="text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );

  if (layout === "band") {
    return (
      <section
        id={id}
        aria-labelledby={title ? `${id}-heading` : undefined}
        className={cn(
          "relative border-y border-slate-200/80 bg-[#F6F8FC]",
          className,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_140px_at_100%_0%,rgba(21,87,160,0.07),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#1557A0]/10 text-[#1557A0] ring-1 ring-[#1557A0]/15">
                  <Lightbulb className="size-4" strokeWidth={2} aria-hidden />
                </span>
                {eyebrow ? (
                  <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                    {eyebrow}
                  </p>
                ) : null}
              </div>
              {title ? (
                <h2
                  id={`${id}-heading`}
                  className="mt-3 font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl"
                >
                  {title}
                </h2>
              ) : null}
            </div>
            <div className="min-w-0">{listBlock}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <aside
      id={id}
      aria-label={title || eyebrow || "Insights"}
      className={cn(
        "rounded-2xl border border-[#1557A0]/15 bg-[#F3F7FC] p-5 sm:p-6",
        className,
      )}
    >
      {(eyebrow || title) && (
        <div className="mb-4">
          {eyebrow ? (
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <p
              className={cn(
                "font-heading text-base font-semibold tracking-tight text-[#0A2E52] sm:text-lg",
                eyebrow ? "mt-1" : undefined,
              )}
            >
              {title}
            </p>
          ) : null}
        </div>
      )}
      {listBlock}
    </aside>
  );
}

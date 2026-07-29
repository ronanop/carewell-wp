import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MythFactPair, SectionBaseProps } from "./types";

export type MythVsFactSectionProps = SectionBaseProps & {
  /** CMS: myths.eyebrow */
  eyebrow?: string;
  /** CMS: myths.heading */
  title?: string;
  /** CMS: myths.mythLabel — defaults to "Myth" when blank */
  mythLabel?: string;
  /** CMS: myths.factLabel — defaults to "Fact" when blank */
  factLabel?: string;
  /** CMS: myths.pairs[] */
  pairs?: MythFactPair[] | null;
};

type NormalizedPair = { myth: string; fact: string };

function normalizePairs(pairs?: MythFactPair[] | null): NormalizedPair[] {
  return (pairs ?? [])
    .map((p) => ({
      myth: p.myth?.trim() ?? "",
      fact: p.fact?.trim() ?? "",
    }))
    .filter((p) => p.myth || p.fact);
}

/**
 * Myth vs fact pairs for service pages.
 * React owns layout/chrome; CMS owns eyebrow, heading, labels, and pair copy.
 * Empty pairs → null.
 */
export function MythVsFactSection({
  id = "myths",
  eyebrow,
  title,
  mythLabel,
  factLabel,
  pairs,
  className,
}: MythVsFactSectionProps) {
  const items = normalizePairs(pairs);
  if (!items.length) return null;

  const mythChrome = mythLabel?.trim() || "Myth";
  const factChrome = factLabel?.trim() || "Fact";

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_70%_0%,rgba(21,87,160,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(eyebrow || title) && (
          <header className="mb-8 max-w-2xl sm:mb-10">
            {eyebrow ? (
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id={`${id}-heading`}
                className={cn(
                  "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
                  eyebrow ? "mt-2" : undefined,
                )}
              >
                {title}
              </h2>
            ) : null}
          </header>
        )}

        <div className="space-y-4 sm:space-y-5">
          {items.map((pair, i) => (
            <article
              key={`${i}-${pair.myth.slice(0, 24)}-${pair.fact.slice(0, 24)}`}
              className={cn(
                "overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
                "shadow-[0_12px_40px_-18px_rgba(10,46,82,0.22)]",
              )}
            >
              <div className="grid sm:grid-cols-2">
                {pair.myth ? (
                  <div
                    className={cn(
                      "relative flex gap-3.5 p-5 sm:gap-4 sm:p-6",
                      "bg-slate-50/80",
                      pair.fact && "border-b border-slate-100 sm:border-b-0 sm:border-r",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                        "border border-slate-200 bg-white text-slate-500",
                      )}
                      aria-hidden
                    >
                      <X className="size-4" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                        {mythChrome}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
                        {pair.myth}
                      </p>
                    </div>
                  </div>
                ) : null}

                {pair.fact ? (
                  <div className="relative flex gap-3.5 bg-[#F3F7FC]/90 p-5 sm:gap-4 sm:p-6">
                    <span
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                        "bg-[#1557A0] text-white",
                      )}
                      aria-hidden
                    >
                      <Check className="size-4" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-[#1557A0] uppercase">
                        {factChrome}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#0A2E52] sm:text-[0.9375rem]">
                        {pair.fact}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

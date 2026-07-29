import { Check, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type PricingSectionProps = SectionBaseProps & {
  /** CMS: pricing.eyebrow */
  eyebrow?: string;
  /** CMS: pricing.heading */
  title?: string;
  /** CMS: pricing.startingFromLabel */
  startingFromLabel?: string;
  /** CMS: pricing.startingFrom */
  startingFrom?: string;
  /** CMS: pricing.factorsHeading */
  factorsHeading?: string;
  /** CMS: pricing.factors */
  factors?: string[];
  /** CMS: pricing.includedHeading */
  includedHeading?: string;
  /** CMS: pricing.whatsIncluded */
  whatsIncluded?: string[];
  /** CMS: pricing.emiNote */
  emiNote?: string;
  /** CMS: pricing.ctaLabel — omit to hide CTA */
  ctaLabel?: string;
  /** CMS: pricing.ctaHref */
  ctaHref?: string;
};

/**
 * Investment / pricing band.
 * React owns layout; CMS owns all copy. Empty startingFrom+factors+included → null.
 */
export function PricingSection({
  id = "pricing",
  eyebrow,
  title,
  startingFromLabel,
  startingFrom,
  factorsHeading,
  factors,
  includedHeading,
  whatsIncluded,
  emiNote,
  ctaLabel,
  ctaHref = "#book",
  className,
}: PricingSectionProps) {
  const factorList = (factors ?? []).map((s) => s.trim()).filter(Boolean);
  const included = (whatsIncluded ?? []).map((s) => s.trim()).filter(Boolean);
  const price = startingFrom?.trim() || "";
  const cta = ctaLabel?.trim() || "";

  if (!price && !factorList.length && !included.length) return null;

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_20%_0%,rgba(21,87,160,0.07),transparent_55%)]"
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

        <div
          className={cn(
            "grid gap-6 lg:gap-8",
            price && included.length
              ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
              : undefined,
          )}
        >
          {/* Price hero + cost factors */}
          {price || factorList.length ? (
            <div
              className={cn(
                "overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
                "shadow-[0_12px_40px_-16px_rgba(10,46,82,0.22)]",
              )}
            >
              {price ? (
                <div className="border-b border-slate-100 bg-gradient-to-br from-[#F3F7FC] to-white px-5 py-6 sm:px-7 sm:py-7">
                  {startingFromLabel ? (
                    <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                      {startingFromLabel}
                    </p>
                  ) : null}
                  <p
                    className={cn(
                      "font-heading text-3xl font-semibold tracking-tight text-[#1557A0] sm:text-4xl",
                      startingFromLabel ? "mt-1.5" : undefined,
                    )}
                  >
                    {price}
                  </p>
                </div>
              ) : null}

              {factorList.length ? (
                <div className="px-5 py-5 sm:px-7 sm:py-6">
                  {factorsHeading ? (
                    <p className="mb-3 text-sm font-semibold text-[#0A2E52]">
                      {factorsHeading}
                    </p>
                  ) : null}
                  <ul className="space-y-2.5">
                    {factorList.map((factor, i) => (
                      <li
                        key={`${i}-${factor.slice(0, 24)}`}
                        className="flex gap-3 text-sm leading-relaxed text-slate-700"
                      >
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1557A0]"
                          aria-hidden
                        />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* What's included */}
          {included.length ? (
            <div className="flex flex-col">
              {includedHeading ? (
                <p className="mb-4 text-sm font-semibold text-[#0A2E52]">
                  {includedHeading}
                </p>
              ) : null}
              <ul className="grid flex-1 gap-3 sm:grid-cols-2">
                {included.map((item, i) => (
                  <li
                    key={`${i}-${item.slice(0, 24)}`}
                    className={cn(
                      "flex gap-3 rounded-xl bg-white p-3.5",
                      "ring-1 ring-[#1557A0]/10",
                      "shadow-[0_4px_16px_-8px_rgba(10,46,82,0.18)]",
                    )}
                  >
                    <span
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1557A0] text-white"
                      aria-hidden
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {(emiNote || cta) && (
          <div
            className={cn(
              "mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
              "rounded-2xl border border-slate-200/80 bg-[#FAFBFE] px-5 py-4 sm:px-6",
            )}
          >
            {emiNote ? (
              <p className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                <Info
                  className="mt-0.5 size-4 shrink-0 text-[#0B7B6B]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{emiNote}</span>
              </p>
            ) : (
              <span />
            )}
            {cta ? (
              <a
                href={ctaHref}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center rounded-lg px-5 py-2.5",
                  "bg-[#0B7B6B] text-sm font-semibold text-white",
                  "shadow-none transition-colors hover:bg-[#096557]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7B6B]/35",
                )}
              >
                {cta}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

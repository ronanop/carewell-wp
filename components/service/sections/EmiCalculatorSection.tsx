"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

const MIN_AMOUNT = 20_000;
const MAX_AMOUNT = 300_000;
const AMOUNT_STEP = 5_000;
const TENURE_OPTIONS = [3, 6, 9, 12, 18, 24] as const;

export type EmiCalculatorSectionProps = SectionBaseProps & {
  /** CMS: emi.eyebrow */
  eyebrow?: string;
  /** CMS: emi.title — required to show the section */
  title?: string;
  /** CMS: emi.amountLabel */
  amountLabel?: string;
  /** CMS: emi.tenureLabel */
  tenureLabel?: string;
  /** CMS: emi.resultLabel */
  resultLabel?: string;
  /** CMS: emi.disclaimer */
  disclaimer?: string;
  /** CMS: emi.ctaLabel */
  ctaLabel?: string;
  /** CMS: emi.ctaHref */
  ctaHref?: string;
  /** CMS: emi.defaultAmount (calculator default) */
  defaultAmount?: number;
  /** CMS: emi.defaultMonths (calculator default) */
  defaultMonths?: number;
  /** CMS: emi.annualRatePct (calculator default) */
  annualRatePct?: number;
};

function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function clampAmount(value: number): number {
  const stepped =
    Math.round((value - MIN_AMOUNT) / AMOUNT_STEP) * AMOUNT_STEP + MIN_AMOUNT;
  return Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, stepped));
}

function nearestTenure(months: number): number {
  return TENURE_OPTIONS.reduce((best, option) =>
    Math.abs(option - months) < Math.abs(best - months) ? option : best,
  );
}

/**
 * Interactive EMI estimator.
 * React owns layout, math, and controls; CMS owns all marketing copy.
 * Renders nothing when `title` is empty.
 */
export function EmiCalculatorSection({
  id = "emi",
  eyebrow,
  title,
  amountLabel,
  tenureLabel,
  resultLabel,
  disclaimer,
  ctaLabel,
  ctaHref = "#book",
  defaultAmount = 80_000,
  defaultMonths = 12,
  annualRatePct = 12,
  className,
}: EmiCalculatorSectionProps) {
  const amountInputId = useId();
  const tenureLabelId = useId();
  const [amount, setAmount] = useState(() => clampAmount(defaultAmount));
  const [months, setMonths] = useState(() => nearestTenure(defaultMonths));

  const emi = useMemo(() => {
    const r = annualRatePct / 12 / 100;
    if (r === 0) return amount / months;
    const pow = Math.pow(1 + r, months);
    return (amount * r * pow) / (pow - 1);
  }, [amount, months, annualRatePct]);

  if (!title?.trim()) return null;

  const fillPercent =
    ((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "relative scroll-mt-28 border-y border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_50%_0%,rgba(21,87,160,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          {eyebrow?.trim() ? (
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
              eyebrow?.trim() ? "mt-2" : undefined,
            )}
          >
            {title}
          </h2>
        </header>

        <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_48px_-28px_rgba(10,46,82,0.28)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {/* Controls */}
          <div className="space-y-8 p-5 sm:p-7 lg:p-8">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                {amountLabel?.trim() ? (
                  <label
                    htmlFor={amountInputId}
                    className="text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase"
                  >
                    {amountLabel}
                  </label>
                ) : null}
                <output
                  htmlFor={amountInputId}
                  className="font-heading text-xl font-semibold tabular-nums tracking-tight text-[#0A2E52] sm:text-2xl"
                >
                  {formatInr(amount)}
                </output>
              </div>

              <div className="relative mt-4">
                <input
                  id={amountInputId}
                  type="range"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={AMOUNT_STEP}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  aria-label={amountLabel?.trim() || "Treatment amount"}
                  aria-valuemin={MIN_AMOUNT}
                  aria-valuemax={MAX_AMOUNT}
                  aria-valuenow={amount}
                  aria-valuetext={formatInr(amount)}
                  className={cn(
                    "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
                    "[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
                    "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1557A0] [&::-webkit-slider-thumb]:bg-white",
                    "[&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(10,46,82,0.2)]",
                    "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full",
                    "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1557A0] [&::-moz-range-thumb]:bg-white",
                    "[&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(10,46,82,0.2)]",
                  )}
                  style={{
                    background: `linear-gradient(to right, #1557A0 0%, #1557A0 ${fillPercent}%, #e2e8f0 ${fillPercent}%, #e2e8f0 100%)`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{formatInr(MIN_AMOUNT)}</span>
                <span>{formatInr(MAX_AMOUNT)}</span>
              </div>
            </div>

            <div>
              {tenureLabel?.trim() ? (
                <p
                  id={tenureLabelId}
                  className="text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase"
                >
                  {tenureLabel}
                </p>
              ) : null}
              <div
                role="radiogroup"
                aria-label={tenureLabel?.trim() || "Tenure in months"}
                aria-labelledby={tenureLabel?.trim() ? tenureLabelId : undefined}
                className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6"
              >
                {TENURE_OPTIONS.map((option) => {
                  const selected = months === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setMonths(option)}
                      className={cn(
                        "min-h-11 cursor-pointer rounded-lg border px-2 text-sm font-medium transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
                        selected
                          ? "border-[#0A2E52] bg-[#0A2E52] text-white"
                          : "border-slate-200 bg-white text-[#0A2E52] hover:border-[#1557A0]/35 hover:bg-[#F6F8FC]",
                      )}
                    >
                      {option}
                      <span className="ml-0.5 text-[0.6875rem] font-normal opacity-80">
                        mo
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result + CTA */}
          <aside
            className="flex flex-col justify-between gap-6 border-t border-slate-200/80 bg-gradient-to-b from-[#0A2E52] to-[#1557A0] p-5 text-white sm:p-7 lg:border-t-0 lg:border-l lg:border-slate-200/20 lg:p-8"
            aria-live="polite"
            aria-atomic="true"
          >
            <div>
              {resultLabel?.trim() ? (
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-sky-200/90 uppercase">
                  {resultLabel}
                </p>
              ) : null}
              <p
                className={cn(
                  "font-heading text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-none tabular-nums tracking-tight",
                  resultLabel?.trim() ? "mt-3" : undefined,
                )}
              >
                {formatInr(emi)}
              </p>
              <p className="mt-2 text-sm text-sky-100/85">per month</p>

              {disclaimer?.trim() ? (
                <p className="mt-5 text-xs leading-relaxed text-sky-100/75">
                  {disclaimer}
                </p>
              ) : null}
            </div>

            {ctaLabel?.trim() ? (
              <a
                href={ctaHref}
                className={cn(
                  "inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg",
                  "bg-white px-5 text-[0.9375rem] font-semibold text-[#0A2E52]",
                  "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]",
                  "transition-[transform,background-color,box-shadow] duration-200",
                  "hover:bg-sky-50 hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)]",
                  "active:translate-y-px",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1557A0]",
                )}
              >
                {ctaLabel}
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </a>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

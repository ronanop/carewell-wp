"use client";

import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";

const MIN_COST = 25_000;
const MAX_COST = 500_000;
const DEFAULT_COST = 75_000;

const TENURE_OPTIONS = [3, 6, 9, 12, 18, 24, 36] as const;
const DEFAULT_TENURE = 12;

const RATE_OPTIONS = [
  { id: "zero", rate: 0, label: "0%", sublabel: "0% EMI PARTNER" },
  { id: "card", rate: 10, label: "10%", sublabel: "Standard Credit Card" },
  { id: "loan", rate: 13, label: "13%", sublabel: "Personal Loan Rate" },
] as const;

type RateOption = (typeof RATE_OPTIONS)[number];

function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function calculateEmi(principal: number, annualRate: number, months: number) {
  if (annualRate === 0) {
    const emi = principal / months;
    return {
      emi,
      totalPayable: principal,
      totalInterest: 0,
    };
  }

  const r = annualRate / 12 / 100;
  const factor = Math.pow(1 + r, months);
  const emi = (principal * r * factor) / (factor - 1);
  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;

  return { emi, totalPayable, totalInterest };
}

export function EmiCalculator({ className }: { className?: string }) {
  const [cost, setCost] = useState(DEFAULT_COST);
  const [tenure, setTenure] = useState<number>(DEFAULT_TENURE);
  const [rateOption, setRateOption] = useState<RateOption>(RATE_OPTIONS[0]);

  const { emi, totalPayable, totalInterest } = useMemo(
    () => calculateEmi(cost, rateOption.rate, tenure),
    [cost, rateOption.rate, tenure],
  );

  const fillPercent =
    ((cost - MIN_COST) / (MAX_COST - MIN_COST)) * 100;

  return (
    <section
      className={cn(
        "emi-calculator scroll-mt-28 rounded-[var(--radius-3xl)] border border-border/50 bg-white p-6 shadow-[0_12px_40px_-18px_rgba(10,37,64,0.14)] sm:p-8 md:p-10",
        className,
      )}
      aria-labelledby="emi-calculator-title"
      data-emi-calculator
    >
      <header className="flex items-start gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-[#0A2540]"
          aria-hidden
        >
          <CalendarClock className="size-5" strokeWidth={2} />
        </div>
        <div>
          <h2
            id="emi-calculator-title"
            className="font-heading text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold tracking-tight text-[#0A2540]"
          >
            EMI calculator
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan your treatment in easy instalments
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-10 lg:gap-12">
        <div className="space-y-8">
          {/* Treatment cost */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor="emi-treatment-cost"
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Treatment cost
              </label>
              <output
                htmlFor="emi-treatment-cost"
                className="font-heading text-xl font-bold tabular-nums text-[#0A2540] sm:text-2xl"
              >
                {formatInr(cost)}
              </output>
            </div>

            <div className="relative mt-4">
              <input
                id="emi-treatment-cost"
                type="range"
                min={MIN_COST}
                max={MAX_COST}
                step={1_000}
                value={cost}
                onChange={(event) => setCost(Number(event.target.value))}
                aria-valuemin={MIN_COST}
                aria-valuemax={MAX_COST}
                aria-valuenow={cost}
                aria-valuetext={formatInr(cost)}
                className={cn(
                  "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                  "[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-400 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(10,37,64,0.15)]",
                  "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-sky-400 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(10,37,64,0.15)]",
                )}
                style={{
                  background: `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${fillPercent}%, #e2e8f0 ${fillPercent}%, #e2e8f0 100%)`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatInr(MIN_COST)}</span>
              <span>{formatInr(MAX_COST)}</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <p
              id="emi-tenure-label"
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Tenure
            </p>
            <div
              role="radiogroup"
              aria-labelledby="emi-tenure-label"
              className="mt-3 flex flex-wrap gap-2"
            >
              {TENURE_OPTIONS.map((months) => {
                const selected = tenure === months;
                return (
                  <button
                    key={months}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setTenure(months)}
                    className={cn(
                      "min-h-10 min-w-[3.25rem] rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                      selected
                        ? "border-[#0A2540] bg-[#0A2540] text-white shadow-[0_4px_14px_-4px_rgba(10,37,64,0.45)]"
                        : "border-border bg-white text-[#0A2540] hover:border-[#0A2540]/30 hover:bg-slate-50",
                    )}
                  >
                    {months}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interest rate */}
          <div>
            <p
              id="emi-rate-label"
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Interest rate
            </p>
            <div
              role="radiogroup"
              aria-labelledby="emi-rate-label"
              className="mt-3 grid gap-3 sm:grid-cols-3"
            >
              {RATE_OPTIONS.map((option) => {
                const selected = rateOption.id === option.id;
                const isZero = option.rate === 0;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setRateOption(option)}
                    className={cn(
                      "flex min-h-[5.5rem] flex-col items-center justify-center rounded-2xl border px-3 py-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                      selected && isZero
                        ? "border-emerald-400 bg-emerald-50"
                        : selected
                          ? "border-[#0A2540]/25 bg-slate-50"
                          : "border-border bg-white hover:border-[#0A2540]/20 hover:bg-slate-50/80",
                    )}
                  >
                    <span className="font-heading text-2xl font-bold text-[#0A2540]">
                      {option.label}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-[0.625rem] font-semibold uppercase leading-snug tracking-[0.08em]",
                        selected && isZero
                          ? "text-emerald-700"
                          : "text-muted-foreground",
                      )}
                    >
                      {option.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary card */}
        <aside
          className="rounded-2xl bg-slate-100/90 p-6 sm:p-7"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-sky-700/80">
            Estimated monthly EMI
          </p>
          <p className="mt-2 font-heading text-[clamp(2rem,5vw,2.75rem)] font-bold leading-none tabular-nums text-[#0A2540]">
            {formatInr(emi)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">per month</p>

          <hr className="my-6 border-border/70" />

          <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <dt className="text-xs text-muted-foreground">Total Payable</dt>
              <dd className="mt-1 font-heading text-base font-bold tabular-nums text-[#0A2540]">
                {formatInr(totalPayable)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total Interest</dt>
              <dd className="mt-1 font-heading text-base font-bold tabular-nums text-[#0A2540]">
                {formatInr(totalInterest)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tenure</dt>
              <dd className="mt-1 font-heading text-base font-bold text-[#0A2540]">
                {tenure} months
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Rate</dt>
              <dd className="mt-1 font-heading text-base font-bold text-[#0A2540]">
                {rateOption.rate}% p.a.
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Indicative figures only. Final EMI depends on partner approval and
            your credit profile.{" "}
            <a
              href="#consultation-sidebar-heading"
              className="font-semibold text-primary no-underline hover:underline"
            >
              Ask about 0% EMI partners.
            </a>
          </p>
        </aside>
      </div>

    </section>
  );
}

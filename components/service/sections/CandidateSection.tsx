import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type CandidateSectionProps = SectionBaseProps & {
  /** CMS: candidacy.eyebrow */
  eyebrow?: string;
  /** CMS: candidacy.heading */
  title?: string;
  /** CMS: candidacy.goodFitLabel */
  goodFitLabel?: string;
  /** CMS: candidacy.notIdealLabel */
  notIdealLabel?: string;
  /** CMS: candidacy.goodFit */
  goodFit?: string[] | null;
  /** CMS: candidacy.notIdeal */
  notIdeal?: string[] | null;
  /** CMS: candidacy.quizCtaLabel */
  quizCtaLabel?: string;
  /** CMS: candidacy.quizCtaHref */
  quizCtaHref?: string;
};

function normalizeItems(items?: string[] | null): string[] {
  return (items ?? []).map((s) => s.trim()).filter(Boolean);
}

/**
 * Candidacy / eligibility — two-column good-fit vs not-ideal.
 * React owns layout/chrome; CMS owns all copy. Empty goodFit AND notIdeal → null.
 */
export function CandidateSection({
  id = "candidacy",
  eyebrow,
  title,
  goodFitLabel,
  notIdealLabel,
  goodFit,
  notIdeal,
  quizCtaLabel,
  quizCtaHref,
  className,
}: CandidateSectionProps) {
  const fit = normalizeItems(goodFit);
  const avoid = normalizeItems(notIdeal);
  if (!fit.length && !avoid.length) return null;

  const href = quizCtaHref?.trim() || "#quiz";
  const showQuiz = Boolean(quizCtaLabel?.trim());
  const bothColumns = fit.length > 0 && avoid.length > 0;

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_50%_0%,rgba(21,87,160,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(eyebrow || title) && (
          <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
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
            "grid gap-4 sm:gap-5",
            bothColumns ? "sm:grid-cols-2" : "mx-auto max-w-xl",
          )}
        >
          {fit.length ? (
            <EligibilityColumn
              variant="fit"
              label={goodFitLabel}
              items={fit}
            />
          ) : null}
          {avoid.length ? (
            <EligibilityColumn
              variant="avoid"
              label={notIdealLabel}
              items={avoid}
            />
          ) : null}
        </div>

        {showQuiz ? (
          <div className="mt-8 flex justify-center sm:mt-10">
            <a
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-[#1557A0] px-5 py-2.5",
                "text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(21,87,160,0.65)]",
                "transition-[background-color,box-shadow,transform] duration-150",
                "hover:bg-[#0A2E52] hover:shadow-[0_10px_28px_-12px_rgba(10,46,82,0.55)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
              )}
            >
              {quizCtaLabel}
              <ArrowRight className="size-4 shrink-0 opacity-90" aria-hidden />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EligibilityColumn({
  variant,
  label,
  items,
}: {
  variant: "fit" | "avoid";
  label?: string;
  items: string[];
}) {
  const isFit = variant === "fit";
  const Icon = isFit ? CheckCircle2 : CircleAlert;

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-white p-5 shadow-[0_12px_32px_-24px_rgba(10,46,82,0.35)] sm:p-6",
        isFit
          ? "border-emerald-200/80"
          : "border-amber-200/80",
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            isFit ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
          )}
          aria-hidden
        >
          <Icon className="size-5" strokeWidth={2} />
        </span>
        {label?.trim() ? (
          <h3 className="font-heading text-base font-semibold tracking-tight text-[#0A2E52] sm:text-lg">
            {label}
          </h3>
        ) : null}
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-slate-700">
            <span
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                isFit ? "bg-emerald-500" : "bg-amber-500",
              )}
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

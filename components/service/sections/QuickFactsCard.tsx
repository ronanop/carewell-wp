import {
  Activity,
  Clock,
  HeartPulse,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { QuickFact, SectionBaseProps } from "./types";

export type QuickFactsCardProps = SectionBaseProps & {
  facts?: QuickFact[];
  title?: string;
  /** CMS: hero.quickFactsNote — omitted when empty */
  note?: string;
  /** Compact glass style when nested inside a dark hero. */
  embedded?: boolean;
};

function iconForLabel(label?: string): LucideIcon {
  const key = (label || "").toLowerCase();
  if (/time|duration|procedure|surgery|min/.test(key)) return Clock;
  if (/anesth|sedation|local|ga/.test(key)) return Activity;
  if (/down|recover|heal|rest/.test(key)) return Timer;
  if (/result|permanent|outcome/.test(key)) return Sparkles;
  if (/safe|risk|trust/.test(key)) return ShieldCheck;
  return HeartPulse;
}

/**
 * At-a-glance clinical facts — sits in the main column above Overview.
 * Empty facts → render nothing.
 */
export function QuickFactsCard({
  id = "quick-facts",
  facts = [],
  title = "At a glance",
  note,
  embedded = false,
  className,
}: QuickFactsCardProps) {
  if (!facts?.length) return null;

  if (embedded) {
    return (
      <div
        id={id}
        className={cn(
          "rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md",
          className,
        )}
      >
        <p className="mb-3 text-xs font-semibold tracking-wide text-white/75 uppercase">
          {title}
        </p>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/15">
          {facts.map((fact, i) => (
            <div
              key={`${fact.label}-${i}`}
              className="min-w-0 sm:px-3 first:sm:pl-0 last:sm:pr-0"
            >
              <dt className="text-[0.6875rem] leading-snug text-white/65">
                {fact.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold tracking-tight text-white">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("relative", className)}
    >
      {/* Match Overview horizontal inset so the card aligns with article content */}
      <div className="relative mx-auto max-w-6xl px-4 pb-2 pt-4 sm:px-6 sm:pb-4 sm:pt-6 lg:px-8">
        <div className="rounded-2xl border border-[#1557A0]/12 bg-gradient-to-br from-white via-white to-[#F1F6FC] p-4 shadow-[0_10px_28px_-20px_rgba(10,46,82,0.35)] sm:p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                Snapshot
              </p>
              <h2
                id={`${id}-heading`}
                className="mt-1 font-heading text-base font-semibold tracking-tight text-[#0A2E52] sm:text-lg"
              >
                {title}
              </h2>
            </div>
            {note ? (
              <p className="max-w-xs text-xs leading-relaxed text-slate-500">
                {note}
              </p>
            ) : null}
          </div>

          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {facts.map((fact, i) => {
              const Icon = iconForLabel(fact.label);
              return (
                <div
                  key={`${fact.label}-${i}`}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-3",
                    "transition-[border-color,box-shadow] duration-200",
                    "hover:border-[#1557A0]/25 hover:shadow-[0_8px_20px_-14px_rgba(21,87,160,0.4)]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      "bg-[#1557A0]/8 text-[#1557A0]",
                      "ring-1 ring-[#1557A0]/12",
                    )}
                    aria-hidden
                  >
                    <Icon className="size-3.5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[0.6875rem] font-medium leading-snug text-slate-500">
                      {fact.label}
                    </dt>
                    <dd className="mt-0.5 font-heading text-[0.9375rem] font-semibold tracking-tight text-[#0A2E52] sm:text-base">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

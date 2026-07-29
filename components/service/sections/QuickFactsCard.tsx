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
 * At-a-glance clinical facts — value-first trust strip under the hero.
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
      className={cn(
        "relative border-b border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      {/* Soft brand wash — keeps strip tied to hero without heavy navy block */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_120px_at_10%_0%,rgba(21,87,160,0.08),transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
              Snapshot
            </p>
            <h2
              id={`${id}-heading`}
              className="mt-1 font-heading text-lg font-semibold tracking-tight text-[#0A2E52] sm:text-xl"
            >
              {title}
            </h2>
          </div>
          {note ? (
            <p className="max-w-sm text-xs leading-relaxed text-slate-500">
              {note}
            </p>
          ) : null}
        </div>

        <dl
          className={cn(
            "grid gap-3",
            "sm:grid-cols-2 lg:grid-cols-4 lg:gap-0",
            "lg:rounded-2xl lg:border lg:border-slate-200/90 lg:bg-white lg:shadow-[0_8px_30px_-18px_rgba(10,46,82,0.35)]",
          )}
        >
          {facts.map((fact, i) => {
            const Icon = iconForLabel(fact.label);
            return (
              <div
                key={`${fact.label}-${i}`}
                className={cn(
                  "group relative rounded-xl border border-slate-200/90 bg-white p-4",
                  "transition-[transform,box-shadow,border-color] duration-200",
                  "hover:border-[#1557A0]/25 hover:shadow-[0_10px_28px_-16px_rgba(21,87,160,0.45)]",
                  "motion-safe:hover:-translate-y-0.5",
                  "lg:rounded-none lg:border-0 lg:bg-transparent lg:p-5 lg:shadow-none",
                  "lg:hover:translate-y-0 lg:hover:shadow-none",
                  i > 0 && "lg:border-l lg:border-slate-200",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                      "bg-[#1557A0]/8 text-[#1557A0]",
                      "ring-1 ring-[#1557A0]/12",
                    )}
                    aria-hidden
                  >
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[0.75rem] font-medium leading-snug text-slate-500">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-heading text-[1.0625rem] font-semibold tracking-tight text-[#0A2E52] sm:text-lg">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

import {
  BadgeCheck,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type WhyChooseUsSectionProps = SectionBaseProps & {
  /** CMS: whyChooseUs.eyebrow */
  eyebrow?: string;
  /** CMS: whyChooseUs.heading */
  title?: string;
  /** CMS: whyChooseUs.intro */
  intro?: string;
  /** CMS: whyChooseUs.items */
  items?: string[];
};

const REASON_ICONS: LucideIcon[] = [
  ShieldCheck,
  BadgeCheck,
  HeartHandshake,
  MapPin,
];

/**
 * Trust / authority — why choose Care Well.
 * React owns layout/chrome (numbers, icons, wash); CMS owns eyebrow, title, intro, items.
 * Empty items AND no intro → null.
 */
export function WhyChooseUsSection({
  id = "why-choose-us",
  eyebrow,
  title,
  intro,
  items,
  className,
}: WhyChooseUsSectionProps) {
  const list = (items ?? []).map((s) => s.trim()).filter(Boolean);
  const lead = intro?.trim() || "";
  if (!list.length && !lead) return null;

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn("relative overflow-hidden bg-[#F6F8FC]", className)}
    >
      {/* Soft brand washes — authority without heavy chrome */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_0%_0%,rgba(21,87,160,0.11),transparent_58%),radial-gradient(700px_240px_at_100%_100%,rgba(10,46,82,0.07),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#1557A0] via-[#1557A0]/40 to-transparent sm:w-1.5"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(eyebrow || title || lead) && (
          <header className="mb-8 max-w-3xl sm:mb-10 lg:mb-12">
            {eyebrow ? (
              <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-[#1557A0] uppercase">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id={`${id}-heading`}
                className={cn(
                  "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl lg:text-[2rem] lg:leading-tight",
                  eyebrow ? "mt-2.5" : undefined,
                )}
              >
                {title}
              </h2>
            ) : null}
            {lead ? (
              <p
                className={cn(
                  "max-w-2xl text-[1.0625rem] leading-relaxed text-slate-600",
                  title || eyebrow ? "mt-4" : undefined,
                )}
              >
                {lead}
              </p>
            ) : null}
          </header>
        )}

        {list.length ? (
          <ol className="flex list-none flex-wrap justify-center gap-3 p-0 sm:gap-4">
            {list.map((item, i) => {
              const Icon = REASON_ICONS[i % REASON_ICONS.length]!;
              const n = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={`${i}-${item.slice(0, 32)}`}
                  className={cn(
                    "group relative flex w-full max-w-[22rem] basis-[min(100%,22rem)] gap-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-5 sm:max-w-[calc(50%-0.5rem)] sm:basis-[calc(50%-0.5rem)] sm:gap-5 sm:p-6",
                    "shadow-[0_10px_36px_-20px_rgba(10,46,82,0.32)]",
                    "transition-[border-color,box-shadow,transform] duration-200",
                    "hover:border-[#1557A0]/30 hover:shadow-[0_16px_40px_-22px_rgba(21,87,160,0.35)]",
                    "hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  )}
                >
                  <span
                    className="pointer-events-none absolute -right-1 -bottom-3 font-heading text-[4.5rem] leading-none font-semibold tabular-nums text-[#0A2E52]/[0.04] select-none sm:text-[5.25rem]"
                    aria-hidden
                  >
                    {n}
                  </span>

                  <span
                    className={cn(
                      "relative mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl",
                      "bg-[#1557A0]/10 text-[#1557A0]",
                      "ring-1 ring-[#1557A0]/12",
                      "transition-colors duration-200 group-hover:bg-[#1557A0] group-hover:text-white group-hover:ring-[#1557A0]/40",
                      "motion-reduce:transition-none",
                    )}
                    aria-hidden
                  >
                    <Icon className="size-[1.125rem]" strokeWidth={2.25} />
                  </span>

                  <div className="relative min-w-0 flex-1 pt-0.5">
                    <span className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.12em] text-[#1557A0] uppercase tabular-nums">
                      Reason {n}
                    </span>
                    <span className="block text-sm leading-relaxed font-medium text-[#0A2E52] sm:text-[0.9375rem]">
                      {item}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    </section>
  );
}

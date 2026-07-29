import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type PreparationSectionProps = SectionBaseProps & {
  /** CMS: preparation.eyebrow */
  eyebrow?: string;
  /** CMS: preparation.heading */
  title?: string;
  /** CMS: preparation.intro */
  intro?: string;
  /** CMS: preparation.items */
  items?: string[];
};

/**
 * Pre-treatment preparation checklist.
 * React owns layout/chrome; CMS owns eyebrow, title, intro, and items.
 * Empty items AND no intro → null.
 */
export function PreparationSection({
  id = "preparation",
  eyebrow,
  title,
  intro,
  items,
  className,
}: PreparationSectionProps) {
  const list = (items ?? []).map((s) => s.trim()).filter(Boolean);
  const lead = intro?.trim() || "";
  if (!list.length && !lead) return null;

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_40%_0%,rgba(21,87,160,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(eyebrow || title) && (
          <header className="mb-6 max-w-2xl sm:mb-8">
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

        {lead ? (
          <p
            className={cn(
              "max-w-3xl text-[1.0625rem] leading-relaxed text-slate-600",
              list.length ? "mb-8 sm:mb-10" : undefined,
            )}
          >
            {lead}
          </p>
        ) : null}

        {list.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {list.map((item, i) => (
              <li
                key={`${i}-${item.slice(0, 32)}`}
                className={cn(
                  "flex gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5",
                  "shadow-[0_8px_28px_-18px_rgba(10,46,82,0.28)]",
                  "transition-colors duration-200 hover:border-[#1557A0]/25",
                  "motion-reduce:transition-none",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                    "bg-[#1557A0] text-white",
                  )}
                  aria-hidden
                >
                  <Check className="size-4" strokeWidth={3} />
                </span>
                <span className="min-w-0 pt-1 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

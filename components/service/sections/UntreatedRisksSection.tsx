import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type UntreatedRisksSectionProps = SectionBaseProps & {
  /** CMS: untreatedRisks.eyebrow */
  eyebrow?: string;
  /** CMS: untreatedRisks.heading */
  title?: string;
  /** CMS: untreatedRisks.intro */
  intro?: string;
  /** CMS: untreatedRisks.items */
  items?: string[];
};

/**
 * What if left untreated — calm awareness list (not alarmist).
 * React owns layout/chrome; CMS owns eyebrow, title, intro, and items.
 * Empty items AND no intro → null.
 */
export function UntreatedRisksSection({
  id = "untreated-risks",
  eyebrow,
  title,
  intro,
  items,
  className,
}: UntreatedRisksSectionProps) {
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_150px_at_8%_0%,rgba(21,87,160,0.07),transparent_52%),radial-gradient(580px_140px_at_92%_100%,rgba(10,46,82,0.04),transparent_50%)]"
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
          <ol className="grid list-none gap-3 sm:grid-cols-2 sm:gap-4">
            {list.map((item, i) => (
              <li
                key={`${i}-${item.slice(0, 32)}`}
                className={cn(
                  "flex gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5",
                  "shadow-[0_8px_28px_-18px_rgba(10,46,82,0.22)]",
                  "transition-colors duration-200 hover:border-[#1557A0]/30",
                  "motion-reduce:transition-none",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                    "bg-[#1557A0]/10 font-heading text-xs font-semibold tabular-nums text-[#1557A0]",
                  )}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 pt-1 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                  <span className="sr-only">Point {i + 1}: </span>
                  {item}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}

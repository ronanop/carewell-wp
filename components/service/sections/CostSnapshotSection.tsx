import { cn } from "@/lib/utils";
import type { CostCard, SectionBaseProps } from "./types";

export type CostSnapshotSectionProps = SectionBaseProps & {
  /** CMS: costSnapshot.eyebrow */
  eyebrow?: string;
  /** CMS: costSnapshot.heading */
  title?: string;
  /** CMS: costSnapshot.cards[] */
  cards?: CostCard[] | null;
};

function normalizeCard(card: CostCard): {
  label: string;
  value: string;
  sublabel?: string;
} | null {
  const label = card.label?.trim() || "";
  const value = card.value?.trim() || "";
  const sublabel = card.sublabel?.trim() || "";
  if (!label && !value) return null;
  return {
    label: label || "Metric",
    value: value || "—",
    sublabel: sublabel || undefined,
  };
}

/**
 * Cost-at-a-glance metric cards.
 * React owns layout/chrome; CMS owns eyebrow, heading, cards.
 * Empty cards → null. Auto-fit 2–N; incomplete last row centers via flex-wrap.
 */
export function CostSnapshotSection({
  id = "cost-snapshot",
  eyebrow,
  title,
  cards,
  className,
}: CostSnapshotSectionProps) {
  const display = (cards ?? [])
    .map(normalizeCard)
    .filter((c): c is NonNullable<typeof c> => c != null);

  if (!display.length) return null;

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

        <ul className="mx-auto flex list-none flex-wrap justify-center gap-4 p-0 sm:gap-5">
          {display.map((card, i) => (
            <li
              key={`${i}-${card.label}`}
              className="min-w-0 w-full max-w-[15.5rem] basis-[min(100%,15.5rem)]"
            >
              <article
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-center",
                  "shadow-[0_12px_40px_-16px_rgba(10,46,82,0.22)]",
                  "transition-[border-color,box-shadow,transform] duration-200",
                  "hover:-translate-y-0.5 hover:border-[#1557A0]/35",
                  "hover:shadow-[0_16px_36px_-20px_rgba(21,87,160,0.35)]",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                )}
              >
                <div className="border-b border-slate-100 bg-gradient-to-br from-[#F3F7FC] to-white px-5 py-5 sm:px-6 sm:py-6">
                  <p className="text-[0.625rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    {card.label}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold tracking-tight text-[#1557A0] tabular-nums sm:text-[1.75rem]">
                    {card.value}
                  </p>
                </div>
                {card.sublabel ? (
                  <p className="px-5 py-3 text-xs leading-relaxed text-slate-500 sm:px-6">
                    {card.sublabel}
                  </p>
                ) : (
                  <div className="min-h-3" aria-hidden />
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

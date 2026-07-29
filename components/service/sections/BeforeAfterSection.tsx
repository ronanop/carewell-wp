import { cn } from "@/lib/utils";
import { BeforeAfterCompare } from "./BeforeAfterCompare";
import { sectionImageUrl } from "./image";
import type { BeforeAfterPair, SectionBaseProps } from "./types";

export type BeforeAfterSectionProps = SectionBaseProps & {
  /** CMS: beforeAfter.eyebrow */
  eyebrow?: string;
  /** CMS: beforeAfter.heading */
  title?: string;
  /** CMS: beforeAfter.pairs */
  pairs?: BeforeAfterPair[] | null;
  /** CMS: beforeAfter.consentNotice */
  consentNotice?: string;
};

function pairMeta(pair: BeforeAfterPair): string {
  const parts: string[] = [];
  if (pair.patientInitials?.trim()) parts.push(pair.patientInitials.trim());
  if (pair.age != null) parts.push(`Age ${pair.age}`);
  if (pair.gender?.trim()) parts.push(pair.gender.trim());
  if (pair.monthsPost != null) parts.push(`${pair.monthsPost} months post`);
  if (pair.subtype?.trim()) parts.push(pair.subtype.trim());
  return parts.join(" · ");
}

/**
 * Patient before/after gallery — React owns comparison shell; CMS owns copy.
 * Empty pairs → null.
 */
export function BeforeAfterSection({
  id = "before-after",
  eyebrow,
  title,
  pairs,
  consentNotice,
  className,
}: BeforeAfterSectionProps) {
  const display = (pairs ?? []).filter(Boolean);
  if (!display.length) return null;

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn(
        "relative border-b border-slate-200/80 bg-white",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(720px_140px_at_100%_0%,rgba(21,87,160,0.07),transparent_60%)]"
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
            "grid gap-6",
            display.length === 1
              ? "mx-auto max-w-xl"
              : "[grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]",
          )}
        >
          {display.map((pair, i) => {
            const before = sectionImageUrl(pair.before, 800);
            const after = sectionImageUrl(pair.after, 800);
            const meta = pairMeta(pair);

            return (
              <article
                key={`${pair.patientInitials ?? "pair"}-${i}`}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#FAFBFE] shadow-[0_16px_40px_-28px_rgba(10,46,82,0.4)]"
              >
                <BeforeAfterCompare
                  beforeSrc={before}
                  afterSrc={after}
                  beforeAlt={pair.before?.alt || "Before treatment"}
                  afterAlt={pair.after?.alt || "After treatment"}
                />
                {meta ? (
                  <p className="border-t border-slate-200/80 px-4 py-3 text-sm text-slate-600">
                    {meta}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        {consentNotice?.trim() ? (
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-500">
            {consentNotice.trim()}
          </p>
        ) : null}
      </div>
    </section>
  );
}

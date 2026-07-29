import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps, TechniqueCard } from "./types";

export type TechnologySectionProps = SectionBaseProps & {
  /** CMS: technology.eyebrow (also treatmentOptions.eyebrow via TreatmentOptionsSection) */
  eyebrow?: string;
  /** CMS: technology.heading */
  title?: string;
  /** CMS: technology.techniques */
  techniques?: TechniqueCard[];
};

function normalizeTechniques(techniques?: TechniqueCard[]): TechniqueCard[] {
  return (techniques ?? [])
    .map((t) => ({
      title: t.title?.trim() || undefined,
      description: t.description?.trim() || undefined,
      bullets: (t.bullets ?? []).map((b) => b.trim()).filter(Boolean),
    }))
    .filter((t) => Boolean(t.title));
}

/**
 * Techniques & technology cards.
 * React owns layout/chrome; CMS owns eyebrow, heading, and technique copy.
 * Empty techniques → null. Flex-wrap + justify-center centers leftover cards on odd rows.
 */
export function TechnologySection({
  id = "technology",
  eyebrow,
  title,
  techniques,
  className,
}: TechnologySectionProps) {
  const list = normalizeTechniques(techniques);
  if (!list.length) return null;

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_70%_0%,rgba(21,87,160,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(eyebrow || title) && (
          <header className="mb-8 max-w-2xl sm:mb-10">
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
          {list.map((tech, i) => (
            <li
              key={`${i}-${tech.title}`}
              className="min-h-0 w-full max-w-[17.5rem] basis-[min(100%,17.5rem)]"
            >
              <article
                className={cn(
                  "flex h-full min-h-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6",
                  "shadow-[0_8px_28px_-18px_rgba(10,46,82,0.28)]",
                  "transition-[border-color,box-shadow] duration-200",
                  "hover:border-[#1557A0]/30 hover:shadow-[0_14px_36px_-20px_rgba(21,87,160,0.35)]",
                  "motion-reduce:transition-none",
                )}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      "bg-[#1557A0] text-[0.6875rem] font-semibold tabular-nums text-white",
                    )}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-[#0A2E52] text-balance">
                      {tech.title}
                    </h3>
                    {tech.description ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
                        {tech.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                {tech.bullets?.length ? (
                  <ul className="mt-auto space-y-2.5 border-t border-slate-100 pt-4">
                    {tech.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2.5 text-sm leading-relaxed text-slate-700"
                      >
                        <span
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1557A0]/10 text-[#1557A0]"
                          aria-hidden
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

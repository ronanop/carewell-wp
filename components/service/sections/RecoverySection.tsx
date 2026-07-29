import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type RecoverySectionProps = SectionBaseProps & {
  /** CMS: recovery.eyebrow */
  eyebrow?: string;
  /** CMS: recovery.heading */
  title?: string;
  /** CMS: recovery.intro */
  intro?: string;
  /** CMS: recovery.items — milestone lines (optional "Phase: detail" form) */
  items?: string[];
};

/** Split "Day 1–3: rest…" into phase label + body when a short prefix precedes ":". */
function splitMilestone(item: string): { phase?: string; body: string } {
  const idx = item.indexOf(":");
  if (idx > 0 && idx <= 36) {
    const phase = item.slice(0, idx).trim();
    const body = item.slice(idx + 1).trim();
    if (phase && body) return { phase, body };
  }
  return { body: item };
}

/**
 * Recovery & aftercare milestones as a vertical timeline.
 * React owns layout/chrome; CMS owns eyebrow, title, intro, and items.
 * Empty items AND no intro → null.
 */
export function RecoverySection({
  id = "recovery",
  eyebrow,
  title,
  intro,
  items,
  className,
}: RecoverySectionProps) {
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_20%_0%,rgba(21,87,160,0.07),transparent_55%)]"
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
          <ol className="relative mx-auto max-w-3xl">
            {/* Timeline rail */}
            <div
              className="pointer-events-none absolute top-3 bottom-3 left-[1.125rem] w-px bg-slate-200 sm:left-5"
              aria-hidden
            />

            {list.map((item, i) => {
              const { phase, body } = splitMilestone(item);
              const isLast = i === list.length - 1;
              return (
                <li
                  key={`${i}-${item.slice(0, 32)}`}
                  className={cn(
                    "relative flex gap-4 sm:gap-5",
                    !isLast ? "pb-6 sm:pb-8" : undefined,
                  )}
                >
                  <span
                    className={cn(
                      "relative z-[1] mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                      "bg-[#1557A0] text-[0.6875rem] font-semibold tabular-nums text-white",
                      "ring-4 ring-[#F6F8FC]",
                      "sm:size-10 sm:text-xs",
                    )}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div
                    className={cn(
                      "min-w-0 flex-1 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5",
                      "shadow-[0_8px_28px_-18px_rgba(10,46,82,0.28)]",
                      "transition-colors duration-200 hover:border-[#1557A0]/25",
                      "motion-reduce:transition-none",
                    )}
                  >
                    {phase ? (
                      <>
                        <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-[#1557A0] uppercase">
                          {phase}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                          {body}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                        {body}
                      </p>
                    )}
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

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ComparisonColumn, SectionBaseProps } from "./types";

export type ComparisonSectionProps = SectionBaseProps & {
  /** CMS: comparison.eyebrow */
  eyebrow?: string;
  /** CMS: comparison.heading */
  title?: string;
  /** CMS: comparison.columns[] */
  columns?: ComparisonColumn[] | null;
  /** CMS: comparison.tableHtml */
  tableHtml?: string | null;
};

function normalizeColumn(col: ComparisonColumn): {
  title: string;
  items: string[];
} | null {
  const title = col.title?.trim() || "";
  const items = (col.items ?? []).map((s) => s.trim()).filter(Boolean);
  if (!title && !items.length) return null;
  return { title: title || "Option", items };
}

/**
 * Side-by-side comparison columns and/or HTML table.
 * React owns layout/chrome; CMS owns eyebrow, heading, columns, tableHtml.
 * Empty columns AND no tableHtml → null. Incomplete rows center via flex-wrap.
 */
export function ComparisonSection({
  id = "comparison",
  eyebrow,
  title,
  columns,
  tableHtml,
  className,
}: ComparisonSectionProps) {
  const display = (columns ?? [])
    .map(normalizeColumn)
    .filter((c): c is NonNullable<typeof c> => c != null);
  const html = tableHtml?.trim() || "";
  if (!display.length && !html) return null;

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

        {display.length ? (
          <ul
            className={cn(
              "mx-auto flex list-none flex-wrap justify-center gap-4 p-0",
              html ? "mb-8 sm:mb-10" : undefined,
            )}
          >
            {display.map((col, i) => (
              <li
                key={`${i}-${col.title}`}
                className="min-w-0 w-full max-w-[18.5rem] basis-[min(100%,18.5rem)]"
              >
                <article
                  className={cn(
                    "flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
                    "shadow-[0_12px_32px_-22px_rgba(10,46,82,0.35)]",
                    "transition-[border-color,box-shadow,transform] duration-200",
                    "hover:-translate-y-0.5 hover:border-[#1557A0]/35",
                    "hover:shadow-[0_16px_36px_-20px_rgba(21,87,160,0.35)]",
                    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  )}
                >
                  <div className="border-b border-slate-100 bg-[#FAFBFE] px-5 py-4">
                    <p className="text-[0.625rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight text-[#0A2E52] text-balance">
                      {col.title}
                    </h3>
                  </div>

                  {col.items.length ? (
                    <ul className="flex flex-1 list-none flex-col gap-2.5 p-5">
                      {col.items.map((item, j) => (
                        <li
                          key={`${j}-${item.slice(0, 28)}`}
                          className="flex gap-2.5 text-sm leading-relaxed text-slate-700"
                        >
                          <span
                            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1557A0]/10 text-[#1557A0]"
                            aria-hidden
                          >
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          <span className="min-w-0">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex-1 p-5" aria-hidden />
                  )}
                </article>
              </li>
            ))}
          </ul>
        ) : null}

        {html ? (
          <div
            className={cn(
              "overflow-x-auto rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5",
              "shadow-[0_12px_32px_-22px_rgba(10,46,82,0.28)]",
              "[&_table]:w-full [&_table]:min-w-[28rem] [&_table]:border-collapse [&_table]:text-sm",
              "[&_th]:bg-[#0A2E52] [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white",
              "[&_td]:border-t [&_td]:border-slate-100 [&_td]:px-3 [&_td]:py-2.5 [&_td]:text-slate-700",
              "[&_tr:nth-child(even)_td]:bg-[#F6F8FC]/80",
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : null}
      </div>
    </section>
  );
}

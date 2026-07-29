import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FaqItem, SectionBaseProps } from "./types";

export type FaqAccordionSectionProps = SectionBaseProps & {
  /** CMS: faqEyebrow */
  eyebrow?: string;
  /** CMS: faqHeading */
  title?: string;
  /** CMS: faqs[] */
  faqs?: FaqItem[];
  /** CMS: faqEmitJsonLd — FAQPage JSON-LD when true */
  emitJsonLd?: boolean;
};

/**
 * FAQ accordion for service pages.
 * React owns layout/a11y chrome; CMS owns eyebrow, title, and Q&A copy.
 * Empty faqs → null. Optional FAQPage JSON-LD via emitJsonLd.
 */
export function FaqAccordionSection({
  id = "faq",
  eyebrow,
  title,
  faqs = [],
  emitJsonLd = true,
  className,
}: FaqAccordionSectionProps) {
  const items = (faqs ?? []).filter(
    (f) => Boolean(f.question?.trim()) && Boolean(f.answer?.trim()),
  );
  if (!items.length) return null;

  const jsonLd = emitJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.question!.trim(),
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer!.trim(),
          },
        })),
      }
    : null;

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn(
        "relative border-y border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_80%_0%,rgba(21,87,160,0.07),transparent_55%)]"
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

        <div
          className={cn(
            "mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
            "shadow-[0_12px_40px_-16px_rgba(10,46,82,0.22)]",
          )}
        >
          {items.map((faq, i) => {
            const question = faq.question!.trim();
            const answer = faq.answer!.trim();
            const panelId = `${id}-panel-${i}`;
            const isLast = i === items.length - 1;

            return (
              <details
                key={`${question}-${i}`}
                className={cn(
                  "group border-slate-100",
                  !isLast && "border-b",
                )}
              >
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-start gap-4 px-5 py-4 sm:px-6 sm:py-5",
                    "marker:content-none [&::-webkit-details-marker]:hidden",
                    "transition-colors duration-200 hover:bg-[#F3F7FC]/80",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1557A0]/35",
                  )}
                  aria-controls={panelId}
                >
                  <span className="min-w-0 flex-1 pt-0.5 text-[0.9375rem] font-medium leading-snug text-[#0A2E52] sm:text-base">
                    {question}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                      "border border-slate-200 bg-[#F6F8FC] text-[#1557A0]",
                      "transition duration-200 group-open:rotate-180 group-open:border-[#1557A0]/30 group-open:bg-[#1557A0] group-open:text-white",
                      "motion-reduce:transition-none",
                    )}
                    aria-hidden
                  >
                    <ChevronDown className="size-4" strokeWidth={2.25} />
                  </span>
                </summary>
                <div
                  id={panelId}
                  className="border-t border-slate-100/80 px-5 pb-5 sm:px-6 sm:pb-6"
                >
                  <p className="max-w-prose pt-3 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem] sm:leading-relaxed">
                    {answer}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

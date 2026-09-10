import { ChevronDown } from "lucide-react";
import Link from "next/link";

import {
  faqClosing,
  faqIntro,
  faqPageTitle,
  faqSections,
} from "@/components/faq/content";
import { cn } from "@/lib/utils";

export function FaqContent() {
  return (
    <article className="bg-background">
      <div className="container-content section-padding">
        <header className="mx-auto max-w-3xl">
          <p className="text-label uppercase tracking-[0.16em] text-[#3B82F6]">
            About Us
          </p>
          <h1 className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]">
            {faqPageTitle}
          </h1>
          <p className="mt-5 text-body leading-relaxed text-muted-foreground">
            {faqIntro}
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl space-y-12">
          {faqSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2
                id={`${section.id}-heading`}
                className="font-heading text-h3 font-semibold text-[#0A2540]"
              >
                {section.title}
              </h2>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_40px_-16px_rgba(10,46,82,0.22)]">
                {section.items.map((item, index) => {
                  const panelId = `${section.id}-panel-${index}`;
                  const isLast = index === section.items.length - 1;

                  return (
                    <details
                      key={item.question}
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
                          {item.question}
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
                        <p className="max-w-prose pt-3 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
                          {item.answer}
                        </p>
                        {item.bullets?.length ? (
                          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
                            {item.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          ))}

          <p className="border-t border-border/60 pt-8 text-body leading-relaxed text-muted-foreground">
            {faqClosing}{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}

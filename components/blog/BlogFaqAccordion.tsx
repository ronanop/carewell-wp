import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_BLOG_FAQS = [
  {
    question: "How do I choose the right treatment for my concern?",
    answer:
      "The right treatment depends on your goals, medical history, and clinical assessment. A doctor-led consultation helps identify the safest and most suitable options for you.",
  },
  {
    question: "Is a consultation required before treatment?",
    answer:
      "Yes. A consultation allows the clinical team to understand your concern, explain expected results and recovery, and recommend an appropriate treatment plan.",
  },
  {
    question: "What should I expect during a consultation?",
    answer:
      "You can expect a private discussion about your concerns, an examination where appropriate, clear treatment guidance, and time to ask questions before making a decision.",
  },
  {
    question: "How can I book an appointment?",
    answer:
      "You can book a consultation online through the contact page or call the clinic directly. The team will help arrange a convenient appointment time.",
  },
] as const;

export function BlogFaqAccordion() {
  return (
    <section
      id="blog-faqs"
      className="border-t border-border bg-muted/30"
      aria-labelledby="blog-faqs-heading"
    >
      <div className="container-content section-padding">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent">
            Blog FAQs
          </p>
          <h2
            id="blog-faqs-heading"
            className="mt-3 font-heading text-[1.8rem] font-bold leading-tight tracking-tight text-[#0A2540] sm:text-[2.7rem]"
          >
            Frequently Asked Questions
          </h2>
        </header>

        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_40px_-16px_rgba(10,46,82,0.22)] sm:mt-10">
          {DEFAULT_BLOG_FAQS.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className={cn(
                "group border-slate-100",
                index < DEFAULT_BLOG_FAQS.length - 1 && "border-b",
              )}
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden hover:bg-[#F3F7FC]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1557A0]/35 sm:px-6 sm:py-5">
                <span className="min-w-0 flex-1 pt-0.5 text-[0.9375rem] font-semibold leading-snug text-[#0A2E52] sm:text-base">
                  {faq.question}
                </span>
                <span
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-[#F6F8FC] text-[#1557A0] transition duration-200 group-open:rotate-180 group-open:border-[#1557A0]/30 group-open:bg-[#1557A0] group-open:text-white motion-reduce:transition-none"
                  aria-hidden
                >
                  <ChevronDown className="size-4" strokeWidth={2.25} />
                </span>
              </summary>
              <div className="border-t border-slate-100/80 px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="max-w-prose pt-3 text-[0.9375rem] leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

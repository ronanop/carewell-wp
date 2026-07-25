"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import { cn } from "@/lib/utils";
import type { DoctorFaqItem } from "@/types/doctor";

interface FAQAccordionProps {
  items: DoctorFaqItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="bg-muted/30" aria-labelledby="faq-heading">
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            FAQs
          </p>
          <h2
            id="faq-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Frequently Asked Questions
          </h2>
        </DoctorReveal>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border/70 border-y border-border/70">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const buttonId = `${baseId}-${item.id}-button`;

            return (
              <div key={item.id}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6",
                      "transition-colors hover:text-primary-800",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                  >
                    <span className="font-heading text-body font-semibold text-[#0A2540]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-primary-600 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5 sm:pb-6"
                >
                  <p className="max-w-prose text-body leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

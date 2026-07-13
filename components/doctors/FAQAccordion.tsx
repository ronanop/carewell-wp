"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import type { DoctorFaqItem } from "@/types/doctor";

interface FAQAccordionProps {
  items: DoctorFaqItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="bg-muted/20" aria-labelledby="faq-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">FAQs</p>
          <h2
            id="faq-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const buttonId = `${baseId}-${item.id}-button`;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border/60 bg-white shadow-[0_4px_20px_rgb(10_37_64/0.05)]"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    )}
                  >
                    <span className="font-heading text-body font-semibold text-[#0A2540]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-[#3B82F6] transition-transform duration-200",
                        isOpen && "rotate-180"
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
                  className="border-t border-border/60 px-5 pb-5 pt-3 sm:px-6 sm:pb-6"
                >
                  <p className="text-body leading-relaxed text-muted-foreground">
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

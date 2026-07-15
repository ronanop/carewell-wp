"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

import {
  ConsultationForm,
  type ConsultationFormProps,
} from "@/components/leads/ConsultationForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConsultationLeadCaptureProps = ConsultationFormProps & {
  /** `inline` for contact/content columns; `sticky` for service landing 70/30. */
  variant?: "inline" | "sticky";
};

/**
 * Public Lead Capture shell — sticky on desktop, bottom sheet on mobile.
 */
export function ConsultationLeadCapture({
  variant = "inline",
  className,
  ...formProps
}: ConsultationLeadCaptureProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (variant === "inline") {
    return <ConsultationForm className={className} {...formProps} />;
  }

  return (
    <>
      {/* Desktop / tablet sticky column */}
      <aside
        className={cn(
          "hidden md:block",
          "md:sticky md:top-24 md:self-start",
          className,
        )}
      >
        <ConsultationForm compact {...formProps} />
      </aside>

      {/* Mobile floating CTA + bottom sheet */}
      <div className="md:hidden">
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-white/95 p-3 backdrop-blur">
          <Button
            type="button"
            className="w-full gap-2"
            onClick={() => setSheetOpen(true)}
          >
            <MessageCircle className="size-4" aria-hidden />
            Book consultation
          </Button>
        </div>

        <AnimatePresence>
          {sheetOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close consultation form"
                className="fixed inset-0 z-50 bg-[#0A2540]/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSheetOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="consultation-form-heading"
                className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 py-3">
                  <p className="font-heading text-small font-semibold text-[#0A2540]">
                    Book Your Consultation
                  </p>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => setSheetOpen(false)}
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="p-4 pb-8">
                  <ConsultationForm
                    compact
                    {...formProps}
                    className="border-0 p-0 shadow-none"
                    onSuccess={() => setSheetOpen(false)}
                  />
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

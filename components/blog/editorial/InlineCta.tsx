"use client";

import { ContactActions } from "@/components/shared/ContactActions";
import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import {
  detectSpecialtyFromHaystack,
  getContextAwareCtaCopyForSpecialty,
} from "@/lib/experience/unified/context";
import { cn } from "@/lib/utils";

export function InlineConsultationCta({
  title,
  placement,
  className,
  copy,
}: {
  title: string;
  placement: string;
  className?: string;
  /** Phase 8.1 — section-contextual messaging (overrides specialty default). */
  copy?: { title: string; body: string; label: string } | null;
}) {
  const specialty = detectSpecialtyFromHaystack(title);
  const specialtyCopy = getContextAwareCtaCopyForSpecialty(specialty);
  const resolved = copy ?? specialtyCopy;

  return (
    <aside
      className={cn(
        "cw-card overflow-hidden border-primary/12 bg-gradient-to-br from-primary/[0.05] via-surface to-surface-cream/80 p-6 sm:p-7",
        className,
      )}
    >
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
        Next step
      </p>
      <h2 className="mt-2 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
        {resolved.title}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
        {resolved.body}
      </p>
      <ContactActions
        className="mt-5"
        bookLabel={resolved.label}
        hierarchy="primary-secondary-tertiary"
        onBookClick={() =>
          emitEditorialEvent({
            type: "cta_clicked",
            ctaId: "inline-consult",
            href: "/contact/",
            placement,
          })
        }
        onWhatsAppClick={() =>
          emitEditorialEvent({
            type: "cta_clicked",
            ctaId: "inline-whatsapp",
            href: "https://wa.me/919811003148",
            placement,
          })
        }
        onCallClick={() =>
          emitEditorialEvent({
            type: "cta_clicked",
            ctaId: "inline-call",
            href: "tel:+919811003148",
            placement,
          })
        }
      />
    </aside>
  );
}

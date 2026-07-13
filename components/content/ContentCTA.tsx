import { CalendarDays, Clock3, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { CONTENT_THEME } from "@/components/content/ContentTheme";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ContentCTAProps {
  /** Optional page context for the headline. */
  pageTitle?: string;
  className?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Post-article clinic CTA — React-only, never from WordPress.
 * Visual language matches homepage / doctor appointment banners.
 */
export function ContentCTA({ pageTitle, className }: ContentCTAProps) {
  const { clinic } = CONTENT_THEME;

  return (
    <section
      className={cn("bg-primary", className)}
      aria-labelledby="content-cta-heading"
    >
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase tracking-wide text-primary-foreground/70">
            {clinic.name}
          </p>
          <h2
            id="content-cta-heading"
            className="mt-3 font-heading text-h2 text-primary-foreground"
          >
            Ready to begin your journey?
          </h2>
          <p className="mt-4 text-body-lg leading-relaxed text-primary-foreground/80">
            {pageTitle
              ? `Speak with our specialists about ${pageTitle}. We will take time to understand your goals and recommend a personalised plan of care.`
              : "Book a consultation with our specialists. We will take time to understand your goals and recommend a personalised plan of care."}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={clinic.bookHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-surface text-primary no-underline transition-transform duration-150 hover:-translate-y-0.5 hover:bg-surface/90 hover:no-underline hover:shadow-md",
              )}
            >
              <CalendarDays className="size-4" aria-hidden />
              Book Consultation
            </Link>
            <a
              href={clinic.phoneHref}
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "border-primary-foreground/40 bg-transparent text-primary-foreground no-underline transition-transform duration-150 hover:-translate-y-0.5 hover:bg-primary-foreground/10 hover:no-underline",
              )}
            >
              <Phone className="size-4" aria-hidden />
              Call Clinic
            </a>
            <a
              href={clinic.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "border-primary-foreground/40 bg-transparent text-primary-foreground no-underline transition-transform duration-150 hover:-translate-y-0.5 hover:bg-primary-foreground/10 hover:no-underline",
              )}
            >
              <WhatsAppIcon className="size-5" />
              WhatsApp
            </a>
          </div>

          <ul className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <li className="flex items-center gap-2 text-small text-primary-foreground/80">
              <ShieldCheck className="size-4 shrink-0" aria-hidden />
              {clinic.experienceLabel}
            </li>
            <li className="flex items-center gap-2 text-small text-primary-foreground/80">
              <Clock3 className="size-4 shrink-0" aria-hidden />
              {clinic.responseLabel}
            </li>
            <li className="flex items-center gap-2 text-small text-primary-foreground/80">
              <CalendarDays className="size-4 shrink-0" aria-hidden />
              Appointment available
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

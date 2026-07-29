import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type FinalCtaStripProps = SectionBaseProps & {
  /** CMS: finalCta.eyebrow */
  eyebrow?: string;
  /** CMS: finalCta.headline */
  headline?: string;
  /** CMS: finalCta.primaryLabel — omit/empty hides primary CTA */
  primaryLabel?: string;
  /** CMS: finalCta.secondaryLabel — omit/empty hides secondary CTA */
  secondaryLabel?: string;
  /** CMS: finalCta.primaryHref */
  primaryHref?: string;
  /** CMS: finalCta.secondaryHref */
  secondaryHref?: string;
};

/**
 * Full-bleed closing CTA band.
 * React owns the shell; CMS owns copy + links.
 * Empty headline + no CTAs → null.
 */
export function FinalCtaStrip({
  id = "final-cta",
  eyebrow,
  headline,
  primaryLabel,
  secondaryLabel,
  primaryHref = "#book",
  secondaryHref = "tel:+919810153580",
  className,
}: FinalCtaStripProps) {
  const title = headline?.trim() || "";
  const primary = primaryLabel?.trim() || "";
  const secondary = secondaryLabel?.trim() || "";
  const showPrimary = Boolean(primary);
  const showSecondary = Boolean(secondary);

  if (!title && !showPrimary && !showSecondary) return null;

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn(
        "relative overflow-hidden border-y border-[#0A2E52]/40",
        "bg-gradient-to-br from-[#0A2E52] via-[#0F3D6B] to-[#1557A0]",
        "text-white",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_15%_0%,rgba(255,255,255,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_240px_at_90%_100%,rgba(11,123,107,0.18),transparent_50%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {eyebrow?.trim() ? (
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-sky-100/80 uppercase">
              {eyebrow.trim()}
            </p>
          ) : null}

          {title ? (
            <h2
              id={`${id}-heading`}
              className={cn(
                "font-heading text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl",
                eyebrow?.trim() ? "mt-2" : undefined,
              )}
            >
              {title}
            </h2>
          ) : null}

          {showPrimary || showSecondary ? (
            <div
              className={cn(
                "flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center",
                title || eyebrow?.trim() ? "mt-7 sm:mt-8" : undefined,
              )}
            >
              {showPrimary ? (
                <a
                  href={primaryHref}
                  className={cn(
                    "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg",
                    "bg-white px-6 text-[0.9375rem] font-semibold text-[#0A2E52]",
                    "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]",
                    "transition-[transform,background-color,box-shadow] duration-200",
                    "hover:bg-sky-50 hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)]",
                    "active:translate-y-px",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1557A0]",
                  )}
                >
                  {primary}
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </a>
              ) : null}

              {showSecondary ? (
                <a
                  href={secondaryHref}
                  className={cn(
                    "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg",
                    "border border-white/45 bg-white/5 px-6 text-[0.9375rem] font-semibold text-white",
                    "backdrop-blur-[2px]",
                    "transition-[background-color,border-color,transform] duration-200",
                    "hover:border-white/70 hover:bg-white/10",
                    "active:translate-y-px",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1557A0]",
                  )}
                >
                  {secondary}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

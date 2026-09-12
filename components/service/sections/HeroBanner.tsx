import Link from "next/link";

import { TreatmentHeroBookingCard } from "@/components/service/TreatmentHeroBookingCard";
import { buttonVariants } from "@/components/ui/button";
import { buildUriBreadcrumbs } from "@/lib/routing/uri";
import { cn } from "@/lib/utils";
import type { ResolvedConsultationChrome } from "@/types/page-chrome";
import { sectionImageUrl } from "./image";
import type { QuickFact, SanityImage, SectionBaseProps } from "./types";

const DEFAULT_HERO_BG = "/images/service-hero-background.jpg";

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

function buildHeroChrome(args: {
  treatment: string;
  pageTitle: string;
  pageSlug: string;
  pageUri: string;
  whatsappNumber?: string;
}): ResolvedConsultationChrome {
  return {
    widgetId: "consultation-sidebar",
    enabled: true,
    stickyOffsetPx: 96,
    desktopWidthPx: 360,
    minWidthPx: 280,
    maxWidthPx: 360,
    variant: "default",
    theme: "light",
    animation: "none",
    heading: "Book FREE Doctor Appointment",
    subtitle: "",
    ctaLabel: "Book Free Appointment",
    badgeLabel: "Free",
    phoneNumber: "+91 9667977499",
    whatsappNumber: args.whatsappNumber ?? "919667977499",
    emergencyNumber: "",
    successMessage: "Thank you — our team will contact you shortly.",
    showTrustBadges: true,
    googleRatingLabel: "4.9 Google",
    patientsLabel: "10k+ patients",
    responseBadge: "Reply in 2 hrs",
    doctorAvailabilityLabel: "Doctors available today",
    treatment: args.treatment,
    pageTitle: args.pageTitle,
    pageSlug: args.pageSlug,
    pageUri: args.pageUri,
  };
}

export type HeroBreadcrumb = { label: string; href: string };

export type HeroBannerProps = SectionBaseProps & {
  /** CMS page title — rendered as the page H1. */
  heading: string;
  tagline?: string; // hero.tagline only — omit/empty hides the subtitle (no excerpt fallback)
  /** WP/Sanity taxonomy only — not used for breadcrumbs. */
  category?: string;
  /**
   * WordPress page URI (e.g. `/plastic-surgery-in-delhi/gynecomastia/`).
   * Breadcrumbs are derived from path segments — same as live WP service pages.
   */
  uri?: string;
  /** Optional override; defaults to `buildUriBreadcrumbs(uri)`. */
  breadcrumbs?: HeroBreadcrumb[];
  /** Desktop / large screens (lg+). */
  image?: SanityImage;
  /** Phones & tablets; falls back to `image` when omitted. */
  imageMobile?: SanityImage;
  /** Falls back to shared service hero photo when omitted. */
  backgroundSrc?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
  whatsappNumber?: string;
  showBookingCard?: boolean;
  /** Kept for API compat — render via QuickFactsCard outside the hero. */
  quickFacts?: QuickFact[];
};

/**
 * Service hero — full-viewport photo plane, left copy + CTAs, right booking card.
 * Breadcrumbs match WordPress: humanized URI segments via `buildUriBreadcrumbs`.
 * Height fills the viewport below sticky promo + navbar (~5.75rem).
 */
export function HeroBanner({
  id = "hero",
  heading,
  tagline,
  uri = "",
  breadcrumbs,
  image,
  imageMobile,
  backgroundSrc,
  primaryCtaLabel = "Book Free Consultation",
  secondaryCtaLabel = "WhatsApp",
  primaryCtaHref = "#treatment-hero-booking",
  secondaryCtaHref,
  whatsappNumber = "919667977499",
  showBookingCard = true,
  className,
}: HeroBannerProps) {
  const desktopSrc =
    sectionImageUrl(image, 1920) || backgroundSrc || DEFAULT_HERO_BG;
  const mobileSrc =
    sectionImageUrl(imageMobile, 1080) ||
    sectionImageUrl(image, 1080) ||
    backgroundSrc ||
    DEFAULT_HERO_BG;
  const whatsappHref =
    secondaryCtaHref || `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  const normalizedUri = uri
    ? uri.startsWith("/")
      ? uri.endsWith("/")
        ? uri
        : `${uri}/`
      : `/${uri.replace(/\/?$/, "/")}`
    : "/";
  const crumbItems: HeroBreadcrumb[] = breadcrumbs?.length
    ? breadcrumbs
    : buildUriBreadcrumbs(normalizedUri).map(({ label, href }) => ({
        label,
        href,
      }));
  const slug = normalizedUri.split("/").filter(Boolean).pop() || "service";
  const chrome = buildHeroChrome({
    treatment: heading,
    pageTitle: heading,
    pageSlug: slug,
    pageUri: normalizedUri,
    whatsappNumber,
  });

  return (
    <header
      id={id}
      className={cn(
        "relative flex min-h-[min(100svh,56rem)] flex-col overflow-hidden lg:min-h-[calc(100svh-5.75rem)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Art direction: browser fetches only the matching source */}
        <picture className="absolute inset-0 block h-full w-full">
          <source media="(min-width: 1024px)" srcSet={desktopSrc} />
          <img
            src={mobileSrc}
            alt=""
            width={1080}
            height={1350}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[center_22%] max-lg:scale-[1.08] lg:object-[center_30%]"
          />
        </picture>
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,37,64,0.94) 0%, rgba(15,55,110,0.82) 32%, rgba(21,87,160,0.35) 58%, rgba(21,87,160,0.08) 78%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,37,64,0.82) 0%, rgba(10,37,64,0.72) 42%, rgba(10,37,64,0.88) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10">
        <nav aria-label="Breadcrumb" className="shrink-0 text-sm text-white/70">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbItems.map((item, i) => {
              const last = i === crumbItems.length - 1;
              return (
                <li key={`${item.href}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 ? <span aria-hidden>/</span> : null}
                  {last ? (
                    <span className="line-clamp-1 opacity-90">{item.label}</span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 grid flex-1 items-center gap-10 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <h1 className="mx-auto max-w-3xl text-center font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-balance text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_12px_rgba(10,37,64,0.35)] lg:mx-0 lg:text-left">
              {heading}
            </h1>
            {tagline ? (
              <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/90 sm:text-lg lg:mx-0 lg:text-left">
                {tagline}
              </p>
            ) : null}

            <div className="mt-7 flex flex-nowrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
              <a
                href={primaryCtaHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "min-w-0 flex-1 rounded-md bg-primary px-3 text-sm text-primary-foreground shadow-none hover:bg-primary/90 sm:flex-none sm:px-5 sm:text-base",
                )}
              >
                {primaryCtaLabel}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "whatsapp", size: "default" }),
                  "shrink-0 rounded-md px-3 text-sm shadow-none sm:px-5 sm:text-base",
                )}
              >
                <WhatsAppIcon className="size-4 shrink-0" />
                {secondaryCtaLabel}
              </a>
            </div>
          </div>

          {showBookingCard ? (
            <div className="mx-auto w-full max-w-[360px] lg:mx-0 lg:max-w-none">
              <TreatmentHeroBookingCard chrome={chrome} />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

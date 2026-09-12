import Link from "next/link";
import type { ReactNode } from "react";

import { TreatmentHeroBookingCardLazy } from "@/components/service/TreatmentHeroBookingCardLazy";
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

export function buildHeroChrome(args: {
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
    desktopWidthPx: 320,
    minWidthPx: 280,
    maxWidthPx: 320,
    variant: "default",
    theme: "light",
    animation: "none",
    heading: "Book FREE Doctor Appointment",
    subtitle: "",
    ctaLabel: "Book Free Consultation",
    badgeLabel: "Free consult",
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
  tagline?: string;
  category?: string;
  uri?: string;
  breadcrumbs?: HeroBreadcrumb[];
  image?: SanityImage;
  imageMobile?: SanityImage;
  backgroundSrc?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
  whatsappNumber?: string;
  showBookingCard?: boolean;
  quickFacts?: QuickFact[];
  /**
   * `standalone` — self-contained hero with inline booking (gallery / previews).
   * `shell` — copy only (min viewport height); backdrop rendered by page shell.
   */
  layout?: "standalone" | "shell";
  /** Extra node after hero copy when layout="shell" (unused; reserved). */
  afterCopy?: ReactNode;
};

function resolveHeroAssets({
  image,
  imageMobile,
  backgroundSrc,
}: {
  image?: SanityImage;
  imageMobile?: SanityImage;
  backgroundSrc?: string;
}) {
  const desktopSrc =
    sectionImageUrl(image, { width: 1600, quality: 68, format: "webp" }) ||
    backgroundSrc ||
    DEFAULT_HERO_BG;
  // Mobile LCP: keep under ~828w — phones do not need 1080+ assets.
  const mobileSrc =
    sectionImageUrl(imageMobile, { width: 750, quality: 65, format: "webp" }) ||
    sectionImageUrl(image, { width: 750, quality: 65, format: "webp" }) ||
    backgroundSrc ||
    DEFAULT_HERO_BG;
  return { desktopSrc, mobileSrc };
}

/** Public helper for <link rel="preload"> on service templates. */
export function resolveServiceHeroImageUrls(args: {
  image?: SanityImage;
  imageMobile?: SanityImage;
  backgroundSrc?: string;
}) {
  return resolveHeroAssets(args);
}

function resolveCrumbs(uri: string, breadcrumbs?: HeroBreadcrumb[]) {
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
  return { normalizedUri, crumbItems, slug };
}

function HeroBackground({
  desktopSrc,
  mobileSrc,
}: {
  desktopSrc: string;
  mobileSrc: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <picture className="absolute inset-0 block h-full w-full">
        <source media="(min-width: 1024px)" srcSet={desktopSrc} />
        <img
          src={mobileSrc}
          alt=""
          width={750}
          height={938}
          fetchPriority="high"
          decoding="sync"
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
  );
}

/**
 * Full-viewport hero photo plane — place outside the content grid so it
 * spans edge-to-edge behind copy + booking form.
 */
export function ServiceHeroBackdrop({
  image,
  imageMobile,
  backgroundSrc,
  className,
}: {
  image?: SanityImage;
  imageMobile?: SanityImage;
  backgroundSrc?: string;
  className?: string;
}) {
  const { desktopSrc, mobileSrc } = resolveHeroAssets({
    image,
    imageMobile,
    backgroundSrc,
  });

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(100svh,56rem)] overflow-hidden lg:h-[calc(100svh-5.75rem)]",
        className,
      )}
      aria-hidden
    >
      <HeroBackground desktopSrc={desktopSrc} mobileSrc={mobileSrc} />
    </div>
  );
}

function HeroCopy({
  heading,
  tagline,
  crumbItems,
  primaryCtaLabel,
  secondaryCtaLabel,
  primaryCtaHref,
  whatsappHref,
}: {
  heading: string;
  tagline?: string;
  crumbItems: HeroBreadcrumb[];
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  primaryCtaHref: string;
  whatsappHref: string;
}) {
  return (
    <>
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

      <div className="mt-8 flex flex-1 flex-col justify-center lg:mt-0">
        <h1 className="mx-auto max-w-3xl text-center font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-balance text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_12px_rgba(10,37,64,0.35)] lg:mx-0 lg:text-left">
          {heading}
        </h1>
        {tagline ? (
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/90 sm:text-lg lg:mx-0 lg:text-left">
            {tagline}
          </p>
        ) : null}

        <div className="mt-7 flex flex-nowrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
          <a
            href={primaryCtaHref}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "group min-w-0 flex-1 rounded-xl bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground",
              "shadow-[0_8px_24px_-8px_rgba(21,87,160,0.55)]",
              "transition-[transform,box-shadow,background-color] duration-200 ease-out",
              "hover:-translate-y-0.5 hover:bg-[#124a8a] hover:shadow-[0_14px_32px_-10px_rgba(21,87,160,0.65)]",
              "active:translate-y-0 active:shadow-[0_6px_16px_-8px_rgba(21,87,160,0.5)]",
              "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              "sm:flex-none sm:px-7 sm:text-base",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            {primaryCtaLabel}
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "whatsapp", size: "lg" }),
              "group shrink-0 rounded-xl px-5 text-[0.9375rem] font-semibold",
              "shadow-[0_8px_24px_-8px_rgba(37,211,102,0.5)]",
              "transition-[transform,box-shadow,background-color] duration-200 ease-out",
              "hover:-translate-y-0.5 hover:bg-[#1ebe57] hover:shadow-[0_14px_32px_-10px_rgba(37,211,102,0.6)]",
              "active:translate-y-0 active:shadow-[0_6px_16px_-8px_rgba(37,211,102,0.45)]",
              "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              "sm:px-7 sm:text-base",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            <WhatsAppIcon className="size-5 shrink-0 transition-transform duration-200 group-hover:scale-110 motion-reduce:group-hover:scale-100" />
            {secondaryCtaLabel}
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * Service hero — full-viewport photo plane, left copy + CTAs, right booking card.
 * Use `layout="shell"` when the page provides a sticky booking rail outside.
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
  layout = "standalone",
  className,
}: HeroBannerProps) {
  const whatsappHref =
    secondaryCtaHref || `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  const { normalizedUri, crumbItems, slug } = resolveCrumbs(uri, breadcrumbs);

  const copy = (
    <HeroCopy
      heading={heading}
      tagline={tagline}
      crumbItems={crumbItems}
      primaryCtaLabel={primaryCtaLabel}
      secondaryCtaLabel={secondaryCtaLabel}
      primaryCtaHref={primaryCtaHref}
      whatsappHref={whatsappHref}
    />
  );

  if (layout === "shell") {
    return (
      <header
        id={id}
        className={cn(
          "relative z-10 flex min-h-[min(100svh,56rem)] flex-col lg:min-h-[calc(100svh-5.75rem)]",
          className,
        )}
      >
        <div className="relative flex flex-1 flex-col py-8 sm:py-10 lg:py-12">
          {copy}
        </div>
      </header>
    );
  }

  const { desktopSrc, mobileSrc } = resolveHeroAssets({
    image,
    imageMobile,
    backgroundSrc,
  });
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
      <HeroBackground desktopSrc={desktopSrc} mobileSrc={mobileSrc} />

      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10">
        <div
          className={cn(
            "mt-0 grid flex-1 items-center gap-10",
            showBookingCard &&
              "lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 xl:gap-16",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col">{copy}</div>

          {showBookingCard ? (
            <div className="mx-auto w-full max-w-[320px] lg:mx-0 lg:w-[320px] lg:max-w-none">
              <TreatmentHeroBookingCardLazy chrome={chrome} />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/** Shared page-shell chrome builder for sticky booking rail. */
export function resolveServiceHeroChrome(args: {
  heading: string;
  uri?: string;
  whatsappNumber?: string;
}) {
  const { normalizedUri, slug } = resolveCrumbs(args.uri ?? "");
  return buildHeroChrome({
    treatment: args.heading,
    pageTitle: args.heading,
    pageSlug: slug,
    pageUri: normalizedUri,
    whatsappNumber: args.whatsappNumber,
  });
}

import type { Metadata } from "next";
import {
  FinalCtaStrip,
  HeroBanner,
  LocationSection,
  QuickFactsCard,
  resolveServiceHeroChrome,
  resolveServiceHeroImageUrls,
  ServiceHeroBackdrop,
} from "@/components/service/sections";
import { ServiceStickyBookingRail } from "@/components/service/ServiceStickyBookingRail";
import { TreatmentHeroBookingCardLazy } from "@/components/service/TreatmentHeroBookingCardLazy";
import { ServicePageBuilderSections } from "@/components/service/ServicePageBuilderSections";
import type { SanityServiceDoc } from "@/components/service/sanityServiceTypes";
import type { SanityPostCard } from "@/lib/sanity/post";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";

export type { SanityServiceDoc } from "@/components/service/sanityServiceTypes";

const TECHNICAL_STRING_KEYS = new Set([
  "_id",
  "_key",
  "_ref",
  "_type",
  "ctaHref",
  "mapEmbedUrl",
  "mapHref",
  "phone",
  "primaryHref",
  "secondaryHref",
  "slug",
  "uri",
  "url",
  "whatsapp",
  "youtubeId",
]);

/**
 * Keep imported service copy readable without changing the Sanity source.
 * This gives every page the same baseline for common brand/place-name casing,
 * spacing, and punctuation while leaving URLs and document identifiers intact.
 */
function polishServiceValue(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    if (key && TECHNICAL_STRING_KEYS.has(key)) return value;

    return value
      .replace(/[ \t]+/g, " ")
      .replace(/[ \t]+([,.;!?])/g, "$1")
      .replace(/\bdr\.?\s+sandeep\s+bhasin\b/gi, "Dr. Sandeep Bhasin")
      .replace(/\bcare\s*well\b/gi, "Care Well")
      .replace(/\bdelhi\s+ncr\b/gi, "Delhi NCR")
      .replace(/\bdelhi\b/gi, "Delhi")
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => polishServiceValue(item, key));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        polishServiceValue(entryValue, entryKey),
      ]),
    );
  }

  return value;
}

function polishServiceCopy(service: SanityServiceDoc): SanityServiceDoc {
  return polishServiceValue(service) as SanityServiceDoc;
}

export function buildSanityServiceMetadata(
  service: SanityServiceDoc,
): Metadata {
  const raw = service.uri?.trim();
  const path = raw
    ? (raw.startsWith("/") ? raw : `/${raw}`).replace(/\/?$/, "/")
    : undefined;
  return {
    title: service.seo?.title || service.title,
    description: service.seo?.description || service.excerpt,
    robots: service.seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: path ? { canonical: path } : undefined,
  };
}

/**
 * Full CMS-driven service page (navbar + sections + footer).
 * Hero booking card sticks in the right rail through hero + main content.
 */
export function SanityServiceTemplate({
  service: rawService,
  relatedPosts = [],
}: {
  service: SanityServiceDoc;
  relatedPosts?: SanityPostCard[];
}) {
  const service = polishServiceCopy(rawService);
  const heading = service.title;
  const chrome = resolveServiceHeroChrome({
    heading,
    uri: service.uri,
  });
  const { mobileSrc, mobileSrcSet } = resolveServiceHeroImageUrls({
    image: service.hero?.image,
    imageMobile: service.hero?.imageMobile,
  });

  return (
    <>
      {/* Discover LCP hero image before CSS/JS — critical for mobile CWV. */}
      {mobileSrc.startsWith("http") || mobileSrc.startsWith("/") ? (
        <link
          rel="preload"
          as="image"
          href={mobileSrc}
          imageSrcSet={mobileSrcSet}
          imageSizes="100vw"
          fetchPriority="high"
        />
      ) : null}
      <NavbarPlaceholder />
      <main className="service-page bg-[#FAFBFE] text-slate-900">
        <div className="relative">
          <ServiceHeroBackdrop
            image={service.hero?.image}
            imageMobile={service.hero?.imageMobile}
          />

          <div className="service-content relative z-10 mx-auto grid w-full max-w-[90rem] px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:px-8 xl:gap-16 xl:px-10">
            <HeroBanner
              layout="shell"
              heading={heading}
              tagline={service.hero?.tagline}
              category={service.category}
              uri={service.uri}
              image={service.hero?.image}
              imageMobile={service.hero?.imageMobile}
              primaryCtaLabel={service.hero?.primaryCtaLabel}
              secondaryCtaLabel={service.hero?.secondaryCtaLabel}
              quickFacts={service.hero?.quickFacts}
              showBookingCard={false}
            />

            <ServiceStickyBookingRail className="w-full max-lg:pb-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <TreatmentHeroBookingCardLazy chrome={chrome} />
            </ServiceStickyBookingRail>

            <div className="service-main-column min-w-0 space-y-2 bg-[#FAFBFE] pb-10 pt-2 sm:pb-12 lg:col-start-1 lg:pt-4">
              <QuickFactsCard
                facts={service.hero?.quickFacts}
                note={service.hero?.quickFactsNote}
              />
              <ServicePageBuilderSections
                service={service}
                relatedPosts={relatedPosts}
              />
            </div>
          </div>
        </div>

        <LocationSection
          eyebrow={service.location?.eyebrow}
          heading={service.location?.heading}
          address={service.location?.address}
          hours={service.location?.hours}
          phone={service.location?.phone}
          mapHref={service.location?.mapHref}
          mapEmbedUrl={service.location?.mapEmbedUrl}
        />

        <FinalCtaStrip
          eyebrow={service.finalCta?.eyebrow}
          headline={service.finalCta?.headline}
          primaryLabel={service.finalCta?.primaryLabel}
          primaryHref={service.finalCta?.primaryHref}
          secondaryLabel={service.finalCta?.secondaryLabel}
          secondaryHref={service.finalCta?.secondaryHref}
        />
      </main>
      <FooterPlaceholder />
    </>
  );
}

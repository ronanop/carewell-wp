/**
 * Homepage — single React tree for public site and Static Experience Studio (ADR-015/016).
 * Hero stays statically imported for LCP. Everything below the fold is dynamically
 * imported (ssr: true) so mobile phones download less JS before first paint.
 */

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { HeroSection } from "@/components/home/HeroSection";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticEditProvider } from "@/components/pages/StaticEditProvider";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { isSectionEnabled } from "@/lib/static-pages/applyOverrides";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

const TrustIndicators = dynamic(
  () =>
    import("@/components/home/TrustIndicators").then((m) => ({
      default: m.TrustIndicators,
    })),
  { ssr: true },
);
const TreatmentJourney = dynamic(
  () =>
    import("@/components/home/TreatmentJourney").then((m) => ({
      default: m.TreatmentJourney,
    })),
  { ssr: true },
);
const ServicesSection = dynamic(
  () =>
    import("@/components/home/ServicesSection").then((m) => ({
      default: m.ServicesSection,
    })),
  { ssr: true },
);
const AiSkinAnalysis = dynamic(
  () =>
    import("@/components/home/AiSkinAnalysis").then((m) => ({
      default: m.AiSkinAnalysis,
    })),
  { ssr: true },
);
const ConsultationSpecialties = dynamic(
  () =>
    import("@/components/home/ConsultationSpecialties").then((m) => ({
      default: m.ConsultationSpecialties,
    })),
  { ssr: true },
);
const CTABanner = dynamic(
  () =>
    import("@/components/home/CTABanner").then((m) => ({
      default: m.CTABanner,
    })),
  { ssr: true },
);
const DoctorsSection = dynamic(
  () =>
    import("@/components/home/DoctorsSection").then((m) => ({
      default: m.DoctorsSection,
    })),
  { ssr: true },
);
const GoogleReviewsSection = dynamic(
  () =>
    import("@/components/home/GoogleReviewsSection").then((m) => ({
      default: m.GoogleReviewsSection,
    })),
  { ssr: true },
);
const LocationLeadSection = dynamic(
  () =>
    import("@/components/home/LocationLeadSection").then((m) => ({
      default: m.LocationLeadSection,
    })),
  { ssr: true },
);
const WhyChooseUs = dynamic(
  () =>
    import("@/components/home/WhyChooseUs").then((m) => ({
      default: m.WhyChooseUs,
    })),
  { ssr: true },
);

export type HomePageViewProps = StaticPageViewProps & {
  /** Streamed testimonials (preferred). */
  testimonialsSlot?: ReactNode;
  /** Streamed blog cards (preferred). */
  blogSlot?: ReactNode;
};

/** Section-level fade entry as the homepage is scrolled. */
function HomeSectionEnter({
  children,
  immediate = false,
}: {
  children: ReactNode;
  immediate?: boolean;
}) {
  return (
    <StaggerReveal immediate={immediate} stepMs={0} className="w-full">
      {children}
    </StaggerReveal>
  );
}

export function HomePageView({
  mode,
  config = null,
  testimonialsSlot,
  blogSlot,
}: HomePageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <StaticEditProvider mode={mode} config={config} pageSlug="home">
      <NavbarPlaceholder />
      <main className="flex-1">
        {enabled("home.hero") ? (
          <StaticSectionFrame id="home.hero" type="hero" mode={mode}>
            {/* No stagger wrapper — hero is the LCP candidate on mobile. */}
            <HeroSection />
          </StaticSectionFrame>
        ) : null}
        <div className="homepage-compact">
          {enabled("home.trust") ? (
            <StaticSectionFrame id="home.trust" type="trust" mode={mode}>
              <HomeSectionEnter>
                <TrustIndicators />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.journey") ? (
            <StaticSectionFrame id="home.journey" type="timeline" mode={mode}>
              <HomeSectionEnter>
                <TreatmentJourney />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.services") ? (
            <StaticSectionFrame
              id="home.services"
              type="related-treatments"
              mode={mode}
            >
              <HomeSectionEnter>
                <ServicesSection />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.ai-skin") ? (
            <StaticSectionFrame id="home.ai-skin" type="content" mode={mode}>
              <HomeSectionEnter>
                <AiSkinAnalysis />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.doctors") ? (
            <StaticSectionFrame id="home.doctors" type="doctor" mode={mode}>
              <HomeSectionEnter>
                <DoctorsSection />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.specialties") ? (
            <StaticSectionFrame id="home.specialties" type="content" mode={mode}>
              <HomeSectionEnter>
                <ConsultationSpecialties />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.why") ? (
            <StaticSectionFrame id="home.why" type="faq" mode={mode}>
              <HomeSectionEnter>
                <WhyChooseUs />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.testimonials") ? (
            <StaticSectionFrame
              id="home.testimonials"
              type="testimonials"
              mode={mode}
            >
              <HomeSectionEnter>{testimonialsSlot}</HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.blog") && blogSlot ? (
            <StaticSectionFrame id="home.blog" type="related-blogs" mode={mode}>
              <HomeSectionEnter>{blogSlot}</HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.reviews") ? (
            <StaticSectionFrame
              id="home.reviews"
              type="testimonials"
              mode={mode}
            >
              <HomeSectionEnter>
                <GoogleReviewsSection />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.location") ? (
            <StaticSectionFrame id="home.location" type="location" mode={mode}>
              <HomeSectionEnter>
                <LocationLeadSection />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.cta") ? (
            <StaticSectionFrame id="home.cta" type="cta" mode={mode}>
              <HomeSectionEnter>
                <CTABanner />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
        </div>
      </main>
      <div className="homepage-compact">
        <FooterPlaceholder />
      </div>
    </StaticEditProvider>
  );
}

/**
 * Homepage — single React tree for public site and Static Experience Studio (ADR-015/016).
 */

import dynamic from "next/dynamic";

import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import type { HomeBlogPost } from "@/components/home/BlogSection";
import type { HomeYouTubeVideo } from "@/components/home/TestimonialsSection";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticEditProvider } from "@/components/pages/StaticEditProvider";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { isSectionEnabled } from "@/lib/static-pages/applyOverrides";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";
import type { ReactNode } from "react";

/** Below-the-fold sections — split client bundles so first paint stays light. */
const TreatmentJourney = dynamic(() =>
  import("@/components/home/TreatmentJourney").then((m) => m.TreatmentJourney),
);
const AiSkinAnalysis = dynamic(() =>
  import("@/components/home/AiSkinAnalysis").then((m) => m.AiSkinAnalysis),
);
const DoctorsSection = dynamic(() =>
  import("@/components/home/DoctorsSection").then((m) => m.DoctorsSection),
);
const AboutSection = dynamic(() =>
  import("@/components/home/AboutSection").then((m) => m.AboutSection),
);
const ConsultationSpecialties = dynamic(() =>
  import("@/components/home/ConsultationSpecialties").then(
    (m) => m.ConsultationSpecialties,
  ),
);
const WhyChooseUs = dynamic(() =>
  import("@/components/home/WhyChooseUs").then((m) => m.WhyChooseUs),
);
const TestimonialsSection = dynamic(() =>
  import("@/components/home/TestimonialsSection").then(
    (m) => m.TestimonialsSection,
  ),
);
const BlogSection = dynamic(() =>
  import("@/components/home/BlogSection").then((m) => m.BlogSection),
);
const GoogleReviewsSection = dynamic(() =>
  import("@/components/home/GoogleReviewsSection").then(
    (m) => m.GoogleReviewsSection,
  ),
);
const LocationLeadSection = dynamic(() =>
  import("@/components/home/LocationLeadSection").then(
    (m) => m.LocationLeadSection,
  ),
);
const CTABanner = dynamic(() =>
  import("@/components/home/CTABanner").then((m) => m.CTABanner),
);

export type HomePageViewProps = StaticPageViewProps & {
  /** Latest posts for BlogSection (optional — empty until Sanity blogs wire up). */
  latestBlogPosts?: HomeBlogPost[];
  /** Latest YouTube videos for TestimonialsSection (public route only). */
  latestYouTubeVideos?: HomeYouTubeVideo[];
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
  latestBlogPosts,
  latestYouTubeVideos,
}: HomePageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <StaticEditProvider mode={mode} config={config} pageSlug="home">
      <NavbarPlaceholder />
      <main className="flex-1">
        {enabled("home.hero") ? (
          <StaticSectionFrame id="home.hero" type="hero" mode={mode}>
            <HomeSectionEnter immediate>
              <HeroSection />
            </HomeSectionEnter>
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
          {enabled("home.about") ? (
            <StaticSectionFrame id="home.about" type="content" mode={mode}>
              <HomeSectionEnter>
                <AboutSection />
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
              <HomeSectionEnter>
                <TestimonialsSection videos={latestYouTubeVideos} />
              </HomeSectionEnter>
            </StaticSectionFrame>
          ) : null}
          {enabled("home.blog") && (latestBlogPosts?.length ?? 0) > 0 ? (
            <StaticSectionFrame id="home.blog" type="related-blogs" mode={mode}>
              <HomeSectionEnter>
                <BlogSection posts={latestBlogPosts} />
              </HomeSectionEnter>
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

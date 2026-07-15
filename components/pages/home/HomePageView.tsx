/**
 * Homepage — single React tree for public site and Static Experience Studio (ADR-015/016).
 */

import { AboutSection } from "@/components/home/AboutSection";
import { AiSkinAnalysis } from "@/components/home/AiSkinAnalysis";
import { BlogSection } from "@/components/home/BlogSection";
import { ConsultationSpecialties } from "@/components/home/ConsultationSpecialties";
import { CTABanner } from "@/components/home/CTABanner";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LocationLeadSection } from "@/components/home/LocationLeadSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TreatmentJourney } from "@/components/home/TreatmentJourney";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticEditProvider } from "@/components/pages/StaticEditProvider";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

export function HomePageView({ mode, config = null }: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <StaticEditProvider mode={mode} config={config} pageSlug="home">
      <NavbarPlaceholder />
      <main className="flex-1">
        {enabled("home.hero") ? (
          <StaticSectionFrame id="home.hero" type="hero" mode={mode}>
            <HeroSection />
          </StaticSectionFrame>
        ) : null}
        <div className="homepage-compact">
          {enabled("home.trust") ? (
            <StaticSectionFrame id="home.trust" type="trust" mode={mode}>
              <TrustIndicators />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.journey") ? (
            <StaticSectionFrame id="home.journey" type="timeline" mode={mode}>
              <TreatmentJourney />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.services") ? (
            <StaticSectionFrame
              id="home.services"
              type="related-treatments"
              mode={mode}
            >
              <ServicesSection />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.ai-skin") ? (
            <StaticSectionFrame id="home.ai-skin" type="content" mode={mode}>
              <AiSkinAnalysis />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.doctors") ? (
            <StaticSectionFrame id="home.doctors" type="doctor" mode={mode}>
              <DoctorsSection />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.about") ? (
            <StaticSectionFrame id="home.about" type="content" mode={mode}>
              <AboutSection />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.specialties") ? (
            <StaticSectionFrame id="home.specialties" type="content" mode={mode}>
              <ConsultationSpecialties />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.why") ? (
            <StaticSectionFrame id="home.why" type="faq" mode={mode}>
              <WhyChooseUs />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.blog") ? (
            <StaticSectionFrame id="home.blog" type="related-blogs" mode={mode}>
              <BlogSection />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.location") ? (
            <StaticSectionFrame id="home.location" type="location" mode={mode}>
              <LocationLeadSection />
            </StaticSectionFrame>
          ) : null}
          {enabled("home.cta") ? (
            <StaticSectionFrame id="home.cta" type="cta" mode={mode}>
              <CTABanner />
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

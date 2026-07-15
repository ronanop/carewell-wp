/**
 * About page — single React tree for public + Studio (ADR-015).
 */

import { AboutBeliefBand } from "@/components/about/AboutBeliefBand";
import { AboutBreadcrumb } from "@/components/about/AboutBreadcrumb";
import { AboutClinic } from "@/components/about/AboutClinic";
import { AboutDoctor } from "@/components/about/AboutDoctor";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTreatments } from "@/components/about/AboutTreatments";
import { AboutValuePillars } from "@/components/about/AboutValuePillars";
import { AboutVisionMission } from "@/components/about/AboutVisionMission";
import { AboutVisitCta } from "@/components/about/AboutVisitCta";
import { AboutWhyChoose } from "@/components/about/AboutWhyChoose";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticEditProvider } from "@/components/pages/StaticEditProvider";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

export function AboutPageView({ mode, config = null }: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <StaticEditProvider mode={mode} config={config} pageSlug="about">
      <NavbarPlaceholder />
      <main className="flex-1">
        {enabled("about.breadcrumb") ? (
          <StaticSectionFrame id="about.breadcrumb" type="content" mode={mode}>
            <AboutBreadcrumb />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.hero") ? (
          <StaticSectionFrame id="about.hero" type="hero" mode={mode}>
            <AboutHero />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.treatments") ? (
          <StaticSectionFrame
            id="about.treatments"
            type="related-treatments"
            mode={mode}
          >
            <AboutTreatments />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.belief") ? (
          <StaticSectionFrame id="about.belief" type="content" mode={mode}>
            <AboutBeliefBand />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.why") ? (
          <StaticSectionFrame id="about.why" type="faq" mode={mode}>
            <AboutWhyChoose />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.doctor") ? (
          <StaticSectionFrame id="about.doctor" type="doctor" mode={mode}>
            <AboutDoctor />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.mission") ? (
          <StaticSectionFrame id="about.mission" type="content" mode={mode}>
            <AboutVisionMission />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.cta") ? (
          <StaticSectionFrame id="about.cta" type="cta" mode={mode}>
            <AboutVisitCta />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.values") ? (
          <StaticSectionFrame id="about.values" type="content" mode={mode}>
            <AboutValuePillars />
          </StaticSectionFrame>
        ) : null}
        {enabled("about.clinic") ? (
          <StaticSectionFrame id="about.clinic" type="content" mode={mode}>
            <AboutClinic />
          </StaticSectionFrame>
        ) : null}
      </main>
      <FooterPlaceholder />
    </StaticEditProvider>
  );
}

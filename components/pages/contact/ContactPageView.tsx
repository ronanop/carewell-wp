/**
 * Contact page — single React tree for public + Studio (ADR-015).
 */

import { ContactBreadcrumb } from "@/components/contact/ContactBreadcrumb";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMapSection } from "@/components/contact/ContactMapSection";
import { ContactReachSection } from "@/components/contact/ContactReachSection";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticEditProvider } from "@/components/pages/StaticEditProvider";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

export function ContactPageView({ mode, config = null }: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <StaticEditProvider mode={mode} config={config} pageSlug="contact">
      <NavbarPlaceholder />
      <main className="flex-1">
        {enabled("contact.breadcrumb") ? (
          <StaticSectionFrame
            id="contact.breadcrumb"
            type="content"
            mode={mode}
          >
            <ContactBreadcrumb />
          </StaticSectionFrame>
        ) : null}
        {enabled("contact.hero") ? (
          <StaticSectionFrame id="contact.hero" type="hero" mode={mode}>
            <ContactHero />
          </StaticSectionFrame>
        ) : null}
        {enabled("contact.reach") ? (
          <StaticSectionFrame id="contact.reach" type="content" mode={mode}>
            <ContactReachSection />
          </StaticSectionFrame>
        ) : null}
        {enabled("contact.map") ? (
          <StaticSectionFrame id="contact.map" type="location" mode={mode}>
            <ContactMapSection />
          </StaticSectionFrame>
        ) : null}
      </main>
      <FooterPlaceholder />
    </StaticEditProvider>
  );
}

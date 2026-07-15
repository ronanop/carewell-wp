/**
 * Privacy policy view — shared public + Studio (ADR-015).
 */

import { PrivacyBreadcrumb } from "@/components/privacy/PrivacyBreadcrumb";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

export function PrivacyPageView({ mode, config = null }: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <PrivacyBreadcrumb />
        {enabled("privacy.content") ? (
          <StaticSectionFrame id="privacy.content" type="content" mode={mode}>
            <PrivacyContent />
          </StaticSectionFrame>
        ) : null}
      </main>
      <FooterPlaceholder />
    </>
  );
}

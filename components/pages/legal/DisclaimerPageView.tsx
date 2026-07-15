/**
 * Disclaimer view — shared public + Studio (ADR-015).
 */

import { DisclaimerBreadcrumb } from "@/components/disclaimer/DisclaimerBreadcrumb";
import { DisclaimerContent } from "@/components/disclaimer/DisclaimerContent";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

export function DisclaimerPageView({
  mode,
  config = null,
}: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <DisclaimerBreadcrumb />
        {enabled("disclaimer.content") ? (
          <StaticSectionFrame
            id="disclaimer.content"
            type="content"
            mode={mode}
          >
            <DisclaimerContent />
          </StaticSectionFrame>
        ) : null}
      </main>
      <FooterPlaceholder />
    </>
  );
}

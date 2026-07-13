import { ContentCTA } from "@/components/content/ContentCTA";
import { EditorialSection } from "@/components/content/EditorialSection";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { ContentRenderer, RenderMode } from "@carewell/page-renderer";
import type { ContentOverrides } from "@/types/content-ast";

import "./content-enhancer.css";

export interface ContentEnhancerProps {
  html: string;
  pageTitle?: string;
  hideCta?: boolean;
  className?: string;
  /** @deprecated Use PresentationPage mode instead. Always PUBLIC here. */
  decompose?: boolean;
  contentOverrides?: ContentOverrides | null;
}

/**
 * Editorial chrome around the canonical ContentRenderer (PUBLIC mode only).
 * Experience Studio must use PresentationPage + RenderMode.EDITOR — never this path for AST.
 */
export function ContentEnhancer({
  html,
  pageTitle,
  hideCta = false,
  className,
  contentOverrides = null,
}: ContentEnhancerProps) {
  return (
    <>
      <ReadingProgress />
      <EditorialSection className={className} aria-label="Page content">
        <div data-content-enhancer-article>
          <ContentRenderer
            mode={RenderMode.PUBLIC}
            html={html}
            contentOverrides={contentOverrides}
          />
        </div>
      </EditorialSection>
      {hideCta ? null : <ContentCTA pageTitle={pageTitle} />}
    </>
  );
}

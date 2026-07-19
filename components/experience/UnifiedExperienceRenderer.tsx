/**
 * UnifiedExperienceRenderer — single public entry for all experience kinds.
 * Phase 8.0: blogs + services share editorial pipeline; PresentationPage is BC adapter.
 */

import { BlogPresentationPage } from "@/components/blog/BlogPresentationPage";
import { ServiceExperienceRenderer } from "@/components/service/ServiceExperienceRenderer";
import {
  experienceToBlogDocument,
  experienceHasEditorialPipeline,
} from "@/lib/experience/unified/adapters";
import { ensureDefaultExperienceSymbols } from "@/lib/experience/library/symbols";
import { ensureDefaultExperienceComponents } from "@/lib/experience/unified/componentRegistry";
import { experienceConfigToPresentationConfig } from "@/lib/experience/unified/migrate";
import type { ExperienceDocument } from "@/types/experience-document";
import type { BlogCategory } from "@/types/blog";
import type { PresentationPage } from "@/types/presentation-config";
import {
  PresentationPage as PresentationPageView,
  RenderMode,
} from "@carewell/page-renderer";

ensureDefaultExperienceSymbols();
ensureDefaultExperienceComponents();

function experienceToPresentationPage(doc: ExperienceDocument): PresentationPage {
  return {
    uri: doc.uri,
    title: doc.title,
    contentHtml: doc.contentHtml,
    wordpressStatus: doc.wordpressStatus,
    featuredImage: doc.hero.featuredImage,
    seo: doc.seo,
    config: doc.legacyPresentation ?? experienceConfigToPresentationConfig(doc.config),
    resolved: doc.resolved,
    presentationStatus: doc.presentationStatus,
    breadcrumbs: doc.breadcrumbs,
    pageType: doc.pageType,
    chrome: doc.chrome,
  };
}

function isServiceLikeKind(kind: ExperienceDocument["kind"]): boolean {
  return kind === "service" || kind === "landing" || kind === "doctor";
}

export function UnifiedExperienceRenderer({
  document: doc,
  categories = [],
  mode = RenderMode.PUBLIC,
}: {
  document: ExperienceDocument;
  categories?: BlogCategory[];
  mode?: (typeof RenderMode)[keyof typeof RenderMode];
}) {
  const hasEditorial = experienceHasEditorialPipeline(doc);
  const preferLegacy = Boolean(doc.useLegacyPresentationFallback);

  // Blog editorial path — always prefer semantic pipeline when present
  if (doc.kind === "blog" && hasEditorial) {
    const blogDoc = experienceToBlogDocument(doc);
    if (blogDoc) {
      return <BlogPresentationPage document={blogDoc} categories={categories} />;
    }
  }

  // Service / landing / doctor editorial path (Phase 8.0).
  // preferLegacy is reserved for absolute pipeline failure (parse throw / empty AST),
  // never for medium/low confidence — see servicePresentationEngine.
  if (isServiceLikeKind(doc.kind) && hasEditorial && !preferLegacy) {
    return (
      <ServiceExperienceRenderer document={doc} categories={categories} />
    );
  }

  if (isServiceLikeKind(doc.kind) && preferLegacy) {
    console.error("[CWMC]", {
      context: "UnifiedExperienceRenderer",
      uri: doc.uri,
      kind: doc.kind,
      confidence: doc.semanticConfidence,
      hasEditorial,
      message:
        "PresentationPage fallback — absolute editorial failure only",
    });
  }

  // Backward-compatible PresentationPage adapter (non-service kinds / absolute failure)
  return (
    <PresentationPageView
      page={experienceToPresentationPage(doc)}
      mode={mode}
    />
  );
}

/**
 * Service Presentation Engine — WordPress Page → ServiceDocument.
 * Shared intelligence: parseHtmlToServiceAst → semantic → layout compose.
 * Presentation overlays from PagePresentation only.
 */

import "server-only";

import { parseHtmlToServiceAst } from "@/lib/experience/service/parseHtmlToServiceAst";
import { ensureServiceSemanticRules } from "@/lib/experience/service/serviceSemanticRules";
import { extractServiceSemanticSlots } from "@/lib/experience/service/semanticSlots";
import {
  scoreServiceSemanticConfidence,
  shouldUseServiceEditorialPath,
} from "@/lib/experience/service/confidence";
import { analyzeArticleSemantics } from "@/lib/experience/semantic/analyzeArticle";
import {
  buildComposerSignals,
  composeEditorialLayout,
} from "@/lib/experience/layout/compose";
import { getPresentationPage } from "@/lib/experience/engine/presentationEngine";
import {
  createDefaultExperienceConfig,
  presentationConfigToExperienceConfig,
} from "@/lib/experience/unified/migrate";
import { DEFAULT_SERVICE_SIDEBAR } from "@/types/service-document";
import type { ServiceDocument } from "@/types/service-document";
import type { ArticleDocument } from "@/types/article-ast";
import type { SemanticAnalysisResult } from "@/types/semantic-article";
import type { LayoutComposition } from "@/types/editorial-layout";
import { SITE_URL } from "@/lib/seo/constants";
import { applyContentOverrides } from "@/lib/experience/content/applyOverrides";

ensureServiceSemanticRules();

function deriveTreatmentName(title: string, slug: string): string {
  const cleaned = title
    .replace(/\s*[|\-–—]\s*Care\s*Well.*$/i, "")
    .replace(/\s+in\s+Delhi.*$/i, "")
    .trim();
  if (cleaned.length >= 3) return cleaned;
  return slug
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function emptyArticle(): ArticleDocument {
  return {
    version: 1,
    content: { version: 1, sourceHash: "empty", nodes: [] },
    blockMeta: {},
    toc: [],
    faqs: [],
    readingTimeMinutes: 1,
    wordCount: 0,
    sourceHash: "empty",
  };
}

function emptySemantic(): SemanticAnalysisResult {
  return { version: 1, sections: [], documentFaqs: [] };
}

/**
 * Build a ServiceDocument from a WordPress page URI.
 * Returns null if the URI is not a WordPress page or not a service-like type.
 */
export async function getServiceDocument(
  uri: string,
): Promise<ServiceDocument | null> {
  const page = await getPresentationPage(uri);
  if (!page) return null;

  // Editorial pipeline for treatment-like WordPress pages.
  // Other page types fall through to PresentationPage via the provider adapter.
  if (
    page.pageType !== "SERVICE" &&
    page.pageType !== "LANDING" &&
    page.pageType !== "DOCTOR"
  ) {
    return null;
  }

  const kind =
    page.pageType === "LANDING"
      ? ("landing" as const)
      : page.pageType === "DOCTOR"
        ? ("doctor" as const)
        : ("service" as const);

  const experienceConfig = presentationConfigToExperienceConfig(
    page.config,
    kind,
  );

  ensureServiceSemanticRules();

  let article: ArticleDocument;
  let semantic: SemanticAnalysisResult;
  let layout: LayoutComposition;
  let pipelineFailed = false;

  try {
    const articleBase = parseHtmlToServiceAst(page.contentHtml ?? "");
    article = {
      ...articleBase,
      content: applyContentOverrides(
        articleBase.content,
        page.config.contentOverrides,
      ),
    };
    semantic = analyzeArticleSemantics(article);
    layout = composeEditorialLayout({
      sections: semantic.sections,
      signals: buildComposerSignals({
        sections: semantic.sections,
        faqCount: article.faqs.length,
        readingMinutes: article.readingTimeMinutes,
      }),
      overrides: {
        templateId:
          (experienceConfig.layoutTemplateId as
            | "treatment-guide"
            | "recovery-guide"
            | "cost-guide"
            | "before-after-showcase"
            | "faq-heavy"
            | "medical-research"
            | "long-form-editorial"
            | null
            | undefined) ?? "treatment-guide",
        heroLayout: experienceConfig.heroLayout ?? null,
        spacingPreset: experienceConfig.spacingPreset ?? null,
        presentationPolish: experienceConfig.presentationPolish ?? {
          preferSoftSurfaces: true,
          tightHeroHandoff: true,
          readingMeasure: "comfortable",
          defaultCardStyle: "medical",
          buttonHierarchy: "primary-secondary-tertiary",
        },
      },
    });
  } catch (error) {
    pipelineFailed = true;
    console.error("[CWMC]", {
      context: "servicePresentationEngine.getServiceDocument",
      uri: page.uri,
      message:
        error instanceof Error ? error.message : "Editorial pipeline soft-fail",
    });
    // Soft-fail: keep a minimal pipeline so UnifiedExperienceRenderer can still
    // prefer ServiceExperienceRenderer when contentHtml exists; only absolute
    // emptiness should force the legacy PresentationPage adapter.
    article = emptyArticle();
    semantic = emptySemantic();
    layout = composeEditorialLayout({
      sections: [],
      signals: buildComposerSignals({
        sections: [],
        faqCount: 0,
        readingMinutes: 1,
      }),
      overrides: {
        templateId: "treatment-guide",
        heroLayout: experienceConfig.heroLayout ?? null,
        spacingPreset: experienceConfig.spacingPreset ?? null,
        presentationPolish: experienceConfig.presentationPolish ?? {
          preferSoftSurfaces: true,
          tightHeroHandoff: true,
          readingMeasure: "comfortable",
          defaultCardStyle: "medical",
          buttonHierarchy: "primary-secondary-tertiary",
        },
      },
    });
  }

  const slots = extractServiceSemanticSlots(semantic);
  const confidence = scoreServiceSemanticConfidence(semantic);
  const nodeCount = article.content.nodes.length;
  const sectionCount = semantic.sections.length;
  // Absolute failure only: thrown pipeline with no AST, or totally empty page.
  // Low/medium confidence never forces PresentationPage when AST exists.
  const useEditorial =
    !pipelineFailed &&
    (sectionCount > 0 || nodeCount > 0) &&
    shouldUseServiceEditorialPath(confidence, { sectionCount: sectionCount || nodeCount });

  if (!useEditorial) {
    console.error("[CWMC]", {
      context: "servicePresentationEngine.editorialGate",
      uri: page.uri,
      confidence,
      pipelineFailed,
      sectionCount,
      nodeCount,
      message:
        "Falling back to PresentationPage — absolute editorial failure only",
    });
  } else if (confidence === "low") {
    console.error("[CWMC]", {
      context: "servicePresentationEngine.lowConfidence",
      uri: page.uri,
      confidence,
      sectionCount,
      message:
        "Low semantic confidence — still using ServiceExperienceRenderer",
    });
  }

  const slug =
    page.uri
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean)
      .pop() ?? "";

  const treatmentName = deriveTreatmentName(page.title, slug);
  const shareUrl =
    page.seo.canonicalUrl ||
    `${SITE_URL}${page.uri.startsWith("/") ? page.uri.replace(/\/$/, "") : `/${page.uri}`}`;

  return {
    kind: "service",
    uri: page.uri,
    slug,
    title: page.title,
    wordpressStatus: page.wordpressStatus,
    pageType: page.pageType,
    experienceKind: kind,
    hero: {
      title: page.title,
      subtitle: page.seo.description,
      featuredImage: page.featuredImage ?? page.resolved.heroImage,
      category: null,
      treatmentName,
      durationLabel: null,
      recoveryLabel: null,
      experienceLabel: "20+ years of clinical care",
      shareUrl,
      readingTimeMinutes: article.readingTimeMinutes,
    },
    article,
    semantic,
    slots,
    layout,
    contentHtml: page.contentHtml,
    toc: article.toc,
    faqs: article.faqs.length ? article.faqs : semantic.documentFaqs,
    relatedTreatments: [],
    relatedBlogs: [],
    breadcrumbs: page.breadcrumbs,
    seo: page.seo,
    config: {
      ...experienceConfig,
      experienceKind: kind,
      layoutPreset: experienceConfig.layoutPreset ?? "medical-luxury",
    },
    sidebar: DEFAULT_SERVICE_SIDEBAR,
    resolved: page.resolved,
    presentationStatus: page.presentationStatus,
    chrome: page.chrome,
    leadContext: {
      pageUrl: shareUrl,
      pageTitle: page.title,
      category: treatmentName,
      specialtySlug: slug,
    },
    // Only absolute failure (no usable content + empty sections) opts into legacy.
    useLegacyPresentationFallback: !useEditorial,
    legacyPresentation: page.config,
    semanticConfidence: confidence,
  };
}

export function createEmptyServiceExperienceConfig() {
  return createDefaultExperienceConfig("service");
}

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

/**
 * Build a ServiceDocument from a WordPress page URI.
 * Returns null if the URI is not a WordPress page.
 */
export async function getServiceDocument(
  uri: string,
): Promise<ServiceDocument | null> {
  const page = await getPresentationPage(uri);
  if (!page) return null;

  // Editorial pipeline only for treatment-like WordPress pages.
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

  const articleBase = parseHtmlToServiceAst(page.contentHtml ?? "");
  const article = {
    ...articleBase,
    content: applyContentOverrides(
      articleBase.content,
      page.config.contentOverrides,
    ),
  };

  const semantic = analyzeArticleSemantics(article);
  const slots = extractServiceSemanticSlots(semantic);
  const confidence = scoreServiceSemanticConfidence(semantic);
  const useEditorial = shouldUseServiceEditorialPath(confidence);

  const layout = composeEditorialLayout({
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
    useLegacyPresentationFallback: !useEditorial,
    legacyPresentation: page.config,
    semanticConfidence: confidence,
  };
}

export function createEmptyServiceExperienceConfig() {
  return createDefaultExperienceConfig("service");
}

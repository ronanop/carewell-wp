/**
 * Convert BlogDocument / PresentationPage → ExperienceDocument.
 */

import {
  blogPresentationConfigToExperienceConfig,
  presentationConfigToExperienceConfig,
} from "@/lib/experience/unified/migrate";
import { DEFAULT_BLOG_SIDEBAR } from "@/lib/experience/validations/blogPresentationConfig";
import type { BlogDocument } from "@/types/blog-document";
import type { PresentationPage } from "@/types/presentation-config";
import type {
  ExperienceDocument,
  ExperienceKind,
} from "@/types/experience-document";
import type { PageType } from "@/lib/experience/engine/pageClassification";
import type { ArticleDocument } from "@/types/article-ast";
import type { SemanticAnalysisResult } from "@/types/semantic-article";
import type { LayoutComposition } from "@/types/editorial-layout";
import type { ServiceDocument } from "@/types/service-document";
import { DEFAULT_SERVICE_SIDEBAR } from "@/types/service-document";
import type { BlogSidebarConfig } from "@/types/blog-document";

function kindFromPageType(pageType: PageType): ExperienceKind {
  switch (pageType) {
    case "BLOG":
      return "blog";
    case "SERVICE":
      return "service";
    case "LANDING":
      return "landing";
    case "DOCTOR":
      return "doctor";
    case "HOME":
      return "home";
    case "ABOUT":
      return "generic";
    default:
      return "generic";
  }
}

export function blogDocumentToExperience(
  doc: BlogDocument,
): ExperienceDocument {
  const config = blogPresentationConfigToExperienceConfig(
    doc.config as import("@/lib/experience/validations/blogPresentationConfig").BlogPresentationConfig,
  );

  return {
    kind: "blog",
    uri: doc.uri,
    slug: doc.slug,
    title: doc.title,
    wordpressStatus: doc.wordpressStatus,
    pageType: doc.pageType,
    hero: doc.hero,
    author: doc.author,
    tags: doc.tags,
    categories: doc.categories,
    article: doc.article,
    semantic: doc.semantic,
    layout: doc.layout,
    contentHtml: doc.contentHtml,
    toc: doc.toc,
    faqs: doc.faqs,
    comments: doc.comments,
    related: doc.related,
    previous: doc.previous,
    next: doc.next,
    popular: doc.popular,
    latest: doc.latest,
    breadcrumbs: doc.breadcrumbs,
    seo: doc.seo,
    config,
    sidebar: doc.sidebar,
    resolved: doc.resolved,
    presentationStatus: doc.presentationStatus,
    chrome: doc.chrome,
    leadContext: {
      pageUrl: doc.leadContext.blogUrl,
      pageTitle: doc.leadContext.blogTitle,
      category: doc.leadContext.category,
      specialtySlug: doc.categories[0]?.slug ?? null,
    },
    legacyPresentation: doc.config,
  };
}

export function experienceToBlogDocument(
  doc: ExperienceDocument,
): BlogDocument | null {
  if (!doc.article || !doc.semantic || !doc.layout) return null;

  return {
    uri: doc.uri,
    slug: doc.slug,
    title: doc.title,
    wordpressStatus: doc.wordpressStatus,
    pageType: doc.pageType,
    hero: doc.hero,
    author: doc.author,
    tags: doc.tags,
    categories: doc.categories,
    article: doc.article,
    semantic: doc.semantic,
    layout: doc.layout,
    contentHtml: doc.contentHtml,
    toc: doc.toc,
    faqs: doc.faqs,
    comments: doc.comments,
    related: doc.related,
    previous: doc.previous,
    next: doc.next,
    popular: doc.popular,
    latest: doc.latest,
    breadcrumbs: doc.breadcrumbs,
    seo: doc.seo,
    config: doc.legacyPresentation ?? doc.config,
    sidebar: doc.sidebar,
    resolved: doc.resolved,
    presentationStatus: doc.presentationStatus,
    chrome: doc.chrome,
    leadContext: {
      blogUrl: doc.leadContext.pageUrl,
      blogTitle: doc.leadContext.pageTitle,
      category: doc.leadContext.category,
    },
  };
}

export function presentationPageToExperience(
  page: PresentationPage,
  extras?: {
    article?: ArticleDocument | null;
    semantic?: SemanticAnalysisResult | null;
    layout?: LayoutComposition | null;
  },
): ExperienceDocument {
  const kind = kindFromPageType(page.pageType);
  const config = presentationConfigToExperienceConfig(page.config, kind);

  const emptyArticle: ArticleDocument | null = extras?.article ?? null;

  return {
    kind,
    uri: page.uri,
    slug: page.uri.replace(/^\/|\/$/g, "").split("/").pop() ?? page.uri,
    title: page.title,
    wordpressStatus: page.wordpressStatus,
    pageType: page.pageType,
    hero: {
      title: page.title,
      excerpt: page.seo.description,
      featuredImage: page.featuredImage,
      category: null,
      categories: [],
      publishedAt: null,
      modifiedAt: null,
      author: null,
      readingTimeMinutes: Math.max(
        1,
        Math.round((page.contentHtml?.replace(/<[^>]+>/g, " ").split(/\s+/).length ?? 200) / 200),
      ),
      views: null,
      shareUrl: page.seo.canonicalUrl ?? page.uri,
    },
    author: null,
    tags: [],
    categories: [],
    article: emptyArticle,
    semantic: extras?.semantic ?? null,
    layout: extras?.layout ?? null,
    contentHtml: page.contentHtml,
    toc: emptyArticle?.toc ?? [],
    faqs: emptyArticle?.faqs ?? [],
    comments: [],
    related: [],
    previous: null,
    next: null,
    popular: [],
    latest: [],
    breadcrumbs: page.breadcrumbs,
    seo: page.seo,
    config,
    sidebar: DEFAULT_BLOG_SIDEBAR,
    resolved: page.resolved,
    presentationStatus: page.presentationStatus,
    chrome: page.chrome,
    leadContext: {
      pageUrl: page.seo.canonicalUrl ?? page.uri,
      pageTitle: page.title,
      category: null,
      specialtySlug: null,
    },
    legacyPresentation: page.config,
  };
}

function serviceSidebarToBlogSidebar(
  sidebar: typeof DEFAULT_SERVICE_SIDEBAR,
): BlogSidebarConfig {
  return {
    widgets: sidebar.widgets.map((w) => {
      // Never surface blog Reading / On this page / redundant CTA chrome on service pages.
      if (
        w.id === "progress" ||
        w.id === "toc" ||
        w.id === "summary" ||
        w.id === "whatsapp" ||
        w.id === "appointment"
      ) {
        return {
          id: (w.id === "summary" ? "toc" : w.id) as BlogSidebarConfig["widgets"][number]["id"],
          enabled: false,
          order: w.order,
        };
      }
      return {
        id: (w.id === "pricing"
          ? "appointment"
          : w.id === "related"
            ? "latest"
            : w.id === "location"
              ? "categories"
              : w.id) as BlogSidebarConfig["widgets"][number]["id"],
        enabled: w.enabled,
        order: w.order,
      };
    }),
  };
}

/**
 * ServiceDocument → ExperienceDocument (Phase 8.0).
 */
export function serviceDocumentToExperience(
  doc: ServiceDocument,
): ExperienceDocument {
  return {
    kind: doc.experienceKind === "landing" ? "landing" : "service",
    uri: doc.uri,
    slug: doc.slug,
    title: doc.title,
    wordpressStatus: doc.wordpressStatus,
    pageType: doc.pageType,
    hero: {
      title: doc.hero.title,
      excerpt: doc.hero.subtitle,
      featuredImage: doc.hero.featuredImage,
      category: null,
      categories: [],
      publishedAt: null,
      modifiedAt: null,
      author: null,
      readingTimeMinutes: doc.hero.readingTimeMinutes,
      views: null,
      shareUrl: doc.hero.shareUrl,
    },
    author: null,
    tags: [],
    categories: [],
    article: doc.article,
    semantic: doc.semantic,
    layout: doc.layout,
    contentHtml: doc.contentHtml,
    toc: doc.toc,
    faqs: doc.faqs,
    comments: [],
    related: doc.relatedBlogs,
    previous: null,
    next: null,
    popular: [],
    latest: [],
    breadcrumbs: doc.breadcrumbs,
    seo: doc.seo,
    config: doc.config,
    sidebar: serviceSidebarToBlogSidebar(doc.sidebar),
    resolved: doc.resolved,
    presentationStatus: doc.presentationStatus,
    chrome: doc.chrome,
    leadContext: doc.leadContext,
    legacyPresentation: doc.legacyPresentation,
    qualityWarnings: doc.qualityWarnings,
    intelligence: doc.intelligence,
    review: doc.review,
    useLegacyPresentationFallback: doc.useLegacyPresentationFallback,
    semanticConfidence: doc.semanticConfidence,
  };
}

export function experienceHasEditorialPipeline(
  doc: ExperienceDocument,
): boolean {
  return Boolean(doc.article && doc.semantic && doc.layout);
}


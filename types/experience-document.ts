/**
 * ExperienceDocument — unified render model for Phase 7.0.
 * Every content kind (blog, service, static, landing, doctor, home)
 * normalizes into this schema before rendering.
 *
 * WordPress remains the source of truth for content bodies.
 * Prisma stores presentation overlays only.
 */

import type { ArticleDocument, ArticleFaqItem, ArticleTocItem } from "@/types/article-ast";
import type {
  BlogAdjacentPost,
  BlogAuthor,
  BlogCategory,
  BlogComment,
  BlogPostSummary,
  BlogTag,
} from "@/types/blog";
import type {
  BlogHeroModel,
  BlogSidebarConfig,
} from "@/types/blog-document";
import type { LayoutComposition } from "@/types/editorial-layout";
import type { PageType } from "@/lib/experience/engine/pageClassification";
import type { ResolvedPageChrome } from "@/types/page-chrome";
import type {
  PresentationConfig,
  ResolvedMedia,
} from "@/types/presentation-config";
import type { SemanticAnalysisResult } from "@/types/semantic-article";

/** Discriminator for content providers and Studio persistence. */
export type ExperienceKind =
  | "blog"
  | "service"
  | "static"
  | "landing"
  | "doctor"
  | "home"
  | "generic";

/**
 * ExperienceConfig — PresentationConfig extended with unified editorial fields.
 * BlogPresentationConfig and page PresentationConfig migrate into this shape.
 */
export type ExperienceConfig = PresentationConfig & {
  experienceKind: ExperienceKind;
  /** Layout Composer / Intelligence preset (Studio switchable). */
  layoutPreset?: ExperienceLayoutPresetId | null;
  /** Article / long-form editorial preset. */
  editorialPreset?: import("@/types/semantic-article").EditorialPresetId;
  /** Sidebar widgets (shared across kinds that show a sidebar). */
  experienceSidebar?: BlogSidebarConfig;
  /** Legacy alias — kept for BlogPresentationConfig round-trips. */
  blogSidebar?: BlogSidebarConfig;
  inlineCtaEverySections?: number;
  heroMedia?: import("@/types/editorial-layout").HeroMediaConfig;
  heroLayout?: import("@/types/editorial-layout").HeroLayoutVariant | null;
  layoutTemplateId?: import("@/types/editorial-layout").ArticleLayoutTemplateId | null;
  spacingPreset?: import("@/types/editorial-layout").SpacingPreset | null;
  heroMediaPreviewOriginal?: boolean;
  /** Optional references into the Global Experience Library. */
  globalSymbolIds?: string[];
  /** Local overrides of global symbols (symbolId → partial props). */
  globalSymbolOverrides?: Record<string, Record<string, unknown>>;
  /** Phase 8.1 — presentation polish controls (Studio). */
  presentationPolish?: import("@/types/editorial-layout").ExperiencePresentationPolish;
};

export type ExperienceLayoutPresetId =
  | "medical-luxury"
  | "editorial"
  | "conversion"
  | "magazine"
  | "minimal"
  | "corporate"
  | "landing"
  | "doctor-profile"
  | "journal";

export type ExperienceLeadContext = {
  pageUrl: string;
  pageTitle: string;
  category: string | null;
  /** Specialty slug for context-aware CTA messaging (hair, hbot, …). */
  specialtySlug: string | null;
};

export type ExperienceDocument = {
  kind: ExperienceKind;
  uri: string;
  slug: string;
  title: string;
  wordpressStatus: string;
  pageType: PageType;
  hero: BlogHeroModel;
  author: BlogAuthor | null;
  tags: BlogTag[];
  categories: BlogCategory[];
  /** Long-form AST when available (blogs; services when HTML is lifted). */
  article: ArticleDocument | null;
  semantic: SemanticAnalysisResult | null;
  layout: LayoutComposition | null;
  contentHtml: string;
  toc: ArticleTocItem[];
  faqs: ArticleFaqItem[];
  comments: BlogComment[];
  related: BlogPostSummary[];
  previous: BlogAdjacentPost | null;
  next: BlogAdjacentPost | null;
  popular: BlogPostSummary[];
  latest: BlogPostSummary[];
  breadcrumbs: Array<{ label: string; href: string }>;
  seo: {
    title: string | null;
    description: string | null;
    canonicalUrl: string | null;
    openGraphTitle: string | null;
    openGraphDescription: string | null;
    openGraphImage: string | null;
  };
  config: ExperienceConfig;
  sidebar: BlogSidebarConfig;
  resolved: {
    heroImage: ResolvedMedia | null;
    ogImage: ResolvedMedia | null;
    sectionMedia: Record<string, ResolvedMedia[]>;
  };
  presentationStatus: "DRAFT" | "PUBLISHED" | "NOT_CONFIGURED";
  chrome: ResolvedPageChrome;
  leadContext: ExperienceLeadContext;
  /**
   * Original PresentationConfig before ExperienceConfig enrichment.
   * Used for round-trip adapters and legacy renderers.
   */
  legacyPresentation?: PresentationConfig;
  /** Design Quality Validator warnings (Studio; never block public render). */
  qualityWarnings?: ExperienceQualityWarning[];
  /** Layout Intelligence scores (optional; Studio / analytics). */
  intelligence?: ExperienceIntelligenceResult | null;
  /** Phase 7.1 — Experience Review Mode report for Studio. */
  review?: import("@/lib/experience/quality/reviewMode").ExperienceReviewReport | null;
  /**
   * Phase 8.0 — when true, UnifiedExperienceRenderer uses PresentationPage
   * (low semantic confidence). Editorial path is preferred when false.
   */
  useLegacyPresentationFallback?: boolean;
  semanticConfidence?: "high" | "medium" | "low";
};

export type ExperienceQualityWarning = {
  code: string;
  severity: "info" | "warn" | "error";
  message: string;
  sectionId?: string;
};

export type ExperienceIntelligenceResult = {
  conversionScore: number;
  readabilityScore: number;
  visualBalanceScore: number;
  recommendations: string[];
  applied: boolean;
};

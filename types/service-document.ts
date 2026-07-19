/**
 * ServiceDocument — typed treatment experience model (Phase 8.0).
 * WordPress Page HTML remains source of truth; this never stores Gutenberg in Prisma.
 * Built on the same Article AST + Semantic + Layout pipeline as blogs.
 */

import type { ArticleDocument, ArticleFaqItem, ArticleTocItem } from "@/types/article-ast";
import type { BlogPostSummary } from "@/types/blog";
import type { LayoutComposition } from "@/types/editorial-layout";
import type { PageType } from "@/lib/experience/engine/pageClassification";
import type { ResolvedPageChrome } from "@/types/page-chrome";
import type {
  PresentationConfig,
  ResolvedMedia,
} from "@/types/presentation-config";
import type {
  SemanticAnalysisResult,
  SemanticSection,
} from "@/types/semantic-article";
import type {
  ExperienceConfig,
  ExperienceKind,
  ExperienceLeadContext,
  ExperienceQualityWarning,
  ExperienceIntelligenceResult,
} from "@/types/experience-document";
import type { ExperienceReviewReport } from "@/lib/experience/quality/reviewMode";

export type ServiceHeroModel = {
  title: string;
  subtitle: string | null;
  featuredImage: ResolvedMedia | null;
  category: string | null;
  treatmentName: string;
  durationLabel: string | null;
  recoveryLabel: string | null;
  experienceLabel: string | null;
  shareUrl: string;
  readingTimeMinutes: number;
};

export type ServiceSidebarWidgetId =
  | "progress"
  | "toc"
  | "consultation"
  | "doctor"
  | "summary"
  | "pricing"
  | "related"
  | "location"
  | "whatsapp"
  | "appointment";

export type ServiceSidebarConfig = {
  widgets: Array<{
    id: ServiceSidebarWidgetId;
    enabled: boolean;
    order: number;
  }>;
};

export const DEFAULT_SERVICE_SIDEBAR: ServiceSidebarConfig = {
  widgets: [
    { id: "progress", enabled: false, order: 0 },
    { id: "toc", enabled: false, order: 1 },
    { id: "consultation", enabled: true, order: 2 },
    { id: "summary", enabled: false, order: 3 },
    { id: "doctor", enabled: false, order: 4 },
    { id: "pricing", enabled: false, order: 5 },
    { id: "related", enabled: false, order: 6 },
    { id: "location", enabled: false, order: 7 },
    { id: "whatsapp", enabled: false, order: 8 },
    { id: "appointment", enabled: false, order: 9 },
  ],
};

/**
 * Service AST = ArticleDocument (shared intelligence; not a fork).
 * Alias clarifies Phase 8.0 naming without duplicating the parser.
 */
export type ServiceAstDocument = ArticleDocument;

/**
 * Typed semantic slots — views over classified sections (not duplicated HTML).
 */
export type ServiceSemanticSlots = {
  overview: SemanticSection | null;
  treatment: SemanticSection | null;
  benefits: SemanticSection | null;
  procedure: SemanticSection | null;
  recovery: SemanticSection | null;
  timeline: SemanticSection | null;
  candidate: SemanticSection | null;
  contraindications: SemanticSection | null;
  risks: SemanticSection | null;
  technology: SemanticSection | null;
  results: SemanticSection | null;
  gallery: SemanticSection | null;
  beforeAfter: SemanticSection | null;
  cost: SemanticSection | null;
  insurance: SemanticSection | null;
  doctor: SemanticSection | null;
  location: SemanticSection | null;
  testimonials: SemanticSection | null;
  research: SemanticSection | null;
  comparison: SemanticSection | null;
  faq: SemanticSection | null;
  consultation: SemanticSection | null;
  preparation: SemanticSection | null;
  aftercare: SemanticSection | null;
  warning: SemanticSection | null;
  videos: SemanticSection | null;
};

export type ServiceDocument = {
  kind: "service";
  uri: string;
  slug: string;
  title: string;
  wordpressStatus: string;
  pageType: PageType;
  experienceKind: ExperienceKind;
  hero: ServiceHeroModel;
  /** Shared AST — same pipeline as blogs. */
  article: ServiceAstDocument;
  semantic: SemanticAnalysisResult;
  /** Typed section views for Studio + conversion components. */
  slots: ServiceSemanticSlots;
  layout: LayoutComposition;
  contentHtml: string;
  toc: ArticleTocItem[];
  faqs: ArticleFaqItem[];
  relatedTreatments: Array<{ title: string; href: string }>;
  relatedBlogs: BlogPostSummary[];
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
  sidebar: ServiceSidebarConfig;
  resolved: {
    heroImage: ResolvedMedia | null;
    ogImage: ResolvedMedia | null;
    sectionMedia: Record<string, ResolvedMedia[]>;
  };
  presentationStatus: "DRAFT" | "PUBLISHED" | "NOT_CONFIGURED";
  chrome: ResolvedPageChrome;
  leadContext: ExperienceLeadContext;
  /** When true, UnifiedExperienceRenderer may fall back to PresentationPage. */
  useLegacyPresentationFallback: boolean;
  legacyPresentation?: PresentationConfig;
  qualityWarnings?: ExperienceQualityWarning[];
  intelligence?: ExperienceIntelligenceResult | null;
  review?: ExperienceReviewReport | null;
  semanticConfidence: "high" | "medium" | "low";
};

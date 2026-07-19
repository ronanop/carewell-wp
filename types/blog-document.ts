/**
 * BlogDocument — resolved render model for the Blog Presentation Engine.
 * Presentation only overlays; WordPress post body is never stored in Prisma.
 */

import type { ArticleDocument } from "@/types/article-ast";
import type { SemanticAnalysisResult } from "@/types/semantic-article";
import type { LayoutComposition } from "@/types/editorial-layout";
import type {
  BlogAdjacentPost,
  BlogAuthor,
  BlogCategory,
  BlogComment,
  BlogPostSummary,
  BlogTag,
} from "@/types/blog";
import type { PageType } from "@/lib/experience/engine/pageClassification";
import type { ResolvedPageChrome } from "@/types/page-chrome";
import type {
  PresentationConfig,
  ResolvedMedia,
} from "@/types/presentation-config";

export type BlogHeroModel = {
  title: string;
  excerpt: string | null;
  featuredImage: ResolvedMedia | null;
  category: BlogCategory | null;
  categories: BlogCategory[];
  publishedAt: string | null;
  modifiedAt: string | null;
  author: BlogAuthor | null;
  readingTimeMinutes: number;
  /** Future-ready view counter (null until Lead/analytics wiring). */
  views: number | null;
  shareUrl: string;
};

export type BlogSidebarWidgetId =
  | "search"
  | "toc"
  | "doctor"
  | "consultation"
  | "categories"
  | "popular"
  | "latest"
  | "newsletter"
  | "whatsapp"
  | "appointment"
  | "progress"
  | "trending";

export type BlogSidebarConfig = {
  widgets: Array<{
    id: BlogSidebarWidgetId;
    enabled: boolean;
    order: number;
  }>;
};

export type BlogCtaPlacement = "mid" | "bottom" | "exit";

export type BlogDocument = {
  uri: string;
  slug: string;
  title: string;
  wordpressStatus: string;
  pageType: PageType;
  hero: BlogHeroModel;
  author: BlogAuthor | null;
  tags: BlogTag[];
  categories: BlogCategory[];
  /** Article AST — typed editorial blocks (never raw HTML as primary path). */
  article: ArticleDocument;
  /** Semantic Analysis Engine output — section classifications. */
  semantic: SemanticAnalysisResult;
  /** Layout Composer output — rhythm, templates, CTA placement. */
  layout: LayoutComposition;
  /** Original WP HTML retained for Studio fingerprint / fallback only. */
  contentHtml: string;
  toc: ArticleDocument["toc"];
  faqs: ArticleDocument["faqs"];
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
  config: PresentationConfig;
  sidebar: BlogSidebarConfig;
  resolved: {
    heroImage: ResolvedMedia | null;
    ogImage: ResolvedMedia | null;
    sectionMedia: Record<string, ResolvedMedia[]>;
  };
  presentationStatus: "DRAFT" | "PUBLISHED" | "NOT_CONFIGURED";
  chrome: ResolvedPageChrome;
  /** Lead capture context for consultation forms. */
  leadContext: {
    blogUrl: string;
    blogTitle: string;
    category: string | null;
  };
};

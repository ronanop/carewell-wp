/**
 * Blog presentation defaults — PresentationConfig tuned for editorial layout.
 * Stores presentation only; never duplicates WordPress content.
 */

import {
  createDefaultPresentationConfig,
  parsePresentationConfig,
} from "@/lib/experience/validations/presentationConfig";
import type { PresentationConfig, SectionConfig } from "@/types/presentation-config";
import type { BlogSidebarConfig } from "@/types/blog-document";
import {
  DEFAULT_HERO_MEDIA,
  type ArticleLayoutTemplateId,
  type HeroLayoutVariant,
  type HeroMediaConfig,
  type SpacingPreset,
} from "@/types/editorial-layout";

const BLOG_SECTION_ORDER: Array<
  Pick<SectionConfig, "type" | "variant" | "enabled">
> = [
  { type: "hero", variant: "editorial", enabled: true },
  { type: "content", variant: "article", enabled: true },
  { type: "doctor", variant: "card", enabled: false },
  { type: "faq", variant: "accordion", enabled: true },
  { type: "related-blogs", variant: "cards", enabled: true },
  { type: "cta", variant: "final", enabled: true },
];

export type BlogPresentationConfig = PresentationConfig & {
  /** Blog-specific sidebar widget order (presentation only). */
  blogSidebar?: BlogSidebarConfig;
  /** Article presentation preset (Phase 6.1). */
  editorialPreset?: import("@/types/semantic-article").EditorialPresetId;
  /** Insert inline consultation CTA every N semantic sections (0 = off). */
  inlineCtaEverySections?: number;
  /** Phase 6.2 — hero media fit / focal point (never crops by default). */
  heroMedia?: HeroMediaConfig;
  /** Override auto-detected hero layout variant. */
  heroLayout?: HeroLayoutVariant | null;
  /** Override Layout Composer template. */
  layoutTemplateId?: ArticleLayoutTemplateId | null;
  /** Override spacing preset. */
  spacingPreset?: SpacingPreset | null;
  /** Studio: show original image dimensions badge. */
  heroMediaPreviewOriginal?: boolean;
};

export const DEFAULT_BLOG_SIDEBAR: BlogSidebarConfig = {
  widgets: [
    { id: "progress", enabled: true, order: 0 },
    { id: "toc", enabled: true, order: 1 },
    { id: "consultation", enabled: true, order: 2 },
    { id: "doctor", enabled: false, order: 3 },
    { id: "categories", enabled: true, order: 4 },
    { id: "popular", enabled: true, order: 5 },
    { id: "latest", enabled: true, order: 6 },
    { id: "newsletter", enabled: true, order: 7 },
    { id: "whatsapp", enabled: true, order: 8 },
    { id: "appointment", enabled: true, order: 9 },
    { id: "search", enabled: true, order: 10 },
    { id: "trending", enabled: false, order: 11 },
  ],
};

export function createDefaultBlogPresentationConfig(): BlogPresentationConfig {
  const base = createDefaultPresentationConfig("blog");
  return {
    ...base,
    pageTypeOverride: "BLOG",
    hero: {
      ...base.hero,
      variant: "editorial",
      height: "default",
      showTrustBadges: false,
      showCta: false,
      overlayStrength: 35,
    },
    content: {
      ...base.content,
      readingWidth: "article",
      headingStyle: "editorial",
      imageStyle: "editorial",
      tableStyle: "professional",
      faqStyle: "accordion",
    },
    theme: { variant: "editorial" },
    animation: { preset: "editorial", delayMs: 0 },
    navigation: {
      ...base.navigation,
      breadcrumbStyle: "light",
      stickyCta: false,
    },
    sections: BLOG_SECTION_ORDER.map((section, index) => ({
      id: `blog-${section.type}-${index + 1}`,
      type: section.type,
      enabled: section.enabled,
      variant: section.variant,
      spacing: section.type === "content" ? "default" : "default",
      background: "none",
      animation: "inherit",
      visibility: "always" as const,
      settings: {
        doctorPhoto: null,
        gallery: [],
        heading: null,
        supportingText: null,
      },
    })),
    chrome: {
      consultationSidebar: {
        visibility: "inherit",
        stickyOffsetPx: null,
        desktopWidthPx: null,
        variant: null,
        theme: null,
        animation: null,
      },
    },
    advanced: {
      ...base.advanced,
      cacheTag: "blogs",
    },
    blogSidebar: DEFAULT_BLOG_SIDEBAR,
    editorialPreset: "editorial",
    inlineCtaEverySections: 4,
    heroMedia: { ...DEFAULT_HERO_MEDIA },
    heroLayout: null,
    layoutTemplateId: null,
    spacingPreset: null,
    heroMediaPreviewOriginal: false,
  };
}

export function parseBlogPresentationConfig(value: unknown): BlogPresentationConfig {
  const parsed = parsePresentationConfig(value) as BlogPresentationConfig;
  if (!parsed.blogSidebar) {
    parsed.blogSidebar = DEFAULT_BLOG_SIDEBAR;
  }
  if (!parsed.pageTypeOverride) {
    parsed.pageTypeOverride = "BLOG";
  }
  if (!parsed.editorialPreset) {
    parsed.editorialPreset = "editorial";
  }
  if (parsed.inlineCtaEverySections === undefined) {
    parsed.inlineCtaEverySections = 4;
  }
  if (!parsed.heroMedia) {
    parsed.heroMedia = { ...DEFAULT_HERO_MEDIA };
  } else {
    parsed.heroMedia = { ...DEFAULT_HERO_MEDIA, ...parsed.heroMedia };
  }
  return parsed;
}

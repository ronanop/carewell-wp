/**
 * PresentationConfig — contract between Experience Studio and the public frontend.
 * Media references store WordPress mediaId + lightweight metadata snapshot.
 */

import type { MediaRef } from "@/types/wordpress-media";
import type { ContentOverrides } from "@/types/content-ast";
import type { LayoutTree } from "@carewell/layout-engine";

export type MediaImageSource = "featured" | "wordpress-media" | "none";

export type SectionType =
  | "hero"
  | "trust"
  | "content"
  | "gallery"
  | "doctor"
  | "pricing"
  | "timeline"
  | "faq"
  | "location"
  | "related-treatments"
  | "related-blogs"
  | "testimonials"
  | "cta";

export type HeroConfig = {
  enabled: boolean;
  variant: "premium" | "editorial" | "minimal";
  imageSource: MediaImageSource;
  /** Authoritative WP media reference + cached snapshot. */
  media: MediaRef | null;
  overlayStrength: number;
  headingAlignment: "left" | "center" | "right";
  height: "compact" | "default" | "tall";
  showTrustBadges: boolean;
  showCta: boolean;
  buttonVariant: "primary" | "secondary" | "outline";
  /** Direct manipulation — optional; public + editor parity */
  imageTransform?: {
    objectPositionX?: number;
    objectPositionY?: number;
    scale?: number;
    objectFit?: "cover" | "contain" | "fill";
    crop?: { x: number; y: number; width: number; height: number } | null;
  } | null;
};

export type NavigationConfig = {
  breadcrumbStyle: "light" | "dark" | "transparent" | "hidden";
  stickyCta: boolean;
  enableWhatsApp: boolean;
  enableCall: boolean;
  stickyMobileCta: boolean;
};

export type ContentConfig = {
  readingWidth: "landing" | "editorial" | "article" | "wide";
  buttonStyle: "primary" | "secondary" | "soft" | "outline";
  imageStyle: "rounded" | "shadow" | "editorial" | "borderless";
  tableStyle: "minimal" | "card" | "professional";
  faqStyle: "accordion" | "list" | "cards";
  galleryStyle: "grid" | "carousel" | "masonry";
  videoStyle: "rounded" | "framed" | "flush";
  headingStyle: "editorial" | "bold" | "quiet";
};

export type ThemeConfig = {
  variant: "medical" | "minimal" | "warm" | "editorial";
};

export type AnimationConfig = {
  preset: "calm" | "premium" | "editorial" | "luxury" | "minimal";
  delayMs: number;
};

export type SectionSettings = {
  doctorPhoto: MediaRef | null;
  gallery: MediaRef[];
  heading: string | null;
  supportingText: string | null;
};

export type SectionConfig = {
  id: string;
  type: SectionType;
  enabled: boolean;
  variant: string;
  spacing: "compact" | "default" | "spacious";
  background: "none" | "muted" | "surface" | "tint";
  animation: "inherit" | "none" | "fade" | "rise";
  visibility: "always" | "desktop" | "mobile";
  settings: SectionSettings;
};

export type SeoOverrides = {
  ogImage: MediaRef | null;
  canonicalOverride: string | null;
  schemaEnabled: boolean;
};

export type AdvancedConfig = {
  customCssClass: string | null;
  cacheTag: string | null;
  notes: string | null;
};

export type PresentationConfig = {
  schemaVersion: 1;
  templateSlug: string | null;
  hero: HeroConfig;
  navigation: NavigationConfig;
  content: ContentConfig;
  theme: ThemeConfig;
  animation: AnimationConfig;
  sections: SectionConfig[];
  seo: SeoOverrides;
  advanced: AdvancedConfig;
  /**
   * Visual/content overrides layered on top of WordPress HTML.
   * Never replaces WordPress source content.
   */
  contentOverrides: ContentOverrides;
  /**
   * Editor layout tree (groups/containers). Leaves map 1:1 to `sections`.
   * Public PresentationPage ignores this and renders `sections` in order.
   */
  layoutTree?: LayoutTree | null;
};

export type ResolvedMedia = {
  databaseId: number;
  sourceUrl: string;
  altText: string;
  width: number | null;
  height: number | null;
  missing?: boolean;
};

export type PresentationPage = {
  uri: string;
  title: string;
  contentHtml: string;
  wordpressStatus: string;
  featuredImage: ResolvedMedia | null;
  seo: {
    title: string | null;
    description: string | null;
    canonicalUrl: string | null;
    openGraphTitle: string | null;
    openGraphDescription: string | null;
    openGraphImage: string | null;
  };
  config: PresentationConfig;
  resolved: {
    heroImage: ResolvedMedia | null;
    ogImage: ResolvedMedia | null;
    sectionMedia: Record<string, ResolvedMedia[]>;
  };
  presentationStatus: "DRAFT" | "PUBLISHED" | "NOT_CONFIGURED";
  breadcrumbs: Array<{ label: string; href: string }>;
};

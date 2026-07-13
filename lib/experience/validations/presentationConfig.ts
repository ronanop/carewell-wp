import { z } from "zod";

import type { PresentationConfig, SectionConfig } from "@/types/presentation-config";
import type { MediaRef } from "@/types/wordpress-media";

const mediaRefSchema = z.object({
  mediaId: z.number().int().positive(),
  title: z.string().max(300),
  alt: z.string().max(500).default(""),
  mimeType: z.string().max(120),
  sourceUrl: z.string().max(2000),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  lastSyncedAt: z.string().min(1),
  missing: z.boolean().optional(),
});

const sectionSettingsSchema = z.object({
  doctorPhoto: mediaRefSchema.nullable(),
  gallery: z.array(mediaRefSchema).max(40),
  heading: z.string().max(160).nullable(),
  supportingText: z.string().max(500).nullable(),
});

const sectionSchema = z.object({
  id: z.string().min(1).max(64),
  type: z.enum([
    "hero",
    "trust",
    "content",
    "gallery",
    "doctor",
    "pricing",
    "timeline",
    "faq",
    "location",
    "related-treatments",
    "related-blogs",
    "testimonials",
    "cta",
  ]),
  enabled: z.boolean(),
  variant: z.string().min(1).max(40),
  spacing: z.enum(["compact", "default", "spacious"]),
  background: z.enum(["none", "muted", "surface", "tint"]),
  animation: z.enum(["inherit", "none", "fade", "rise"]),
  visibility: z.enum(["always", "desktop", "mobile"]),
  settings: sectionSettingsSchema,
});

export const presentationConfigSchema = z.object({
  schemaVersion: z.literal(1),
  templateSlug: z.string().min(1).max(80).nullable(),
  hero: z.object({
    enabled: z.boolean(),
    variant: z.enum(["premium", "editorial", "minimal"]),
    imageSource: z.enum(["featured", "wordpress-media", "none"]),
    media: mediaRefSchema.nullable(),
    overlayStrength: z.number().int().min(0).max(100),
    headingAlignment: z.enum(["left", "center", "right"]),
    height: z.enum(["compact", "default", "tall"]),
    showTrustBadges: z.boolean(),
    showCta: z.boolean(),
    buttonVariant: z.enum(["primary", "secondary", "outline"]),
    imageTransform: z
      .object({
        objectPositionX: z.number().min(0).max(100).optional(),
        objectPositionY: z.number().min(0).max(100).optional(),
        scale: z.number().min(0.25).max(4).optional(),
        objectFit: z.enum(["cover", "contain", "fill"]).optional(),
        crop: z
          .object({
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
          })
          .nullable()
          .optional(),
      })
      .nullable()
      .optional(),
  }),
  navigation: z.object({
    breadcrumbStyle: z.enum(["light", "dark", "transparent", "hidden"]),
    stickyCta: z.boolean(),
    enableWhatsApp: z.boolean(),
    enableCall: z.boolean(),
    stickyMobileCta: z.boolean(),
  }),
  content: z.object({
    readingWidth: z.enum(["landing", "editorial", "article", "wide"]),
    buttonStyle: z.enum(["primary", "secondary", "soft", "outline"]),
    imageStyle: z.enum(["rounded", "shadow", "editorial", "borderless"]),
    tableStyle: z.enum(["minimal", "card", "professional"]),
    faqStyle: z.enum(["accordion", "list", "cards"]),
    galleryStyle: z.enum(["grid", "carousel", "masonry"]),
    videoStyle: z.enum(["rounded", "framed", "flush"]),
    headingStyle: z.enum(["editorial", "bold", "quiet"]),
  }),
  theme: z.object({
    variant: z.enum(["medical", "minimal", "warm", "editorial"]),
  }),
  animation: z.object({
    preset: z.enum(["calm", "premium", "editorial", "luxury", "minimal"]),
    delayMs: z.number().int().min(0).max(2000),
  }),
  sections: z.array(sectionSchema).min(1).max(200),
  seo: z.object({
    ogImage: mediaRefSchema.nullable(),
    canonicalOverride: z.string().max(500).nullable(),
    schemaEnabled: z.boolean(),
  }),
  advanced: z.object({
    customCssClass: z.string().max(120).nullable(),
    cacheTag: z.string().max(80).nullable(),
    notes: z.string().max(2000).nullable(),
  }),
  contentOverrides: z
    .object({
      nodes: z.record(z.string(), z.any()).default({}),
      order: z.array(z.string()).nullable().default(null),
      insertions: z.array(z.any()).default([]),
    })
    .default({ nodes: {}, order: null, insertions: [] }),
  /** Layout engine tree — optional; ignored by public renderer. */
  layoutTree: z.any().nullable().optional(),
});

export type PresentationConfigInput = z.infer<typeof presentationConfigSchema>;

function stubMediaRef(mediaId: number): MediaRef {
  return {
    mediaId,
    title: `Media ${mediaId}`,
    alt: "",
    mimeType: "image/jpeg",
    sourceUrl: "",
    width: null,
    height: null,
    lastSyncedAt: new Date(0).toISOString(),
    missing: false,
  };
}

/**
 * Migrates legacy mediaId-only configs to MediaRef snapshots.
 */
export function migratePresentationConfig(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const value = { ...(raw as Record<string, unknown>) };
  const hero =
    value.hero && typeof value.hero === "object"
      ? { ...(value.hero as Record<string, unknown>) }
      : null;

  if (hero) {
    if (!("media" in hero) && typeof hero.mediaId === "number") {
      hero.media = stubMediaRef(hero.mediaId);
    }
    delete hero.mediaId;
    value.hero = hero;
  }

  const seo =
    value.seo && typeof value.seo === "object"
      ? { ...(value.seo as Record<string, unknown>) }
      : null;
  if (seo) {
    if (!("ogImage" in seo) && typeof seo.ogImageMediaId === "number") {
      seo.ogImage = stubMediaRef(seo.ogImageMediaId);
    }
    if (!("ogImage" in seo)) seo.ogImage = null;
    delete seo.ogImageMediaId;
    value.seo = seo;
  }

  if (Array.isArray(value.sections)) {
    value.sections = value.sections.map((section) => {
      if (!section || typeof section !== "object") return section;
      const next = { ...(section as Record<string, unknown>) };
      const settings =
        next.settings && typeof next.settings === "object"
          ? { ...(next.settings as Record<string, unknown>) }
          : {};

      if (!("doctorPhoto" in settings)) {
        settings.doctorPhoto =
          typeof settings.doctorPhotoMediaId === "number"
            ? stubMediaRef(settings.doctorPhotoMediaId)
            : null;
      }
      if (!("gallery" in settings)) {
        const ids = Array.isArray(settings.mediaIds) ? settings.mediaIds : [];
        settings.gallery = ids
          .filter((id): id is number => typeof id === "number")
          .map((id) => stubMediaRef(id));
      }
      if (!("heading" in settings)) settings.heading = null;
      if (!("supportingText" in settings)) settings.supportingText = null;

      delete settings.doctorPhotoMediaId;
      delete settings.mediaIds;
      next.settings = settings;
      return next;
    });
  }

  if (!value.contentOverrides || typeof value.contentOverrides !== "object") {
    value.contentOverrides = { nodes: {}, order: null, insertions: [] };
  } else {
    const co = { ...(value.contentOverrides as Record<string, unknown>) };
    if (!co.nodes || typeof co.nodes !== "object") co.nodes = {};
    if (!("order" in co)) co.order = null;
    if (!Array.isArray(co.insertions)) co.insertions = [];
    value.contentOverrides = co;
  }

  // Keep a single WordPress body section — duplicates remounted full HTML.
  if (Array.isArray(value.sections)) {
    let seenContent = false;
    value.sections = value.sections.filter((section) => {
      if (!section || typeof section !== "object") return true;
      const type = (section as Record<string, unknown>).type;
      if (type !== "content") return true;
      if (seenContent) return false;
      seenContent = true;
      return true;
    });
  }

  if (!("layoutTree" in value)) {
    value.layoutTree = null;
  }

  return value;
}

const DEFAULT_SECTION_ORDER: Array<
  Pick<SectionConfig, "type" | "variant" | "enabled">
> = [
  { type: "hero", variant: "default", enabled: true },
  { type: "trust", variant: "badges", enabled: true },
  { type: "content", variant: "default", enabled: true },
  { type: "gallery", variant: "grid", enabled: false },
  { type: "doctor", variant: "card", enabled: false },
  { type: "pricing", variant: "card", enabled: false },
  { type: "timeline", variant: "steps", enabled: false },
  { type: "faq", variant: "accordion", enabled: false },
  { type: "location", variant: "map", enabled: false },
  { type: "related-treatments", variant: "cards", enabled: false },
  { type: "related-blogs", variant: "cards", enabled: false },
  { type: "testimonials", variant: "quote", enabled: false },
  { type: "cta", variant: "final", enabled: true },
];

export function createDefaultPresentationConfig(
  templateSlug: string | null = "generic",
): PresentationConfig {
  return {
    schemaVersion: 1,
    templateSlug,
    hero: {
      enabled: true,
      variant: "editorial",
      imageSource: "featured",
      media: null,
      overlayStrength: 40,
      headingAlignment: "left",
      height: "default",
      showTrustBadges: true,
      showCta: true,
      buttonVariant: "primary",
    },
    navigation: {
      breadcrumbStyle: "light",
      stickyCta: false,
      enableWhatsApp: true,
      enableCall: true,
      stickyMobileCta: true,
    },
    content: {
      readingWidth: "editorial",
      buttonStyle: "primary",
      imageStyle: "rounded",
      tableStyle: "card",
      faqStyle: "accordion",
      galleryStyle: "grid",
      videoStyle: "rounded",
      headingStyle: "editorial",
    },
    theme: {
      variant: "medical",
    },
    animation: {
      preset: "calm",
      delayMs: 0,
    },
    sections: DEFAULT_SECTION_ORDER.map((section, index) => ({
      id: `${section.type}-${index + 1}`,
      type: section.type,
      enabled: section.enabled,
      variant: section.variant,
      spacing: "default",
      background: "none",
      animation: "inherit",
      visibility: "always",
      settings: {
        doctorPhoto: null,
        gallery: [],
        heading: null,
        supportingText: null,
      },
    })),
    seo: {
      ogImage: null,
      canonicalOverride: null,
      schemaEnabled: true,
    },
    advanced: {
      customCssClass: null,
      cacheTag: null,
      notes: null,
    },
    contentOverrides: {
      nodes: {},
      order: null,
      insertions: [],
    },
    layoutTree: null,
  };
}

export function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function parsePresentationConfig(value: unknown): PresentationConfig {
  const migrated = migratePresentationConfig(value);
  const parsed = presentationConfigSchema.safeParse(migrated);
  if (parsed.success) {
    return parsed.data as PresentationConfig;
  }
  return createDefaultPresentationConfig();
}

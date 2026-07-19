/**
 * ExperienceConfig validation + defaults — unified presentation overlay.
 * Migrates BlogPresentationConfig and PresentationConfig without data loss.
 */

import {
  createDefaultPresentationConfig,
  parsePresentationConfig,
} from "@/lib/experience/validations/presentationConfig";
import {
  createDefaultBlogPresentationConfig,
  DEFAULT_BLOG_SIDEBAR,
  type BlogPresentationConfig,
} from "@/lib/experience/validations/blogPresentationConfig";
import type {
  ExperienceConfig,
  ExperienceKind,
  ExperienceLayoutPresetId,
} from "@/types/experience-document";
import type { PresentationConfig } from "@/types/presentation-config";

const LAYOUT_PRESETS: ExperienceLayoutPresetId[] = [
  "medical-luxury",
  "editorial",
  "conversion",
  "magazine",
  "minimal",
  "corporate",
  "landing",
  "doctor-profile",
  "journal",
];

export function defaultLayoutPresetForKind(
  kind: ExperienceKind,
): ExperienceLayoutPresetId {
  switch (kind) {
    case "blog":
      return "editorial";
    case "service":
      return "medical-luxury";
    case "landing":
      return "landing";
    case "doctor":
      return "doctor-profile";
    case "home":
      return "magazine";
    case "static":
      return "minimal";
    default:
      return "editorial";
  }
}

export function createDefaultExperienceConfig(
  kind: ExperienceKind = "generic",
): ExperienceConfig {
  if (kind === "blog") {
    return blogPresentationConfigToExperienceConfig(
      createDefaultBlogPresentationConfig(),
    );
  }

  const base = createDefaultPresentationConfig(
    kind === "service" ? "service" : kind === "landing" ? "landing" : "page",
  );

  return {
    ...base,
    experienceKind: kind,
    layoutPreset: defaultLayoutPresetForKind(kind),
    experienceSidebar: DEFAULT_BLOG_SIDEBAR,
    globalSymbolIds: [],
    globalSymbolOverrides: {},
    presentationPolish: {
      preferSoftSurfaces: true,
      tightHeroHandoff: true,
      readingMeasure: kind === "service" ? "comfortable" : "comfortable",
      defaultCardStyle: kind === "service" ? "medical" : "editorial",
      buttonHierarchy: "primary-secondary-tertiary",
    },
  };
}

export function presentationConfigToExperienceConfig(
  config: PresentationConfig,
  kind: ExperienceKind = "generic",
): ExperienceConfig {
  const asBlog = config as BlogPresentationConfig;
  return {
    ...config,
    experienceKind: kind,
    layoutPreset:
      (asBlog as ExperienceConfig).layoutPreset ??
      defaultLayoutPresetForKind(kind),
    editorialPreset: asBlog.editorialPreset,
    experienceSidebar: asBlog.blogSidebar ?? DEFAULT_BLOG_SIDEBAR,
    blogSidebar: asBlog.blogSidebar,
    inlineCtaEverySections: asBlog.inlineCtaEverySections,
    heroMedia: asBlog.heroMedia,
    heroLayout: asBlog.heroLayout,
    layoutTemplateId: asBlog.layoutTemplateId,
    spacingPreset: asBlog.spacingPreset,
    heroMediaPreviewOriginal: asBlog.heroMediaPreviewOriginal,
    globalSymbolIds: (config as ExperienceConfig).globalSymbolIds ?? [],
    globalSymbolOverrides:
      (config as ExperienceConfig).globalSymbolOverrides ?? {},
    presentationPolish: (config as ExperienceConfig).presentationPolish ?? {
      preferSoftSurfaces: true,
      tightHeroHandoff: true,
      readingMeasure: "comfortable",
      defaultCardStyle: kind === "service" ? "medical" : "editorial",
      buttonHierarchy: "primary-secondary-tertiary",
    },
  };
}

export function blogPresentationConfigToExperienceConfig(
  config: BlogPresentationConfig,
): ExperienceConfig {
  return presentationConfigToExperienceConfig(config, "blog");
}

/**
 * Round-trip: ExperienceConfig → BlogPresentationConfig (Studio / blog engine).
 */
export function experienceConfigToBlogPresentationConfig(
  config: ExperienceConfig,
): BlogPresentationConfig {
  const { experienceKind: _k, layoutPreset: _p, experienceSidebar, ...rest } =
    config;
  return {
    ...rest,
    blogSidebar: experienceSidebar ?? config.blogSidebar ?? DEFAULT_BLOG_SIDEBAR,
    editorialPreset: config.editorialPreset,
    inlineCtaEverySections: config.inlineCtaEverySections,
    heroMedia: config.heroMedia,
    heroLayout: config.heroLayout,
    layoutTemplateId: config.layoutTemplateId,
    spacingPreset: config.spacingPreset,
    heroMediaPreviewOriginal: config.heroMediaPreviewOriginal,
  };
}

/**
 * Strip experience-only fields for legacy PresentationPage renderer.
 */
export function experienceConfigToPresentationConfig(
  config: ExperienceConfig,
): PresentationConfig {
  const {
    experienceKind: _a,
    layoutPreset: _b,
    experienceSidebar: _c,
    blogSidebar: _d,
    editorialPreset: _e,
    inlineCtaEverySections: _f,
    heroMedia: _g,
    heroLayout: _h,
    layoutTemplateId: _i,
    spacingPreset: _j,
    heroMediaPreviewOriginal: _k,
    globalSymbolIds: _l,
    globalSymbolOverrides: _m,
    presentationPolish: _n,
    ...base
  } = config;
  return base;
}

export function parseExperienceConfig(
  raw: unknown,
  kind: ExperienceKind = "generic",
): ExperienceConfig {
  const base = parsePresentationConfig(raw);
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const layoutPreset =
    typeof record.layoutPreset === "string" &&
    LAYOUT_PRESETS.includes(record.layoutPreset as ExperienceLayoutPresetId)
      ? (record.layoutPreset as ExperienceLayoutPresetId)
      : defaultLayoutPresetForKind(kind);

  return {
    ...presentationConfigToExperienceConfig(base, kind),
    layoutPreset,
    globalSymbolIds: Array.isArray(record.globalSymbolIds)
      ? (record.globalSymbolIds as string[])
      : [],
    globalSymbolOverrides:
      record.globalSymbolOverrides &&
      typeof record.globalSymbolOverrides === "object"
        ? (record.globalSymbolOverrides as Record<string, Record<string, unknown>>)
        : {},
  };
}

export { DEFAULT_BLOG_SIDEBAR };

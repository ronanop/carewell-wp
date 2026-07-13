/**
 * Bridge — PresentationConfig ↔ BlockDocument.
 * Preserves backward compatibility while migrating to the block platform.
 */

import { createBlockNode } from "@/lib/experience/platform/composition/tree";
import { ensurePlatformPacksLoaded } from "@/lib/experience/platform/bootstrap";
import type { PresentationConfig } from "@/types/presentation-config";
import type { BlockDocument, BlockNode, BlockRules } from "@/types/studio-platform";

const SECTION_TO_BLOCK: Record<string, string> = {
  hero: "hero-editorial",
  trust: "trust-badges",
  content: "content-body",
  gallery: "gallery-grid",
  doctor: "doctor-card",
  pricing: "pricing-card",
  timeline: "procedure-timeline",
  faq: "faq-accordion",
  location: "location-map",
  "related-treatments": "related-treatments",
  "related-blogs": "related-blogs",
  testimonials: "testimonials-quote",
  cta: "final-cta",
};

function sectionRules(
  enabled: boolean,
  visibility: PresentationConfig["sections"][number]["visibility"],
  type: string,
): BlockRules {
  const when =
    type === "doctor"
      ? [
          {
            id: "doctor-exists",
            path: "doctor.name",
            operator: "exists" as const,
            description: "Only show when doctor data exists",
          },
        ]
      : undefined;

  return {
    visibility:
      visibility === "always"
        ? "always"
        : visibility === "desktop"
          ? "desktop"
          : "mobile",
    when: enabled ? when : [{ id: "disabled", path: "runtime.path", operator: "equals", value: "__never__" }],
  };
}

/**
 * Migrates legacy PresentationConfig sections into a BlockDocument.
 * Existing pages keep rendering via PresentationConfig; this enables gradual adoption.
 */
export function presentationConfigToBlockDocument(
  config: PresentationConfig,
): BlockDocument {
  ensurePlatformPacksLoaded();

  const themeId =
    config.theme.variant === "minimal"
      ? "minimal"
      : config.theme.variant === "editorial" || config.theme.variant === "warm"
        ? "luxury"
        : "medical";

  const root: BlockNode[] = [];

  for (const section of config.sections) {
    if (section.type === "hero" && !config.hero.enabled) continue;

    const blockId = SECTION_TO_BLOCK[section.type];
    if (!blockId) continue;

    // Disabled sections still migrate but with a failing rule so order is preserved for editors.
    const node = createBlockNode(blockId, {
      variant: section.variant,
      spacing: section.spacing,
      background: section.background,
      animation: section.animation,
      enabled: section.enabled,
      ...(section.type === "hero"
        ? {
            heroVariant: config.hero.variant,
            height: config.hero.height,
            showCta: config.hero.showCta,
            showTrustBadges: config.hero.showTrustBadges,
            media: config.hero.media,
            imageSource: config.hero.imageSource,
          }
        : {}),
      ...(section.type === "doctor"
        ? { doctorPhoto: section.settings.doctorPhoto }
        : {}),
      ...(section.type === "gallery"
        ? { gallery: section.settings.gallery }
        : {}),
    });

    node.rules = sectionRules(section.enabled, section.visibility, section.type);
    root.push(node);
  }

  return {
    schemaVersion: 1,
    packIds: ["medical"],
    themeId,
    root,
    meta: {
      generatedBy: "migration",
      notes: "Migrated from PresentationConfig sections",
    },
  };
}

/**
 * Extracts a best-effort PresentationConfig section order update from a BlockDocument.
 * Does not destroy PresentationConfig fields — only syncs enablement/order hints.
 */
export function applyBlockDocumentOrderToPresentationConfig(
  config: PresentationConfig,
  document: BlockDocument,
): PresentationConfig {
  const order = document.root.map((node) => node.blockId);
  const reverse = Object.fromEntries(
    Object.entries(SECTION_TO_BLOCK).map(([section, block]) => [block, section]),
  );

  const reordered = [...config.sections].sort((a, b) => {
    const aBlock = SECTION_TO_BLOCK[a.type];
    const bBlock = SECTION_TO_BLOCK[b.type];
    const aIndex = aBlock ? order.indexOf(aBlock) : Number.MAX_SAFE_INTEGER;
    const bIndex = bBlock ? order.indexOf(bBlock) : Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });

  const enabledByType = new Map<string, boolean>();
  for (const node of document.root) {
    const sectionType = reverse[node.blockId];
    if (!sectionType) continue;
    const disabled = node.rules?.when?.some((rule) => rule.id === "disabled");
    enabledByType.set(sectionType, !disabled);
  }

  return {
    ...config,
    sections: reordered.map((section) => ({
      ...section,
      enabled: enabledByType.get(section.type) ?? section.enabled,
    })),
  };
}

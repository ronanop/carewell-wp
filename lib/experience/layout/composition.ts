/**
 * Experience Composition Engine (Phase 8.1).
 * Presentation-only polish over already-composed semantic sections.
 * Does not reorder WordPress content or fork the renderer.
 */

import type {
  ComposedSection,
  SectionCardStyle,
  SectionImportance,
  SectionPresentationMode,
  SectionSpacingTokens,
  ExperiencePresentationPolish,
} from "@/types/editorial-layout";
import type { SemanticSectionType } from "@/types/semantic-article";
import { getSectionContextualCtaCopy } from "@/lib/experience/layout/contextualCta";

const PRIMARY_TYPES = new Set<SemanticSectionType>([
  "BENEFITS",
  "PROCEDURE",
  "STEP_BY_STEP",
  "DOCTOR_ADVICE",
  "CONSULTATION",
  "FAQ",
  "INTRODUCTION",
  "SUMMARY",
]);

const TERTIARY_TYPES = new Set<SemanticSectionType>([
  "MEDICAL_DISCLAIMER",
  "REFERENCES",
  "LOCATION",
  "CONTACT",
  "GENERIC",
]);

const MODE_CYCLE: SectionPresentationMode[] = [
  "editorial",
  "soft-surface",
  "premium-card",
  "cream",
  "split",
  "minimal",
  "highlight",
  "light-tint",
  "wide-reading",
  "compact",
];

const MODE_FOR_TYPE: Partial<
  Record<SemanticSectionType, SectionPresentationMode>
> = {
  INTRODUCTION: "editorial",
  SUMMARY: "highlight",
  KEY_TAKEAWAYS: "premium-card",
  BENEFITS: "premium-card",
  PROCEDURE: "split",
  STEP_BY_STEP: "split",
  RECOVERY: "soft-surface",
  AFTERCARE: "soft-surface",
  PREPARATION: "compact",
  TECHNOLOGY: "cream",
  RESEARCH: "wide-reading",
  STATISTICS: "light-tint",
  COST: "premium-card",
  FAQ: "editorial",
  DOCTOR_ADVICE: "highlight",
  GALLERY: "full-width",
  IMAGE_GALLERY: "full-width",
  BEFORE_AFTER: "full-width",
  WARNING: "highlight",
  RISKS: "soft-surface",
  LOCATION: "split",
  CONSULTATION: "highlight",
  COMPARISON: "wide-reading",
  ELIGIBILITY: "premium-card",
  RESULTS: "cream",
  VIDEO: "full-width",
};

const CARD_FOR_TYPE: Partial<Record<SemanticSectionType, SectionCardStyle>> = {
  BENEFITS: "medical",
  RISKS: "warning",
  SIDE_EFFECTS: "warning",
  WARNING: "warning",
  COST: "comparison",
  STATISTICS: "statistics",
  RESEARCH: "research",
  PROCEDURE: "timeline",
  RECOVERY: "timeline",
  DOCTOR_ADVICE: "editorial",
  KEY_TAKEAWAYS: "highlight",
  SUMMARY: "highlight",
  FAQ: "minimal",
  TECHNOLOGY: "glass",
  ELIGIBILITY: "medical",
};

function importanceFor(type: SemanticSectionType): SectionImportance {
  if (PRIMARY_TYPES.has(type)) return "primary";
  if (TERTIARY_TYPES.has(type)) return "tertiary";
  return "secondary";
}

function pickMode(
  type: SemanticSectionType,
  index: number,
  prevMode: SectionPresentationMode | undefined,
): SectionPresentationMode {
  const preferred = MODE_FOR_TYPE[type] ?? MODE_CYCLE[index % MODE_CYCLE.length]!;
  if (prevMode && preferred === prevMode) {
    return MODE_CYCLE[(index + 2) % MODE_CYCLE.length]!;
  }
  return preferred;
}

function spacingBetween(
  prev: ComposedSection | undefined,
  current: ComposedSection,
  polish?: ExperiencePresentationPolish | null,
): SectionSpacingTokens {
  const tightHandoff = polish?.tightHeroHandoff !== false && !prev;
  const nextType = current.section.type;
  const prevType = prev?.section.type;

  let top: SectionSpacingTokens["top"] = tightHandoff ? "snug" : "normal";
  let bottom: SectionSpacingTokens["bottom"] = "normal";
  let paddingY: SectionSpacingTokens["paddingY"] = "md";
  let contentGap: SectionSpacingTokens["contentGap"] = "md";
  let mediaGap: SectionSpacingTokens["mediaGap"] = "md";

  if (
    prevType === "GALLERY" ||
    prevType === "IMAGE_GALLERY" ||
    prevType === "BEFORE_AFTER" ||
    prevType === "VIDEO"
  ) {
    top = "loose";
  }
  if (nextType === "FAQ") {
    top = prevType === "GALLERY" || prevType === "IMAGE_GALLERY" ? "loose" : "relaxed";
  }
  if (nextType === "CONSULTATION" || current.showInlineCta) {
    bottom = "relaxed";
  }
  if (
    prev &&
    prev.importance === "primary" &&
    current.importance === "primary"
  ) {
    top = "relaxed";
  }
  if (current.importance === "tertiary") {
    top = "snug";
    bottom = "snug";
    paddingY = "sm";
    contentGap = "sm";
  }
  if (current.importance === "primary") {
    paddingY = "lg";
    contentGap = "lg";
  }
  if (
    current.presentationMode === "compact" ||
    current.presentationMode === "minimal"
  ) {
    paddingY = "sm";
    top = top === "loose" ? "relaxed" : "snug";
  }
  if (
    current.presentationMode === "full-width" ||
    current.presentationMode === "premium-card"
  ) {
    mediaGap = "lg";
  }

  const divider: SectionSpacingTokens["divider"] =
    current.separator === "none" ? "none" : current.separator;

  return { top, bottom, paddingY, contentGap, mediaGap, divider };
}

function alignBackgroundToMode(
  mode: SectionPresentationMode,
  background: ComposedSection["background"],
  polish?: ExperiencePresentationPolish | null,
): ComposedSection["background"] {
  if (background !== "none" && background !== "light") return background;

  switch (mode) {
    case "cream":
      return "cream";
    case "soft-surface":
      return polish?.preferSoftSurfaces === false ? "muted" : "muted";
    case "premium-card":
      return "card";
    case "light-tint":
      return "accent";
    case "highlight":
      return "editorial";
    case "split":
      return "split";
    case "minimal":
    case "compact":
      return "none";
    default:
      return polish?.preferSoftSurfaces === false ? background : background === "none" ? "none" : background;
  }
}

/**
 * Enrich composed sections with presentation mode, importance, spacing, CTA copy.
 */
export function polishComposition(
  sections: ComposedSection[],
  polish?: ExperiencePresentationPolish | null,
): ComposedSection[] {
  const result: ComposedSection[] = [];

  for (let index = 0; index < sections.length; index++) {
    const composed = sections[index]!;
    const type = composed.section.type;
    const prev = result[index - 1];

    const importance = importanceFor(type);
    const presentationMode = pickMode(type, index, prev?.presentationMode);
    const cardStyle =
      polish?.defaultCardStyle &&
      (composed.variant === "cards" || composed.variant === "grid")
        ? polish.defaultCardStyle
        : (CARD_FOR_TYPE[type] ?? "editorial");

    let background = alignBackgroundToMode(
      presentationMode,
      composed.background,
      polish,
    );

    // Avoid identical adjacent surfaces
    if (prev && prev.background === background && background !== "none") {
      background =
        background === "cream"
          ? "muted"
          : background === "muted"
            ? "cream"
            : background === "card"
              ? "editorial"
              : "none";
    }

    const withMeta: ComposedSection = {
      ...composed,
      importance,
      presentationMode,
      cardStyle,
      background,
      width:
        presentationMode === "full-width"
          ? "full"
          : presentationMode === "wide-reading"
            ? "wide"
            : presentationMode === "compact" || presentationMode === "minimal"
              ? "narrow"
              : composed.width,
      ctaCopy: composed.showInlineCta
        ? getSectionContextualCtaCopy(type)
        : undefined,
    };

    const spacingTokens = spacingBetween(prev, withMeta, polish);

    // Map spacing tokens → existing SpacingPreset for legacy class map
    let spacing = composed.spacing;
    if (spacingTokens.top === "loose" || spacingTokens.paddingY === "lg") {
      spacing =
        composed.spacing === "compact" ? "comfortable" : "magazine";
    } else if (spacingTokens.top === "tight" || spacingTokens.top === "snug") {
      spacing = "compact";
    }

    result.push({
      ...withMeta,
      spacingTokens,
      spacing,
      separator:
        spacingTokens.divider === "none"
          ? composed.separator
          : spacingTokens.divider,
    });
  }

  return result;
}

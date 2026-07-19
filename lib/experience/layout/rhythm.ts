/**
 * Visual Rhythm Engine (Phase 7.1) — deterministic handcrafted feel.
 * Alternates backgrounds, density, separators; Studio may override per section.
 * Guarantees dark backgrounds always pair with light text at the renderer layer.
 */

import type {
  ComposedSection,
  SectionBackground,
  SectionVariant,
  SpacingPreset,
} from "@/types/editorial-layout";
import type { SemanticSectionType } from "@/types/semantic-article";

/** Color rhythm — cream/muted/editorial break white stretches; dark used sparingly. */
const BACKGROUND_CYCLE: SectionBackground[] = [
  "none",
  "cream",
  "muted",
  "none",
  "card",
  "editorial",
  "none",
  "split",
  "light",
  "cream",
  "none",
  "muted",
];

const DEFAULT_VARIANT: Partial<Record<SemanticSectionType, SectionVariant>> = {
  BENEFITS: "grid",
  RISKS: "cards",
  SIDE_EFFECTS: "cards",
  WARNING: "cards",
  PROCEDURE: "timeline",
  STEP_BY_STEP: "stepper",
  RECOVERY: "timeline",
  AFTERCARE: "checklist",
  PREPARATION: "stepper",
  RESEARCH: "journal",
  STATISTICS: "grid",
  FAQ: "accordion",
  COST: "cards",
  SUMMARY: "highlight",
  CONCLUSION: "highlight",
  KEY_TAKEAWAYS: "cards",
  DOCTOR_ADVICE: "large",
  COMPARISON: "default",
  INTRODUCTION: "minimal",
  QUOTE: "floating",
  VIDEO: "magazine",
  IMAGE_GALLERY: "magazine",
  BEFORE_AFTER: "magazine",
  TECHNOLOGY: "magazine",
  TESTIMONIALS: "cards",
  CONSULTATION: "highlight",
  LOCATION: "split",
};

function weightFor(type: SemanticSectionType, variant: SectionVariant): number {
  if (variant === "large" || variant === "banner" || variant === "dark-block") {
    return 5;
  }
  if (
    type === "FAQ" ||
    type === "PROCEDURE" ||
    type === "BENEFITS" ||
    type === "BEFORE_AFTER"
  ) {
    return 4;
  }
  if (type === "INTRODUCTION" || type === "GENERIC" || type === "SUMMARY") {
    return 2;
  }
  if (type === "RESEARCH" || type === "STATISTICS" || type === "COST") {
    return 4;
  }
  return 3;
}

function pickBackground(
  index: number,
  prev: ComposedSection | undefined,
  forced?: SectionBackground,
): SectionBackground {
  if (forced && forced !== "none") return forced;

  let background = BACKGROUND_CYCLE[index % BACKGROUND_CYCLE.length]!;

  if (prev && prev.background === background) {
    background = BACKGROUND_CYCLE[(index + 3) % BACKGROUND_CYCLE.length]!;
  }

  // Never stack dark/accent (contrast safety)
  if (
    prev &&
    (prev.background === "dark" || prev.background === "accent") &&
    (background === "dark" || background === "accent")
  ) {
    background = "cream";
  }

  if (prev && prev.visualWeight >= 4 && background === "dark") {
    background = "muted";
  }

  if (prev && prev.visualWeight === weightFor(prev.section.type, prev.variant) && background === "none") {
    // handled after weight known — leave for caller
  }

  return background;
}

/**
 * Apply rhythm: alternate backgrounds using already-resolved previous section.
 */
export function applySectionRhythm(
  sections: ComposedSection[],
  spacingPreset: SpacingPreset,
): ComposedSection[] {
  const result: ComposedSection[] = [];

  for (let index = 0; index < sections.length; index++) {
    const composed = sections[index]!;
    const prev = result[index - 1];

    let variant = composed.variant;
    if (
      prev &&
      prev.variant === variant &&
      prev.section.type === composed.section.type
    ) {
      variant =
        variant === "grid"
          ? "cards"
          : variant === "cards"
            ? "magazine"
            : "default";
    }

    const visualWeight = weightFor(composed.section.type, variant);

    let background = pickBackground(
      index,
      prev,
      composed.background !== "none" ? composed.background : undefined,
    );

    if (prev && prev.visualWeight === visualWeight && background === "none") {
      background = index % 2 === 0 ? "muted" : "cream";
    }

    let spacing = spacingPreset;
    if (spacingPreset === "luxury" || spacingPreset === "magazine") {
      spacing = index % 2 === 0 ? spacingPreset : "comfortable";
    } else if (index % 3 === 2 && spacingPreset === "comfortable") {
      spacing = "medical";
    }

    const separator: ComposedSection["separator"] =
      index === 0
        ? "none"
        : visualWeight >= 4
          ? "fade"
          : background === "none"
            ? "space"
            : prev && prev.background === background
              ? "line"
              : "none";

    result.push({
      ...composed,
      background,
      variant,
      spacing,
      visualWeight,
      separator,
    });
  }

  return result;
}

export function defaultVariantForType(type: SemanticSectionType): SectionVariant {
  return DEFAULT_VARIANT[type] ?? "default";
}

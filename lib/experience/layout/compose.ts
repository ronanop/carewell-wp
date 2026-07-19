/**
 * Layout Composer — Semantic Sections → Editorial Page structure.
 * Independent from Presentation Engine; consumes semantic analysis only.
 */

import { defaultVariantForType, applySectionRhythm } from "@/lib/experience/layout/rhythm";
import { polishComposition } from "@/lib/experience/layout/composition";
import { selectLayoutTemplate } from "@/lib/experience/layout/templates";
import { validateLayoutComposition } from "@/lib/experience/layout/validator";
import type {
  ArticleLayoutTemplateId,
  ComposedSection,
  ExperiencePresentationPolish,
  HeroLayoutVariant,
  ImagePlacement,
  LayoutComposition,
  LayoutComposerInput,
  SpacingPreset,
} from "@/types/editorial-layout";
import type { SemanticSectionType } from "@/types/semantic-article";

function heroForTemplate(templateId: ArticleLayoutTemplateId): HeroLayoutVariant {
  switch (templateId) {
    case "before-after-showcase":
      return "image-focus";
    case "celebrity-health":
      return "magazine";
    case "medical-research":
      return "medical-journal";
    case "cost-guide":
      return "split-left";
    case "faq-heavy":
      return "minimal";
    case "recovery-guide":
      return "editorial";
    case "treatment-guide":
      return "split-right";
    default:
      return "editorial";
  }
}

function spacingForTemplate(templateId: ArticleLayoutTemplateId): SpacingPreset {
  switch (templateId) {
    case "medical-research":
      return "medical";
    case "celebrity-health":
    case "long-form-editorial":
      return "magazine";
    case "before-after-showcase":
      return "luxury";
    case "faq-heavy":
      return "compact";
    default:
      return "comfortable";
  }
}

function imagePlacementFor(
  type: SemanticSectionType,
  templateId: ArticleLayoutTemplateId,
): ImagePlacement {
  if (type === "BEFORE_AFTER") return "before-after";
  if (type === "IMAGE_GALLERY") return "gallery";
  if (type === "VIDEO") return "full-width";
  if (type === "INTRODUCTION" && templateId === "celebrity-health") {
    return "editorial-offset";
  }
  if (type === "PROCEDURE" || type === "RECOVERY") return "side-by-side";
  if (type === "DOCTOR_ADVICE") return "floating";
  return "inline";
}

function shouldShowCta(
  type: SemanticSectionType,
  index: number,
  sections: LayoutComposerInput["sections"],
): boolean {
  const next = sections[index + 1];
  // Shared blog + service conversion moments (capped later by MAX_INLINE_CONSULTATION_CTAS)
  if (type === "BENEFITS") return true;
  if (type === "PROCEDURE") return true;
  if (type === "RECOVERY" || type === "AFTERCARE") return true;
  if (type === "COST" || type === "INSURANCE") return true;
  if (type === "TECHNOLOGY" || type === "RESULTS") return true;
  if (type === "GALLERY" || type === "BEFORE_AFTER" || type === "IMAGE_GALLERY") {
    return true;
  }
  if (next?.type === "FAQ") return true;
  if (next?.type === "CONCLUSION") return true;
  return false;
}

/** Hard cap — inline consultation CTAs must not flood long articles. */
export const MAX_INLINE_CONSULTATION_CTAS = 3;

/**
 * Keep at most `max` inline CTAs, spaced evenly across candidates
 * so mid- and late-article placements survive trimming.
 */
export function limitInlineConsultationCtas(
  sections: ComposedSection[],
  max: number = MAX_INLINE_CONSULTATION_CTAS,
): ComposedSection[] {
  const indices = sections
    .map((s, i) => (s.showInlineCta ? i : -1))
    .filter((i) => i >= 0);
  if (indices.length <= max) return sections;

  const keep = new Set<number>();
  if (max === 1) {
    keep.add(indices[Math.floor(indices.length / 2)]!);
  } else {
    for (let k = 0; k < max; k++) {
      const pick =
        indices[Math.round((k * (indices.length - 1)) / (max - 1))]!;
      keep.add(pick);
    }
  }

  return sections.map((s, i) =>
    s.showInlineCta && !keep.has(i) ? { ...s, showInlineCta: false } : s,
  );
}

function buildSignalsFromSections(
  input: LayoutComposerInput,
): LayoutComposerInput["signals"] {
  return input.signals;
}

/**
 * Compose an editorial page layout from semantic sections.
 */
export function composeEditorialLayout(
  input: LayoutComposerInput,
): LayoutComposition {
  const signals = buildSignalsFromSections(input);
  const templateId = selectLayoutTemplate(
    signals,
    input.overrides?.templateId,
  );
  const heroLayout =
    input.overrides?.heroLayout ?? heroForTemplate(templateId);
  const spacingPreset =
    input.overrides?.spacingPreset ?? spacingForTemplate(templateId);

  let composed: ComposedSection[] = input.sections.map((section, index) => {
    const overrideVariant = input.overrides?.sectionVariants?.[section.id];
    const variant =
      overrideVariant ?? defaultVariantForType(section.type);

    return {
      section,
      variant,
      background: "none",
      width: section.type === "INTRODUCTION" ? "measure" : "measure",
      spacing: spacingPreset,
      imagePlacement: imagePlacementFor(section.type, templateId),
      showInlineCta: shouldShowCta(section.type, index, input.sections),
      separator: "none",
      visualWeight: 3,
    };
  });

  composed = applySectionRhythm(composed, spacingPreset);
  composed = polishComposition(
    composed,
    input.overrides?.presentationPolish,
  );

  const validated = validateLayoutComposition({
    templateId,
    heroLayout,
    spacingPreset,
    sections: composed,
  });

  return {
    templateId,
    heroLayout,
    spacingPreset,
    sections: limitInlineConsultationCtas(validated.sections),
    validationNotes: validated.notes,
  };
}

export function buildComposerSignals(input: {
  sections: LayoutComposerInput["sections"];
  faqCount: number;
  readingMinutes: number;
}): LayoutComposerInput["signals"] {
  const types = new Set(input.sections.map((s) => s.type));
  return {
    faqCount: input.faqCount,
    hasProcedure: types.has("PROCEDURE") || types.has("STEP_BY_STEP"),
    hasCost: types.has("COST"),
    hasResearch: types.has("RESEARCH") || types.has("STATISTICS"),
    hasBeforeAfter: types.has("BEFORE_AFTER") || types.has("IMAGE_GALLERY"),
    hasRecovery: types.has("RECOVERY") || types.has("AFTERCARE"),
    hasBenefits: types.has("BENEFITS"),
    hasRisks: types.has("RISKS") || types.has("SIDE_EFFECTS"),
    readingMinutes: input.readingMinutes,
    sectionCount: input.sections.length,
  };
}

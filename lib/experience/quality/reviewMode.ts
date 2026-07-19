/**
 * Experience Review Mode (Phase 7.1) — scored editorial quality for Studio.
 * Extends the Design Quality Validator with actionable dimension scores.
 * Never blocks public rendering.
 */

import { validateExperienceQuality } from "@/lib/experience/quality/validator";
import { scoreExperienceIntelligence } from "@/lib/experience/unified/intelligence";
import type {
  ExperienceDocument,
  ExperienceQualityWarning,
} from "@/types/experience-document";

export type ReviewDimensionId =
  | "visualHierarchy"
  | "spacingConsistency"
  | "typography"
  | "ctaProminence"
  | "mobileUsability"
  | "accessibility"
  | "imageComposition"
  | "performanceBudget"
  | "editorialQuality"
  | "composition"
  | "rhythm"
  | "conversionReadiness";

export type ReviewDimension = {
  id: ReviewDimensionId;
  label: string;
  score: number;
  weight: number;
  suggestions: string[];
};

export type ExperienceReviewReport = {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  dimensions: ReviewDimension[];
  warnings: ExperienceQualityWarning[];
  summary: string;
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function gradeFromScore(score: number): ExperienceReviewReport["grade"] {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 55) return "D";
  return "F";
}

/**
 * Analyze a page and produce Studio-facing review scores.
 */
export function buildExperienceReviewReport(
  doc: ExperienceDocument,
): ExperienceReviewReport {
  const warnings = validateExperienceQuality(doc);
  const intelligence = scoreExperienceIntelligence(doc);
  const suggestions: Record<ReviewDimensionId, string[]> = {
    visualHierarchy: [],
    spacingConsistency: [],
    typography: [],
    ctaProminence: [],
    mobileUsability: [],
    accessibility: [],
    imageComposition: [],
    performanceBudget: [],
    editorialQuality: [],
    composition: [],
    rhythm: [],
    conversionReadiness: [],
  };

  let visualHierarchy = 72;
  let spacingConsistency = 75;
  let typography = 78;
  let ctaProminence = intelligence.conversionScore;
  let mobileUsability = 80;
  let accessibility = 78;
  let imageComposition = 70;
  let performanceBudget = 82;
  let editorialQuality = intelligence.visualBalanceScore;
  let composition = 74;
  let rhythm = 76;
  let conversionReadiness = intelligence.conversionScore;

  if (!doc.title.trim()) {
    visualHierarchy -= 25;
    suggestions.visualHierarchy.push("Add a clear page title");
  }
  if (!doc.hero.excerpt && doc.kind === "blog") {
    visualHierarchy -= 8;
    suggestions.visualHierarchy.push("Add a concise subheadline / excerpt");
  }

  const ctaCount =
    doc.layout?.sections.filter((s) => s.showInlineCta).length ?? 0;
  if (ctaCount === 0) {
    ctaProminence -= 15;
    suggestions.ctaProminence.push("Add 1–3 contextual consultation CTAs");
  } else if (ctaCount > 3) {
    ctaProminence -= 10;
    suggestions.ctaProminence.push("Reduce inline CTAs to at most three");
  } else {
    ctaProminence += 5;
  }

  if (!doc.resolved.heroImage && !doc.hero.featuredImage) {
    imageComposition -= 20;
    suggestions.imageComposition.push(
      "Add hero media with original aspect ratio (avoid cover crop)",
    );
  }
  if (doc.config.heroMedia?.fit === "cover") {
    imageComposition -= 12;
    suggestions.imageComposition.push(
      "Switch hero fit from cover to original/contain for medical imagery",
    );
  } else {
    imageComposition += 8;
  }

  if (doc.layout) {
    let noneStreak = 0;
    let maxStreak = 0;
    let modeStreak = 0;
    let maxModeStreak = 0;
    let prevMode: string | undefined;
    let polished = 0;
    for (const s of doc.layout.sections) {
      if (s.background === "none") {
        noneStreak += 1;
        maxStreak = Math.max(maxStreak, noneStreak);
      } else {
        noneStreak = 0;
      }
      if (s.presentationMode) {
        polished += 1;
        if (s.presentationMode === prevMode) {
          modeStreak += 1;
          maxModeStreak = Math.max(maxModeStreak, modeStreak);
        } else {
          modeStreak = 1;
        }
        prevMode = s.presentationMode;
      }
      if (s.spacingTokens) {
        spacingConsistency += 1;
      }
      if (s.importance === "primary") composition += 2;
    }
    if (maxStreak >= 4) {
      spacingConsistency -= 12;
      editorialQuality -= 10;
      rhythm -= 14;
      suggestions.spacingConsistency.push(
        "Break long plain stretches with cream/muted/card rhythm backgrounds",
      );
      suggestions.rhythm.push(
        "Alternate soft surfaces — avoid four consecutive flat white sections",
      );
    } else {
      spacingConsistency += 8;
      rhythm += 6;
    }
    if (polished >= Math.max(1, Math.floor(doc.layout.sections.length * 0.6))) {
      composition += 12;
      rhythm += 8;
    } else if (doc.kind === "service") {
      composition -= 8;
      suggestions.composition.push(
        "Enable presentation polish so sections receive mode/importance metadata",
      );
    }
    if (maxModeStreak >= 3) {
      rhythm -= 10;
      suggestions.rhythm.push(
        "Avoid repeating the same presentation mode on adjacent sections",
      );
    }
    const ctaWithCopy = doc.layout.sections.filter(
      (s) => s.showInlineCta && s.ctaCopy,
    ).length;
    if (ctaWithCopy > 0) {
      conversionReadiness += 8;
      ctaProminence += 4;
    } else if (ctaCount > 0) {
      suggestions.conversionReadiness.push(
        "Use section-contextual CTA copy (procedure vs recovery vs pricing)",
      );
    }
  }

  if (!doc.seo.description) {
    accessibility -= 8;
    suggestions.accessibility.push("Add an SEO / meta description");
  }
  if (!doc.hero.featuredImage?.altText && doc.hero.featuredImage) {
    accessibility -= 12;
    suggestions.accessibility.push("Provide alt text for the hero image");
  }

  const reading = doc.hero.readingTimeMinutes;
  if (reading > 20) {
    performanceBudget -= 8;
    typography -= 5;
    suggestions.performanceBudget.push(
      "Long article — ensure TOC, lazy media, and section rhythm are enabled",
    );
  }
  if (doc.layout?.sections.length && doc.layout.sections.length > 18) {
    performanceBudget -= 6;
    suggestions.performanceBudget.push(
      "Many sections — consider consolidating low-value blocks",
    );
  }

  if (doc.faqs.length > 0 || doc.layout?.sections.some((s) => s.section.type === "FAQ")) {
    editorialQuality += 8;
    typography += 4;
  } else if (doc.kind === "blog" || doc.kind === "service") {
    editorialQuality -= 6;
    suggestions.editorialQuality.push("Add an FAQ section for clarity and trust");
  }

  for (const w of warnings) {
    if (w.severity === "error") editorialQuality -= 8;
    if (w.severity === "warn") editorialQuality -= 4;
  }

  suggestions.typography.push(
    ...intelligence.recommendations.filter((r) =>
      /read|TOC|section/i.test(r),
    ),
  );
  suggestions.editorialQuality.push(
    ...intelligence.recommendations.slice(0, 3),
  );

  const dimensions: ReviewDimension[] = [
    {
      id: "visualHierarchy",
      label: "Visual hierarchy",
      score: clamp(visualHierarchy),
      weight: 1.2,
      suggestions: suggestions.visualHierarchy,
    },
    {
      id: "spacingConsistency",
      label: "Spacing consistency",
      score: clamp(spacingConsistency),
      weight: 1,
      suggestions: suggestions.spacingConsistency,
    },
    {
      id: "typography",
      label: "Typography quality",
      score: clamp(typography),
      weight: 1,
      suggestions: suggestions.typography,
    },
    {
      id: "ctaProminence",
      label: "CTA prominence",
      score: clamp(ctaProminence),
      weight: 1.3,
      suggestions: suggestions.ctaProminence,
    },
    {
      id: "mobileUsability",
      label: "Mobile usability",
      score: clamp(mobileUsability),
      weight: 1.1,
      suggestions: suggestions.mobileUsability.length
        ? suggestions.mobileUsability
        : ["Thumb-friendly CTAs and sticky consultation are available"],
    },
    {
      id: "accessibility",
      label: "Accessibility",
      score: clamp(accessibility),
      weight: 1.2,
      suggestions: suggestions.accessibility,
    },
    {
      id: "imageComposition",
      label: "Image composition",
      score: clamp(imageComposition),
      weight: 1.1,
      suggestions: suggestions.imageComposition,
    },
    {
      id: "performanceBudget",
      label: "Performance budget",
      score: clamp(performanceBudget),
      weight: 0.9,
      suggestions: suggestions.performanceBudget,
    },
    {
      id: "editorialQuality",
      label: "Overall editorial quality",
      score: clamp(editorialQuality),
      weight: 1.4,
      suggestions: [...new Set(suggestions.editorialQuality)].slice(0, 5),
    },
    {
      id: "composition",
      label: "Composition",
      score: clamp(composition),
      weight: 1.15,
      suggestions: suggestions.composition,
    },
    {
      id: "rhythm",
      label: "Visual rhythm",
      score: clamp(rhythm),
      weight: 1.1,
      suggestions: suggestions.rhythm,
    },
    {
      id: "conversionReadiness",
      label: "Conversion readiness",
      score: clamp(conversionReadiness),
      weight: 1.25,
      suggestions: suggestions.conversionReadiness.length
        ? suggestions.conversionReadiness
        : suggestions.ctaProminence.slice(0, 2),
    },
  ];

  const weightSum = dimensions.reduce((s, d) => s + d.weight, 0);
  const overallScore = clamp(
    dimensions.reduce((s, d) => s + d.score * d.weight, 0) / weightSum,
  );
  const grade = gradeFromScore(overallScore);

  const topSuggestions = dimensions
    .flatMap((d) => d.suggestions)
    .filter(Boolean)
    .slice(0, 4);

  return {
    overallScore,
    grade,
    dimensions,
    warnings,
    summary:
      topSuggestions.length > 0
        ? `Grade ${grade} (${overallScore}/100). Focus: ${topSuggestions.join("; ")}.`
        : `Grade ${grade} (${overallScore}/100). Page meets editorial polish baselines.`,
  };
}

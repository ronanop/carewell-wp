/**
 * Layout Template Engine — picks article templates from semantic signals.
 */

import type {
  ArticleLayoutTemplateId,
  LayoutComposerInput,
} from "@/types/editorial-layout";

export type LayoutTemplateDefinition = {
  id: ArticleLayoutTemplateId;
  label: string;
  description: string;
  /** Score boost when signals match. */
  score: (signals: LayoutComposerInput["signals"]) => number;
};

export const LAYOUT_TEMPLATES: LayoutTemplateDefinition[] = [
  {
    id: "faq-heavy",
    label: "FAQ Heavy",
    description: "Emphasis on accordion answers and scannable Q&A.",
    score: (s) => (s.faqCount >= 4 ? 40 + s.faqCount * 2 : s.faqCount * 5),
  },
  {
    id: "cost-guide",
    label: "Cost Guide",
    description: "Pricing-focused layout with comparison and CTAs.",
    score: (s) => (s.hasCost ? 45 : 0),
  },
  {
    id: "before-after-showcase",
    label: "Before/After Showcase",
    description: "Media-forward results and gallery rhythm.",
    score: (s) => (s.hasBeforeAfter ? 50 : 0),
  },
  {
    id: "recovery-guide",
    label: "Recovery Guide",
    description: "Timeline-heavy aftercare and recovery steps.",
    score: (s) => (s.hasRecovery ? 42 : 0) + (s.hasProcedure ? 8 : 0),
  },
  {
    id: "medical-research",
    label: "Medical Research",
    description: "Evidence cards, citations, journal density.",
    score: (s) => (s.hasResearch ? 48 : 0),
  },
  {
    id: "treatment-guide",
    label: "Treatment Guide",
    description: "Benefits, procedure, risks, CTA cadence.",
    score: (s) =>
      (s.hasProcedure ? 25 : 0) +
      (s.hasBenefits ? 15 : 0) +
      (s.hasRisks ? 10 : 0),
  },
  {
    id: "celebrity-health",
    label: "Celebrity Health Analysis",
    description: "Magazine hero, story-led sections, pull quotes.",
    score: (s) => (s.sectionCount >= 8 && !s.hasCost ? 12 : 0),
  },
  {
    id: "long-form-editorial",
    label: "Long-form Editorial",
    description: "Default premium reading for long articles.",
    score: (s) => 10 + (s.readingMinutes >= 8 ? 15 : 0) + Math.min(s.sectionCount, 10),
  },
];

export function selectLayoutTemplate(
  signals: LayoutComposerInput["signals"],
  override?: ArticleLayoutTemplateId | null,
): ArticleLayoutTemplateId {
  if (override) return override;

  let best: { id: ArticleLayoutTemplateId; score: number } = {
    id: "long-form-editorial",
    score: -1,
  };

  for (const template of LAYOUT_TEMPLATES) {
    const score = template.score(signals);
    if (score > best.score) {
      best = { id: template.id, score };
    }
  }

  return best.id;
}

export function listLayoutTemplates(): LayoutTemplateDefinition[] {
  return LAYOUT_TEMPLATES;
}

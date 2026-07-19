/**
 * Layout Intelligence Engine — scores conversion, readability, visual balance.
 * May recommend layout improvements; does not mutate WordPress content.
 */

import type {
  ExperienceDocument,
  ExperienceIntelligenceResult,
} from "@/types/experience-document";

export function scoreExperienceIntelligence(
  doc: ExperienceDocument,
): ExperienceIntelligenceResult {
  const recommendations: string[] = [];
  let conversion = 55;
  let readability = 60;
  let balance = 60;

  const sectionCount = doc.layout?.sections.length ?? doc.config.sections.length;
  const ctaSections = doc.layout?.sections.filter((s) => s.showInlineCta).length ?? 0;
  const hasFaq = (doc.faqs?.length ?? 0) > 0 ||
    doc.layout?.sections.some((s) => s.section.type === "FAQ");
  const hasHeroImage = Boolean(doc.resolved.heroImage ?? doc.hero.featuredImage);
  const readingMinutes = doc.hero.readingTimeMinutes;

  if (ctaSections === 0 && sectionCount >= 4) {
    recommendations.push("Add at least one mid-article consultation CTA");
    conversion -= 12;
  } else if (ctaSections >= 1 && ctaSections <= 3) {
    conversion += 15;
  } else if (ctaSections > 3) {
    recommendations.push("Reduce inline CTAs to at most three for better conversion");
    conversion -= 8;
  }

  if (hasFaq) {
    conversion += 8;
    readability += 5;
  } else if (doc.kind === "service" || doc.kind === "blog") {
    recommendations.push("Add an FAQ section to improve clarity and SEO");
  }

  if (hasHeroImage) {
    balance += 10;
  } else {
    recommendations.push("Add a hero image that preserves original aspect ratio");
    balance -= 10;
  }

  if (readingMinutes >= 4 && readingMinutes <= 12) {
    readability += 15;
  } else if (readingMinutes > 18) {
    recommendations.push("Long article — ensure TOC and section rhythm are enabled");
    readability -= 5;
  }

  if (doc.sidebar.widgets.some((w) => w.id === "consultation" && w.enabled)) {
    conversion += 10;
  }

  if (doc.layout?.templateId === "faq-heavy" && !hasFaq) {
    recommendations.push("Template is FAQ-heavy but no FAQ sections detected");
    balance -= 8;
  }

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  return {
    conversionScore: clamp(conversion),
    readabilityScore: clamp(readability),
    visualBalanceScore: clamp(balance),
    recommendations,
    applied: false,
  };
}

/**
 * Optionally apply safe layout recommendations (CTA spacing already capped in composer).
 * Returns a shallow-cloned document; never mutates content HTML.
 */
export function applyIntelligenceRecommendations(
  doc: ExperienceDocument,
): ExperienceDocument {
  const intelligence = scoreExperienceIntelligence(doc);
  return {
    ...doc,
    intelligence: { ...intelligence, applied: true },
  };
}

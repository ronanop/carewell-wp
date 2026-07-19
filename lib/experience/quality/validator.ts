/**
 * Design Quality Validator — Studio warnings before publish.
 * Never blocks public rendering; surfaces issues in Experience Studio.
 */

import type {
  ExperienceDocument,
  ExperienceQualityWarning,
} from "@/types/experience-document";

export function validateExperienceQuality(
  doc: ExperienceDocument,
): ExperienceQualityWarning[] {
  const warnings: ExperienceQualityWarning[] = [];

  if (!doc.title.trim()) {
    warnings.push({
      code: "empty-title",
      severity: "error",
      message: "Page title is empty",
    });
  }

  if (!doc.contentHtml?.trim() && !doc.article) {
    warnings.push({
      code: "empty-content",
      severity: "error",
      message: "Page has no content body",
    });
  }

  const enabledSections = doc.config.sections.filter((s) => s.enabled);
  if (enabledSections.length === 0) {
    warnings.push({
      code: "no-sections",
      severity: "warn",
      message: "No presentation sections are enabled",
    });
  }

  for (const section of enabledSections) {
    if (section.type === "cta" && !section.variant) {
      warnings.push({
        code: "cta-missing-variant",
        severity: "info",
        message: `CTA section ${section.id} has no variant`,
        sectionId: section.id,
      });
    }
  }

  const ctaCount =
    doc.layout?.sections.filter((s) => s.showInlineCta).length ?? 0;
  if (ctaCount === 0 && (doc.kind === "service" || doc.kind === "blog")) {
    warnings.push({
      code: "missing-cta",
      severity: "warn",
      message: "No inline consultation CTAs detected — conversion may suffer",
    });
  }

  if (ctaCount > 3) {
    warnings.push({
      code: "excess-cta",
      severity: "warn",
      message: `Found ${ctaCount} inline CTAs — recommend at most 3`,
    });
  }

  if (!doc.seo.description) {
    warnings.push({
      code: "missing-meta-description",
      severity: "warn",
      message: "SEO meta description is missing",
    });
  }

  if (!doc.resolved.heroImage && !doc.hero.featuredImage) {
    warnings.push({
      code: "missing-hero-media",
      severity: "info",
      message: "No hero image — consider adding media with original aspect ratio",
    });
  }

  const heroFit = doc.config.heroMedia?.fit;
  if (heroFit === "cover") {
    warnings.push({
      code: "hero-cover-crop",
      severity: "info",
      message:
        "Hero media fit is cover — text-heavy thumbnails may be cropped; prefer original/contain",
    });
  }

  if (doc.layout) {
    let noneStreak = 0;
    for (const composed of doc.layout.sections) {
      if (composed.background === "none") {
        noneStreak += 1;
        if (noneStreak >= 4) {
          warnings.push({
            code: "flat-rhythm",
            severity: "info",
            message: "Long stretch of plain backgrounds — visual rhythm may feel flat",
          });
          break;
        }
      } else {
        noneStreak = 0;
      }
    }
  }

  return warnings;
}

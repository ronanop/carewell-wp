/**
 * Visual Consistency Validator — lightweight pass before render.
 * Suggests fixes; Layout Composer applies automatic defaults.
 */

import type { ComposedSection, LayoutComposition } from "@/types/editorial-layout";

/** Keep in sync with MAX_INLINE_CONSULTATION_CTAS in compose.ts */
const MAX_INLINE_CONSULTATION_CTAS = 3;

export type ValidationIssue = {
  code: string;
  message: string;
  severity: "info" | "warn";
};

export function validateLayoutComposition(
  composition: Omit<LayoutComposition, "validationNotes"> & {
    validationNotes?: string[];
  },
): { notes: string[]; issues: ValidationIssue[]; sections: ComposedSection[] } {
  const issues: ValidationIssue[] = [];
  const sections = [...composition.sections];

  // Repeated identical variants in a row
  for (let i = 1; i < sections.length; i++) {
    const prev = sections[i - 1]!;
    const curr = sections[i]!;
    if (
      prev.variant === curr.variant &&
      prev.background === curr.background &&
      prev.visualWeight === curr.visualWeight
    ) {
      issues.push({
        code: "repeated-rhythm",
        message: `Sections ${i - 1} and ${i} share identical visual weight`,
        severity: "warn",
      });
      // Auto-fix: flip background
      sections[i] = {
        ...curr,
        background: curr.background === "none" ? "muted" : "none",
        visualWeight: Math.min(5, curr.visualWeight + 1),
      };
    }
  }

  // Missing CTAs on long articles (respect max of 3; compose caps finally)
  let ctaCount = sections.filter((s) => s.showInlineCta).length;
  if (sections.length >= 6 && ctaCount === 0) {
    issues.push({
      code: "missing-cta",
      message: "Long article without inline CTAs — injecting mid and pre-FAQ",
      severity: "info",
    });
    const mid = Math.floor(sections.length / 2);
    if (sections[mid] && ctaCount < MAX_INLINE_CONSULTATION_CTAS) {
      sections[mid] = { ...sections[mid]!, showInlineCta: true };
      ctaCount += 1;
    }
    const faqIdx = sections.findIndex((s) => s.section.type === "FAQ");
    if (
      faqIdx > 0 &&
      sections[faqIdx - 1] &&
      !sections[faqIdx - 1]!.showInlineCta &&
      ctaCount < MAX_INLINE_CONSULTATION_CTAS
    ) {
      sections[faqIdx - 1] = { ...sections[faqIdx - 1]!, showInlineCta: true };
    }
  }

  // Excessive consecutive "none" backgrounds
  let noneStreak = 0;
  for (let i = 0; i < sections.length; i++) {
    if (sections[i]!.background === "none") {
      noneStreak += 1;
      if (noneStreak >= 3) {
        issues.push({
          code: "flat-rhythm",
          message: "Three consecutive plain sections — adding muted break",
          severity: "info",
        });
        sections[i] = { ...sections[i]!, background: "muted" };
        noneStreak = 0;
      }
    } else {
      noneStreak = 0;
    }
  }

  // Wide + large weight without breathing room
  for (let i = 1; i < sections.length; i++) {
    if (sections[i]!.visualWeight >= 4 && sections[i - 1]!.visualWeight >= 4) {
      sections[i] = {
        ...sections[i]!,
        spacing: "luxury",
        separator: "fade",
      };
      issues.push({
        code: "dense-weight",
        message: "Adjacent heavy sections — increasing spacing",
        severity: "info",
      });
    }
  }

  return {
    notes: issues.map((i) => i.message),
    issues,
    sections,
  };
}

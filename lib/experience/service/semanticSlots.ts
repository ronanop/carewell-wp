/**
 * Derive typed ServiceDocument semantic slots from shared SemanticAnalysisResult.
 * Does not duplicate WordPress HTML — views over classified sections.
 */

import type { SemanticAnalysisResult, SemanticSection } from "@/types/semantic-article";
import type { SemanticSectionType } from "@/types/semantic-article";
import type { ServiceSemanticSlots } from "@/types/service-document";

function firstOf(
  sections: SemanticSection[],
  types: SemanticSectionType[],
): SemanticSection | null {
  for (const type of types) {
    const hit = sections.find((s) => s.type === type);
    if (hit) return hit;
  }
  return null;
}

export function extractServiceSemanticSlots(
  semantic: SemanticAnalysisResult,
): ServiceSemanticSlots {
  const s = semantic.sections;
  return {
    overview: firstOf(s, ["INTRODUCTION", "SUMMARY"]),
    treatment: firstOf(s, ["PROCEDURE", "STEP_BY_STEP"]),
    benefits: firstOf(s, ["BENEFITS"]),
    procedure: firstOf(s, ["PROCEDURE", "STEP_BY_STEP"]),
    recovery: firstOf(s, ["RECOVERY"]),
    timeline: firstOf(s, ["TIMELINE"]),
    candidate: firstOf(s, ["ELIGIBILITY"]),
    contraindications: firstOf(s, ["WARNING"]),
    risks: firstOf(s, ["RISKS", "SIDE_EFFECTS"]),
    technology: firstOf(s, ["TECHNOLOGY"]),
    results: firstOf(s, ["RESULTS"]),
    gallery: firstOf(s, ["GALLERY", "IMAGE_GALLERY"]),
    beforeAfter: firstOf(s, ["BEFORE_AFTER"]),
    cost: firstOf(s, ["COST"]),
    insurance: firstOf(s, ["INSURANCE"]),
    doctor: firstOf(s, ["DOCTOR_ADVICE"]),
    location: firstOf(s, ["LOCATION"]),
    testimonials: firstOf(s, ["TESTIMONIALS", "TESTIMONIAL", "REVIEWS"]),
    research: firstOf(s, ["RESEARCH", "STATISTICS", "REFERENCES"]),
    comparison: firstOf(s, ["COMPARISON"]),
    faq: firstOf(s, ["FAQ"]),
    consultation: firstOf(s, ["CONSULTATION", "CONTACT"]),
    preparation: firstOf(s, ["PREPARATION"]),
    aftercare: firstOf(s, ["AFTERCARE"]),
    warning: firstOf(s, ["WARNING", "WHEN_TO_CONTACT"]),
    videos: firstOf(s, ["VIDEO"]),
  };
}

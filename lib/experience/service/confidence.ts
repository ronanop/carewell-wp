/**
 * Service semantic confidence — decides editorial vs legacy PresentationPage path.
 */

import type { SemanticAnalysisResult } from "@/types/semantic-article";

export function scoreServiceSemanticConfidence(
  semantic: SemanticAnalysisResult,
): "high" | "medium" | "low" {
  const sections = semantic.sections;
  if (sections.length === 0) return "low";

  const classified = sections.filter((s) => s.type !== "GENERIC");
  const high = sections.filter((s) => s.confidence === "high").length;
  const ratio = classified.length / sections.length;
  const highRatio = high / sections.length;

  if (ratio >= 0.55 && highRatio >= 0.25 && classified.length >= 3) {
    return "high";
  }
  if (ratio >= 0.35 && classified.length >= 2) {
    return "medium";
  }
  return "low";
}

/** Prefer editorial path for medium+; low falls back to PresentationPage. */
export function shouldUseServiceEditorialPath(
  confidence: "high" | "medium" | "low",
): boolean {
  return confidence === "high" || confidence === "medium";
}

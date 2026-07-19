/**
 * Service semantic confidence — advisory score for Studio / section polish.
 * Public routing prefers the editorial path whenever a ServiceDocument pipeline
 * was built; confidence must not silently regress production to PresentationPage.
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

  // Softened thresholds — real WordPress treatment pages often mix classified
  // blocks with GENERIC intro/CTA chunks; do not treat that as failure.
  if (ratio >= 0.4 && highRatio >= 0.15 && classified.length >= 2) {
    return "high";
  }
  if (ratio >= 0.2 && classified.length >= 1) {
    return "medium";
  }
  if (sections.length >= 1) {
    // Parsed content exists — medium floor so Studio still sees a usable score.
    return "medium";
  }
  return "low";
}

/**
 * Whether the public renderer should use ServiceExperienceRenderer.
 * Always prefer editorial when a pipeline exists; only absolute emptiness
 * (no sections) opts out — callers still soft-fail and log.
 */
export function shouldUseServiceEditorialPath(
  confidence: "high" | "medium" | "low",
  opts?: { sectionCount?: number },
): boolean {
  const sectionCount = opts?.sectionCount;
  if (typeof sectionCount === "number" && sectionCount <= 0) {
    return false;
  }
  // Confidence is advisory — never gate medium/low away from the semantic path.
  void confidence;
  return true;
}

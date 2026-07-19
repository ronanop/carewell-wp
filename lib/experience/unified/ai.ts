/**
 * AI-ready interfaces — no implementation in Phase 7.0.
 * Future: layout generation, readability improvements, conversion optimisation.
 */

import type { ExperienceDocument } from "@/types/experience-document";
import type { LayoutComposition } from "@/types/editorial-layout";
import type { SemanticAnalysisResult } from "@/types/semantic-article";

export type AiLayoutSuggestion = {
  templateId: string;
  rationale: string;
  confidence: number;
};

export type AiSectionSuggestion = {
  sectionType: string;
  placement: "before" | "after" | "replace";
  targetSectionId?: string;
  rationale: string;
};

export type AiReadabilitySuggestion = {
  sectionId: string;
  issue: string;
  suggestion: string;
};

export type AiConversionSuggestion = {
  action: string;
  expectedLift: "low" | "medium" | "high";
  rationale: string;
};

/**
 * Future AI layout generator — stub only.
 */
export interface ExperienceAiLayoutGenerator {
  suggestLayout(input: {
    semantic: SemanticAnalysisResult;
    kind: ExperienceDocument["kind"];
  }): Promise<AiLayoutSuggestion[]>;
}

/**
 * Future AI editorial assistant — stub only.
 */
export interface ExperienceAiEditorialAssistant {
  suggestSections(doc: ExperienceDocument): Promise<AiSectionSuggestion[]>;
  improveReadability(doc: ExperienceDocument): Promise<AiReadabilitySuggestion[]>;
  optimizeConversions(doc: ExperienceDocument): Promise<AiConversionSuggestion[]>;
}

/** No-op stub registered for Plugin SDK discovery. */
export const noopAiLayoutGenerator: ExperienceAiLayoutGenerator = {
  async suggestLayout() {
    return [];
  },
};

export const noopAiEditorialAssistant: ExperienceAiEditorialAssistant = {
  async suggestSections() {
    return [];
  },
  async improveReadability() {
    return [];
  },
  async optimizeConversions() {
    return [];
  },
};

/** Placeholder for applying AI layout suggestions (never auto-applies in Phase 7.0). */
export function previewAiLayout(
  _current: LayoutComposition,
  _suggestion: AiLayoutSuggestion,
): LayoutComposition {
  return _current;
}

/**
 * Unit-testable helpers for semantic rule matching (no React).
 */

import { clearSemanticRulesForTests } from "@/lib/experience/blog/semantic/ruleRegistry";
import {
  ensureMedicalCoreSemanticRules,
  resetMedicalCoreSemanticRulesForTests,
} from "@/lib/experience/blog/semantic/medicalCoreRules";
import { evaluateSemanticRules } from "@/lib/experience/blog/semantic/ruleRegistry";
import type { SemanticRuleContext } from "@/lib/experience/blog/semantic/ruleRegistry";

export function matchHeading(headingText: string) {
  clearSemanticRulesForTests();
  resetMedicalCoreSemanticRulesForTests();
  ensureMedicalCoreSemanticRules();

  const ctx: SemanticRuleContext = {
    headingText,
    headingLevel: 2,
    bodyText: "",
    listItems: [],
    hasTable: false,
    hasImage: false,
    hasVideo: false,
    hasQuote: false,
    nodeTypes: ["heading"],
    previousType: null,
    index: 1,
  };

  return evaluateSemanticRules(ctx);
}

export type { SemanticRule, SemanticRuleContext, SemanticRuleMatch } from "@/lib/experience/semantic/ruleRegistry";
export {
  registerSemanticRule,
  unregisterSemanticRule,
  getSemanticRules,
  evaluateSemanticRules,
  clearSemanticRulesForTests,
} from "@/lib/experience/semantic/ruleRegistry";
export { ensureMedicalCoreSemanticRules } from "@/lib/experience/semantic/medicalCoreRules";
export { analyzeArticleSemantics } from "@/lib/experience/semantic/analyzeArticle";

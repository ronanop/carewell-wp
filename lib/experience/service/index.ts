/**
 * Service editorial intelligence — public API (Phase 8.0).
 * Shares Article AST / semantic / layout engines with blogs; no fork.
 */

export type {
  ServiceDocument,
  ServiceAstDocument,
  ServiceHeroModel,
  ServiceSemanticSlots,
  ServiceSidebarConfig,
  ServiceSidebarWidgetId,
} from "@/types/service-document";
export { DEFAULT_SERVICE_SIDEBAR } from "@/types/service-document";

export {
  parseHtmlToServiceAst,
  stripPluginToc,
  extractAndRemoveFaqs,
} from "@/lib/experience/service/parseHtmlToServiceAst";

export {
  ensureServiceSemanticRules,
  resetServiceSemanticRulesForTests,
} from "@/lib/experience/service/serviceSemanticRules";

export {
  scoreServiceSemanticConfidence,
  shouldUseServiceEditorialPath,
} from "@/lib/experience/service/confidence";

export { extractServiceSemanticSlots } from "@/lib/experience/service/semanticSlots";

export { ensureServiceEditorialComponents } from "@/lib/experience/service/registerServiceComponents";

export {
  getServiceDocument,
  createEmptyServiceExperienceConfig,
} from "@/lib/experience/engine/servicePresentationEngine";

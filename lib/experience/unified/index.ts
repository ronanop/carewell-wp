/**
 * Unified Editorial Experience Engine — public API surface (Phase 7.0).
 */

export type {
  ExperienceDocument,
  ExperienceConfig,
  ExperienceKind,
  ExperienceLayoutPresetId,
  ExperienceLeadContext,
  ExperienceQualityWarning,
  ExperienceIntelligenceResult,
} from "@/types/experience-document";

export {
  blogDocumentToExperience,
  experienceToBlogDocument,
  presentationPageToExperience,
  serviceDocumentToExperience,
  experienceHasEditorialPipeline,
} from "@/lib/experience/unified/adapters";

export {
  blogPresentationConfigToExperienceConfig,
  presentationConfigToExperienceConfig,
  experienceConfigToBlogPresentationConfig,
  experienceConfigToPresentationConfig,
  createDefaultExperienceConfig,
  parseExperienceConfig,
  defaultLayoutPresetForKind,
} from "@/lib/experience/unified/migrate";

export type { ExperienceContentProvider } from "@/lib/experience/unified/provider";
export {
  resolveExperienceDocument,
  resolveExperienceSchemas,
} from "@/lib/experience/unified/resolve";

export {
  scoreExperienceIntelligence,
  applyIntelligenceRecommendations,
} from "@/lib/experience/unified/intelligence";

export { validateExperienceQuality } from "@/lib/experience/quality/validator";
export {
  buildExperienceReviewReport,
  type ExperienceReviewReport,
  type ReviewDimension,
} from "@/lib/experience/quality/reviewMode";

export {
  registerExperienceSymbol,
  getExperienceSymbol,
  listExperienceSymbols,
  resolveSymbolProps,
  ensureDefaultExperienceSymbols,
} from "@/lib/experience/library/symbols";

export {
  detectSpecialtyFromDocument,
  getContextAwareCtaCopy,
  applyContextAwareMessaging,
} from "@/lib/experience/unified/context";

export {
  registerExperienceComponent,
  getExperienceComponent,
  listExperienceComponents,
  ensureDefaultExperienceComponents,
} from "@/lib/experience/unified/componentRegistry";

export { emitExperienceEvent, onExperienceEvent } from "@/lib/experience/unified/analytics";

export type {
  ExperienceAiLayoutGenerator,
  ExperienceAiEditorialAssistant,
} from "@/lib/experience/unified/ai";
export {
  noopAiLayoutGenerator,
  noopAiEditorialAssistant,
} from "@/lib/experience/unified/ai";

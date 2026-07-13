/**
 * Experience Studio Platform public API.
 */

export {
  ensurePlatformPacksLoaded,
  getBlock,
  hasBlock,
  listBlockManifests,
  listBlocks,
  listPackIds,
} from "@/lib/experience/platform/bootstrap";

export { registerBlock } from "@/lib/experience/platform/sdk/registerBlock";
export {
  emitStudioEvent,
  onStudioEvent,
  clearStudioEvents,
} from "@/lib/experience/platform/events";

export {
  createBindingContext,
  resolveBinding,
  resolveBindings,
} from "@/lib/experience/platform/binding/engine";

export {
  evaluateBlockRules,
} from "@/lib/experience/platform/rules/engine";

export {
  getThemeTokens,
  listThemes,
  setActiveTheme,
  tokensToCssVars,
} from "@/lib/experience/platform/tokens/engine";

export {
  createBlockNode,
  flattenBlockTree,
  moveBlock,
  resolveBlockTree,
} from "@/lib/experience/platform/composition/tree";

export {
  presentationConfigToBlockDocument,
  applyBlockDocumentOrderToPresentationConfig,
} from "@/lib/experience/platform/bridge/presentationBridge";

export { generateLayoutFromPrompt } from "@/lib/experience/platform/ai/layoutGenerator";

export { MEDICAL_PACK_ID } from "@/lib/experience/platform/packs/medical";

export { getStudioPlatformCatalog } from "@/lib/experience/platform/catalog";
export { getPresentationPlatformProjection } from "@/lib/experience/platform/projection";

/**
 * Experience Studio public barrel — server-only.
 * Never import from public website feature components.
 */

import "server-only";

export { prisma, getPrisma } from "@/lib/experience/db";
export {
  ROLE_PERMISSIONS,
  hasPermission,
  requirePermission,
  type Permission,
} from "@/lib/experience/rbac";
export { createUserRepository } from "@/lib/experience/repositories/userRepository";
export { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
export { createPagePresentationRepository } from "@/lib/experience/repositories/pagePresentationRepository";
export { createTemplateRepository } from "@/lib/experience/repositories/templateRepository";
export {
  writeAuditLog,
  ensureRolesSeeded,
} from "@/lib/experience/services/auditService";
export {
  getDashboardSummary,
  type DashboardSummary,
} from "@/lib/experience/services/dashboardService";
export { syncWordPressPages, type SyncSummary } from "@/lib/experience/services/syncService";
export {
  getPagePresentation,
  getCachedPagePresentation,
  savePagePresentation,
  rollbackPresentationVersion,
} from "@/lib/experience/services/presentationService";
export {
  getPresentationPage,
  getPresentationPagePreview,
} from "@/lib/experience/engine/presentationEngine";
export { ensureSiteBootstrap, getDefaultSite } from "@/lib/experience/services/siteService";
export { listStudioPages } from "@/lib/experience/services/pageListService";
export {
  createDefaultPresentationConfig,
  parsePresentationConfig,
  presentationConfigSchema,
} from "@/lib/experience/validations/presentationConfig";

// Platform foundation (Plugin SDK, binding, tokens, rules, composition)
export {
  ensurePlatformPacksLoaded,
  getBlock,
  hasBlock,
  listBlockManifests,
  listBlocks,
  listPackIds,
  registerBlock,
  emitStudioEvent,
  onStudioEvent,
  createBindingContext,
  resolveBindings,
  evaluateBlockRules,
  getThemeTokens,
  listThemes,
  setActiveTheme,
  tokensToCssVars,
  createBlockNode,
  resolveBlockTree,
  presentationConfigToBlockDocument,
  applyBlockDocumentOrderToPresentationConfig,
  generateLayoutFromPrompt,
  MEDICAL_PACK_ID,
  getStudioPlatformCatalog,
} from "@/lib/experience/platform";

export { getPresentationPlatformProjection } from "@/lib/experience/platform/projection";

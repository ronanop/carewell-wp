export {
  registerEditorialComponent,
  getEditorialComponent,
  listEditorialComponents,
  meetsConfidence,
  type EditorialSectionProps,
} from "@/lib/experience/components/registry";
export { ensureDefaultEditorialComponents } from "@/lib/experience/components/registerDefaults";
export {
  EDITORIAL_PRESETS,
  getEditorialPreset,
  listEditorialPresets,
} from "@/lib/experience/components/presets";
export {
  emitEditorialEvent,
  subscribeEditorialAnalytics,
  type EditorialAnalyticsEvent,
} from "@/lib/experience/components/analytics";

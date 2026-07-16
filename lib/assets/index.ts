/**
 * Enterprise Asset Management System (AMS) — Experience Studio side.
 * WordPress remains the binary store; Studio is the only editor UI.
 */

export { classifyAssetKind, toAsset, toAssetRef, matchesAssetSearch, formatBytes, DEFAULT_VIRTUAL_FOLDERS, isAllowedUploadMime } from "@/lib/assets/domain";
export { extractMediaIdsFromValue, rewriteMediaIdsInValue } from "@/lib/assets/usage/extractMediaIds";
export type { AssetProvider } from "@/lib/assets/providers/types";

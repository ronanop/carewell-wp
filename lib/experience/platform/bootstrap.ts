/**
 * Platform bootstrap — loads built-in packs exactly once.
 */

import { registerMedicalPack } from "@/lib/experience/platform/packs/medical";
import {
  getRegisteredBlock,
  listRegisteredBlocks,
  listRegisteredPackIds,
} from "@/lib/experience/platform/sdk/registerBlock";
import type { BlockDefinition, BlockManifest } from "@/types/studio-platform";

let packsLoaded = false;

export function ensurePlatformPacksLoaded(): void {
  if (packsLoaded) return;
  packsLoaded = true;
  registerMedicalPack();
}

export function getBlock(id: string): BlockDefinition | undefined {
  ensurePlatformPacksLoaded();
  return getRegisteredBlock(id);
}

export function listBlocks(filter?: {
  category?: string;
  packId?: string;
}): BlockDefinition[] {
  ensurePlatformPacksLoaded();
  return listRegisteredBlocks(filter);
}

export function listPackIds(): string[] {
  ensurePlatformPacksLoaded();
  return listRegisteredPackIds();
}

export function listBlockManifests(): BlockManifest[] {
  return listBlocks().map((block) => block.manifest);
}

export function hasBlock(id: string): boolean {
  return Boolean(getBlock(id));
}

export function __resetPlatformForTests(): void {
  packsLoaded = false;
}

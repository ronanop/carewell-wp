import { listBlockManifests, listPackIds } from "@/lib/experience/platform/bootstrap";

/**
 * Server helper for Page Studio — exposes discovered packs without hardcoding.
 */
export function getStudioPlatformCatalog() {
  const packs = listPackIds();
  const blocks = listBlockManifests();

  return {
    packs,
    blockCount: blocks.length,
    categories: [...new Set(blocks.map((block) => block.category))].sort(),
    blocks: blocks.map((block) => ({
      id: block.id,
      name: block.displayName,
      category: block.category,
      packId: block.packId,
      version: block.version,
      acceptsChildren: Boolean(block.acceptsChildren),
    })),
  };
}

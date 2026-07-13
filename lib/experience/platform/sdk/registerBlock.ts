/**
 * Plugin SDK — block registration without hardcoding into the builder.
 */

import { emitStudioEvent } from "@/lib/experience/platform/events";
import type {
  BlockDefinition,
  BlockManifest,
} from "@/types/studio-platform";

const blockRegistry = new Map<string, BlockDefinition>();
const packIndex = new Map<string, Set<string>>();

export type RegisterBlockInput = {
  id: string;
  name: string;
  category: string;
  version?: string;
  author?: string;
  description?: string;
  packId: string;
  componentKey: string;
  inspectorKey: string;
  schema: BlockDefinition["schema"];
  bindings: BlockDefinition["bindings"];
  icon?: string;
  thumbnail?: string;
  supportedTemplates?: string[];
  defaultProps?: Record<string, unknown>;
  inspectorSchema?: Record<string, unknown>;
  responsiveSchema?: BlockManifest["responsiveSchema"];
  animationSchema?: BlockManifest["animationSchema"];
  themeCompatibility?: BlockManifest["themeCompatibility"];
  minimumWidth?: number | null;
  maximumWidth?: number | null;
  acceptsChildren?: boolean;
  allowedChildCategories?: string[];
  allowedChildIds?: string[];
  capabilities?: BlockManifest["capabilities"];
};

/**
 * Registers a block into the global Plugin SDK registry.
 * Builder discovers blocks dynamically — never hardcode packs into core UI.
 */
export function registerBlock(input: RegisterBlockInput): BlockDefinition {
  if (blockRegistry.has(input.id)) {
    return blockRegistry.get(input.id)!;
  }

  const manifest: BlockManifest = {
    id: input.id,
    displayName: input.name,
    category: input.category,
    version: input.version ?? "1.0.0",
    author: input.author ?? "Care Well",
    description: input.description ?? "",
    packId: input.packId,
    icon: input.icon,
    thumbnail: input.thumbnail,
    supportedTemplates: input.supportedTemplates,
    defaultProps: input.defaultProps ?? {},
    bindingSchema: input.bindings,
    inspectorSchema: input.inspectorSchema,
    responsiveSchema: input.responsiveSchema,
    animationSchema: input.animationSchema,
    themeCompatibility: input.themeCompatibility,
    minimumWidth: input.minimumWidth ?? null,
    maximumWidth: input.maximumWidth ?? null,
    acceptsChildren: input.acceptsChildren ?? false,
    allowedChildCategories: input.allowedChildCategories,
    allowedChildIds: input.allowedChildIds,
    capabilities: input.capabilities ?? {
      resizable: true,
      draggable: true,
      responsive: true,
      supportsBindings: true,
      nestable: Boolean(input.acceptsChildren),
    },
  };

  const definition: BlockDefinition = {
    manifest,
    schema: input.schema,
    bindings: input.bindings,
    componentKey: input.componentKey,
    inspectorKey: input.inspectorKey,
  };

  blockRegistry.set(input.id, definition);

  const packBlocks = packIndex.get(input.packId) ?? new Set<string>();
  packBlocks.add(input.id);
  packIndex.set(input.packId, packBlocks);

  emitStudioEvent("PackRegistered", {
    packId: input.packId,
    blockId: input.id,
  });

  return definition;
}

export function getRegisteredBlock(id: string): BlockDefinition | undefined {
  return blockRegistry.get(id);
}

export function listRegisteredBlocks(filter?: {
  category?: string;
  packId?: string;
}): BlockDefinition[] {
  let blocks = [...blockRegistry.values()];
  if (filter?.category) {
    blocks = blocks.filter((b) => b.manifest.category === filter.category);
  }
  if (filter?.packId) {
    blocks = blocks.filter((b) => b.manifest.packId === filter.packId);
  }
  return blocks.sort((a, b) =>
    a.manifest.displayName.localeCompare(b.manifest.displayName),
  );
}

export function listRegisteredPackIds(): string[] {
  return [...packIndex.keys()].sort();
}

export function __resetBlockRegistryForTests(): void {
  blockRegistry.clear();
  packIndex.clear();
}

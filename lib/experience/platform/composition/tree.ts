/**
 * Block composition — recursive tree helpers.
 */

import { getBlock } from "@/lib/experience/platform/bootstrap";
import { evaluateBlockRules } from "@/lib/experience/platform/rules/engine";
import { resolveBindings } from "@/lib/experience/platform/binding/engine";
import type {
  BindingContext,
  BlockNode,
} from "@/types/studio-platform";

export type ResolvedBlockNode = {
  instanceId: string;
  blockId: string;
  componentKey: string;
  inspectorKey: string;
  props: Record<string, unknown>;
  children: ResolvedBlockNode[];
};

function createInstanceId(blockId: string): string {
  return `${blockId}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createBlockNode(
  blockId: string,
  props: Record<string, unknown> = {},
  children: BlockNode[] = [],
): BlockNode {
  const definition = getBlock(blockId);
  if (!definition) {
    throw new Error(`Unknown block: ${blockId}`);
  }

  return {
    instanceId: createInstanceId(blockId),
    blockId,
    version: definition.manifest.version,
    props: { ...definition.manifest.defaultProps, ...props },
    bindings: definition.bindings,
    rules: undefined,
    children:
      definition.manifest.acceptsChildren !== false ? children : undefined,
  };
}

/**
 * Recursively resolves a block tree for rendering.
 * Skips nodes that fail Visual Rule Engine checks.
 */
export function resolveBlockTree(
  nodes: BlockNode[],
  context: BindingContext,
  options?: {
    templateSlug?: string | null;
    themeId?: string | null;
  },
): ResolvedBlockNode[] {
  const resolved: ResolvedBlockNode[] = [];

  for (const node of nodes) {
    const definition = getBlock(node.blockId);
    if (!definition) continue;

    if (!evaluateBlockRules(node.rules, context, options)) {
      continue;
    }

    const props = resolveBindings(
      node.bindings ?? definition.bindings,
      context,
      node.props,
    );

    const parsed = definition.schema.safeParse(props);
    const safeProps = parsed.success ? parsed.data : props;

    resolved.push({
      instanceId: node.instanceId,
      blockId: node.blockId,
      componentKey: definition.componentKey,
      inspectorKey: definition.inspectorKey,
      props: safeProps,
      children: resolveBlockTree(node.children ?? [], context, options),
    });
  }

  return resolved;
}

/**
 * Flattens a tree depth-first (useful for AI / analytics).
 */
export function flattenBlockTree(nodes: BlockNode[]): BlockNode[] {
  const out: BlockNode[] = [];
  for (const node of nodes) {
    out.push(node);
    if (node.children?.length) {
      out.push(...flattenBlockTree(node.children));
    }
  }
  return out;
}

export function moveBlock(
  nodes: BlockNode[],
  instanceId: string,
  toIndex: number,
): BlockNode[] {
  const index = nodes.findIndex((node) => node.instanceId === instanceId);
  if (index < 0) return nodes;
  const next = [...nodes];
  const [item] = next.splice(index, 1);
  if (!item) return nodes;
  next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, item);
  return next;
}

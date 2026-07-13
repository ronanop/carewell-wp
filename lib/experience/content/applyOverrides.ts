import type {
  ContentDocument,
  ContentNode,
  ContentNodeOverride,
  ContentOverrides,
  ContentTextRun,
} from "@/types/content-ast";

export function emptyContentOverrides(): ContentOverrides {
  return {
    nodes: {},
    order: null,
    insertions: [],
  };
}

/**
 * Apply Studio overrides onto a parsed WordPress AST.
 * Never mutates the source document.
 */
export function applyContentOverrides(
  doc: ContentDocument,
  overrides: ContentOverrides | null | undefined,
): ContentDocument {
  if (!overrides) return doc;

  const mapped = doc.nodes
    .map((node) => applyNodeOverrides(node, overrides.nodes))
    .filter((node): node is ContentNode => node !== null);

  let nodes = mapped;
  if (overrides.order?.length) {
    const byId = new Map(mapped.map((n) => [n.id, n]));
    const ordered: ContentNode[] = [];
    for (const id of overrides.order) {
      const node = byId.get(id);
      if (node) {
        ordered.push(node);
        byId.delete(id);
      }
    }
    for (const rest of byId.values()) ordered.push(rest);
    nodes = ordered;
  }

  if (overrides.insertions.length) {
    nodes = [...nodes, ...overrides.insertions.map((n) => structuredClone(n))];
  }

  return {
    ...doc,
    nodes,
  };
}

function applyNodeOverrides(
  node: ContentNode,
  map: Record<string, ContentNodeOverride>,
): ContentNode | null {
  const override = map[node.id] ?? map[node.fingerprint];
  let next: ContentNode = {
    ...node,
    children: node.children
      .map((child) => applyNodeOverrides(child, map))
      .filter((child): child is ContentNode => child !== null),
  };

  if (!override) return next;

  if (override.hidden || override.visibility === "hidden") {
    return null;
  }

  if (override.text != null) {
    next = {
      ...next,
      runs: [{ text: override.text }] satisfies ContentTextRun[],
    };
  }
  if (override.runs) {
    next = { ...next, runs: override.runs };
  }

  next = {
    ...next,
    attributes: { ...next.attributes, ...override.attributes },
    styles: { ...next.styles, ...override.styles },
    responsive: { ...next.responsive, ...override.responsive },
    visibility: override.visibility ?? next.visibility,
    animations: { ...next.animations, ...override.animations },
    bindings: { ...next.bindings, ...override.bindings },
    metadata: {
      ...next.metadata,
      locked: override.locked ?? next.metadata.locked,
    },
  };

  return next;
}

export function patchContentOverride(
  overrides: ContentOverrides,
  nodeId: string,
  patch: ContentNodeOverride,
): ContentOverrides {
  const prev = overrides.nodes[nodeId] ?? {};
  return {
    ...overrides,
    nodes: {
      ...overrides.nodes,
      [nodeId]: {
        ...prev,
        ...patch,
        attributes: { ...prev.attributes, ...patch.attributes },
        styles: { ...prev.styles, ...patch.styles },
        responsive: { ...prev.responsive, ...patch.responsive },
        animations: { ...prev.animations, ...patch.animations },
        bindings: { ...prev.bindings, ...patch.bindings },
      },
    },
  };
}

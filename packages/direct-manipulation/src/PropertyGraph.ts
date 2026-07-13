/**
 * Property Graph — editable values as dependency-aware nodes.
 * Enables undo, AI editing, and future live collaboration without prop sprawl.
 */

export type PropertyNodeId = string;

export type PropertyNode = {
  id: PropertyNodeId;
  /** Dot path e.g. Hero.Height / content:cn_abc.styles.objectPositionX */
  path: string;
  value: unknown;
  /** Upstream dependency ids */
  deps: PropertyNodeId[];
  meta?: {
    type?: "number" | "string" | "boolean" | "object" | "enum";
    breakpoint?: "desktop" | "tablet" | "mobile" | "all";
    binding?: string | null;
  };
};

export type PropertyGraph = {
  version: 1;
  nodes: Record<PropertyNodeId, PropertyNode>;
};

export function createPropertyGraph(): PropertyGraph {
  return { version: 1, nodes: {} };
}

export function propertyId(path: string): PropertyNodeId {
  return `prop:${path}`;
}

export function setProperty(
  graph: PropertyGraph,
  path: string,
  value: unknown,
  opts?: {
    deps?: PropertyNodeId[];
    meta?: PropertyNode["meta"];
  },
): PropertyGraph {
  const id = propertyId(path);
  return {
    ...graph,
    nodes: {
      ...graph.nodes,
      [id]: {
        id,
        path,
        value,
        deps: opts?.deps ?? graph.nodes[id]?.deps ?? [],
        meta: opts?.meta ?? graph.nodes[id]?.meta,
      },
    },
  };
}

export function getProperty<T = unknown>(
  graph: PropertyGraph,
  path: string,
): T | undefined {
  return graph.nodes[propertyId(path)]?.value as T | undefined;
}

export function removeProperty(
  graph: PropertyGraph,
  path: string,
): PropertyGraph {
  const id = propertyId(path);
  if (!graph.nodes[id]) return graph;
  const nodes = { ...graph.nodes };
  delete nodes[id];
  return { ...graph, nodes };
}

/** Collect values that depend on a changed node (shallow). */
export function dependentsOf(
  graph: PropertyGraph,
  path: string,
): PropertyNode[] {
  const id = propertyId(path);
  return Object.values(graph.nodes).filter((node) => node.deps.includes(id));
}

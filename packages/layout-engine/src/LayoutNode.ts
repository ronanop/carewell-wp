/**
 * Layout Engine — structural model for Experience Studio.
 * Leaf nodes map 1:1 to PresentationConfig sections for the shared renderer.
 * Container nodes (grid/row/column/stack) are layout metadata; leaves stay flat for PresentationPage.
 */

export type LayoutNodeKind =
  | "page"
  | "container"
  | "grid"
  | "row"
  | "column"
  | "stack"
  | "section"
  | "group";

export type LayoutSectionType = string;

export type LayoutSpacing = {
  margin?: Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  padding?: Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  gap?: number;
};

export type LayoutResponsive = {
  desktop?: LayoutSpacing & { columns?: number; hidden?: boolean };
  tablet?: LayoutSpacing & { columns?: number; hidden?: boolean };
  mobile?: LayoutSpacing & { columns?: number; hidden?: boolean };
};

export type LayoutNode = {
  id: string;
  kind: LayoutNodeKind;
  /** Present when kind === "section" — PresentationConfig section id */
  sectionId?: string;
  sectionType?: LayoutSectionType;
  name?: string;
  children: LayoutNode[];
  locked?: boolean;
  hidden?: boolean;
  spacing?: LayoutSpacing;
  responsive?: LayoutResponsive;
  /** Grid columns (1–12) when kind === "grid" | "row" */
  columns?: number;
  stackDirection?: "vertical" | "horizontal";
  /** Auto-layout (Framer-like) */
  autoLayout?: {
    direction?: "vertical" | "horizontal";
    wrap?: boolean;
    justify?: "start" | "center" | "end" | "space-between" | "pack";
    align?: "start" | "center" | "end" | "stretch" | "top" | "bottom";
    gap?: number;
    mode?: "stack" | "grid" | "freeform";
  };
  constraints?: {
    width?: "fill" | "hug" | "fixed";
    height?: "fill" | "hug" | "fixed";
    fixedWidth?: number;
    fixedHeight?: number;
  };
  /** Explicit column width percentages for row children */
  columnWidths?: number[];
  columnWidthPct?: number;
  transform?: {
    translateX?: number;
    translateY?: number;
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
    skewX?: number;
    skewY?: number;
  };
};

export type LayoutTree = {
  version: 1;
  root: LayoutNode;
};

export function createPageLayoutTree(
  sectionLeaves: Array<{ id: string; type: string; name?: string }>,
): LayoutTree {
  return {
    version: 1,
    root: {
      id: "page-root",
      kind: "page",
      name: "Page",
      children: sectionLeaves.map((section) => ({
        id: `layout-${section.id}`,
        kind: "section" as const,
        sectionId: section.id,
        sectionType: section.type,
        name: section.name ?? section.type,
        children: [],
      })),
    },
  };
}

/** Depth-first leaf section ids — order consumed by PresentationPage. */
export function flattenSectionIds(tree: LayoutTree): string[] {
  const ids: string[] = [];
  function walk(node: LayoutNode) {
    if (node.kind === "section" && node.sectionId) {
      ids.push(node.sectionId);
      return;
    }
    for (const child of node.children) walk(child);
  }
  walk(tree.root);
  return ids;
}

export function findLayoutNode(
  tree: LayoutTree,
  nodeId: string,
): LayoutNode | null {
  function walk(node: LayoutNode): LayoutNode | null {
    if (node.id === nodeId) return node;
    for (const child of node.children) {
      const hit = walk(child);
      if (hit) return hit;
    }
    return null;
  }
  return walk(tree.root);
}

export function findLayoutNodeBySectionId(
  tree: LayoutTree,
  sectionId: string,
): LayoutNode | null {
  function walk(node: LayoutNode): LayoutNode | null {
    if (node.sectionId === sectionId) return node;
    for (const child of node.children) {
      const hit = walk(child);
      if (hit) return hit;
    }
    return null;
  }
  return walk(tree.root);
}

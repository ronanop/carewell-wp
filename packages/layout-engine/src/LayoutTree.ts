import {
  createPageLayoutTree,
  flattenSectionIds,
  findLayoutNode,
  findLayoutNodeBySectionId,
  type LayoutNode,
  type LayoutTree,
} from "./LayoutNode";

export {
  createPageLayoutTree,
  flattenSectionIds,
  findLayoutNode,
  findLayoutNodeBySectionId,
};
export type { LayoutNode, LayoutTree, LayoutNodeKind } from "./LayoutNode";

/** Move a section leaf before another section leaf (or append). */
export function reorderLayoutSection(
  tree: LayoutTree,
  fromSectionId: string,
  beforeSectionId: string | null,
): LayoutTree {
  const next = structuredClone(tree);
  const fromNode = findLayoutNodeBySectionId(next, fromSectionId);
  if (!fromNode?.sectionId) return tree;

  const parent = findParent(next.root, fromNode.id);
  if (!parent) return tree;

  const fromIndex = parent.children.findIndex((c) => c.id === fromNode.id);
  if (fromIndex < 0) return tree;
  const [item] = parent.children.splice(fromIndex, 1);
  if (!item) return tree;

  // Prefer same parent reorder; fall back to page root for cross-group moves
  const targetParent = next.root;
  if (beforeSectionId === null) {
    targetParent.children.push(item);
    return next;
  }

  const beforeNode = findLayoutNodeBySectionId(next, beforeSectionId);
  if (!beforeNode) {
    targetParent.children.push(item);
    return next;
  }

  const beforeParent = findParent(next.root, beforeNode.id) ?? targetParent;
  const toIndex = beforeParent.children.findIndex((c) => c.id === beforeNode.id);
  beforeParent.children.splice(
    toIndex >= 0 ? toIndex : beforeParent.children.length,
    0,
    item,
  );
  return next;
}

export function insertLayoutSection(
  tree: LayoutTree,
  section: { id: string; type: string; name?: string },
  beforeSectionId: string | null,
): LayoutTree {
  const next = structuredClone(tree);
  const leaf: LayoutNode = {
    id: `layout-${section.id}`,
    kind: "section",
    sectionId: section.id,
    sectionType: section.type,
    name: section.name ?? section.type,
    children: [],
  };
  if (beforeSectionId === null) {
    next.root.children.push(leaf);
  } else {
    const beforeNode = findLayoutNodeBySectionId(next, beforeSectionId);
    const parent = beforeNode
      ? (findParent(next.root, beforeNode.id) ?? next.root)
      : next.root;
    const idx = beforeNode
      ? parent.children.findIndex((c) => c.id === beforeNode.id)
      : -1;
    parent.children.splice(idx >= 0 ? idx : parent.children.length, 0, leaf);
  }
  return next;
}

export function removeLayoutSection(
  tree: LayoutTree,
  sectionId: string,
): LayoutTree {
  const next = structuredClone(tree);
  pruneSection(next.root, sectionId);
  return next;
}

export function groupLayoutSections(
  tree: LayoutTree,
  sectionIds: string[],
): LayoutTree {
  if (sectionIds.length < 2) return tree;
  const idSet = new Set(sectionIds);
  const groupChildren = tree.root.children
    .filter((c) => c.sectionId && idSet.has(c.sectionId))
    .map((c) => structuredClone(c));

  if (groupChildren.length < 2) return tree;

  const result: LayoutNode[] = [];
  let placed = false;
  for (const child of tree.root.children) {
    if (child.sectionId && idSet.has(child.sectionId)) {
      if (!placed) {
        result.push({
          id: `group-${Date.now().toString(36)}`,
          kind: "group",
          name: "Group",
          children: groupChildren,
        });
        placed = true;
      }
    } else {
      result.push(structuredClone(child));
    }
  }

  return {
    version: 1,
    root: { ...structuredClone(tree.root), children: result },
  };
}

export function ungroupLayoutNode(
  tree: LayoutTree,
  groupId: string,
): LayoutTree {
  const next = structuredClone(tree);
  const idx = next.root.children.findIndex((c) => c.id === groupId);
  if (idx < 0) return tree;
  const group = next.root.children[idx]!;
  if (group.kind !== "group") return tree;
  next.root.children.splice(idx, 1, ...group.children);
  return next;
}

/** Ungroup the group that contains any of the given section ids. */
export function ungroupSectionsContaining(
  tree: LayoutTree,
  sectionIds: string[],
): LayoutTree {
  const idSet = new Set(sectionIds);
  for (const child of tree.root.children) {
    if (child.kind !== "group") continue;
    const has = child.children.some(
      (c) => c.sectionId && idSet.has(c.sectionId),
    );
    if (has) return ungroupLayoutNode(tree, child.id);
  }
  return tree;
}

/**
 * Sync layout tree with PresentationConfig sections.
 * Preserves group containers when leaf section ids still exist.
 */
export function syncLayoutFromSections(
  sections: Array<{ id: string; type: string; name?: string }>,
  previous?: LayoutTree | null,
): LayoutTree {
  const base = createPageLayoutTree(sections);
  if (!previous) return base;

  const byId = new Map(sections.map((s) => [s.id, s]));
  const seen = new Set<string>();

  function rebuild(node: LayoutNode): LayoutNode | null {
    if (node.kind === "section") {
      if (!node.sectionId || !byId.has(node.sectionId)) return null;
      const section = byId.get(node.sectionId)!;
      seen.add(section.id);
      return {
        ...structuredClone(node),
        sectionType: section.type,
        name: section.name ?? section.type,
        children: [],
      };
    }

    const children = node.children
      .map((child) => rebuild(child))
      .filter((child): child is LayoutNode => child != null);

    if (node.kind === "group" && children.length < 2) {
      // Collapse invalid groups to flat children
      return children.length === 1 ? children[0]! : null;
    }

    return { ...structuredClone(node), children };
  }

  const rebuiltRoot = rebuild(previous.root);
  const children =
    rebuiltRoot?.kind === "page"
      ? rebuiltRoot.children
      : (rebuiltRoot ? [rebuiltRoot] : []);

  for (const section of sections) {
    if (seen.has(section.id)) continue;
    children.push({
      id: `layout-${section.id}`,
      kind: "section",
      sectionId: section.id,
      sectionType: section.type,
      name: section.name ?? section.type,
      children: [],
    });
  }

  return {
    version: 1,
    root: {
      id: "page-root",
      kind: "page",
      name: "Page",
      children,
    },
  };
}

/** Reorder a flat sections array to match layout tree leaf order. */
export function orderSectionsByLayout<T extends { id: string }>(
  sections: T[],
  tree: LayoutTree,
): T[] {
  const byId = new Map(sections.map((s) => [s.id, s]));
  const ordered: T[] = [];
  for (const id of flattenSectionIds(tree)) {
    const section = byId.get(id);
    if (section) ordered.push(section);
  }
  for (const section of sections) {
    if (!ordered.some((s) => s.id === section.id)) ordered.push(section);
  }
  return ordered;
}

function findParent(
  root: LayoutNode,
  childId: string,
): LayoutNode | null {
  for (const child of root.children) {
    if (child.id === childId) return root;
    const nested = findParent(child, childId);
    if (nested) return nested;
  }
  return null;
}

function pruneSection(node: LayoutNode, sectionId: string): void {
  node.children = node.children.filter((child) => {
    if (child.sectionId === sectionId) return false;
    pruneSection(child, sectionId);
    if (child.kind === "group" && child.children.length === 0) return false;
    return true;
  });
}

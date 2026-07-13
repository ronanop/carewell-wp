/**
 * Layout Runtime — resolves layout trees before PresentationPage renders.
 * Business logic lives here; the renderer only paints resolved styles/structure.
 */

import type { LayoutNode, LayoutTree } from "@carewell/layout-engine";
import { createPageLayoutTree, syncLayoutFromSections } from "@carewell/layout-engine";

export type LayoutBreakpoint = "desktop" | "tablet" | "mobile";

export type ResolvedTransform = {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
};

export type ResolvedLayoutStyle = {
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  margin?: string;
  padding?: string;
  transform?: string;
  opacity?: number;
  visibility?: "visible" | "hidden";
  flex?: string;
  gridColumn?: string;
};

export type ResolvedLayoutNode = {
  id: string;
  kind: LayoutNode["kind"];
  sectionId?: string;
  sectionType?: string;
  name?: string;
  hidden: boolean;
  locked: boolean;
  style: ResolvedLayoutStyle;
  className: string;
  transform: ResolvedTransform;
  children: ResolvedLayoutNode[];
  /** Column width percentages when parent is row/grid */
  columnWidthPct?: number;
};

export type LayoutRuntimeInput = {
  sections: Array<{ id: string; type: string; name?: string }>;
  layoutTree?: LayoutTree | null;
  breakpoint?: LayoutBreakpoint;
  isEditor?: boolean;
  themeVariant?: string;
};

export type LayoutRuntimeResult = {
  root: ResolvedLayoutNode;
  /** Depth-first section ids in render order */
  sectionOrder: string[];
};

const IDENTITY_TRANSFORM: ResolvedTransform = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
};

/**
 * Resolve a layout tree into a renderable structure.
 * Falls back to a flat page of section leaves when no tree is stored.
 */
export function resolveLayoutRuntime(
  input: LayoutRuntimeInput,
): LayoutRuntimeResult {
  const tree =
    input.layoutTree ??
    syncLayoutFromSections(input.sections) ??
    createPageLayoutTree(input.sections);

  const breakpoint = input.breakpoint ?? "desktop";
  const sectionOrder: string[] = [];

  const root = resolveNode(tree.root, {
    breakpoint,
    isEditor: Boolean(input.isEditor),
    themeVariant: input.themeVariant ?? "medical",
    sectionOrder,
  });

  return { root, sectionOrder };
}

type ResolveCtx = {
  breakpoint: LayoutBreakpoint;
  isEditor: boolean;
  themeVariant: string;
  sectionOrder: string[];
};

function resolveNode(node: LayoutNode, ctx: ResolveCtx): ResolvedLayoutNode {
  const responsive = node.responsive?.[ctx.breakpoint];
  const spacing = responsive ?? node.spacing;
  const hidden = Boolean(node.hidden || responsive?.hidden);

  if (node.kind === "section" && node.sectionId) {
    ctx.sectionOrder.push(node.sectionId);
  }

  const transform = resolveTransform(node);
  const style = resolveStyle(node, spacing, transform);
  const className = resolveClassName(node, ctx);

  const children = node.children.map((child) => resolveNode(child, ctx));

  // Distribute equal column widths when parent is row/grid without explicit widths
  if (
    (node.kind === "row" || node.kind === "grid") &&
    children.length > 0 &&
    !children.some((c) => c.columnWidthPct != null)
  ) {
    const pct = Math.round((100 / children.length) * 100) / 100;
    for (const child of children) {
      child.columnWidthPct = pct;
      child.style.flex = `0 0 ${pct}%`;
      child.style.width = `${pct}%`;
    }
  }

  return {
    id: node.id,
    kind: node.kind,
    sectionId: node.sectionId,
    sectionType: node.sectionType,
    name: node.name,
    hidden,
    locked: Boolean(node.locked),
    style,
    className,
    transform,
    children,
    columnWidthPct: node.columnWidthPct,
  };
}

function resolveTransform(node: LayoutNode): ResolvedTransform {
  const t = node.transform;
  if (!t) return { ...IDENTITY_TRANSFORM };
  return {
    translateX: t.translateX ?? 0,
    translateY: t.translateY ?? 0,
    rotate: t.rotate ?? 0,
    scaleX: t.scaleX ?? 1,
    scaleY: t.scaleY ?? 1,
    skewX: t.skewX ?? 0,
    skewY: t.skewY ?? 0,
  };
}

function resolveStyle(
  node: LayoutNode,
  spacing: LayoutNode["spacing"] | undefined,
  transform: ResolvedTransform,
): ResolvedLayoutStyle {
  const style: ResolvedLayoutStyle = {};

  const autoLayout = node.autoLayout;
  const constraints = node.constraints;

  if (node.kind === "stack" || autoLayout?.mode === "stack") {
    const dir =
      autoLayout?.direction ??
      node.stackDirection ??
      "vertical";
    style.display = "flex";
    style.flexDirection = dir === "horizontal" ? "row" : "column";
    if (autoLayout?.wrap) style.flexWrap = "wrap";
    style.justifyContent = mapJustify(autoLayout?.justify);
    style.alignItems = mapAlign(autoLayout?.align);
    style.gap = px(autoLayout?.gap ?? spacing?.gap ?? 16);
  } else if (node.kind === "row") {
    style.display = "flex";
    style.flexDirection = "row";
    style.alignItems = "stretch";
    style.gap = px(spacing?.gap ?? 16);
  } else if (node.kind === "column") {
    style.display = "flex";
    style.flexDirection = "column";
    style.gap = px(spacing?.gap ?? 12);
  } else if (node.kind === "grid") {
    const cols = node.columns ?? 2;
    style.display = "grid";
    style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    style.gap = px(spacing?.gap ?? 16);
  } else if (node.kind === "container" || node.kind === "group") {
    style.display = "flex";
    style.flexDirection = "column";
    style.gap = px(spacing?.gap ?? 0);
  }

  if (spacing?.padding) {
    const p = spacing.padding;
    style.padding = `${p.top ?? 0}px ${p.right ?? 0}px ${p.bottom ?? 0}px ${p.left ?? 0}px`;
  }
  if (spacing?.margin) {
    const m = spacing.margin;
    style.margin = `${m.top ?? 0}px ${m.right ?? 0}px ${m.bottom ?? 0}px ${m.left ?? 0}px`;
  }

  if (constraints?.width === "fill") style.width = "100%";
  if (constraints?.width === "hug") style.width = "fit-content";
  if (constraints?.width === "fixed" && constraints.fixedWidth != null) {
    style.width = px(constraints.fixedWidth);
  }
  if (constraints?.height === "fill") style.height = "100%";
  if (constraints?.height === "hug") style.height = "fit-content";
  if (constraints?.height === "fixed" && constraints.fixedHeight != null) {
    style.height = px(constraints.fixedHeight);
  }

  const hasTransform =
    transform.translateX ||
    transform.translateY ||
    transform.rotate ||
    transform.scaleX !== 1 ||
    transform.scaleY !== 1 ||
    transform.skewX ||
    transform.skewY;

  if (hasTransform) {
    style.transform = [
      `translate(${transform.translateX}px, ${transform.translateY}px)`,
      `rotate(${transform.rotate}deg)`,
      `scale(${transform.scaleX}, ${transform.scaleY})`,
      `skew(${transform.skewX}deg, ${transform.skewY}deg)`,
    ].join(" ");
  }

  return style;
}

function resolveClassName(node: LayoutNode, ctx: ResolveCtx): string {
  const parts = [`layout-${node.kind}`];
  if (node.kind === "group") parts.push("layout-group");
  if (ctx.themeVariant) parts.push(`theme-token-${ctx.themeVariant}`);
  return parts.join(" ");
}

function mapJustify(value?: string): string | undefined {
  switch (value) {
    case "space-between":
      return "space-between";
    case "center":
      return "center";
    case "end":
      return "flex-end";
    case "start":
    case "pack":
      return "flex-start";
    default:
      return undefined;
  }
}

function mapAlign(value?: string): string | undefined {
  switch (value) {
    case "center":
      return "center";
    case "end":
    case "bottom":
      return "flex-end";
    case "stretch":
      return "stretch";
    case "start":
    case "top":
      return "flex-start";
    default:
      return undefined;
  }
}

function px(value: number): string {
  return `${value}px`;
}

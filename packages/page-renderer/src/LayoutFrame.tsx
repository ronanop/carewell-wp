import { type CSSProperties, type ReactNode } from "react";
import type { ResolvedLayoutNode } from "@carewell/layout-runtime";

import { cn } from "@/lib/utils";

/**
 * Paints resolved layout containers. No business logic — styles come from LayoutRuntime.
 */
export function LayoutFrame({
  node,
  children,
  isEditor,
}: {
  node: ResolvedLayoutNode;
  children: ReactNode;
  isEditor?: boolean;
}) {
  if (node.hidden && !isEditor) return null;

  const style: CSSProperties = {
    display: node.style.display as CSSProperties["display"],
    flexDirection: node.style.flexDirection as CSSProperties["flexDirection"],
    flexWrap: node.style.flexWrap as CSSProperties["flexWrap"],
    justifyContent: node.style.justifyContent,
    alignItems: node.style.alignItems,
    gap: node.style.gap,
    gridTemplateColumns: node.style.gridTemplateColumns,
    width: node.style.width,
    height: node.style.height,
    minWidth: node.style.minWidth,
    minHeight: node.style.minHeight,
    maxWidth: node.style.maxWidth,
    maxHeight: node.style.maxHeight,
    margin: node.style.margin,
    padding: node.style.padding,
    transform: node.style.transform,
    opacity: node.style.opacity,
    visibility: node.style.visibility,
    flex: node.style.flex,
    gridColumn: node.style.gridColumn,
  };

  // Page root is transparent — don't introduce an extra visual wrapper.
  if (node.kind === "page") {
    return (
      <div
        data-layout-node={node.id}
        data-layout-kind="page"
        className={cn(node.className, node.hidden && isEditor && "opacity-40")}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-layout-node={node.id}
      data-layout-kind={node.kind}
      data-layout-locked={node.locked || undefined}
      className={cn(
        node.className,
        node.hidden && isEditor && "opacity-40 outline-dashed outline-1 outline-amber-400",
        node.kind === "group" && "relative",
      )}
      style={style}
    >
      {children}
    </div>
  );
}

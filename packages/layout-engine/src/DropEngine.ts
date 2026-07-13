export type DropZone = "before" | "after" | "center" | "left" | "right";

export type DropHit = {
  targetSectionId: string | null;
  /** Insert before this section id; null = append */
  beforeId: string | null;
  zone: DropZone;
  /** 0–1 progress through target for indicator placement */
  ratio: number;
};

export type DropEngineInput = {
  clientY: number;
  /** Ordered section ids currently on the canvas */
  sectionIds: string[];
  /** getBoundingClientRect for each section */
  getBounds: (sectionId: string) => DOMRect | null;
  draggingSectionId?: string | null;
};

/**
 * Resolve where a dragged section / library block should land.
 */
export function resolveDropTarget(input: DropEngineInput): DropHit | null {
  const { clientY, sectionIds, getBounds, draggingSectionId } = input;
  if (!sectionIds.length) {
    return {
      targetSectionId: null,
      beforeId: null,
      zone: "after",
      ratio: 1,
    };
  }

  for (let i = 0; i < sectionIds.length; i += 1) {
    const id = sectionIds[i]!;
    if (draggingSectionId && id === draggingSectionId) continue;
    const rect = getBounds(id);
    if (!rect) continue;

    if (clientY < rect.top + rect.height * 0.5) {
      return {
        targetSectionId: id,
        beforeId: id,
        zone: "before",
        ratio: (clientY - rect.top) / Math.max(rect.height, 1),
      };
    }

    const isLast = i === sectionIds.length - 1;
    if (isLast || clientY < rect.bottom) {
      const nextId = sectionIds[i + 1] ?? null;
      return {
        targetSectionId: id,
        beforeId: nextId,
        zone: nextId ? "after" : "after",
        ratio: (clientY - rect.top) / Math.max(rect.height, 1),
      };
    }
  }

  return {
    targetSectionId: sectionIds[sectionIds.length - 1]!,
    beforeId: null,
    zone: "after",
    ratio: 1,
  };
}

export type SmartInsertAction =
  | "insert-before"
  | "insert-after"
  | "replace"
  | "wrap-section"
  | "add-to-grid";

export function suggestSmartInsertActions(opts: {
  draggingType: string;
  targetType: string;
}): SmartInsertAction[] {
  const actions: SmartInsertAction[] = ["insert-before", "insert-after"];
  if (opts.draggingType === opts.targetType) {
    actions.push("replace");
  }
  if (opts.targetType === "gallery" && opts.draggingType === "doctor") {
    actions.push("wrap-section", "add-to-grid");
  }
  return actions;
}

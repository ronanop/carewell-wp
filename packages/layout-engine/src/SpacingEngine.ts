const GRID = 4;

export function snapSpacing(value: number, grid = GRID): number {
  return Math.round(value / grid) * grid;
}

export type SpacingDraft = {
  padding?: Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  margin?: Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  gap?: number;
};

export function applySpacingDelta(
  current: SpacingDraft,
  edge: "padding-top" | "padding-bottom" | "margin-top" | "margin-bottom" | "gap",
  delta: number,
): SpacingDraft {
  const next = structuredClone(current);
  const apply = (value: number | undefined) =>
    snapSpacing(Math.max(0, (value ?? 0) + delta));

  if (edge === "padding-top") {
    next.padding = { ...next.padding, top: apply(next.padding?.top) };
  } else if (edge === "padding-bottom") {
    next.padding = { ...next.padding, bottom: apply(next.padding?.bottom) };
  } else if (edge === "margin-top") {
    next.margin = { ...next.margin, top: apply(next.margin?.top) };
  } else if (edge === "margin-bottom") {
    next.margin = { ...next.margin, bottom: apply(next.margin?.bottom) };
  } else if (edge === "gap") {
    next.gap = apply(next.gap);
  }
  return next;
}

export type ResizeHandle =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

export type Rect = { x: number; y: number; width: number; height: number };

export function applyResize(input: {
  rect: Rect;
  handle: ResizeHandle;
  deltaX: number;
  deltaY: number;
  minWidth?: number;
  minHeight?: number;
  snap?: number;
}): Rect {
  const minW = input.minWidth ?? 40;
  const minH = input.minHeight ?? 40;
  const snap = input.snap ?? 0;
  let { x, y, width, height } = input.rect;
  const { handle, deltaX, deltaY } = input;

  const snapValue = (v: number) =>
    snap > 0 ? Math.round(v / snap) * snap : v;

  if (handle.includes("e")) width = Math.max(minW, width + deltaX);
  if (handle.includes("s")) height = Math.max(minH, height + deltaY);
  if (handle.includes("w")) {
    const nextW = Math.max(minW, width - deltaX);
    x += width - nextW;
    width = nextW;
  }
  if (handle.includes("n")) {
    const nextH = Math.max(minH, height - deltaY);
    y += height - nextH;
    height = nextH;
  }

  return {
    x: snapValue(x),
    y: snapValue(y),
    width: snapValue(width),
    height: snapValue(height),
  };
}

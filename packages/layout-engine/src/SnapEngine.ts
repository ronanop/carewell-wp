export type SnapGuide = {
  orientation: "horizontal" | "vertical";
  /** Position in viewport coordinates */
  position: number;
  kind: "center" | "edge" | "spacing";
};

export type SnapResult = {
  x: number;
  y: number;
  guides: SnapGuide[];
};

const DEFAULT_THRESHOLD = 6;

/**
 * Snap a dragged box to siblings / viewport center.
 */
export function snapBox(input: {
  x: number;
  y: number;
  width: number;
  height: number;
  siblings: Array<{ x: number; y: number; width: number; height: number }>;
  viewport: { width: number; height: number };
  threshold?: number;
}): SnapResult {
  const threshold = input.threshold ?? DEFAULT_THRESHOLD;
  let { x, y } = input;
  const guides: SnapGuide[] = [];

  const centersX = [
    input.viewport.width / 2,
    ...input.siblings.map((s) => s.x + s.width / 2),
  ];
  const centersY = [
    input.viewport.height / 2,
    ...input.siblings.map((s) => s.y + s.height / 2),
  ];
  const edgesX = input.siblings.flatMap((s) => [s.x, s.x + s.width]);
  const edgesY = input.siblings.flatMap((s) => [s.y, s.y + s.height]);

  const boxCenterX = x + input.width / 2;
  const boxCenterY = y + input.height / 2;

  for (const cx of centersX) {
    if (Math.abs(boxCenterX - cx) <= threshold) {
      x = cx - input.width / 2;
      guides.push({ orientation: "vertical", position: cx, kind: "center" });
      break;
    }
  }
  for (const cy of centersY) {
    if (Math.abs(boxCenterY - cy) <= threshold) {
      y = cy - input.height / 2;
      guides.push({ orientation: "horizontal", position: cy, kind: "center" });
      break;
    }
  }
  for (const edge of edgesX) {
    if (Math.abs(x - edge) <= threshold) {
      x = edge;
      guides.push({ orientation: "vertical", position: edge, kind: "edge" });
      break;
    }
    if (Math.abs(x + input.width - edge) <= threshold) {
      x = edge - input.width;
      guides.push({ orientation: "vertical", position: edge, kind: "edge" });
      break;
    }
  }
  for (const edge of edgesY) {
    if (Math.abs(y - edge) <= threshold) {
      y = edge;
      guides.push({ orientation: "horizontal", position: edge, kind: "edge" });
      break;
    }
  }

  return { x, y, guides };
}

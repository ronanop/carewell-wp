export type GuideLine = {
  orientation: "horizontal" | "vertical";
  position: number;
  label?: string;
};

/** Equal-spacing and baseline guides between ordered boxes. */
export function computeSpacingGuides(
  boxes: Array<{ y: number; height: number; x: number; width: number }>,
): GuideLine[] {
  if (boxes.length < 2) return [];
  const sorted = [...boxes].sort((a, b) => a.y - b.y);
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i += 1) {
    gaps.push(sorted[i]!.y - (sorted[i - 1]!.y + sorted[i - 1]!.height));
  }
  const guides: GuideLine[] = [];
  if (gaps.length >= 2) {
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    for (let i = 1; i < sorted.length; i += 1) {
      const mid =
        sorted[i - 1]!.y +
        sorted[i - 1]!.height +
        (sorted[i]!.y - (sorted[i - 1]!.y + sorted[i - 1]!.height)) / 2;
      guides.push({
        orientation: "horizontal",
        position: mid,
        label: `${Math.round(avg)}px`,
      });
    }
  }
  return guides;
}

import { applyResize, type ResizeHandle, type Rect } from "@carewell/layout-engine";

import {
  type ImageFrameState,
  panImagePosition,
  resizeImageFrame,
  zoomImageFrame,
} from "./TransformEngine";

export type { ResizeHandle };

/** Live corner/edge resize for an image frame. */
export function resizeImageByHandle(input: {
  frame: ImageFrameState;
  handle: ResizeHandle;
  deltaX: number;
  deltaY: number;
}): ImageFrameState {
  const width = input.frame.frameWidth ?? 320;
  const height = input.frame.frameHeight ?? 240;
  const next = applyResize({
    rect: { x: 0, y: 0, width, height },
    handle: input.handle,
    deltaX: input.deltaX,
    deltaY: input.deltaY,
    minWidth: 48,
    minHeight: 48,
    snap: 4,
  });
  return resizeImageFrame(input.frame, next.width, next.height);
}

export function positionImageByDrag(input: {
  frame: ImageFrameState;
  deltaX: number;
  deltaY: number;
  frameWidth: number;
  frameHeight: number;
}): ImageFrameState {
  const dxPct = (input.deltaX / Math.max(input.frameWidth, 1)) * 100;
  const dyPct = (input.deltaY / Math.max(input.frameHeight, 1)) * 100;
  return panImagePosition(input.frame, -dxPct, -dyPct);
}

export function scaleImageByWheel(input: {
  frame: ImageFrameState;
  deltaY: number;
}): ImageFrameState {
  const delta = input.deltaY > 0 ? -0.05 : 0.05;
  return zoomImageFrame(input.frame, delta);
}

export function applyCropDraft(
  frame: ImageFrameState,
  crop: { x: number; y: number; width: number; height: number },
): ImageFrameState {
  return {
    ...frame,
    crop: {
      x: clamp(crop.x, 0, 100),
      y: clamp(crop.y, 0, 100),
      width: clamp(crop.width, 1, 100),
      height: clamp(crop.height, 1, 100),
    },
  };
}

export function rectFromBounds(bounds: {
  width: number;
  height: number;
}): Rect {
  return { x: 0, y: 0, width: bounds.width, height: bounds.height };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

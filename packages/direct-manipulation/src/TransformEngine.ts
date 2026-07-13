/**
 * Transform Engine — translate / rotate / scale / crop / flip for visual objects.
 * Future-ready for the animation editor; no React coupling.
 */

export type TransformState = {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  flipX: boolean;
  flipY: boolean;
};

export type ImageFrameState = {
  /** Object-position percentages (0–100) */
  objectPositionX: number;
  objectPositionY: number;
  /** Scale inside frame (1 = 100%) */
  scale: number;
  objectFit: "cover" | "contain" | "fill" | "none";
  /** Crop rect as % of natural image — never mutates WordPress media */
  crop: { x: number; y: number; width: number; height: number } | null;
  frameWidth: number | null;
  frameHeight: number | null;
  borderRadius: number;
  opacity: number;
  rotate: number;
};

export const DEFAULT_TRANSFORM: TransformState = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  flipX: false,
  flipY: false,
};

export const DEFAULT_IMAGE_FRAME: ImageFrameState = {
  objectPositionX: 50,
  objectPositionY: 50,
  scale: 1,
  objectFit: "cover",
  crop: null,
  frameWidth: null,
  frameHeight: null,
  borderRadius: 0,
  opacity: 1,
  rotate: 0,
};

export function resetTransform(): TransformState {
  return { ...DEFAULT_TRANSFORM };
}

export function resetImageFrame(): ImageFrameState {
  return { ...DEFAULT_IMAGE_FRAME };
}

export function applyTranslate(
  state: TransformState,
  dx: number,
  dy: number,
): TransformState {
  return {
    ...state,
    translateX: state.translateX + dx,
    translateY: state.translateY + dy,
  };
}

export function applyScale(
  state: TransformState,
  factor: number,
  uniform = true,
): TransformState {
  const next = Math.max(0.05, state.scaleX * factor);
  return {
    ...state,
    scaleX: next,
    scaleY: uniform ? next : Math.max(0.05, state.scaleY * factor),
  };
}

export function applyRotate(state: TransformState, degrees: number): TransformState {
  return { ...state, rotate: state.rotate + degrees };
}

export function flipHorizontal(state: TransformState): TransformState {
  return { ...state, flipX: !state.flipX, scaleX: -state.scaleX };
}

export function flipVertical(state: TransformState): TransformState {
  return { ...state, flipY: !state.flipY, scaleY: -state.scaleY };
}

export function transformToCss(state: TransformState): string {
  const sx = state.flipX ? -Math.abs(state.scaleX) : state.scaleX;
  const sy = state.flipY ? -Math.abs(state.scaleY) : state.scaleY;
  return [
    `translate(${state.translateX}px, ${state.translateY}px)`,
    `rotate(${state.rotate}deg)`,
    `scale(${sx}, ${sy})`,
    `skew(${state.skewX}deg, ${state.skewY}deg)`,
  ].join(" ");
}

export function panImagePosition(
  frame: ImageFrameState,
  dxPct: number,
  dyPct: number,
): ImageFrameState {
  return {
    ...frame,
    objectPositionX: clamp(frame.objectPositionX + dxPct, 0, 100),
    objectPositionY: clamp(frame.objectPositionY + dyPct, 0, 100),
  };
}

export function zoomImageFrame(
  frame: ImageFrameState,
  delta: number,
): ImageFrameState {
  return {
    ...frame,
    scale: clamp(frame.scale + delta, 0.25, 4),
  };
}

export function resizeImageFrame(
  frame: ImageFrameState,
  width: number,
  height: number,
): ImageFrameState {
  return {
    ...frame,
    frameWidth: Math.max(40, width),
    frameHeight: Math.max(40, height),
  };
}

export function imageFrameToObjectPosition(frame: ImageFrameState): string {
  return `${frame.objectPositionX}% ${frame.objectPositionY}%`;
}

export function imageFrameToCss(frame: ImageFrameState): Record<string, string | number> {
  const css: Record<string, string | number> = {
    objectFit: frame.objectFit,
    objectPosition: imageFrameToObjectPosition(frame),
    opacity: frame.opacity,
    borderRadius: `${frame.borderRadius}px`,
  };
  if (frame.frameWidth != null) css.width = `${frame.frameWidth}px`;
  if (frame.frameHeight != null) css.height = `${frame.frameHeight}px`;
  if (frame.scale !== 1 || frame.rotate) {
    css.transform = `scale(${frame.scale}) rotate(${frame.rotate}deg)`;
  }
  if (frame.crop) {
    const { x, y, width, height } = frame.crop;
    css.clipPath = `inset(${y}% ${Math.max(0, 100 - x - width)}% ${Math.max(0, 100 - y - height)}% ${x}%)`;
  }
  return css;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

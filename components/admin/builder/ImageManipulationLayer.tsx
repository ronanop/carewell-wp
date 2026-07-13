"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  Crop,
  Maximize2,
  Move,
  RotateCcw,
  Scan,
  ZoomIn,
} from "lucide-react";
import {
  applyCropDraft,
  positionImageByDrag,
  resizeImageByHandle,
  scaleImageByWheel,
  type ImageFrameState,
  type InteractionMode,
  type ResizeHandle,
  DEFAULT_IMAGE_FRAME,
} from "@carewell/direct-manipulation";

import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";

type Bounds = { top: number; left: number; width: number; height: number };

/**
 * Direct image manipulation — resize, position, scale, crop.
 * Writes contentOverrides / hero.imageTransform only (never WordPress media).
 */
export function ImageManipulationLayer({
  bounds,
  target,
}: {
  bounds: Bounds;
  target:
    | { kind: "content"; nodeId: string; frame: ImageFrameState }
    | { kind: "hero"; frame: ImageFrameState };
}) {
  const [mode, setMode] = useState<InteractionMode>("select");
  const [liveFrame, setLiveFrame] = useState(() =>
    normalizeFrame(target.frame, bounds),
  );
  const liveFrameRef = useRef(liveFrame);
  const draggingRef = useRef(false);
  const patchContentNodeStyles = useEditorStore((s) => s.patchContentNodeStyles);
  const patchHeroImageTransform = useEditorStore(
    (s) => s.patchHeroImageTransform,
  );

  useEffect(() => {
    if (draggingRef.current) return;
    const next = normalizeFrame(target.frame, bounds);
    liveFrameRef.current = next;
    setLiveFrame(next);
    // bounds + target identity drive sync; skip while dragging
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: use bounds fields + target
  }, [
    target,
    bounds.top,
    bounds.left,
    bounds.width,
    bounds.height,
  ]);

  function setFrame(frame: ImageFrameState) {
    liveFrameRef.current = frame;
    setLiveFrame(frame);
  }

  function commit(frame: ImageFrameState, pushHistory: boolean) {
    setFrame(frame);
    if (target.kind === "content") {
      patchContentNodeStyles(
        target.nodeId,
        {
          objectPositionX: frame.objectPositionX,
          objectPositionY: frame.objectPositionY,
          objectPosition: `${frame.objectPositionX}% ${frame.objectPositionY}%`,
          objectFit: frame.objectFit,
          imageScale: frame.scale,
          crop: frame.crop,
          width: frame.frameWidth != null ? `${Math.round(frame.frameWidth)}px` : undefined,
          height:
            frame.frameHeight != null
              ? `${Math.round(frame.frameHeight)}px`
              : undefined,
          borderRadius: frame.borderRadius || undefined,
          opacity: frame.opacity,
          rotate: frame.rotate || undefined,
        },
        pushHistory,
      );
    } else {
      patchHeroImageTransform(
        {
          objectPositionX: frame.objectPositionX,
          objectPositionY: frame.objectPositionY,
          scale: frame.scale,
          objectFit: frame.objectFit === "none" ? "cover" : frame.objectFit,
          crop: frame.crop,
        },
        pushHistory,
      );
    }
  }

  /** Live preview without flooding the store/history. */
  function preview(frame: ImageFrameState) {
    setFrame(frame);
    if (target.kind === "hero") {
      const img = document.querySelector<HTMLElement>(
        '[data-manip-target="hero-image"] img',
      );
      if (img) {
        img.style.transform = `scale(${frame.scale})`;
        img.style.transformOrigin = "center center";
        img.style.objectPosition = `${frame.objectPositionX}% ${frame.objectPositionY}%`;
        if (frame.objectFit) img.style.objectFit = frame.objectFit;
      }
      return;
    }

    const el = document.querySelector<HTMLElement>(
      `[data-content-node="${target.nodeId}"] img, [data-content-node="${target.nodeId}"]`,
    );
    const img =
      el?.tagName === "IMG" ? el : el?.querySelector<HTMLElement>("img");
    const frameEl = document.querySelector<HTMLElement>(
      `[data-content-node="${target.nodeId}"] .content-ast-image-frame`,
    );
    if (frame.frameWidth != null) {
      if (frameEl) {
        frameEl.style.width = `${Math.round(frame.frameWidth)}px`;
        frameEl.style.height = `${Math.round(frame.frameHeight ?? frame.frameWidth)}px`;
      } else if (img) {
        img.style.width = `${Math.round(frame.frameWidth)}px`;
        img.style.height = frame.frameHeight
          ? `${Math.round(frame.frameHeight)}px`
          : "auto";
        img.style.maxWidth = "none";
      }
    }
    if (img) {
      img.style.transform = frame.scale !== 1 ? `scale(${frame.scale})` : "";
      img.style.objectPosition = `${frame.objectPositionX}% ${frame.objectPositionY}%`;
    }
  }

  const handles: ResizeHandle[] = [
    "n",
    "s",
    "e",
    "w",
    "ne",
    "nw",
    "se",
    "sw",
  ];

  // Overlay follows live frame size for content; hero stays section-sized.
  const boxW =
    target.kind === "content"
      ? (liveFrame.frameWidth ?? bounds.width)
      : bounds.width;
  const boxH =
    target.kind === "content"
      ? (liveFrame.frameHeight ?? bounds.height)
      : bounds.height;

  return (
    <div
      className="pointer-events-none absolute z-40"
      style={{
        top: bounds.top,
        left: bounds.left,
        width: boxW,
        height: boxH,
      }}
      data-image-manip
    >
      <div className="absolute inset-0 shadow-[0_0_0_2px_#0ea5e9,0_0_0_6px_rgba(14,165,233,0.15)]" />

      {handles.map((handle) => (
        <ResizeKnob
          key={handle}
          handle={handle}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            draggingRef.current = true;
            const origin = normalizeFrame(liveFrameRef.current, bounds);
            const startX = event.clientX;
            const startY = event.clientY;

            function onMove(moveEvent: PointerEvent) {
              const dx = moveEvent.clientX - startX;
              const dy = moveEvent.clientY - startY;
              let next: ImageFrameState;

              if (target.kind === "hero") {
                // Fill hero: corner/edge drag zooms the image (scale), not the section.
                next = scaleFromHandleDrag(origin, handle, dx, dy);
              } else {
                next = resizeImageByHandle({
                  frame: origin,
                  handle,
                  deltaX: dx,
                  deltaY: dy,
                });
              }
              preview(next);
            }

            function onUp() {
              draggingRef.current = false;
              commit(liveFrameRef.current, true);
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", onUp);
            }

            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
          }}
        />
      ))}

      <div
        className={cn(
          "pointer-events-auto absolute inset-0",
          mode === "image-position" && "cursor-move",
          mode === "crop" && "cursor-crosshair",
        )}
        onPointerDown={(event) => {
          if (mode !== "image-position" && mode !== "select") return;
          if (mode === "select" && !event.altKey) return;
          event.preventDefault();
          event.stopPropagation();
          draggingRef.current = true;
          const startX = event.clientX;
          const startY = event.clientY;
          const origin = liveFrameRef.current;

          function onMove(moveEvent: PointerEvent) {
            const frame = positionImageByDrag({
              frame: origin,
              deltaX: moveEvent.clientX - startX,
              deltaY: moveEvent.clientY - startY,
              frameWidth: bounds.width,
              frameHeight: bounds.height,
            });
            preview(frame);
          }
          function onUp() {
            draggingRef.current = false;
            commit(liveFrameRef.current, true);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
          }
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        }}
        onWheel={(event) => {
          if (!event.ctrlKey && !event.metaKey) return;
          event.preventDefault();
          event.stopPropagation();
          const next = scaleImageByWheel({
            frame: liveFrameRef.current,
            deltaY: event.deltaY,
          });
          commit(next, true);
        }}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setMode("crop");
          const draft = liveFrameRef.current.crop ?? {
            x: 10,
            y: 10,
            width: 80,
            height: 80,
          };
          commit(applyCropDraft(liveFrameRef.current, draft), true);
        }}
      />

      <div className="pointer-events-auto absolute left-1/2 z-50 flex -translate-x-1/2 -translate-y-[calc(100%+10px)] items-center gap-0.5 rounded-xl border border-sky-200 bg-white/95 p-1 shadow-lg backdrop-blur">
        <Tool
          active={mode === "image-position"}
          title="Position (or Alt-drag)"
          icon={Move}
          onClick={() =>
            setMode(mode === "image-position" ? "select" : "image-position")
          }
        />
        <Tool
          active={mode === "crop"}
          title="Crop"
          icon={Crop}
          onClick={() => {
            if (mode === "crop") {
              setMode("select");
              return;
            }
            setMode("crop");
            commit(
              applyCropDraft(
                liveFrameRef.current,
                liveFrameRef.current.crop ?? {
                  x: 10,
                  y: 10,
                  width: 80,
                  height: 80,
                },
              ),
              true,
            );
          }}
        />
        <Tool
          title="Fit contain"
          icon={Maximize2}
          onClick={() =>
            commit({ ...liveFrameRef.current, objectFit: "contain", scale: 1 }, true)
          }
        />
        <Tool
          title="Fill cover"
          icon={Scan}
          onClick={() =>
            commit({ ...liveFrameRef.current, objectFit: "cover", scale: 1 }, true)
          }
        />
        <Tool
          title="Zoom in"
          icon={ZoomIn}
          onClick={() =>
            commit(
              scaleImageByWheel({
                frame: liveFrameRef.current,
                deltaY: -100,
              }),
              true,
            )
          }
        />
        <Tool
          title="Reset"
          icon={RotateCcw}
          onClick={() =>
            commit(normalizeFrame(DEFAULT_IMAGE_FRAME, bounds), true)
          }
        />
      </div>

      {mode === "crop" && liveFrame.crop ? (
        <CropBox
          crop={liveFrame.crop}
          bounds={{ ...bounds, width: boxW, height: boxH }}
          onChange={(crop) => {
            const next = applyCropDraft(liveFrameRef.current, crop);
            preview(next);
          }}
          onDone={() => {
            setMode("select");
            commit(liveFrameRef.current, true);
          }}
        />
      ) : null}

      <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-sky-700/90 px-1.5 py-0.5 text-[0.625rem] text-white">
        {target.kind === "hero"
          ? `${Math.round(liveFrame.scale * 100)}% zoom`
          : `${Math.round(boxW)}×${Math.round(boxH)} · ${Math.round(liveFrame.scale * 100)}%`}
      </div>
    </div>
  );
}

/**
 * Map handle drag to image scale for fill/cover heroes.
 * Dragging outward increases zoom; inward decreases.
 */
function scaleFromHandleDrag(
  origin: ImageFrameState,
  handle: ResizeHandle,
  dx: number,
  dy: number,
): ImageFrameState {
  let signed = 0;
  if (handle.includes("e")) signed += dx;
  if (handle.includes("w")) signed -= dx;
  if (handle.includes("s")) signed += dy;
  if (handle.includes("n")) signed -= dy;
  // Single-axis handles still work
  if (handle === "e" || handle === "w") signed = handle === "e" ? dx : -dx;
  if (handle === "n" || handle === "s") signed = handle === "s" ? dy : -dy;

  const nextScale = clamp(origin.scale + signed / 180, 0.25, 4);
  return { ...origin, scale: nextScale };
}

function normalizeFrame(frame: ImageFrameState, bounds: Bounds): ImageFrameState {
  return {
    ...frame,
    frameWidth: frame.frameWidth ?? bounds.width,
    frameHeight: frame.frameHeight ?? bounds.height,
    scale: frame.scale || 1,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function ResizeKnob({
  handle,
  onPointerDown,
}: {
  handle: ResizeHandle;
  onPointerDown: (event: ReactPointerEvent) => void;
}) {
  const pos = handlePosition(handle);
  return (
    <div
      className="pointer-events-auto absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white bg-sky-500 shadow"
      style={{ top: pos.top, left: pos.left, cursor: pos.cursor }}
      onPointerDown={onPointerDown}
    />
  );
}

function CropBox({
  crop,
  bounds,
  onChange,
  onDone,
}: {
  crop: { x: number; y: number; width: number; height: number };
  bounds: Bounds;
  onChange: (crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  onDone: () => void;
}) {
  const left = (crop.x / 100) * bounds.width;
  const top = (crop.y / 100) * bounds.height;
  const width = (crop.width / 100) * bounds.width;
  const height = (crop.height / 100) * bounds.height;

  return (
    <div
      className="pointer-events-auto absolute border-2 border-amber-400 bg-amber-400/10"
      style={{ left, top, width, height }}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const startX = event.clientX;
        const startY = event.clientY;
        const origin = { ...crop };
        function onMove(moveEvent: PointerEvent) {
          const dx = ((moveEvent.clientX - startX) / bounds.width) * 100;
          const dy = ((moveEvent.clientY - startY) / bounds.height) * 100;
          onChange({
            ...origin,
            x: Math.min(100 - origin.width, Math.max(0, origin.x + dx)),
            y: Math.min(100 - origin.height, Math.max(0, origin.y + dy)),
          });
        }
        function onUp() {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        }
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      }}
    >
      <div className="absolute inset-x-0 -bottom-8 flex justify-center gap-1">
        <button
          type="button"
          className="rounded bg-amber-500 px-2 py-0.5 text-[0.625rem] font-medium text-white"
          onClick={onDone}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Tool({
  title,
  icon: Icon,
  onClick,
  active,
}: {
  title: string;
  icon: typeof Move;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      className={cn(
        "rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "bg-sky-50 text-sky-700",
      )}
      onClick={onClick}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function handlePosition(handle: ResizeHandle): {
  top: string;
  left: string;
  cursor: string;
} {
  const map: Record<
    ResizeHandle,
    { top: string; left: string; cursor: string }
  > = {
    n: { top: "0%", left: "50%", cursor: "ns-resize" },
    s: { top: "100%", left: "50%", cursor: "ns-resize" },
    e: { top: "50%", left: "100%", cursor: "ew-resize" },
    w: { top: "50%", left: "0%", cursor: "ew-resize" },
    ne: { top: "0%", left: "100%", cursor: "nesw-resize" },
    nw: { top: "0%", left: "0%", cursor: "nwse-resize" },
    se: { top: "100%", left: "100%", cursor: "nwse-resize" },
    sw: { top: "100%", left: "0%", cursor: "nesw-resize" },
  };
  return map[handle];
}

export function frameFromContentStyles(
  styles: {
    objectPositionX?: number | null;
    objectPositionY?: number | null;
    objectPosition?: string | null;
    objectFit?: "cover" | "contain" | "fill" | "none" | null;
    imageScale?: number | null;
    crop?: ImageFrameState["crop"];
    width?: string | null;
    height?: string | null;
    borderRadius?: number | null;
    opacity?: number | null;
    rotate?: number | null;
  } | null | undefined,
  fallbackWidth: number,
  fallbackHeight: number,
): ImageFrameState {
  let x = styles?.objectPositionX ?? 50;
  let y = styles?.objectPositionY ?? 50;
  if (styles?.objectPosition && styles.objectPositionX == null) {
    const parts = styles.objectPosition.split(/\s+/);
    x = parseFloat(parts[0] ?? "50") || 50;
    y = parseFloat(parts[1] ?? "50") || 50;
  }
  return {
    objectPositionX: x,
    objectPositionY: y,
    scale: styles?.imageScale ?? 1,
    objectFit: styles?.objectFit ?? "cover",
    crop: styles?.crop ?? null,
    frameWidth: parsePx(styles?.width) ?? fallbackWidth,
    frameHeight: parsePx(styles?.height) ?? fallbackHeight,
    borderRadius: styles?.borderRadius ?? 0,
    opacity: styles?.opacity ?? 1,
    rotate: styles?.rotate ?? 0,
  };
}

function parsePx(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^(\d+(?:\.\d+)?)px$/.exec(value);
  return match ? Number(match[1]) : null;
}

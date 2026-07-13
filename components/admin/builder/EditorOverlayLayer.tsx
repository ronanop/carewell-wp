"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  Copy,
  EyeOff,
  GripVertical,
  Layers2,
  Plus,
  Trash2,
  Ungroup,
} from "lucide-react";
import {
  computeSpacingGuides,
  resolveDropTarget,
  snapBox,
  suggestSmartInsertActions,
  type GuideLine,
  type SnapGuide,
} from "@carewell/layout-engine";

import {
  ImageManipulationLayer,
  frameFromContentStyles,
} from "@/components/admin/builder/ImageManipulationLayer";
import { InsertionLine } from "@/components/admin/builder/InsertionLine";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";
import type { SectionConfig } from "@/types/presentation-config";
import { DEFAULT_IMAGE_FRAME } from "@carewell/direct-manipulation";

type Bounds = { top: number; left: number; width: number; height: number };

const SPACING_STEPS: SectionConfig["spacing"][] = [
  "compact",
  "default",
  "spacious",
];

/**
 * Editor chrome outside PresentationPage — selection, DnD indicators, insert bars.
 */
export function EditorOverlayLayer({
  viewportRef,
}: {
  viewportRef: RefObject<HTMLElement | null>;
}) {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const selectedContentId = useEditorStore((s) => s.selectedContentId);
  const hoveredContentId = useEditorStore((s) => s.hoveredContentId);
  const dragging = useEditorStore((s) => s.dragging);
  const dropTarget = useEditorStore((s) => s.dropTarget);
  const sections = useEditorStore((s) => s.config.sections);
  const config = useEditorStore((s) => s.config);
  const showGuides = useEditorStore((s) => s.showGuides);
  const showBaselineGrid = useEditorStore((s) => s.showBaselineGrid);
  const select = useEditorStore((s) => s.select);
  const selectContent = useEditorStore((s) => s.selectContent);
  const hover = useEditorStore((s) => s.hover);
  const hoverContent = useEditorStore((s) => s.hoverContent);
  const duplicateSection = useEditorStore((s) => s.duplicateSection);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const deleteSections = useEditorStore((s) => s.deleteSections);
  const setEditingContent = useEditorStore((s) => s.setEditingContent);
  const setDragging = useEditorStore((s) => s.setDragging);
  const setDropTarget = useEditorStore((s) => s.setDropTarget);
  const commitDrop = useEditorStore((s) => s.commitDrop);
  const setLeftTab = useEditorStore((s) => s.setLeftTab);
  const copySelection = useEditorStore((s) => s.copySelection);
  const pasteClipboard = useEditorStore((s) => s.pasteClipboard);
  const groupSelection = useEditorStore((s) => s.groupSelection);
  const ungroupSelection = useEditorStore((s) => s.ungroupSelection);
  const toggleLock = useEditorStore((s) => s.toggleLock);

  const [sectionBounds, setSectionBounds] = useState<Record<string, Bounds>>(
    {},
  );
  const [contentBounds, setContentBounds] = useState<Record<string, Bounds>>(
    {},
  );
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    sectionId: string;
  } | null>(null);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [smartActions, setSmartActions] = useState<string[]>([]);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const vRect = viewport.getBoundingClientRect();

    const nextSections: Record<string, Bounds> = {};
    viewport
      .querySelectorAll<HTMLElement>("[data-presentation-section]")
      .forEach((el) => {
        const id = el.getAttribute("data-presentation-section");
        if (!id) return;
        const r = measureContentsElement(el);
        nextSections[id] = {
          top: r.top - vRect.top + viewport.scrollTop,
          left: r.left - vRect.left + viewport.scrollLeft,
          width: r.width,
          height: r.height,
        };
      });
    setSectionBounds(nextSections);

    const nextContent: Record<string, Bounds> = {};
    viewport
      .querySelectorAll<HTMLElement>("[data-content-node]")
      .forEach((el) => {
        const id = el.getAttribute("data-content-node");
        if (!id) return;
        const r = measureContentsElement(el);
        nextContent[id] = {
          top: r.top - vRect.top + viewport.scrollTop,
          left: r.left - vRect.left + viewport.scrollLeft,
          width: r.width,
          height: r.height,
        };
      });
    setContentBounds(nextContent);
  }, [viewportRef]);

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onScroll = () => measure();
    viewport.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(() => measure());
    observer.observe(viewport);
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [measure, viewportRef, selectedIds, selectedContentId, sections, dragging]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function onMove(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const content = target.closest<HTMLElement>("[data-content-node]");
      if (content) {
        hoverContent(content.getAttribute("data-content-node"));
        hover(null);
        return;
      }
      const section = target.closest<HTMLElement>("[data-presentation-section]");
      hover(section?.getAttribute("data-presentation-section") ?? null);
      hoverContent(null);
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-editor-overlay]")) return;
      setContextMenu(null);

      const content = target.closest<HTMLElement>("[data-content-node]");
      if (content) {
        event.preventDefault();
        event.stopPropagation();
        selectContent(content.getAttribute("data-content-node"));
        return;
      }
      const section = target.closest<HTMLElement>("[data-presentation-section]");
      if (section) {
        event.preventDefault();
        event.stopPropagation();
        select(section.getAttribute("data-presentation-section"), {
          additive: event.shiftKey || event.metaKey || event.ctrlKey,
        });
        selectContent(null);
      }
    }

    function onDblClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const content = target?.closest<HTMLElement>("[data-content-node]");
      if (!content) return;
      const id = content.getAttribute("data-content-node");
      const type = content.getAttribute("data-content-type");
      if (
        id &&
        type &&
        ["heading", "paragraph", "quote", "button", "callout", "list-item"].includes(
          type,
        )
      ) {
        event.preventDefault();
        selectContent(id);
        setEditingContent(id);
      }
    }

    function onContextMenu(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const section = target?.closest<HTMLElement>("[data-presentation-section]");
      if (!section) return;
      event.preventDefault();
      const id = section.getAttribute("data-presentation-section");
      if (!id) return;
      select(id);
      setContextMenu({ x: event.clientX, y: event.clientY, sectionId: id });
    }

    function onDragOver(event: DragEvent) {
      const state = useEditorStore.getState();
      if (!state.dragging) return;
      const vp = viewportRef.current;
      if (!vp) return;
      event.preventDefault();
      setPointer({ x: event.clientX, y: event.clientY });

      const ids = state.config.sections.map((s) => s.id);
      const hit = resolveDropTarget({
        clientY: event.clientY,
        sectionIds: ids,
        draggingSectionId:
          state.dragging.kind === "section"
            ? state.dragging.sectionId
            : null,
        getBounds: (sectionId) => {
          const el = vp.querySelector<HTMLElement>(
            `[data-presentation-section="${sectionId}"]`,
          );
          return el ? measureContentsElement(el) : null;
        },
      });
      if (hit) {
        setDropTarget({
          beforeId: hit.beforeId,
          targetSectionId: hit.targetSectionId,
          zone: hit.zone,
        });

        const drag = state.dragging;
        const draggingType =
          drag.kind === "library"
            ? drag.sectionType
            : state.config.sections.find((s) => s.id === drag.sectionId)?.type;
        const targetType = hit.targetSectionId
          ? state.config.sections.find((s) => s.id === hit.targetSectionId)
              ?.type
          : null;
        if (draggingType && targetType) {
          setSmartActions(
            suggestSmartInsertActions({
              draggingType,
              targetType,
            }),
          );
        } else {
          setSmartActions([]);
        }
      }

      if (state.showGuides) {
        const vRect = vp.getBoundingClientRect();
        const siblings = ids
          .filter(
            (id) =>
              state.dragging?.kind !== "section" ||
              id !== state.dragging.sectionId,
          )
          .map((id) => {
            const el = vp.querySelector<HTMLElement>(
              `[data-presentation-section="${id}"]`,
            );
            if (!el) return null;
            const r = measureContentsElement(el);
            return {
              x: r.left - vRect.left,
              y: r.top - vRect.top,
              width: r.width,
              height: r.height,
            };
          })
          .filter(Boolean) as Array<{
          x: number;
          y: number;
          width: number;
          height: number;
        }>;

        const ghostW = 240;
        const ghostH = 48;
        const result = snapBox({
          x: event.clientX - vRect.left - ghostW / 2,
          y: event.clientY - vRect.top - ghostH / 2,
          width: ghostW,
          height: ghostH,
          siblings,
          viewport: { width: vRect.width, height: vRect.height },
        });
        setSnapGuides(result.guides);
      } else {
        setSnapGuides([]);
      }
    }

    function onDrop(event: DragEvent) {
      event.preventDefault();
      commitDrop();
      setSnapGuides([]);
      setSmartActions([]);
      setPointer(null);
    }

    function onDragEnd() {
      setSnapGuides([]);
      setSmartActions([]);
      setPointer(null);
    }

    viewport.addEventListener("mousemove", onMove);
    viewport.addEventListener("click", onClick, true);
    viewport.addEventListener("dblclick", onDblClick, true);
    viewport.addEventListener("contextmenu", onContextMenu);
    viewport.addEventListener("dragover", onDragOver);
    viewport.addEventListener("drop", onDrop);
    viewport.addEventListener("dragend", onDragEnd);
    return () => {
      viewport.removeEventListener("mousemove", onMove);
      viewport.removeEventListener("click", onClick, true);
      viewport.removeEventListener("dblclick", onDblClick, true);
      viewport.removeEventListener("contextmenu", onContextMenu);
      viewport.removeEventListener("dragover", onDragOver);
      viewport.removeEventListener("drop", onDrop);
      viewport.removeEventListener("dragend", onDragEnd);
    };
  }, [
    viewportRef,
    hover,
    hoverContent,
    select,
    selectContent,
    setEditingContent,
    setDropTarget,
    commitDrop,
  ]);

  const spacingGuides: GuideLine[] = useMemo(() => {
    if (!showGuides || dragging) return [];
    const boxes = Object.values(sectionBounds).map((b) => ({
      x: b.left,
      y: b.top,
      width: b.width,
      height: b.height,
    }));
    return computeSpacingGuides(boxes);
  }, [sectionBounds, showGuides, dragging]);

  if (!portalTarget || !viewportRef.current) return null;

  const viewport = viewportRef.current;
  const vRect = viewport.getBoundingClientRect();
  const orderedIds = sections.map((s) => s.id);
  const primaryId = selectedIds[0];
  const primarySection = primaryId
    ? sections.find((s) => s.id === primaryId)
    : null;

  const insertionY = (() => {
    if (!dragging || !dropTarget) return null;
    if (dropTarget.beforeId === null) {
      const last = orderedIds[orderedIds.length - 1];
      if (!last || !sectionBounds[last]) return null;
      const b = sectionBounds[last]!;
      return b.top + b.height;
    }
    const b = sectionBounds[dropTarget.beforeId];
    return b ? b.top : null;
  })();

  const overlay = (
    <div
      data-editor-overlay
      className="pointer-events-none fixed z-[70]"
      style={{
        top: vRect.top,
        left: vRect.left,
        width: vRect.width,
        height: vRect.height,
        overflow: "hidden",
      }}
    >
      {showBaselineGrid ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(14,165,233,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,165,233,0.08) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
      ) : null}

      <div
        className="relative"
        style={{
          transform: `translate(${-viewport.scrollLeft}px, ${-viewport.scrollTop}px)`,
        }}
      >
        {selectedIds.map((id) =>
          sectionBounds[id] ? (
            <Outline
              key={id}
              bounds={sectionBounds[id]!}
              color="#0ea5e9"
              solid
            />
          ) : null,
        )}

        {hoveredId &&
        !selectedIds.includes(hoveredId) &&
        sectionBounds[hoveredId] ? (
          <Outline bounds={sectionBounds[hoveredId]!} color="#7dd3fc" solid={false} />
        ) : null}

        {selectedContentId && contentBounds[selectedContentId] ? (
          (() => {
            const el = viewportRef.current?.querySelector(
              `[data-content-node="${selectedContentId}"]`,
            );
            const type = el?.getAttribute("data-content-type");
            const bounds = contentBounds[selectedContentId]!;
            if (type === "image" || type === "figure") {
              const override =
                config.contentOverrides.nodes[selectedContentId]?.styles;
              return (
                <ImageManipulationLayer
                  bounds={bounds}
                  target={{
                    kind: "content",
                    nodeId: selectedContentId,
                    frame: frameFromContentStyles(
                      override,
                      bounds.width,
                      bounds.height,
                    ),
                  }}
                />
              );
            }
            return (
              <Outline bounds={bounds} color="#8b5cf6" solid />
            );
          })()
        ) : null}

        {/* Hero image direct manipulation when hero section selected */}
        {selectedIds.length === 1 &&
        sections.find((s) => s.id === selectedIds[0])?.type === "hero" &&
        sectionBounds[selectedIds[0]!] ? (
          <ImageManipulationLayer
            bounds={sectionBounds[selectedIds[0]!]!}
            target={{
              kind: "hero",
              frame: {
                ...DEFAULT_IMAGE_FRAME,
                objectPositionX:
                  config.hero.imageTransform?.objectPositionX ?? 50,
                objectPositionY:
                  config.hero.imageTransform?.objectPositionY ?? 50,
                scale: config.hero.imageTransform?.scale ?? 1,
                objectFit: config.hero.imageTransform?.objectFit ?? "cover",
                crop: config.hero.imageTransform?.crop ?? null,
                frameWidth: sectionBounds[selectedIds[0]!]!.width,
                frameHeight: sectionBounds[selectedIds[0]!]!.height,
              },
            }}
          />
        ) : null}

        {hoveredContentId &&
        hoveredContentId !== selectedContentId &&
        contentBounds[hoveredContentId] ? (
          <Outline
            bounds={contentBounds[hoveredContentId]!}
            color="#c4b5fd"
            solid={false}
          />
        ) : null}

        {spacingGuides.map((guide, index) => (
          <div
            key={`sg-${index}`}
            className="pointer-events-none absolute z-10 border-t border-dashed border-fuchsia-400/70"
            style={{
              top: guide.position,
              left: 24,
              right: 24,
            }}
          >
            {guide.label ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-fuchsia-500 px-1.5 text-[0.625rem] text-white">
                {guide.label}
              </span>
            ) : null}
          </div>
        ))}

        {insertionY != null ? (
          <div
            className="pointer-events-none absolute inset-x-4 z-30"
            style={{ top: insertionY }}
          >
            <InsertionLine />
          </div>
        ) : null}

        {!dragging
          ? orderedIds.map((id) => {
              const bounds = sectionBounds[id];
              if (!bounds) return null;
              const y = bounds.top + bounds.height;
              return (
                <div
                  key={`insert-${id}`}
                  className="pointer-events-auto absolute left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 opacity-0 transition hover:opacity-100"
                  style={{ top: y }}
                >
                  <button
                    type="button"
                    className="flex size-7 items-center justify-center rounded-full border border-sky-300 bg-white text-sky-600 shadow-md"
                    title="Insert section"
                    onClick={() => {
                      setLeftTab("components");
                      select(id);
                    }}
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              );
            })
          : null}

        {primaryId && primarySection && sectionBounds[primaryId] ? (
          <>
            <div
              className="pointer-events-auto absolute z-20 flex -translate-y-[calc(100%+8px)] items-center gap-0.5 rounded-xl border border-sky-200 bg-white/95 p-1 shadow-lg backdrop-blur"
              style={{
                top: sectionBounds[primaryId]!.top,
                left: sectionBounds[primaryId]!.left + 12,
              }}
            >
              <span
                className="cursor-grab px-1 text-muted-foreground active:cursor-grabbing"
                draggable
                title="Drag to reorder"
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData(
                    "application/x-editor-section",
                    primaryId,
                  );
                  setDragging({
                    kind: "section",
                    sectionId: primaryId,
                    duplicate: event.altKey,
                  });
                }}
                onDragEnd={() => {
                  setDragging(null);
                  setDropTarget(null);
                  setSnapGuides([]);
                }}
              >
                <GripVertical className="size-3.5" />
              </span>
              <span className="px-1.5 text-[0.6875rem] font-semibold uppercase text-sky-700">
                {selectedIds.length > 1
                  ? `${selectedIds.length} selected`
                  : primarySection.type}
              </span>
              <OverlayBtn
                title="Duplicate"
                onClick={() => duplicateSection(primaryId)}
                icon={Copy}
              />
              {selectedIds.length > 1 ? (
                <OverlayBtn
                  title="Group"
                  onClick={() => groupSelection()}
                  icon={Layers2}
                />
              ) : (
                <OverlayBtn
                  title="Ungroup"
                  onClick={() => ungroupSelection()}
                  icon={Ungroup}
                />
              )}
              <OverlayBtn
                title="Hide"
                onClick={() => toggleVisibility(primaryId)}
                icon={EyeOff}
              />
              <OverlayBtn
                title="Delete"
                danger
                onClick={() => deleteSections(selectedIds)}
                icon={Trash2}
              />
            </div>

            <SpacingHandles
              bounds={sectionBounds[primaryId]!}
              spacing={primarySection.spacing}
              sectionId={primaryId}
            />
          </>
        ) : null}
      </div>

      {/* Viewport-relative snap guides */}
      {snapGuides.map((guide, index) => (
        <div
          key={`snap-${index}`}
          className="pointer-events-none absolute z-40 bg-fuchsia-500"
          style={
            guide.orientation === "vertical"
              ? {
                  left: guide.position,
                  top: 0,
                  width: 1,
                  height: "100%",
                }
              : {
                  top: guide.position,
                  left: 0,
                  height: 1,
                  width: "100%",
                }
          }
        />
      ))}

      {dragging && pointer && smartActions.length > 1 ? (
        <div
          className="pointer-events-none absolute z-50 flex -translate-x-1/2 gap-1 rounded-full border border-sky-200 bg-white/95 px-2 py-1 shadow-lg"
          style={{
            left: pointer.x - vRect.left,
            top: pointer.y - vRect.top - 36,
          }}
        >
          {smartActions.map((action) => (
            <span
              key={action}
              className="rounded-full bg-sky-50 px-2 py-0.5 text-[0.625rem] font-medium capitalize text-sky-700"
            >
              {action.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      ) : null}

      {contextMenu ? (
        <div
          className="pointer-events-auto fixed z-[80] min-w-[180px] rounded-xl border border-border bg-white py-1 shadow-2xl"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {[
            {
              label: "Duplicate",
              run: () => duplicateSection(contextMenu.sectionId),
            },
            {
              label: "Copy",
              run: () => {
                select(contextMenu.sectionId);
                copySelection();
              },
            },
            { label: "Paste", run: () => pasteClipboard() },
            {
              label: "Group",
              run: () => groupSelection(),
            },
            {
              label: "Ungroup",
              run: () => ungroupSelection(),
            },
            {
              label: "Lock",
              run: () => toggleLock(contextMenu.sectionId),
            },
            {
              label: "Hide",
              run: () => toggleVisibility(contextMenu.sectionId),
            },
            {
              label: "Insert below…",
              run: () => {
                select(contextMenu.sectionId);
                setLeftTab("components");
              },
            },
            {
              label: "Delete",
              run: () => deleteSections([contextMenu.sectionId]),
              danger: true,
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "block w-full px-3 py-2 text-left text-small hover:bg-sky-50",
                item.danger && "text-red-600 hover:bg-red-50",
              )}
              onClick={() => {
                item.run();
                setContextMenu(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  return createPortal(overlay, portalTarget);
}

function SpacingHandles({
  bounds,
  spacing,
  sectionId,
}: {
  bounds: Bounds;
  spacing: SectionConfig["spacing"];
  sectionId: string;
}) {
  const [dragEdge, setDragEdge] = useState<"top" | "bottom" | null>(null);
  const [liveSpacing, setLiveSpacing] = useState(spacing);

  useEffect(() => {
    setLiveSpacing(spacing);
  }, [spacing]);

  return (
    <>
      {(["top", "bottom"] as const).map((edge) => (
        <div
          key={edge}
          className="pointer-events-auto absolute z-20 flex cursor-ns-resize items-center justify-center"
          style={{
            left: bounds.left + bounds.width / 2 - 20,
            width: 40,
            height: 12,
            top: edge === "top" ? bounds.top - 6 : bounds.top + bounds.height - 6,
          }}
          title={`Spacing: ${liveSpacing} (drag)`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const startY = event.clientY;
            const startIndex = SPACING_STEPS.indexOf(spacing);
            let latest = spacing;
            setDragEdge(edge);
            function onMove(moveEvent: PointerEvent) {
              const delta =
                edge === "top"
                  ? startY - moveEvent.clientY
                  : moveEvent.clientY - startY;
              const step = Math.round(delta / 28);
              const nextIndex = Math.min(
                SPACING_STEPS.length - 1,
                Math.max(0, startIndex + step),
              );
              latest = SPACING_STEPS[nextIndex]!;
              setLiveSpacing(latest);
            }
            function onUp() {
              setDragEdge(null);
              if (latest !== spacing) {
                useEditorStore.getState().setSectionSpacing(sectionId, latest);
              }
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", onUp);
            }
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
          }}
        >
          <div
            className={cn(
              "h-1.5 w-8 rounded-full bg-sky-400/80 shadow",
              dragEdge === edge && "bg-sky-600",
            )}
          />
        </div>
      ))}
      <div
        className="pointer-events-none absolute z-20 rounded bg-sky-600 px-1.5 py-0.5 text-[0.625rem] font-medium capitalize text-white"
        style={{
          top: bounds.top + 8,
          left: bounds.left + bounds.width - 72,
        }}
      >
        {liveSpacing}
      </div>
    </>
  );
}

function Outline({
  bounds,
  color,
  solid,
}: {
  bounds: Bounds;
  color: string;
  solid: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
        boxShadow: solid
          ? `0 0 0 2px ${color}, 0 0 0 6px ${color}22`
          : `0 0 0 2px ${color}`,
      }}
    />
  );
}

function OverlayBtn({
  title,
  onClick,
  icon: Icon,
  danger,
}: {
  title: string;
  onClick: () => void;
  icon: typeof Copy;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      className={cn(
        "rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
        danger && "hover:bg-red-50 hover:text-red-600",
      )}
      onClick={onClick}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function measureContentsElement(el: HTMLElement): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rect = range.getBoundingClientRect();
  if (rect.width > 0 || rect.height > 0) return rect;
  return el.getBoundingClientRect();
}

"use client";

import { useMemo, useRef } from "react";

import { useBuilderMeta } from "@/components/admin/builder/BuilderProvider";
import { EditorOverlayLayer } from "@/components/admin/builder/EditorOverlayLayer";
import { InsertionLine } from "@/components/admin/builder/InsertionLine";
import { ScrollableViewport } from "@/components/admin/builder/ScrollableViewport";
import { buildLivePreviewPage } from "@/lib/experience/builder/livePreview";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import {
  ContentNodeMarker,
  PresentationPage,
  RenderMode,
  SectionMarker,
} from "@carewell/page-renderer";

/**
 * Full-page canvas — identical PresentationPage tree as production + overlay chrome.
 */
export function EditorCanvas() {
  const { basePage } = useBuilderMeta();
  const config = useEditorStore((s) => s.config);
  const device = useEditorStore((s) => s.device);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const dragging = useEditorStore((s) => s.dragging);
  const dropTarget = useEditorStore((s) => s.dropTarget);
  const setDropTarget = useEditorStore((s) => s.setDropTarget);
  const commitDrop = useEditorStore((s) => s.commitDrop);
  const viewportRef = useRef<HTMLDivElement>(null);

  const editorPage = useMemo(
    () => buildLivePreviewPage(basePage, config),
    [basePage, config],
  );

  const breakpoint =
    device === "mobile" ? "mobile" : device === "tablet" ? "tablet" : "desktop";

  return (
    <div
      className="relative h-full min-w-0 flex-[1_1_70%] bg-[radial-gradient(ellipse_at_top,#e8eef5_0%,#f4f7fb_40%,#eef2f7_100%)]"
      onDragOver={(event) => {
        if (!dragging) return;
        event.preventDefault();
        event.dataTransfer.dropEffect =
          dragging.kind === "library" ? "copy" : "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        commitDrop();
      }}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) {
          setDropTarget(null);
        }
      }}
    >
      <ScrollableViewport
        ref={viewportRef}
        onBackgroundClick={clearSelection}
      >
        <div
          className="relative"
          onDragOver={(event) => {
            if (!dragging) return;
            event.preventDefault();
            const sections = useEditorStore.getState().config.sections;
            const last = sections[sections.length - 1];
            if (last) {
              const el = document.querySelector(
                `[data-presentation-section="${last.id}"]`,
              );
              if (el) {
                const rect = el.getBoundingClientRect();
                if (event.clientY > rect.bottom - 24) {
                  setDropTarget({ beforeId: null });
                }
              }
            } else {
              setDropTarget({ beforeId: null });
            }
          }}
        >
          <PresentationPage
            page={editorPage}
            mode={RenderMode.EDITOR}
            breakpoint={breakpoint}
            markSection={({ section, children }) => (
              <SectionMarker section={section}>{children}</SectionMarker>
            )}
            markContentNode={({ node, children }) => (
              <ContentNodeMarker node={node}>{children}</ContentNodeMarker>
            )}
          />

          {dragging && dropTarget?.beforeId === null ? (
            <InsertionLine label="Insert at end" />
          ) : null}

          {!config.sections.length ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
              <p className="font-heading text-h3 text-foreground">
                Empty canvas
              </p>
              <p className="mt-2 max-w-md text-small text-muted-foreground">
                Drag a block from Components onto the page, or press ⌘K to
                insert.
              </p>
            </div>
          ) : null}
        </div>
      </ScrollableViewport>

      <EditorOverlayLayer viewportRef={viewportRef} />

      {dragging ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center"
          aria-hidden
        >
          <span className="rounded-full border border-sky-200 bg-white/95 px-3 py-1 text-[0.6875rem] font-medium text-sky-700 shadow-lg backdrop-blur">
            Drop to place · Esc to cancel
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** @deprecated Use EditorCanvas */
export const BuilderCanvas = EditorCanvas;

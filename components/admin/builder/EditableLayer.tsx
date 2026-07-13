"use client";

import { memo, type ReactNode } from "react";

import { InsertionLine } from "@/components/admin/builder/InsertionLine";
import { SelectionToolbar } from "@/components/admin/builder/SelectionToolbar";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";
import type { SectionConfig } from "@/types/presentation-config";

/**
 * Editable overlay around production section components.
 * Does not replace the section — wraps the same React tree used publicly.
 */
export const EditableLayer = memo(function EditableLayer({
  section,
  children,
}: {
  section: SectionConfig;
  children: ReactNode;
}) {
  const selected = useEditorStore((s) => s.selectedIds.includes(section.id));
  const hovered = useEditorStore((s) => s.hoveredId === section.id);
  const locked = useEditorStore((s) => s.lockedIds.includes(section.id));
  const dragging = useEditorStore((s) => s.dragging);
  const dropTarget = useEditorStore((s) => s.dropTarget);
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);
  const setDropTarget = useEditorStore((s) => s.setDropTarget);
  const setDragging = useEditorStore((s) => s.setDragging);
  const commitDrop = useEditorStore((s) => s.commitDrop);

  const showInsertBefore =
    Boolean(dragging) && dropTarget?.beforeId === section.id;

  return (
    <div
      data-editor-layer={section.id}
      data-layer-type={section.type}
      data-layer-locked={locked ? "true" : "false"}
      className={cn(
        "relative transition-[box-shadow,outline,opacity] duration-150",
        !section.enabled && "opacity-40",
        locked && "cursor-not-allowed",
        hovered &&
          !selected &&
          "outline outline-2 outline-sky-300/60 outline-offset-[-2px]",
        selected &&
          "outline outline-2 outline-sky-500 outline-offset-[-2px] shadow-[0_0_0_4px_rgba(14,165,233,0.12)]",
        dragging?.kind === "section" &&
          dragging.sectionId === section.id &&
          "opacity-40",
      )}
      draggable={!locked}
      onDragStart={(event) => {
        if (locked) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData("application/x-editor-section", section.id);
        event.dataTransfer.effectAllowed = "copyMove";
        setDragging({
          kind: "section",
          sectionId: section.id,
          duplicate: event.altKey,
        });
        if (!selected) select(section.id);
      }}
      onDragEnd={() => {
        setDragging(null);
        setDropTarget(null);
      }}
      onDragOver={(event) => {
        if (!dragging) return;
        if (
          dragging.kind === "section" &&
          dragging.sectionId === section.id
        ) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const before = event.clientY < rect.top + rect.height / 2;
        setDropTarget({
          beforeId: before ? section.id : nextBeforeId(section.id),
        });
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        commitDrop();
      }}
      onMouseEnter={() => hover(section.id)}
      onMouseLeave={() => hover(null)}
      onClick={(event) => {
        event.stopPropagation();
        if (locked) return;
        select(section.id, { additive: event.shiftKey });
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        // Phase 4.3: enter child editing; for now keep section selected
        select(section.id);
      }}
    >
      {showInsertBefore ? <InsertionLine /> : null}

      {selected ? (
        <SelectionToolbar sectionId={section.id} locked={locked} />
      ) : null}

      {children}
    </div>
  );
});

function nextBeforeId(sectionId: string): string | null {
  const sections = useEditorStore.getState().config.sections;
  const index = sections.findIndex((s) => s.id === sectionId);
  if (index < 0) return null;
  return sections[index + 1]?.id ?? null;
}

"use client";

import {
  Copy,
  EyeOff,
  GripVertical,
  Lock,
  MoreHorizontal,
  Settings2,
  Sparkles,
  Trash2,
  Unlock,
} from "lucide-react";

import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";

export function SelectionToolbar({
  sectionId,
  locked,
}: {
  sectionId: string;
  locked: boolean;
}) {
  const duplicateSection = useEditorStore((s) => s.duplicateSection);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const deleteSections = useEditorStore((s) => s.deleteSections);
  const setLeftTab = useEditorStore((s) => s.setLeftTab);
  const section = useEditorStore((s) =>
    s.config.sections.find((item) => item.id === sectionId),
  );

  if (!section) return null;

  return (
    <div
      className={cn(
        "absolute left-1/2 top-0 z-40 flex -translate-x-1/2 -translate-y-[calc(100%+8px)] items-center gap-0.5",
        "rounded-xl border border-sky-200/80 bg-white/95 p-1 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md",
      )}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <span
        className="inline-flex cursor-grab items-center px-1.5 text-muted-foreground active:cursor-grabbing"
        title="Drag to reorder"
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData(
            "application/x-editor-section",
            sectionId,
          );
          event.dataTransfer.effectAllowed = "move";
          useEditorStore.getState().setDragging({
            kind: "section",
            sectionId,
          });
        }}
        onDragEnd={() => {
          useEditorStore.getState().setDragging(null);
          useEditorStore.getState().setDropTarget(null);
        }}
      >
        <GripVertical className="size-3.5" />
      </span>

      <span className="px-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-sky-700">
        {section.type}
      </span>

      <Tool
        title="Duplicate"
        onClick={() => duplicateSection(sectionId)}
        icon={Copy}
      />
      <Tool
        title="Hide"
        onClick={() => toggleVisibility(sectionId)}
        icon={EyeOff}
      />
      <Tool
        title={locked ? "Unlock" : "Lock"}
        onClick={() => toggleLock(sectionId)}
        icon={locked ? Unlock : Lock}
      />
      <Tool
        title="Settings"
        onClick={() => {
          useEditorStore.getState().select(sectionId);
        }}
        icon={Settings2}
      />
      <Tool
        title="Bindings"
        onClick={() => useEditorStore.getState().select(sectionId)}
        icon={Sparkles}
      />
      <Tool
        title="More"
        onClick={() => setLeftTab("layers")}
        icon={MoreHorizontal}
      />
      <Tool
        title="Delete"
        onClick={() => deleteSections([sectionId])}
        icon={Trash2}
        danger
      />
    </div>
  );
}

function Tool({
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
        "rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground",
        danger && "hover:bg-red-50 hover:text-red-600",
      )}
      onClick={onClick}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

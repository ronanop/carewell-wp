"use client";

import type { ReactNode } from "react";
import {
  Copy,
  EyeOff,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";

import { useEditorStore } from "@/lib/experience/builder/editorStore";
import {
  findElementDescriptor,
  findRepeaterDescriptor,
} from "@/lib/experience/static-pages/elementRegistry";
import {
  addRepeaterItem,
  duplicateRepeaterItem,
  removeRepeaterItem,
} from "@/lib/experience/static-pages/repeaterOverrides";
import { setElementOverrideField } from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

/**
 * Floating element toolbar — duplicate / hide / delete / add (repeaters).
 */
export function ElementFloatingToolbar() {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const updateConfig = useEditorStore((s) => s.updateConfig);
  const setEditingElement = useEditorStore((s) => s.setEditingElement);
  const selectElement = useEditorStore((s) => s.selectElement);
  const device = useEditorStore((s) => s.device);

  if (!selectedElementId) return null;

  const descriptor = findElementDescriptor(selectedElementId);
  const itemMatch = selectedElementId.match(
    /^(.*)\.item\.(\d+)\.([^.]+)$/,
  );
  const repeaterId = itemMatch?.[1] ?? null;
  const itemIndex = itemMatch ? Number(itemMatch[2]) : null;
  const repeater = repeaterId
    ? findRepeaterDescriptor(repeaterId)
    : undefined;

  function hide() {
    updateConfig((prev) =>
      setElementOverrideField(prev, selectedElementId!, "hidden", true),
    );
    selectElement(null);
  }

  function lock() {
    updateConfig((prev) =>
      setElementOverrideField(
        prev,
        selectedElementId!,
        "locked",
        !prev.elementOverrides?.[selectedElementId!]?.locked,
      ),
    );
  }

  function duplicate() {
    if (!repeater || itemIndex === null) return;
    updateConfig((prev) =>
      duplicateRepeaterItem(
        prev,
        repeater.id,
        repeater.defaultItems,
        itemIndex,
      ),
    );
  }

  function remove() {
    if (!repeater || itemIndex === null) return;
    updateConfig((prev) =>
      removeRepeaterItem(prev, repeater.id, repeater.defaultItems, itemIndex),
    );
    selectElement(null);
  }

  function addItem() {
    if (!repeater) return;
    const template = { ...(repeater.defaultItems[0] ?? {}) };
    updateConfig((prev) =>
      addRepeaterItem(prev, repeater.id, repeater.defaultItems, template),
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-auto absolute right-3 top-3 z-[65] flex flex-wrap items-center gap-1 rounded-xl border border-sky-200 bg-white/95 p-1.5 shadow-lg backdrop-blur",
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <span className="px-2 text-[0.65rem] font-semibold uppercase tracking-wide text-sky-800">
        {descriptor?.displayName ?? "Element"}
      </span>
      {descriptor?.supports.inlineEdit ? (
        <ToolBtn
          label="Edit"
          onClick={() => setEditingElement(selectedElementId)}
        />
      ) : null}
      {repeater?.allowDuplicate ? (
        <ToolBtn label="Duplicate" icon={<Copy className="size-3.5" />} onClick={duplicate} />
      ) : null}
      {repeater?.allowAdd ? (
        <ToolBtn label="Add" icon={<Plus className="size-3.5" />} onClick={addItem} />
      ) : null}
      <ToolBtn label="Hide" icon={<EyeOff className="size-3.5" />} onClick={hide} />
      <ToolBtn label="Lock" icon={<Lock className="size-3.5" />} onClick={lock} />
      {repeater?.allowDelete ? (
        <ToolBtn label="Delete" icon={<Trash2 className="size-3.5" />} onClick={remove} />
      ) : null}
      <span className="px-1.5 text-[0.65rem] text-muted-foreground">
        {device}
      </span>
    </div>
  );
}

function ToolBtn({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.7rem] font-medium text-sky-900 hover:bg-sky-50"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

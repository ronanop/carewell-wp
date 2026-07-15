"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { resolveElementText } from "@/lib/experience/static-pages/elementOverrides";
import { findElementDescriptor } from "@/lib/experience/static-pages/elementRegistry";

/**
 * Controlled inline text editor — portal over the selected element.
 * Does not use contentEditable / does not mutate React HTML trees.
 */
export function InlineTextEditor() {
  const editingElementId = useEditorStore((s) => s.editingElementId);
  const config = useEditorStore((s) => s.config);
  const setElementField = useEditorStore((s) => s.setElementField);
  const setEditingElement = useEditorStore((s) => s.setEditingElement);
  const [draft, setDraft] = useState("");
  const [box, setBox] = useState<DOMRect | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const descriptor = editingElementId
    ? findElementDescriptor(editingElementId)
    : undefined;
  const field = descriptor?.inlineField ?? "text";

  useLayoutEffect(() => {
    if (!editingElementId) {
      setBox(null);
      return;
    }
    const el = document.querySelector<HTMLElement>(
      `[data-editable-element="${editingElementId}"]`,
    );
    if (!el) {
      setBox(null);
      return;
    }
    setBox(el.getBoundingClientRect());
    const fallback =
      (descriptor?.defaultValues?.[field] as string | undefined) ?? "";
    setDraft(resolveElementText(config, editingElementId, fallback, field));
  }, [editingElementId, config, descriptor, field]);

  useEffect(() => {
    if (!editingElementId) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editingElementId]);

  if (!editingElementId || !box) return null;

  function commit() {
    setElementField(editingElementId!, field, draft.trim());
    setEditingElement(null);
    window.dispatchEvent(new CustomEvent("builder:save"));
  }

  function cancel() {
    setEditingElement(null);
  }

  return createPortal(
    <div
      className="fixed z-[80]"
      style={{
        top: box.top,
        left: box.left,
        width: Math.max(box.width, 160),
        minHeight: box.height,
      }}
    >
      <textarea
        ref={inputRef}
        className="min-h-full w-full resize-none rounded-md border-2 border-sky-500 bg-white/95 p-2 text-[inherit] font-[inherit] leading-[inherit] text-[#0A2540] shadow-xl outline-none"
        style={{ minHeight: Math.max(box.height, 40) }}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit()}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            commit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
          }
        }}
        aria-label={`Edit ${descriptor?.displayName ?? editingElementId}`}
      />
    </div>,
    document.body,
  );
}

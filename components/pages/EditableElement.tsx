"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useRef,
} from "react";

import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";
import type { ElementKind } from "@/types/element-descriptor";
import type { PresentationConfig } from "@/types/presentation-config";

type EditableElementProps = {
  id: string;
  kind: ElementKind;
  /** Primary field for text / image src. */
  field?: string;
  defaultValue?: string;
  /** Optional full defaults for multi-field elements. */
  defaults?: Record<string, unknown>;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "a" | "button";
  children?:
    | ReactNode
    | ((ctx: {
        value: string;
        fields: Record<string, unknown>;
        mode: "public" | "editor";
      }) => ReactNode);
  /** When true, prevent navigation on links in editor mode. */
  disableNavigationInEditor?: boolean;
};

/**
 * Marks a handcrafted surface as canvas-editable.
 * Public: transparent. Editor: selection + inline edit via overlays (no HTML mutation).
 */
export function EditableElement({
  id,
  kind,
  field = "text",
  defaultValue = "",
  defaults,
  className,
  style,
  as: Tag = "div",
  children,
  disableNavigationInEditor = true,
}: EditableElementProps) {
  const { mode, config } = useStaticEditContext();
  const selectElement = useEditorStore((s) => s.selectElement);
  const hoverElement = useEditorStore((s) => s.hoverElement);
  const setEditingElement = useEditorStore((s) => s.setEditingElement);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const editingElementId = useEditorStore((s) => s.editingElementId);
  const ref = useRef<HTMLElement | null>(null);

  const fields = resolveFields(config, id, defaults);
  const isHidden = fields.hidden === true;
  const isEditor = mode === "editor";
  const selected = selectedElementId === id;
  const editing = editingElementId === id;

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (!isEditor) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(id);
    },
    [id, isEditor, selectElement],
  );

  const onDoubleClick = useCallback(
    (event: MouseEvent) => {
      if (!isEditor) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(id);
      if (kind === "heading" || kind === "paragraph" || kind === "badge" || kind === "button" || kind === "label" || kind === "caption" || kind === "statistic") {
        setEditingElement(id);
      }
    },
    [id, isEditor, kind, selectElement, setEditingElement],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEditor || event.key !== "Enter" || event.metaKey || event.ctrlKey)
        return;
      if (
        kind === "heading" ||
        kind === "paragraph" ||
        kind === "badge" ||
        kind === "button"
      ) {
        event.preventDefault();
        selectElement(id);
        setEditingElement(id);
      }
    },
    [id, isEditor, kind, selectElement, setEditingElement],
  );

  if (isHidden && mode === "public") {
    return null;
  }

  const value =
    kind === "image"
      ? String(
          resolveElementField(config, id, "src", defaultValue || defaults?.src || ""),
        )
      : resolveElementText(config, id, defaultValue, field);

  const content =
    typeof children === "function"
      ? children({ value, fields, mode })
      : children ?? value;

  if (!isEditor) {
    if (typeof children === "function") {
      // Keep a real wrapper when layout classes matter (e.g. absolute fill images).
      if (className || style || Tag !== "div") {
        return (
          <Tag className={className} style={style}>
            {content}
          </Tag>
        );
      }
      return <>{content}</>;
    }
    return (
      <Tag className={className} style={style}>
        {content}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      data-editable-element={id}
      data-editable-kind={kind}
      data-editable-field={field}
      data-editable-selected={selected ? "true" : undefined}
      data-editable-editing={editing ? "true" : undefined}
      className={cn(
        "relative outline-offset-2 transition-[outline-color]",
        selected && "outline outline-2 outline-sky-500",
        !selected && "hover:outline hover:outline-1 hover:outline-sky-300",
        isHidden && "opacity-40 outline outline-dashed outline-amber-400",
        className,
      )}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      onMouseEnter={() => hoverElement(id)}
      onMouseLeave={() => hoverElement(null)}
      onClickCapture={
        disableNavigationInEditor
          ? (event) => {
              if ((event.target as HTMLElement).closest("a")) {
                event.preventDefault();
              }
            }
          : undefined
      }
      tabIndex={0}
      role="button"
      aria-label={`Edit ${id}`}
    >
      {content}
    </Tag>
  );
}

function resolveFields(
  config: PresentationConfig | null,
  elementId: string,
  defaults?: Record<string, unknown>,
): Record<string, unknown> {
  const base = { ...(defaults ?? {}) };
  const override = config?.elementOverrides?.[elementId];
  if (!override) {
    // legacy via resolve helpers for known fields
    if (defaults) {
      for (const key of Object.keys(defaults)) {
        base[key] = resolveElementField(
          config,
          elementId,
          key,
          defaults[key],
        );
      }
    }
    return base;
  }
  return { ...base, ...override };
}

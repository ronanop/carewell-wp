"use client";

import { memo, useCallback, useState, type ReactNode } from "react";
import {
  Copy,
  EyeOff,
  GripVertical,
  Lock,
  Plus,
  Trash2,
  Unlock,
} from "lucide-react";

import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { createStudioContentNode } from "@/lib/experience/content/createStudioNode";
import {
  emptyContentOverrides,
  patchContentOverride,
} from "@/lib/experience/content/applyOverrides";
import { cn } from "@/lib/utils";
import type { ContentNode, ContentNodeType } from "@/types/content-ast";

const INSERT_TYPES: Array<{ type: ContentNodeType; label: string }> = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "list", label: "List" },
  { type: "quote", label: "Quote" },
  { type: "table", label: "Table" },
  { type: "button", label: "Button" },
  { type: "callout", label: "Callout" },
  { type: "divider", label: "Divider" },
  { type: "faq", label: "FAQ" },
];

/**
 * Editable overlay for a single content AST node inside Experience Studio.
 */
export const EditableContentNode = memo(function EditableContentNode({
  node,
  children,
}: {
  node: ContentNode;
  children: ReactNode;
}) {
  const selected = useEditorStore((s) => s.selectedContentId === node.id);
  const hovered = useEditorStore((s) => s.hoveredContentId === node.id);
  const editing = useEditorStore((s) => s.editingContentId === node.id);
  const selectContent = useEditorStore((s) => s.selectContent);
  const hoverContent = useEditorStore((s) => s.hoverContent);
  const setEditingContent = useEditorStore((s) => s.setEditingContent);
  const updateConfig = useEditorStore((s) => s.updateConfig);
  const [insertOpen, setInsertOpen] = useState(false);

  const isText =
    node.type === "heading" ||
    node.type === "paragraph" ||
    node.type === "quote" ||
    node.type === "button" ||
    node.type === "callout" ||
    node.type === "list-item";

  const patchNode = useCallback(
    (text: string) => {
      updateConfig((prev) => ({
        ...prev,
        contentOverrides: patchContentOverride(
          prev.contentOverrides ?? emptyContentOverrides(),
          node.id,
          { text },
        ),
      }));
    },
    [node.id, updateConfig],
  );

  const hideNode = useCallback(() => {
    updateConfig((prev) => ({
      ...prev,
      contentOverrides: patchContentOverride(
        prev.contentOverrides ?? emptyContentOverrides(),
        node.id,
        { hidden: true },
      ),
    }));
  }, [node.id, updateConfig]);

  const insertAfter = useCallback(
    (type: ContentNodeType) => {
      const fresh = createStudioContentNode(type);
      updateConfig((prev) => {
        const overrides = prev.contentOverrides ?? emptyContentOverrides();
        return {
          ...prev,
          contentOverrides: {
            ...overrides,
            insertions: [...overrides.insertions, fresh],
          },
        };
      });
      selectContent(fresh.id);
      setInsertOpen(false);
    },
    [selectContent, updateConfig],
  );

  return (
    <div
      data-content-node={node.id}
      data-content-type={node.type}
      className={cn(
        "group/content relative transition-[outline,box-shadow] duration-150",
        hovered &&
          !selected &&
          "outline outline-1 outline-violet-300/70 outline-offset-2",
        selected &&
          "outline outline-2 outline-violet-500 outline-offset-2 shadow-[0_0_0_4px_rgba(139,92,246,0.12)]",
      )}
      onMouseEnter={(event) => {
        event.stopPropagation();
        hoverContent(node.id);
      }}
      onMouseLeave={() => hoverContent(null)}
      onClick={(event) => {
        event.stopPropagation();
        selectContent(node.id);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        if (isText) setEditingContent(node.id);
      }}
    >
      {(selected || hovered) && (
        <div className="absolute -top-3 left-2 z-30 flex -translate-y-full items-center gap-0.5 rounded-lg border border-violet-200 bg-white/95 px-1 py-0.5 shadow-lg backdrop-blur">
          <span className="px-1.5 text-[0.625rem] font-semibold uppercase tracking-wide text-violet-700">
            {node.type}
          </span>
          <span className="cursor-grab px-1 text-muted-foreground">
            <GripVertical className="size-3" />
          </span>
          <Tool
            title="Duplicate"
            onClick={() => {
              updateConfig((prev) => {
                const overrides =
                  prev.contentOverrides ?? emptyContentOverrides();
                const copy = {
                  ...structuredClone(node),
                  id: `${node.id}-copy-${Date.now().toString(36)}`,
                  source: "studio" as const,
                };
                return {
                  ...prev,
                  contentOverrides: {
                    ...overrides,
                    insertions: [...overrides.insertions, copy],
                  },
                };
              });
            }}
            icon={Copy}
          />
          <Tool title="Hide" onClick={hideNode} icon={EyeOff} />
          <Tool
            title={node.metadata.locked ? "Unlock" : "Lock"}
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                contentOverrides: patchContentOverride(
                  prev.contentOverrides ?? emptyContentOverrides(),
                  node.id,
                  { locked: !node.metadata.locked },
                ),
              }))
            }
            icon={node.metadata.locked ? Unlock : Lock}
          />
          <Tool
            title="Delete"
            danger
            onClick={() => {
              if (node.source === "studio") {
                updateConfig((prev) => {
                  const overrides =
                    prev.contentOverrides ?? emptyContentOverrides();
                  return {
                    ...prev,
                    contentOverrides: {
                      ...overrides,
                      insertions: overrides.insertions.filter(
                        (item) => item.id !== node.id,
                      ),
                    },
                  };
                });
              } else {
                hideNode();
              }
              selectContent(null);
            }}
            icon={Trash2}
          />
        </div>
      )}

      {editing && isText ? (
        <EditableText
          initial={node.runs?.map((r) => r.text).join("") ?? ""}
          onCommit={(value) => {
            patchNode(value);
            setEditingContent(null);
          }}
          onCancel={() => setEditingContent(null)}
          asHeading={node.type === "heading" ? node.attributes.level : undefined}
        />
      ) : (
        children
      )}

      <div className="pointer-events-none absolute inset-x-0 -bottom-3 z-20 flex justify-center opacity-0 transition group-hover/content:pointer-events-auto group-hover/content:opacity-100">
        <div className="relative">
          <button
            type="button"
            className="flex size-6 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-600 shadow-md"
            onClick={(event) => {
              event.stopPropagation();
              setInsertOpen((open) => !open);
            }}
            title="Insert block"
          >
            <Plus className="size-3.5" />
          </button>
          {insertOpen ? (
            <div className="absolute left-1/2 top-8 z-40 w-44 -translate-x-1/2 rounded-xl border border-border bg-white p-1 shadow-xl">
              {INSERT_TYPES.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className="block w-full rounded-lg px-3 py-1.5 text-left text-[0.75rem] hover:bg-violet-50"
                  onClick={(event) => {
                    event.stopPropagation();
                    insertAfter(item.type);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

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
        "rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
        danger && "hover:bg-red-50 hover:text-red-600",
      )}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <Icon className="size-3" />
    </button>
  );
}

function EditableText({
  initial,
  onCommit,
  onCancel,
  asHeading,
}: {
  initial: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
  asHeading?: number;
}) {
  const [value, setValue] = useState(initial);
  const className = cn(
    "w-full resize-none border-0 bg-transparent p-0 outline-none ring-2 ring-violet-400 ring-offset-2",
    asHeading === 1 && "font-heading text-h1 font-semibold",
    asHeading === 2 && "font-heading text-h2 font-semibold",
    asHeading === 3 && "font-heading text-h3 font-semibold",
    !asHeading && "text-body",
  );

  return (
    <textarea
      autoFocus
      className={className}
      rows={Math.max(1, value.split("\n").length)}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => onCommit(value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
        if (event.key === "Enter" && !event.shiftKey && asHeading) {
          event.preventDefault();
          onCommit(value);
        }
      }}
    />
  );
}

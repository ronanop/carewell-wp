"use client";

import { useMemo } from "react";

import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import {
  applyContentOverrides,
  emptyContentOverrides,
  parseHtmlToAst,
  patchContentOverride,
} from "@/lib/experience/content";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { useBuilderMeta } from "@/components/admin/builder/BuilderProvider";
import type { ContentNode } from "@/types/content-ast";

/**
 * Inspector for a selected content AST node (heading, image, paragraph, …).
 */
export function ContentNodeInspector() {
  const { basePage } = useBuilderMeta();
  const selectedContentId = useEditorStore((s) => s.selectedContentId);
  const contentOverrides = useEditorStore((s) => s.config.contentOverrides);
  const updateConfig = useEditorStore((s) => s.updateConfig);

  const node = useMemo(() => {
    if (!selectedContentId) return null;
    const doc = applyContentOverrides(
      parseHtmlToAst(basePage.contentHtml),
      contentOverrides,
    );
    return findNode(doc.nodes, selectedContentId);
  }, [basePage.contentHtml, contentOverrides, selectedContentId]);

  if (!node) {
    return (
      <aside className="flex w-[15%] min-w-[240px] max-w-[300px] shrink-0 flex-col border-l border-border/80 bg-white/80 p-5 backdrop-blur-xl">
        <h2 className="font-heading text-small font-semibold text-foreground">
          Inspector
        </h2>
        <p className="mt-3 text-small text-muted-foreground">
          Select a content block on the canvas.
        </p>
      </aside>
    );
  }

  function patch(patch: Parameters<typeof patchContentOverride>[2]) {
    updateConfig((prev) => ({
      ...prev,
      contentOverrides: patchContentOverride(
        prev.contentOverrides ?? emptyContentOverrides(),
        node!.id,
        patch,
      ),
    }));
  }

  const text = node.runs?.map((r) => r.text).join("") ?? "";

  return (
    <aside className="flex w-[15%] min-w-[240px] max-w-[300px] shrink-0 flex-col border-l border-border/80 bg-white/80 backdrop-blur-xl">
      <div className="border-b border-border/80 px-5 py-4">
        <p className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
          Content node
        </p>
        <h2 className="mt-1 font-heading text-h4 font-semibold capitalize text-foreground">
          {node.type}
        </h2>
        <p className="mt-1 truncate text-[0.6875rem] text-muted-foreground">
          {node.source === "wordpress" ? "WordPress" : "Studio"} · {node.id}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
        <section className="space-y-3">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Content
          </h3>
          {node.type === "heading" ? (
            <label className="block space-y-1.5">
              <span className="text-[0.75rem] font-medium">Level</span>
              <select
                className={inputClass}
                value={node.attributes.level ?? 2}
                onChange={(event) =>
                  patch({
                    attributes: {
                      level: Number(event.target.value) as 1 | 2 | 3 | 4 | 5 | 6,
                    },
                  })
                }
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    H{level}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {["heading", "paragraph", "quote", "button", "callout", "list-item"].includes(
            node.type,
          ) ? (
            <label className="block space-y-1.5">
              <span className="text-[0.75rem] font-medium">Text</span>
              <textarea
                className={inputClass}
                rows={4}
                value={text}
                onChange={(event) => patch({ text: event.target.value })}
              />
              <p className="text-[0.6875rem] text-muted-foreground">
                Double-click the block on canvas for inline editing.
              </p>
            </label>
          ) : null}

          {node.type === "image" || node.type === "figure" ? (
            <>
              <MediaPickerField
                label="Replace image"
                value={
                  node.attributes.src
                    ? {
                        mediaId: 1,
                        title: node.attributes.title ?? "Image",
                        alt: node.attributes.alt ?? "",
                        mimeType: "image/jpeg",
                        sourceUrl: node.attributes.src,
                        width: node.attributes.width ?? null,
                        height: node.attributes.height ?? null,
                        lastSyncedAt: new Date().toISOString(),
                      }
                    : null
                }
                onChange={(ref) => {
                  if (!ref) return;
                  patch({
                    attributes: {
                      src: ref.sourceUrl,
                      alt: ref.alt,
                      title: ref.title,
                      width: ref.width,
                      height: ref.height,
                    },
                  });
                }}
              />
              <label className="block space-y-1.5">
                <span className="text-[0.75rem] font-medium">Alt text</span>
                <input
                  className={inputClass}
                  value={node.attributes.alt ?? ""}
                  onChange={(event) =>
                    patch({ attributes: { alt: event.target.value } })
                  }
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[0.75rem] font-medium">Object fit</span>
                <select
                  className={inputClass}
                  value={node.styles.objectFit ?? "cover"}
                  onChange={(event) =>
                    patch({
                      styles: {
                        objectFit: event.target.value as
                          | "cover"
                          | "contain"
                          | "fill"
                          | "none",
                      },
                    })
                  }
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                  <option value="none">None</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[0.75rem] font-medium">Radius</span>
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={node.styles.borderRadius ?? 0}
                  onChange={(event) =>
                    patch({
                      styles: { borderRadius: Number(event.target.value) },
                    })
                  }
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[0.75rem] font-medium">Opacity</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round((node.styles.opacity ?? 1) * 100)}
                  onChange={(event) =>
                    patch({
                      styles: { opacity: Number(event.target.value) / 100 },
                    })
                  }
                />
              </label>
            </>
          ) : null}

          {node.type === "button" ? (
            <>
              <label className="block space-y-1.5">
                <span className="text-[0.75rem] font-medium">Link</span>
                <input
                  className={inputClass}
                  value={node.attributes.href ?? ""}
                  onChange={(event) =>
                    patch({ attributes: { href: event.target.value } })
                  }
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[0.75rem] font-medium">Variant</span>
                <select
                  className={inputClass}
                  value={node.attributes.buttonVariant ?? "primary"}
                  onChange={(event) =>
                    patch({
                      attributes: {
                        buttonVariant: event.target.value as
                          | "primary"
                          | "secondary"
                          | "outline"
                          | "ghost",
                      },
                    })
                  }
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </label>
            </>
          ) : null}

          {node.type === "callout" ? (
            <label className="block space-y-1.5">
              <span className="text-[0.75rem] font-medium">Tone</span>
              <select
                className={inputClass}
                value={node.attributes.calloutTone ?? "info"}
                onChange={(event) =>
                  patch({
                    attributes: {
                      calloutTone: event.target.value as
                        | "tip"
                        | "warning"
                        | "success"
                        | "info"
                        | "danger",
                    },
                  })
                }
              >
                <option value="info">Info</option>
                <option value="tip">Tip</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="danger">Danger</option>
              </select>
            </label>
          ) : null}
        </section>

        <section className="space-y-3">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Layout
          </h3>
          <label className="block space-y-1.5">
            <span className="text-[0.75rem] font-medium">Alignment</span>
            <select
              className={inputClass}
              value={node.styles.textAlign ?? "left"}
              onChange={(event) =>
                patch({
                  styles: {
                    textAlign: event.target.value as
                      | "left"
                      | "center"
                      | "right"
                      | "justify",
                  },
                })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </label>
        </section>

        <section className="space-y-3">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Accessibility
          </h3>
          {node.type === "image" && !node.attributes.alt ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[0.75rem] text-amber-900">
              Missing alt text — add a description for screen readers.
            </p>
          ) : (
            <p className="text-[0.75rem] text-muted-foreground">
              No critical accessibility issues detected for this node.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Bindings
          </h3>
          <p className="text-[0.75rem] text-muted-foreground">
            Source: {node.source === "wordpress" ? "WordPress HTML" : "Studio insertion"}.
            Overrides are stored separately and never overwrite WordPress content.
          </p>
        </section>
      </div>
    </aside>
  );
}

function findNode(nodes: ContentNode[], id: string): ContentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = findNode(node.children, id);
    if (nested) return nested;
  }
  return null;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-small outline-none ring-ring focus:ring-2";

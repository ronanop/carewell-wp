"use client";

import { DescriptorPropField } from "@/lib/experience/descriptors/propertyRegistry";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import {
  findElementDescriptor,
  findRepeaterDescriptor,
} from "@/lib/experience/static-pages/elementRegistry";
import {
  getElementOverride,
  resolveElementField,
} from "@/lib/experience/static-pages/elementOverrides";
import {
  getElementBinding,
  setElementBinding,
  setResponsiveField,
} from "@/lib/experience/static-pages/repeaterOverrides";
import { ImageReplaceUpload } from "@/components/admin/media/ImageReplaceUpload";
import type { BindingMode, ResponsiveBreakpoint } from "@/types/repeater-descriptor";
import type { SectionPropSchema } from "@/types/static-page-descriptor";

/**
 * Auto-generated inspector for a selected editable element (ADR-016 / ADR-017).
 */
export function ElementInspector() {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const config = useEditorStore((s) => s.config);
  const device = useEditorStore((s) => s.device);
  const setElementField = useEditorStore((s) => s.setElementField);
  const setEditingElement = useEditorStore((s) => s.setEditingElement);
  const updateConfig = useEditorStore((s) => s.updateConfig);

  if (!selectedElementId) return null;

  const descriptor = findElementDescriptor(selectedElementId);
  const overrides = getElementOverride(config, selectedElementId);
  const binding = getElementBinding(config, selectedElementId);
  const breakpoint: ResponsiveBreakpoint =
    device === "mobile" ? "mobile" : device === "tablet" ? "tablet" : "desktop";
  const responsivePatch =
    config.elementResponsive?.[selectedElementId]?.[breakpoint] ?? {};

  const itemMatch = selectedElementId.match(/^(.*)\.item\.(\d+)\./);
  const repeater = itemMatch
    ? findRepeaterDescriptor(itemMatch[1])
    : findRepeaterDescriptor(selectedElementId);

  const groups = new Map<string, SectionPropSchema[]>();
  for (const field of descriptor?.fields ?? [
    {
      key: "text",
      label: "Text",
      type: "text" as const,
      group: "Content",
    },
  ]) {
    const group = field.group ?? "Content";
    const list = groups.get(group) ?? [];
    list.push({
      key: field.key,
      label: field.label,
      type:
        field.type === "link" || field.type === "image"
          ? field.type === "link"
            ? "url"
            : "image"
          : field.type === "textarea" || field.type === "text"
            ? field.type
            : field.type === "select"
              ? "select"
              : field.type === "boolean"
                ? "boolean"
                : field.type === "number" || field.type === "range"
                  ? "number"
                  : "text",
      group,
      options: field.options,
      description: field.description,
    });
    groups.set(group, list);
  }

  return (
    <aside className="flex w-[15%] min-w-[240px] max-w-[300px] shrink-0 flex-col border-l border-border/80 bg-white/80 backdrop-blur-xl">
      <div className="border-b border-border/80 px-5 py-4">
        <p className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
          Element
        </p>
        <h2 className="mt-1 font-heading text-h4 font-semibold text-foreground">
          {descriptor?.displayName ?? "Content"}
        </h2>
        <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
          {selectedElementId}
        </p>
        {descriptor?.supports.inlineEdit ? (
          <button
            type="button"
            className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-[0.75rem] font-medium text-sky-800"
            onClick={() => setEditingElement(selectedElementId)}
          >
            Edit inline
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
        {Array.from(groups.entries()).map(([group, fields]) => (
          <section key={group} className="space-y-3">
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </h3>
            {fields.map((schema) => {
              const value =
                overrides[schema.key] ??
                resolveElementField(
                  config,
                  selectedElementId,
                  schema.key,
                  descriptor?.defaultValues?.[schema.key],
                );
              return (
                <DescriptorPropField
                  key={schema.key}
                  schema={schema}
                  value={value}
                  onChange={(next) => {
                    setElementField(selectedElementId, schema.key, next);
                  }}
                />
              );
            })}
            {group === "Content" && descriptor?.kind === "image" ? (
              <ImageReplaceUpload
                currentSrc={String(
                  resolveElementField(
                    config,
                    selectedElementId,
                    "src",
                    String(descriptor.defaultValues?.src ?? ""),
                  ),
                )}
                elementId={selectedElementId}
                expectedSize={
                  typeof overrides.width === "number" &&
                  typeof overrides.height === "number"
                    ? {
                        width: overrides.width,
                        height: overrides.height,
                      }
                    : null
                }
                alt={String(
                  resolveElementField(
                    config,
                    selectedElementId,
                    "alt",
                    String(descriptor.defaultValues?.alt ?? ""),
                  ),
                )}
                onUploaded={(media) => {
                  setElementField(selectedElementId, "src", media.sourceUrl);
                  setElementField(
                    selectedElementId,
                    "alt",
                    media.alt || media.title,
                  );
                  setElementField(selectedElementId, "mediaId", media.mediaId);
                  if (media.width) {
                    setElementField(selectedElementId, "width", media.width);
                  }
                  if (media.height) {
                    setElementField(selectedElementId, "height", media.height);
                  }
                  window.dispatchEvent(new CustomEvent("builder:save"));
                }}
              />
            ) : null}
          </section>
        ))}

        <section className="space-y-3">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Bindings
          </h3>
          <label className="block text-small">
            <span className="font-medium text-foreground">Source mode</span>
            <select
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-small"
              value={binding.mode}
              onChange={(event) => {
                const mode = event.target.value as BindingMode;
                updateConfig((prev) =>
                  setElementBinding(prev, selectedElementId, {
                    ...binding,
                    mode,
                    source:
                      mode === "wordpress"
                        ? binding.source ??
                          descriptor?.bindingSources?.[0] ??
                          repeater?.bindingSources?.[0] ??
                          "wordpress.page.title"
                        : undefined,
                  }),
                );
              }}
            >
              <option value="static">Static override</option>
              <option value="wordpress">WordPress</option>
              <option value="api">API (future)</option>
              <option value="ai">AI (future)</option>
            </select>
          </label>
          {binding.mode === "wordpress" ? (
            <label className="block text-small">
              <span className="font-medium text-foreground">Binding source</span>
              <select
                className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-small"
                value={binding.source ?? ""}
                onChange={(event) => {
                  updateConfig((prev) =>
                    setElementBinding(prev, selectedElementId, {
                      mode: "wordpress",
                      source: event.target.value,
                    }),
                  );
                }}
              >
                {(
                  descriptor?.bindingSources ??
                  repeater?.bindingSources ?? [
                    "wordpress.page.title",
                    "wordpress.cpt.doctor",
                    "wordpress.cpt.service",
                    "wordpress.cpt.faq",
                    "wordpress.latestPosts",
                    "wordpress.media.category",
                  ]
                ).map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="text-[0.75rem] text-muted-foreground">
              Using handcrafted defaults + presentation overrides.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
            Responsive ({breakpoint})
          </h3>
          <p className="text-[0.75rem] text-muted-foreground">
            Edits below apply to the current toolbar device (
            {breakpoint}). Desktop values remain the base.
          </p>
          {(descriptor?.fields ?? []).slice(0, 3).map((field) => (
            <DescriptorPropField
              key={`responsive-${field.key}`}
              schema={{
                key: field.key,
                label: `${field.label} (${breakpoint})`,
                type:
                  field.type === "textarea"
                    ? "textarea"
                    : field.type === "number"
                      ? "number"
                      : "text",
                group: "Responsive",
              }}
              value={responsivePatch[field.key]}
              onChange={(next) => {
                updateConfig((prev) =>
                  setResponsiveField(
                    prev,
                    selectedElementId,
                    breakpoint,
                    field.key,
                    next,
                  ),
                );
              }}
            />
          ))}
        </section>

        {repeater ? (
          <section className="space-y-2">
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
              Repeater
            </h3>
            <p className="text-[0.75rem] text-muted-foreground">
              {repeater.displayName} — use the floating toolbar to add,
              duplicate, hide, or delete items.
            </p>
          </section>
        ) : null}
      </div>
    </aside>
  );
}

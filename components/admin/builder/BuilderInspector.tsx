"use client";

import type { ReactNode } from "react";

import { ContentNodeInspector } from "@/components/admin/builder/ContentNodeInspector";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import type {
  PresentationConfig,
  SectionConfig,
} from "@/types/presentation-config";

/**
 * Inspector — content node when selected, otherwise section properties.
 */
export function BuilderInspector() {
  const selectedContentId = useEditorStore((s) => s.selectedContentId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const sections = useEditorStore((s) => s.config.sections);
  const hero = useEditorStore((s) => s.config.hero);
  const updateConfig = useEditorStore((s) => s.updateConfig);

  if (selectedContentId) {
    return <ContentNodeInspector />;
  }

  const selected = sections.find((section) => section.id === selectedIds[0]);

  if (!selected) {
    return (
      <aside className="flex w-[15%] min-w-[240px] max-w-[300px] shrink-0 flex-col border-l border-border/80 bg-white/80 p-5 backdrop-blur-xl">
        <h2 className="font-heading text-small font-semibold text-foreground">
          Inspector
        </h2>
        <p className="mt-3 text-small text-muted-foreground">
          Select a section or any content block on the canvas to edit it.
        </p>
      </aside>
    );
  }

  const selectedSection = selected;

  function patchSection(
    patch:
      | Partial<SectionConfig>
      | ((section: SectionConfig) => SectionConfig),
  ) {
    const selectedId = selectedSection.id;
    updateConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== selectedId) return section;
        return typeof patch === "function"
          ? patch(section)
          : { ...section, ...patch };
      }),
    }));
  }

  function patchHero(patch: Partial<PresentationConfig["hero"]>) {
    updateConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...patch },
    }));
  }

  return (
    <aside className="flex w-[15%] min-w-[240px] max-w-[300px] shrink-0 flex-col border-l border-border/80 bg-white/80 backdrop-blur-xl">
      <div className="border-b border-border/80 px-5 py-4">
        <p className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
          Inspector
        </p>
        <h2 className="mt-1 font-heading text-h4 font-semibold capitalize text-foreground">
          {selected.type}
        </h2>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
        <Group title="Content">
          <Field label="Enabled">
            <Toggle
              checked={selected.enabled}
              onChange={(enabled) => patchSection({ enabled })}
            />
          </Field>
          <Field label="Heading">
            <input
              className={inputClass}
              value={selected.settings.heading ?? ""}
              onChange={(event) =>
                patchSection({
                  settings: {
                    ...selected.settings,
                    heading: event.target.value || null,
                  },
                })
              }
              placeholder="Optional override"
            />
          </Field>
          <Field label="Supporting text">
            <textarea
              className={inputClass}
              rows={3}
              value={selected.settings.supportingText ?? ""}
              onChange={(event) =>
                patchSection({
                  settings: {
                    ...selected.settings,
                    supportingText: event.target.value || null,
                  },
                })
              }
            />
          </Field>
        </Group>

        <Group title="Appearance">
          <Field label="Background">
            <select
              className={inputClass}
              value={selected.background}
              onChange={(event) =>
                patchSection({
                  background: event.target
                    .value as SectionConfig["background"],
                })
              }
            >
              <option value="none">None</option>
              <option value="muted">Muted</option>
              <option value="surface">Surface</option>
              <option value="tint">Tint</option>
            </select>
          </Field>
          <Field label="Animation">
            <select
              className={inputClass}
              value={selected.animation}
              onChange={(event) =>
                patchSection({
                  animation: event.target
                    .value as SectionConfig["animation"],
                })
              }
            >
              <option value="inherit">Inherit</option>
              <option value="none">None</option>
              <option value="fade">Fade</option>
              <option value="rise">Rise</option>
            </select>
          </Field>
        </Group>

        <Group title="Layout">
          <Field label="Spacing">
            <select
              className={inputClass}
              value={selected.spacing}
              onChange={(event) =>
                patchSection({
                  spacing: event.target.value as SectionConfig["spacing"],
                })
              }
            >
              <option value="compact">Compact</option>
              <option value="default">Default</option>
              <option value="spacious">Spacious</option>
            </select>
          </Field>
          <Field label="Visibility">
            <select
              className={inputClass}
              value={selected.visibility}
              onChange={(event) =>
                patchSection({
                  visibility: event.target
                    .value as SectionConfig["visibility"],
                })
              }
            >
              <option value="always">Always</option>
              <option value="desktop">Desktop only</option>
              <option value="mobile">Mobile only</option>
            </select>
          </Field>
        </Group>

        {selected.type === "hero" ? (
          <Group title="Hero">
            <Field label="Variant">
              <select
                className={inputClass}
                value={hero.variant}
                onChange={(event) =>
                  patchHero({
                    variant: event.target
                      .value as PresentationConfig["hero"]["variant"],
                  })
                }
              >
                <option value="premium">Premium</option>
                <option value="editorial">Editorial</option>
                <option value="minimal">Minimal</option>
              </select>
            </Field>
            <Field label="Height">
              <select
                className={inputClass}
                value={hero.height}
                onChange={(event) =>
                  patchHero({
                    height: event.target
                      .value as PresentationConfig["hero"]["height"],
                  })
                }
              >
                <option value="compact">Compact</option>
                <option value="default">Default</option>
                <option value="tall">Tall</option>
              </select>
            </Field>
            <Field label="Image source">
              <select
                className={inputClass}
                value={hero.imageSource}
                onChange={(event) =>
                  patchHero({
                    imageSource: event.target
                      .value as PresentationConfig["hero"]["imageSource"],
                  })
                }
              >
                <option value="featured">Featured image</option>
                <option value="wordpress-media">WordPress media</option>
                <option value="none">None</option>
              </select>
            </Field>
            {hero.imageSource === "wordpress-media" ? (
              <Field label="Hero image">
                <MediaPickerField
                  label="Hero image"
                  value={hero.media}
                  onChange={(media) => patchHero({ media })}
                />
              </Field>
            ) : null}
            <Field label="Overlay strength">
              <input
                type="range"
                min={0}
                max={90}
                value={hero.overlayStrength}
                onChange={(event) =>
                  patchHero({ overlayStrength: Number(event.target.value) })
                }
              />
            </Field>
          </Group>
        ) : null}

        {selected.type === "doctor" ? (
          <Group title="Doctor">
            <Field label="Photo">
              <MediaPickerField
                label="Doctor photo"
                value={selected.settings.doctorPhoto}
                onChange={(doctorPhoto) =>
                  patchSection({
                    settings: { ...selected.settings, doctorPhoto },
                  })
                }
              />
            </Field>
          </Group>
        ) : null}

        {selected.type === "gallery" ? (
          <Group title="Gallery">
            <MediaPickerField
              label="Add image"
              value={null}
              onChange={(media) => {
                if (!media) return;
                if (
                  selected.settings.gallery.some(
                    (item) => item.mediaId === media.mediaId,
                  )
                ) {
                  return;
                }
                patchSection({
                  settings: {
                    ...selected.settings,
                    gallery: [...selected.settings.gallery, media],
                  },
                });
              }}
            />
            <ul className="space-y-2">
              {selected.settings.gallery.map((item) => (
                <li
                  key={item.mediaId}
                  className="flex items-center justify-between rounded-lg border border-border px-2 py-1.5 text-[0.75rem]"
                >
                  <span className="truncate">{item.title || item.alt}</span>
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() =>
                      patchSection({
                        settings: {
                          ...selected.settings,
                          gallery: selected.settings.gallery.filter(
                            (g) => g.mediaId !== item.mediaId,
                          ),
                        },
                      })
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </Group>
        ) : null}

        <Group title="Bindings">
          <p className="text-[0.75rem] text-muted-foreground">
            Live binding picker expands in the next milestone. Content currently
            resolves through the existing Binding Engine on publish.
          </p>
        </Group>

        <Group title="Responsive">
          <p className="text-[0.75rem] text-muted-foreground">
            Use the toolbar device switcher to resize the live canvas. Per-breakpoint
            overrides land next.
          </p>
        </Group>
      </div>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[0.75rem] font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`relative h-6 w-10 rounded-full transition ${
        checked ? "bg-sky-500" : "bg-muted"
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${
          checked ? "left-4" : "left-0.5"
        }`}
      />
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-small outline-none ring-ring focus:ring-2";

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Loader2,
  Save,
} from "lucide-react";

import { useAdminToast } from "@/components/admin/AdminToast";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { LivePreviewCard } from "@/components/admin/page-studio/LivePreviewCard";
import {
  PresentationStatusBadge,
  WpStatusBadge,
} from "@/components/admin/pages/PresentationStatusBadge";
import { Button } from "@/components/ui/button";
import { savePagePresentationAction } from "@/lib/experience/actions/pageActions";
import type { PresentationBadge } from "@/lib/experience/pages/pageList";
import { presentationConfigSchema } from "@/lib/experience/validations/presentationConfig";
import { cn } from "@/lib/utils";
import type {
  PresentationConfig,
  SectionConfig,
} from "@/types/presentation-config";

type TemplateOption = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type PlatformCatalog = {
  packs: string[];
  blockCount: number;
  categories: string[];
  blocks: Array<{
    id: string;
    name: string;
    category: string;
    packId: string;
    version: string;
    acceptsChildren: boolean;
  }>;
};

type PageStudioProps = {
  pageId: string;
  title: string;
  uri: string;
  wpStatus: string;
  featuredImageUrl: string | null;
  badges: PresentationBadge[];
  templates: TemplateOption[];
  initialConfig: PresentationConfig;
  platformCatalog: PlatformCatalog;
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  trust: "Trust",
  content: "Content",
  gallery: "Gallery",
  doctor: "Doctor",
  pricing: "Pricing",
  timeline: "Timeline",
  faq: "FAQ",
  location: "Location",
  "related-treatments": "Related Treatments",
  "related-blogs": "Related Blogs",
  testimonials: "Testimonials",
  cta: "CTA",
};

export function PageStudio({
  pageId,
  title,
  uri,
  wpStatus,
  featuredImageUrl,
  badges,
  templates,
  initialConfig,
  platformCatalog,
}: PageStudioProps) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [config, setConfig] = useState<PresentationConfig>(initialConfig);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(initialConfig),
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [saving, setSaving] = useState<"draft" | "publish" | "autosave" | null>(
    null,
  );
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(config) !== savedSnapshot,
    [config, savedSnapshot],
  );

  const selectedTemplate = templates.find(
    (template) => template.slug === config.templateSlug,
  );

  const heroPreviewUrl =
    config.hero.imageSource === "none"
      ? null
      : config.hero.imageSource === "featured"
        ? featuredImageUrl
        : config.hero.media?.sourceUrl ?? null;

  const patch = useCallback(
    <K extends keyof PresentationConfig>(
      key: K,
      value: PresentationConfig[K],
    ) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const patchHero = useCallback(
    <K extends keyof PresentationConfig["hero"]>(
      key: K,
      value: PresentationConfig["hero"][K],
    ) => {
      setConfig((prev) => ({
        ...prev,
        hero: { ...prev.hero, [key]: value },
      }));
    },
    [],
  );

  const persist = useCallback(
    async (publish: boolean, mode: "draft" | "publish" | "autosave") => {
      const parsed = presentationConfigSchema.safeParse(config);
      if (!parsed.success) {
        toast(parsed.error.issues[0]?.message ?? "Invalid configuration", "error");
        return;
      }

      setSaving(mode);
      try {
        const result = await savePagePresentationAction({
          pageId,
          data: parsed.data,
          publish,
        });
        if (result.ok) {
          setSavedSnapshot(JSON.stringify(parsed.data));
          setLastSavedAt(new Date());
          if (mode !== "autosave") {
            toast(result.message, "success");
          }
          startTransition(() => router.refresh());
        } else {
          toast(result.message, "error");
        }
      } catch {
        toast("Save failed", "error");
      } finally {
        setSaving(null);
      }
    },
    [config, pageId, router, toast],
  );

  // Autosave drafts when dirty.
  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => {
      void persist(false, "autosave");
    }, 20000);
    return () => window.clearTimeout(timer);
  }, [dirty, persist]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (event.shiftKey) {
          void persist(true, "publish");
        } else {
          void persist(false, "draft");
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [persist]);

  function updateSection(id: string, next: Partial<SectionConfig>) {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === id ? { ...section, ...next } : section,
      ),
    }));
  }

  const busy = saving !== null || isPending;

  return (
    <div className="space-y-6 pb-28">
      <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-small text-muted-foreground"
          >
            <Link href="/admin/pages" className="hover:text-foreground hover:underline">
              WordPress Page
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="truncate font-medium text-foreground">{title}</span>
          </nav>
          <div>
            <h1 className="font-heading text-h2 font-semibold tracking-tight text-foreground">
              Page Studio
            </h1>
            <p className="mt-1 truncate font-mono text-small text-muted-foreground">
              {uri}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <WpStatusBadge status={wpStatus} />
            {badges.map((badge) => (
              <PresentationStatusBadge key={badge} badge={badge} />
            ))}
            {dirty ? (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[0.6875rem] font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                Unsaved changes
              </span>
            ) : (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[0.6875rem] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                {lastSavedAt
                  ? `Saved ${lastSavedAt.toLocaleTimeString()}`
                  : "Up to date"}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)]">
        <div className="space-y-5">
          <StudioSection title="Template" description="Choose how this page is framed.">
            <Field label="Template">
              <select
                className={fieldClass}
                value={config.templateSlug ?? ""}
                onChange={(event) =>
                  patch("templateSlug", event.target.value || null)
                }
              >
                <option value="">Select template…</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.slug}>
                    {template.name}
                  </option>
                ))}
              </select>
            </Field>
            {selectedTemplate ? (
              <p className="mt-3 text-small text-muted-foreground">
                {selectedTemplate.description}
              </p>
            ) : null}
          </StudioSection>

          <StudioSection title="Hero" description="First impression presentation.">
            <Toggle
              label="Enable Hero"
              checked={config.hero.enabled}
              onChange={(value) => patchHero("enabled", value)}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Variant"
                value={config.hero.variant}
                onChange={(value) =>
                  patchHero("variant", value as PresentationConfig["hero"]["variant"])
                }
                options={[
                  ["premium", "Premium"],
                  ["editorial", "Editorial"],
                  ["minimal", "Minimal"],
                ]}
              />
              <SelectField
                label="Image Source"
                value={config.hero.imageSource}
                onChange={(value) => {
                  const imageSource =
                    value as PresentationConfig["hero"]["imageSource"];
                  setConfig((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      imageSource,
                      media:
                        imageSource === "wordpress-media" ? prev.hero.media : null,
                    },
                  }));
                }}
                options={[
                  ["featured", "WordPress Featured Image"],
                  ["wordpress-media", "WordPress Media"],
                  ["none", "No Hero Image"],
                ]}
              />
              <SelectField
                label="Height"
                value={config.hero.height}
                onChange={(value) =>
                  patchHero("height", value as PresentationConfig["hero"]["height"])
                }
                options={[
                  ["compact", "Compact"],
                  ["default", "Default"],
                  ["tall", "Tall"],
                ]}
              />
              <SelectField
                label="Heading Alignment"
                value={config.hero.headingAlignment}
                onChange={(value) =>
                  patchHero(
                    "headingAlignment",
                    value as PresentationConfig["hero"]["headingAlignment"],
                  )
                }
                options={[
                  ["left", "Left"],
                  ["center", "Center"],
                  ["right", "Right"],
                ]}
              />
            </div>

            {config.hero.imageSource === "wordpress-media" ? (
              <div className="mt-4">
                <MediaPickerField
                  label="Hero image"
                  value={config.hero.media}
                  onChange={(media) => patchHero("media", media)}
                />
              </div>
            ) : null}

            <div className="mt-4">
              <Field
                label={`Overlay Strength (${config.hero.overlayStrength}%)`}
              >
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={config.hero.overlayStrength}
                  onChange={(event) =>
                    patchHero("overlayStrength", Number(event.target.value))
                  }
                  className="w-full"
                />
              </Field>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Show Trust Badges"
                checked={config.hero.showTrustBadges}
                onChange={(value) => patchHero("showTrustBadges", value)}
              />
              <Toggle
                label="Show CTA"
                checked={config.hero.showCta}
                onChange={(value) => patchHero("showCta", value)}
              />
            </div>
          </StudioSection>

          <StudioSection title="Breadcrumb & Navigation">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Breadcrumb"
                value={config.navigation.breadcrumbStyle}
                onChange={(value) =>
                  patch("navigation", {
                    ...config.navigation,
                    breadcrumbStyle:
                      value as PresentationConfig["navigation"]["breadcrumbStyle"],
                  })
                }
                options={[
                  ["light", "Light"],
                  ["dark", "Dark"],
                  ["transparent", "Transparent"],
                  ["hidden", "Hidden"],
                ]}
              />
              <Toggle
                label="Sticky CTA"
                checked={config.navigation.stickyCta}
                onChange={(value) =>
                  patch("navigation", {
                    ...config.navigation,
                    stickyCta: value,
                  })
                }
              />
              <Toggle
                label="Sticky Mobile CTA"
                checked={config.navigation.stickyMobileCta}
                onChange={(value) =>
                  patch("navigation", {
                    ...config.navigation,
                    stickyMobileCta: value,
                  })
                }
              />
              <Toggle
                label="Enable WhatsApp"
                checked={config.navigation.enableWhatsApp}
                onChange={(value) =>
                  patch("navigation", {
                    ...config.navigation,
                    enableWhatsApp: value,
                  })
                }
              />
              <Toggle
                label="Enable Call"
                checked={config.navigation.enableCall}
                onChange={(value) =>
                  patch("navigation", {
                    ...config.navigation,
                    enableCall: value,
                  })
                }
              />
            </div>
          </StudioSection>

          <StudioSection
            title="Content Presentation"
            description="Visual presets — WordPress HTML is never edited."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <PresetCards
                label="Reading Width"
                value={config.content.readingWidth}
                options={[
                  ["landing", "Landing"],
                  ["editorial", "Editorial"],
                  ["article", "Article"],
                  ["wide", "Wide"],
                ]}
                onChange={(value) =>
                  patch("content", {
                    ...config.content,
                    readingWidth:
                      value as PresentationConfig["content"]["readingWidth"],
                  })
                }
              />
              <PresetCards
                label="Animations"
                value={config.animation.preset}
                options={[
                  ["calm", "Calm"],
                  ["premium", "Premium"],
                  ["editorial", "Editorial"],
                  ["luxury", "Luxury"],
                  ["minimal", "Minimal"],
                ]}
                onChange={(value) =>
                  patch("animation", {
                    ...config.animation,
                    preset: value as PresentationConfig["animation"]["preset"],
                  })
                }
              />
              <PresetCards
                label="Buttons"
                value={config.content.buttonStyle}
                options={[
                  ["primary", "Primary"],
                  ["secondary", "Secondary"],
                  ["soft", "Soft"],
                  ["outline", "Outline"],
                ]}
                onChange={(value) =>
                  patch("content", {
                    ...config.content,
                    buttonStyle:
                      value as PresentationConfig["content"]["buttonStyle"],
                  })
                }
              />
              <PresetCards
                label="Images"
                value={config.content.imageStyle}
                options={[
                  ["rounded", "Rounded"],
                  ["shadow", "Shadow"],
                  ["editorial", "Editorial"],
                  ["borderless", "Borderless"],
                ]}
                onChange={(value) =>
                  patch("content", {
                    ...config.content,
                    imageStyle:
                      value as PresentationConfig["content"]["imageStyle"],
                  })
                }
              />
              <PresetCards
                label="Tables"
                value={config.content.tableStyle}
                options={[
                  ["minimal", "Minimal"],
                  ["card", "Card"],
                  ["professional", "Professional"],
                ]}
                onChange={(value) =>
                  patch("content", {
                    ...config.content,
                    tableStyle:
                      value as PresentationConfig["content"]["tableStyle"],
                  })
                }
              />
              <SelectField
                label="Theme"
                value={config.theme.variant}
                onChange={(value) =>
                  patch("theme", {
                    variant: value as PresentationConfig["theme"]["variant"],
                  })
                }
                options={[
                  ["medical", "Medical"],
                  ["minimal", "Minimal"],
                  ["warm", "Warm"],
                  ["editorial", "Editorial"],
                ]}
              />
            </div>
          </StudioSection>

          <StudioSection
            title="Section Builder"
            description="Enable, configure, and drag to reorder. Frontend renders in this order."
          >
            <Reorder.Group
              axis="y"
              values={config.sections}
              onReorder={(sections) => patch("sections", sections)}
              className="space-y-3"
            >
              {config.sections.map((section) => {
                const isOpen = expanded[section.id] ?? false;
                return (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    className="rounded-xl border border-border bg-background"
                  >
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <span className="cursor-grab text-muted-foreground active:cursor-grabbing">
                        <GripVertical className="size-4" />
                      </span>
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [section.id]: !isOpen,
                          }))
                        }
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 shrink-0 text-muted-foreground transition-transform",
                            !isOpen && "-rotate-90",
                          )}
                        />
                        <span className="truncate text-small font-medium text-foreground">
                          {SECTION_LABELS[section.type] ?? section.type}
                        </span>
                      </button>
                      <Toggle
                        label="Enable"
                        checked={section.enabled}
                        onChange={(value) =>
                          updateSection(section.id, { enabled: value })
                        }
                        compact
                      />
                    </div>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="space-y-3 border-t border-border px-3 py-3"
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Variant">
                            <input
                              className={fieldClass}
                              value={section.variant}
                              onChange={(event) =>
                                updateSection(section.id, {
                                  variant: event.target.value,
                                })
                              }
                            />
                          </Field>
                          <SelectField
                            label="Spacing"
                            value={section.spacing}
                            onChange={(value) =>
                              updateSection(section.id, {
                                spacing:
                                  value as SectionConfig["spacing"],
                              })
                            }
                            options={[
                              ["compact", "Compact"],
                              ["default", "Default"],
                              ["spacious", "Spacious"],
                            ]}
                          />
                          <SelectField
                            label="Background"
                            value={section.background}
                            onChange={(value) =>
                              updateSection(section.id, {
                                background:
                                  value as SectionConfig["background"],
                              })
                            }
                            options={[
                              ["none", "None"],
                              ["muted", "Muted"],
                              ["surface", "Surface"],
                              ["tint", "Tint"],
                            ]}
                          />
                          <SelectField
                            label="Animation"
                            value={section.animation}
                            onChange={(value) =>
                              updateSection(section.id, {
                                animation:
                                  value as SectionConfig["animation"],
                              })
                            }
                            options={[
                              ["inherit", "Inherit"],
                              ["none", "None"],
                              ["fade", "Fade"],
                              ["rise", "Rise"],
                            ]}
                          />
                          <SelectField
                            label="Visibility"
                            value={section.visibility}
                            onChange={(value) =>
                              updateSection(section.id, {
                                visibility:
                                  value as SectionConfig["visibility"],
                              })
                            }
                            options={[
                              ["always", "Always"],
                              ["desktop", "Desktop"],
                              ["mobile", "Mobile"],
                            ]}
                          />
                        </div>

                        {section.type === "doctor" ? (
                          <MediaPickerField
                            label="Doctor photo"
                            value={section.settings.doctorPhoto}
                            onChange={(media) =>
                              updateSection(section.id, {
                                settings: {
                                  ...section.settings,
                                  doctorPhoto: media,
                                },
                              })
                            }
                          />
                        ) : null}

                        {section.type === "gallery" ? (
                          <div className="space-y-2">
                            <p className="text-[0.75rem] font-medium text-foreground">
                              Gallery images
                            </p>
                            <p className="text-[0.6875rem] text-muted-foreground">
                              Select WordPress media. Stored as mediaId + snapshot.
                            </p>
                            <MediaPickerField
                              label="Add gallery image"
                              value={null}
                              onChange={(media) => {
                                if (!media) return;
                                const existing = section.settings.gallery;
                                if (
                                  existing.some(
                                    (item) => item.mediaId === media.mediaId,
                                  )
                                ) {
                                  return;
                                }
                                updateSection(section.id, {
                                  settings: {
                                    ...section.settings,
                                    gallery: [...existing, media],
                                  },
                                });
                              }}
                            />
                            {section.settings.gallery.length > 0 ? (
                              <ul className="flex flex-wrap gap-2">
                                {section.settings.gallery.map((item) => (
                                  <li
                                    key={item.mediaId}
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-2 py-1 text-[0.6875rem]"
                                  >
                                    #{item.mediaId}
                                    {item.missing ? " · missing" : ""}
                                    <button
                                      type="button"
                                      className="text-muted-foreground hover:text-foreground"
                                      onClick={() =>
                                        updateSection(section.id, {
                                          settings: {
                                            ...section.settings,
                                            gallery:
                                              section.settings.gallery.filter(
                                                (entry) =>
                                                  entry.mediaId !== item.mediaId,
                                              ),
                                          },
                                        })
                                      }
                                    >
                                      ×
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </StudioSection>

          <StudioSection
            title="SEO Overrides"
            description="Never replaces Yoast — optional overrides only."
          >
            <MediaPickerField
              label="OpenGraph Image"
              value={config.seo.ogImage}
              onChange={(media) =>
                patch("seo", {
                  ...config.seo,
                  ogImage: media,
                })
              }
            />
            <div className="mt-4 grid gap-4">
              <Field label="Canonical Override">
                <input
                  className={fieldClass}
                  value={config.seo.canonicalOverride ?? ""}
                  onChange={(event) =>
                    patch("seo", {
                      ...config.seo,
                      canonicalOverride: event.target.value || null,
                    })
                  }
                />
              </Field>
              <Toggle
                label="Schema Enabled"
                checked={config.seo.schemaEnabled}
                onChange={(value) =>
                  patch("seo", { ...config.seo, schemaEnabled: value })
                }
              />
            </div>
          </StudioSection>

          <StudioSection
            title="Platform"
            description="Plugin SDK discovery — blocks register dynamically. Page Studio will bind inspectors to these packs in Phase 2."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                <p className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
                  Packs
                </p>
                <p className="mt-1 font-heading text-h4 font-semibold text-foreground">
                  {platformCatalog.packs.length}
                </p>
                <p className="mt-1 text-[0.75rem] text-muted-foreground">
                  {platformCatalog.packs.join(", ") || "—"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                <p className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
                  Blocks
                </p>
                <p className="mt-1 font-heading text-h4 font-semibold text-foreground">
                  {platformCatalog.blockCount}
                </p>
                <p className="mt-1 text-[0.75rem] text-muted-foreground">
                  Marketplace-ready manifests
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                <p className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
                  Categories
                </p>
                <p className="mt-1 font-heading text-h4 font-semibold text-foreground">
                  {platformCatalog.categories.length}
                </p>
                <p className="mt-1 text-[0.75rem] text-muted-foreground">
                  {platformCatalog.categories.slice(0, 4).join(", ")}
                  {platformCatalog.categories.length > 4 ? "…" : ""}
                </p>
              </div>
            </div>
            <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto rounded-xl border border-border p-3 text-[0.75rem]">
              {platformCatalog.blocks.map((block) => (
                <li
                  key={block.id}
                  className="flex items-center justify-between gap-2 py-1 text-muted-foreground"
                >
                  <span className="truncate text-foreground">{block.name}</span>
                  <span className="shrink-0 font-mono">
                    {block.packId}@{block.version}
                  </span>
                </li>
              ))}
            </ul>
          </StudioSection>

          <StudioSection title="Advanced">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Custom CSS Class" className="sm:col-span-2">
                <input
                  className={fieldClass}
                  value={config.advanced.customCssClass ?? ""}
                  onChange={(event) =>
                    patch("advanced", {
                      ...config.advanced,
                      customCssClass: event.target.value || null,
                    })
                  }
                />
              </Field>
              <Field label="Cache Tag">
                <input
                  className={fieldClass}
                  value={config.advanced.cacheTag ?? ""}
                  onChange={(event) =>
                    patch("advanced", {
                      ...config.advanced,
                      cacheTag: event.target.value || null,
                    })
                  }
                />
              </Field>
              <Field
                label={`Animation Delay (${config.animation.delayMs}ms)`}
              >
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={config.animation.delayMs}
                  onChange={(event) =>
                    patch("animation", {
                      ...config.animation,
                      delayMs: Number(event.target.value),
                    })
                  }
                  className="w-full"
                />
              </Field>
              <Field label="Notes" className="sm:col-span-2">
                <textarea
                  className={cn(fieldClass, "min-h-24 py-2")}
                  value={config.advanced.notes ?? ""}
                  onChange={(event) =>
                    patch("advanced", {
                      ...config.advanced,
                      notes: event.target.value || null,
                    })
                  }
                />
              </Field>
            </div>
          </StudioSection>
        </div>

        <div className="space-y-3 xl:sticky xl:top-24 xl:self-start">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-small font-semibold text-foreground">
              Live Preview
            </h2>
            <div className="flex rounded-lg border border-border p-1">
              {(
                [
                  ["desktop", "Desk"],
                  ["tablet", "Tab"],
                  ["mobile", "Mob"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDevice(value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[0.6875rem] font-medium",
                    device === value
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <LivePreviewCard
            title={title}
            uri={uri}
            config={config}
            heroPreviewUrl={heroPreviewUrl}
            device={device}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <p className="text-[0.75rem] text-muted-foreground">
            {dirty
              ? "Unsaved changes · ⌘/Ctrl+S draft · ⌘/Ctrl+Shift+S publish"
              : "All changes saved"}
            {saving === "autosave" ? " · Autosaving…" : null}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => persist(false, "draft")}
            >
              {saving === "draft" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save Draft
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={() => persist(true, "publish")}
            >
              {saving === "publish" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : null}
              Publish Presentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const fieldClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-small outline-none ring-ring focus:ring-2";

function StudioSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="font-heading text-h4 font-semibold text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-small text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-[0.75rem] font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <Field label={label}>
      <select
        className={fieldClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([optionValue, text]) => (
          <option key={optionValue} value={optionValue}>
            {text}
          </option>
        ))}
      </select>
    </Field>
  );
}

function PresetCards({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <p className="text-[0.75rem] font-medium text-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map(([optionValue, text]) => (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cn(
              "rounded-xl border px-3 py-3 text-left text-small transition-colors",
              value === optionValue
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/30",
            )}
          >
            <span className="font-medium text-foreground">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  compact = false,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-3 text-left",
        compact
          ? "gap-2"
          : "w-full justify-between rounded-xl border border-border bg-background px-3 py-2.5 hover:bg-muted/40",
      )}
    >
      {!compact ? (
        <span className="text-small font-medium text-foreground">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
      <span
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  resetMegaMenuAction,
  saveMegaMenuAction,
  uploadMegaMenuImageAction,
} from "@/lib/navigation/megaMenuActions";
import {
  MEGA_MENU_PANEL_DISPLAY,
  MEGA_MENU_PANEL_IMAGE_SIZE,
} from "@/lib/navigation/megaMenuImage";
import { resizeFileToExactSize } from "@/lib/media/resizeImageToExactSize";
import type { MegaServiceCategory } from "@/lib/navigation/services-mega-menu";
import { cn } from "@/lib/utils";

type Props = {
  initialCategories: MegaServiceCategory[];
  canEdit: boolean;
};

export function MegaMenuAdminEditor({ initialCategories, canEdit }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateCategoryHref(categoryIndex: number, href: string) {
    setCategories((prev) =>
      prev.map((cat, i) => (i === categoryIndex ? { ...cat, href } : cat)),
    );
  }

  function updateCategoryImageSrc(categoryIndex: number, imageSrc: string) {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, imageSrc: imageSrc.trim() || undefined }
          : cat,
      ),
    );
  }

  function updateGroupHref(
    categoryIndex: number,
    groupIndex: number,
    href: string,
  ) {
    setCategories((prev) =>
      prev.map((cat, ci) => {
        if (ci !== categoryIndex) return cat;
        return {
          ...cat,
          groups: cat.groups.map((group, gi) =>
            gi === groupIndex ? { ...group, href: href || undefined } : group,
          ),
        };
      }),
    );
  }

  function updateLink(
    categoryIndex: number,
    groupIndex: number,
    linkIndex: number,
    patch: { label?: string; href?: string },
  ) {
    setCategories((prev) =>
      prev.map((cat, ci) => {
        if (ci !== categoryIndex) return cat;
        return {
          ...cat,
          groups: cat.groups.map((group, gi) => {
            if (gi !== groupIndex) return group;
            return {
              ...group,
              links: group.links.map((link, li) =>
                li === linkIndex ? { ...link, ...patch } : link,
              ),
            };
          }),
        };
      }),
    );
  }

  function onSave() {
    if (!canEdit) return;
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveMegaMenuAction(categories);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setCategories(result.categories);
      setMessage(result.message);
      router.refresh();
    });
  }

  function onReset() {
    if (!canEdit) return;
    if (
      !window.confirm(
        "Reset all Services menu links to the built-in defaults?",
      )
    ) {
      return;
    }
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await resetMegaMenuAction();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setCategories(result.categories);
      setMessage(result.message);
      router.refresh();
    });
  }

  async function onUploadImage(categoryIndex: number, file: File | undefined) {
    if (!canEdit || !file) return;
    const category = categories[categoryIndex];
    if (!category) return;

    setMessage(null);
    setError(null);
    setUploadingId(category.id);

    try {
      const blob = await resizeFileToExactSize(
        file,
        MEGA_MENU_PANEL_IMAGE_SIZE,
        file.type === "image/png" ? "image/png" : "image/jpeg",
      );
      const formData = new FormData();
      formData.set(
        "file",
        new File([blob], `${category.id}-panel.jpg`, {
          type: blob.type || "image/jpeg",
        }),
      );

      const result = await uploadMegaMenuImageAction(category.id, formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      updateCategoryImageSrc(categoryIndex, result.imageSrc);
      setMessage(
        `${category.title}: panel image updated (${MEGA_MENU_PANEL_IMAGE_SIZE.width}×${MEGA_MENU_PANEL_IMAGE_SIZE.height}px). Click Save menu to publish.`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not process that image.",
      );
    } finally {
      setUploadingId(null);
      const input = fileInputs.current[category.id];
      if (input) input.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canEdit || pending}
          onClick={onSave}
          className={cn(buttonVariants({ variant: "default" }), "cursor-pointer")}
        >
          {pending ? "Saving…" : "Save menu"}
        </button>
        <button
          type="button"
          disabled={!canEdit || pending}
          onClick={onReset}
          className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}
        >
          Reset to defaults
        </button>
        {!canEdit ? (
          <p className="text-sm text-slate-500">
            View only — ask an Admin or Editor to change links.
          </p>
        ) : null}
      </div>

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {message ? (
        <p
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <section
            key={category.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
              <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
                {category.title}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">{category.description}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[15.5rem_minmax(0,1fr)] sm:items-start">
                <div className="space-y-2">
                  <div
                    className="relative mx-auto w-full max-w-[15.5rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm sm:mx-0"
                    style={{
                      aspectRatio: `${MEGA_MENU_PANEL_DISPLAY.width} / ${MEGA_MENU_PANEL_DISPLAY.height}`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.imageSrc?.trim() || "/images/hero-model.png"}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <p className="text-center text-[0.65rem] text-slate-500 sm:text-left">
                    Preview at menu size ({MEGA_MENU_PANEL_DISPLAY.width}×
                    {MEGA_MENU_PANEL_DISPLAY.height}px, 4:5)
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-600">
                    Category page URL
                    <input
                      type="text"
                      disabled={!canEdit || pending}
                      value={category.href}
                      onChange={(e) =>
                        updateCategoryHref(categoryIndex, e.target.value)
                      }
                      className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2 disabled:bg-slate-50"
                      placeholder="/hair-transplant/"
                    />
                  </label>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600">
                      Category panel image
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={(el) => {
                          fileInputs.current[category.id] = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={!canEdit || pending || uploadingId === category.id}
                        className="sr-only"
                        onChange={(e) =>
                          void onUploadImage(
                            categoryIndex,
                            e.target.files?.[0],
                          )
                        }
                      />
                      <button
                        type="button"
                        disabled={
                          !canEdit || pending || uploadingId === category.id
                        }
                        onClick={() =>
                          fileInputs.current[category.id]?.click()
                        }
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "cursor-pointer",
                        )}
                      >
                        {uploadingId === category.id
                          ? "Uploading…"
                          : "Upload panel image"}
                      </button>
                    </div>
                    <label className="block text-xs font-medium text-slate-600">
                      Or paste path / URL
                      <input
                        type="text"
                        disabled={!canEdit || pending}
                        value={category.imageSrc ?? ""}
                        onChange={(e) =>
                          updateCategoryImageSrc(
                            categoryIndex,
                            e.target.value,
                          )
                        }
                        className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2 disabled:bg-slate-50"
                        placeholder="/images/mega-menu/wellness.jpg"
                      />
                    </label>
                    <p className="text-[0.7rem] font-normal leading-relaxed text-slate-500">
                      Prefer{" "}
                      <strong>Sanity Studio → Services mega menu</strong> for
                      panel photos ({MEGA_MENU_PANEL_IMAGE_SIZE.width}×
                      {MEGA_MENU_PANEL_IMAGE_SIZE.height}px). Local upload /
                      path below is a fallback when Sanity has no image. Then
                      click <strong>Save menu</strong> for path changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {category.groups.map((group, groupIndex) => (
                <div key={`${category.id}-${groupIndex}`} className="px-4 py-4 sm:px-5">
                  {group.title ? (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {group.title}
                      </p>
                      <label className="mt-2 block text-xs font-medium text-slate-600">
                        Group heading URL
                        <input
                          type="text"
                          disabled={!canEdit || pending}
                          value={group.href ?? ""}
                          onChange={(e) =>
                            updateGroupHref(
                              categoryIndex,
                              groupIndex,
                              e.target.value,
                            )
                          }
                          className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2 disabled:bg-slate-50"
                          placeholder="/hair-loss-treatment-in-delhi/"
                        />
                      </label>
                    </div>
                  ) : (
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Links
                    </p>
                  )}

                  <ul className="space-y-3">
                    {group.links.map((link, linkIndex) => (
                      <li
                        key={`${category.id}-${groupIndex}-${linkIndex}`}
                        className="grid gap-2 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-end"
                      >
                        <label className="block text-xs font-medium text-slate-600">
                          Label
                          <input
                            type="text"
                            disabled={!canEdit || pending}
                            value={link.label}
                            onChange={(e) =>
                              updateLink(categoryIndex, groupIndex, linkIndex, {
                                label: e.target.value,
                              })
                            }
                            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2 disabled:bg-slate-50"
                          />
                        </label>
                        <label className="block text-xs font-medium text-slate-600">
                          Page URL
                          <input
                            type="text"
                            disabled={!canEdit || pending}
                            value={link.href}
                            onChange={(e) =>
                              updateLink(categoryIndex, groupIndex, linkIndex, {
                                href: e.target.value,
                              })
                            }
                            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2 disabled:bg-slate-50"
                            placeholder="/prp-hair-treatment/"
                          />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          disabled={!canEdit || pending}
          onClick={onSave}
          className={cn(buttonVariants({ variant: "default" }), "cursor-pointer")}
        >
          {pending ? "Saving…" : "Save menu"}
        </button>
      </div>
    </div>
  );
}

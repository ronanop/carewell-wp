"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ImageIcon } from "lucide-react";

import { ImageReplaceUpload } from "@/components/admin/media/ImageReplaceUpload";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { findElementDescriptor } from "@/lib/experience/static-pages/elementRegistry";
import {
  getElementOverride,
  resolveElementField,
} from "@/lib/experience/static-pages/elementOverrides";

/**
 * Floating image tools when an image element is selected.
 * Supports WordPress library pick + upload resized to current pixel size.
 */
export function ElementImageToolbar() {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const config = useEditorStore((s) => s.config);
  const setElementField = useEditorStore((s) => s.setElementField);
  const [box, setBox] = useState<DOMRect | null>(null);
  const [openPicker, setOpenPicker] = useState(false);

  const descriptor = selectedElementId
    ? findElementDescriptor(selectedElementId)
    : undefined;
  const isImage = descriptor?.kind === "image";

  useLayoutEffect(() => {
    if (!selectedElementId || !isImage) {
      setBox(null);
      return;
    }
    const el = document.querySelector<HTMLElement>(
      `[data-editable-element="${selectedElementId}"]`,
    );
    setBox(el?.getBoundingClientRect() ?? null);
  }, [selectedElementId, isImage, config]);

  if (!selectedElementId || !isImage || !box) return null;

  const src = String(
    resolveElementField(
      config,
      selectedElementId,
      "src",
      String(descriptor?.defaultValues?.src ?? ""),
    ),
  );
  const objectFit = resolveElementField(
    config,
    selectedElementId,
    "objectFit",
    "contain",
  );
  const alt = String(
    resolveElementField(
      config,
      selectedElementId,
      "alt",
      String(descriptor?.defaultValues?.alt ?? ""),
    ),
  );
  const override = getElementOverride(config, selectedElementId);
  const expectedSize =
    typeof override.width === "number" && typeof override.height === "number"
      ? { width: override.width, height: override.height }
      : typeof descriptor?.defaultValues?.width === "number" &&
          typeof descriptor?.defaultValues?.height === "number"
        ? {
            width: descriptor.defaultValues.width as number,
            height: descriptor.defaultValues.height as number,
          }
        : null;

  return createPortal(
    <div
      className="fixed z-[70] flex max-h-[min(70vh,520px)] w-[280px] flex-col gap-2 overflow-y-auto rounded-xl border border-sky-200 bg-white/95 p-3 shadow-xl backdrop-blur"
      style={{
        top: Math.min(Math.max(8, box.top - 12), window.innerHeight - 120),
        left: Math.min(Math.max(8, box.left), window.innerWidth - 300),
        transform: box.top > 160 ? "translateY(-100%)" : "none",
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2 text-[0.75rem] font-semibold text-sky-800">
        <ImageIcon className="size-3.5" />
        {descriptor?.displayName ?? "Image"}
      </div>

      <ImageReplaceUpload
        currentSrc={src}
        elementId={selectedElementId}
        expectedSize={expectedSize}
        alt={alt}
        onUploaded={(media) => {
          setElementField(selectedElementId, "src", media.sourceUrl);
          setElementField(
            selectedElementId,
            "alt",
            media.alt || media.title || alt,
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

      <label className="block text-[0.75rem]">
        <span className="text-muted-foreground">Fit</span>
        <select
          className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-small"
          value={String(objectFit)}
          onChange={(event) =>
            setElementField(selectedElementId, "objectFit", event.target.value)
          }
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
        </select>
      </label>

      <label className="block text-[0.75rem]">
        <span className="text-muted-foreground">Image URL</span>
        <input
          className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-small"
          value={src}
          onChange={(event) =>
            setElementField(selectedElementId, "src", event.target.value)
          }
        />
      </label>

      <button
        type="button"
        className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-[0.75rem] font-medium text-sky-800"
        onClick={() => setOpenPicker((v) => !v)}
      >
        {openPicker ? "Hide media library" : "Choose from WordPress"}
      </button>
      {openPicker ? (
        <MediaPickerField
          label="WordPress media"
          value={
            typeof override.mediaId === "number" && override.mediaId > 0
              ? {
                  mediaId: override.mediaId,
                  title: "Selected",
                  alt,
                  mimeType: "image/jpeg",
                  sourceUrl: src,
                  width:
                    typeof override.width === "number" ? override.width : null,
                  height:
                    typeof override.height === "number"
                      ? override.height
                      : null,
                  lastSyncedAt: new Date().toISOString(),
                }
              : null
          }
          onChange={(media) => {
            if (!media) return;
            setElementField(selectedElementId, "src", media.sourceUrl);
            setElementField(selectedElementId, "alt", media.alt || media.title);
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
    </div>,
    document.body,
  );
}

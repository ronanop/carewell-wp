"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { AlertTriangle, ImageIcon, Replace, Trash2 } from "lucide-react";

import { MediaBrowser } from "@/components/admin/media/MediaBrowser";
import { Button } from "@/components/ui/button";
import { refreshMediaRefAction } from "@/lib/experience/actions/mediaActions";
import { toMediaRef } from "@/lib/media/mediaDomain";
import type { MediaAsset, MediaRef } from "@/types/wordpress-media";
import { cn } from "@/lib/utils";

type MediaPickerFieldProps = {
  label: string;
  value: MediaRef | null;
  onChange: (ref: MediaRef | null) => void;
};

/**
 * Stores MediaRef (mediaId + cached snapshot). Never uploads files.
 */
export function MediaPickerField({
  label,
  value,
  onChange,
}: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!value?.mediaId) return;
    startTransition(async () => {
      const result = await refreshMediaRefAction(value);
      if (!result.ok) return;
      const next = result.data;
      const changed =
        next.sourceUrl !== value.sourceUrl ||
        next.title !== value.title ||
        next.mimeType !== value.mimeType ||
        next.width !== value.width ||
        next.height !== value.height ||
        Boolean(next.missing) !== Boolean(value.missing);
      if (changed) onChange(next);
    });
    // Refresh once when the field mounts / mediaId changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount/id sync
  }, [value?.mediaId]);

  function handleSelect(asset: MediaAsset) {
    onChange(toMediaRef(asset));
  }

  const previewUrl = value?.sourceUrl || null;
  const missing = Boolean(value?.missing) || (value && !value.sourceUrl);

  return (
    <div className="space-y-2">
      <p className="text-[0.75rem] font-medium text-foreground">{label}</p>
      {value ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="relative aspect-[16/9] bg-muted">
            {previewUrl && !missing ? (
              <Image
                src={previewUrl}
                alt={value.alt || value.title || label}
                fill
                className="object-cover"
                sizes="400px"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                <AlertTriangle className="size-5 text-amber-600" />
                <p className="text-small font-medium text-foreground">
                  Missing WordPress Asset
                </p>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Media #{value.mediaId} is no longer available in WordPress.
                </p>
              </div>
            )}
            {missing ? (
              <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-[0.625rem] font-semibold text-white">
                Missing
              </span>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-[0.75rem] font-medium text-foreground">
                {value.title}
              </p>
              <p className="font-mono text-[0.6875rem] text-muted-foreground">
                WP Media #{value.mediaId}
                {isPending ? " · syncing…" : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
              >
                <Replace className="size-3.5" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-small text-muted-foreground transition-colors",
            "hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
          )}
        >
          <ImageIcon className="size-5" />
          Choose from WordPress Media
        </button>
      )}

      <MediaBrowser
        open={open}
        onClose={() => setOpen(false)}
        selectedMediaId={value?.mediaId ?? null}
        onSelect={handleSelect}
        title={label}
      />
    </div>
  );
}

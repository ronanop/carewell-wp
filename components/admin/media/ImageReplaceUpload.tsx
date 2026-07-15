"use client";

import { useEffect, useRef, useState, useTransition, type ChangeEvent } from "react";
import { Upload } from "lucide-react";

import { uploadSizedStudioImageAction } from "@/lib/experience/actions/uploadMediaAction";
import {
  loadImageNaturalSize,
  readImageSizeFromElement,
  resizeFileToExactSize,
  type ExactImageSize,
} from "@/lib/media/resizeImageToExactSize";
import type { MediaRef } from "@/types/wordpress-media";
import { cn } from "@/lib/utils";

type ImageReplaceUploadProps = {
  currentSrc: string;
  /** Optional element id — used to read natural size from the live canvas img. */
  elementId?: string;
  /** Known size from overrides / defaults. */
  expectedSize?: ExactImageSize | null;
  alt?: string;
  onUploaded: (ref: MediaRef) => void;
  className?: string;
};

/**
 * Upload a replacement image, resized to the exact pixel size of the current one.
 */
export function ImageReplaceUpload({
  currentSrc,
  elementId,
  expectedSize = null,
  alt = "",
  onUploaded,
  className,
}: ImageReplaceUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [targetSize, setTargetSize] = useState<ExactImageSize | null>(
    expectedSize,
  );
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function resolveSize() {
      if (expectedSize?.width && expectedSize?.height) {
        setTargetSize(expectedSize);
        return;
      }
      if (elementId) {
        const fromDom = readImageSizeFromElement(elementId);
        if (fromDom) {
          if (!cancelled) setTargetSize(fromDom);
          return;
        }
      }
      const fromSrc = await loadImageNaturalSize(currentSrc);
      if (!cancelled) setTargetSize(fromSrc);
    }

    void resolveSize();
    return () => {
      cancelled = true;
    };
  }, [currentSrc, elementId, expectedSize]);

  function onPickClick() {
    setError(null);
    setStatus(null);
    inputRef.current?.click();
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, or WebP).");
      return;
    }

    if (!targetSize) {
      setError(
        "Could not detect the current image size. Wait for the image to load, then try again.",
      );
      return;
    }

    startTransition(async () => {
      try {
        setStatus(
          `Resizing to ${targetSize.width}×${targetSize.height}px…`,
        );
        const blob = await resizeFileToExactSize(
          file,
          targetSize,
          file.type === "image/png" ? "image/png" : "image/jpeg",
        );
        const dataUrl = await blobToDataUrl(blob);
        setStatus("Uploading…");
        const result = await uploadSizedStudioImageAction({
          dataUrl,
          filename: file.name || "replacement.jpg",
          alt,
          width: targetSize.width,
          height: targetSize.height,
        });
        if (!result.ok) {
          setError(result.message);
          setStatus(null);
          return;
        }
        setStatus("Uploaded");
        onUploaded(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setStatus(null);
      }
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileChange}
      />
      <button
        type="button"
        disabled={isPending || !targetSize}
        onClick={onPickClick}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-3 py-2 text-[0.75rem] font-medium text-white",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <Upload className="size-3.5" />
        {isPending ? "Working…" : "Upload & replace"}
      </button>
      {targetSize ? (
        <p className="text-[0.6875rem] text-muted-foreground">
          Replacement will be resized to{" "}
          <span className="font-mono font-medium text-foreground">
            {targetSize.width}×{targetSize.height}px
          </span>{" "}
          to match the current image.
        </p>
      ) : (
        <p className="text-[0.6875rem] text-amber-700">
          Detecting current image size…
        </p>
      )}
      {status ? (
        <p className="text-[0.6875rem] text-sky-700">{status}</p>
      ) : null}
      {error ? (
        <p className="text-[0.6875rem] text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read resized image"));
    reader.readAsDataURL(blob);
  });
}

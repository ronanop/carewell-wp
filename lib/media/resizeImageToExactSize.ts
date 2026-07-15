/**
 * Client-side image resize to an exact pixel size (cover + center crop).
 */

export type ExactImageSize = {
  width: number;
  height: number;
};

export async function loadImageNaturalSize(
  src: string,
): Promise<ExactImageSize | null> {
  if (!src) return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Resizes a File to exact width×height (cover + center crop), returns PNG/JPEG Blob.
 */
export async function resizeFileToExactSize(
  file: File,
  size: ExactImageSize,
  mimeType: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 0.92,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not create canvas context");
  }

  const scale = Math.max(
    size.width / bitmap.width,
    size.height / bitmap.height,
  );
  const drawW = bitmap.width * scale;
  const drawH = bitmap.height * scale;
  const dx = (size.width - drawW) / 2;
  const dy = (size.height - drawH) / 2;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.drawImage(bitmap, dx, dy, drawW, drawH);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((next) => resolve(next), mimeType, quality);
  });
  if (!blob) throw new Error("Failed to encode resized image");
  return blob;
}

export function readImageSizeFromElement(
  elementId: string,
): ExactImageSize | null {
  const root = document.querySelector(
    `[data-editable-element="${elementId}"]`,
  );
  if (!root) return null;
  const img = root.querySelector("img");
  if (!img) return null;
  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
    return { width: img.naturalWidth, height: img.naturalHeight };
  }
  return null;
}

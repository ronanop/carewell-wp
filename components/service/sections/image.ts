import { urlFor } from "@/lib/sanity/client";
import type { SanityImage } from "./types";

type SectionImageOpts = {
  width?: number;
  quality?: number;
  /** Sanity auto format — webp is widely supported and much smaller than jpg/png. */
  format?: "webp" | "jpg" | "png";
};

/**
 * Optimized Sanity CDN URL for section imagery (hero LCP, cards, etc.).
 */
export function sectionImageUrl(
  image?: SanityImage,
  widthOrOpts: number | SectionImageOpts = 1200,
) {
  if (!image?.asset) return null;
  const opts: SectionImageOpts =
    typeof widthOrOpts === "number" ? { width: widthOrOpts } : widthOrOpts;
  const width = opts.width ?? 1200;
  const quality = opts.quality ?? 70;
  const format = opts.format ?? "webp";
  try {
    return urlFor(image)
      .width(width)
      .quality(quality)
      .format(format)
      .fit("max")
      .url();
  } catch {
    return image.asset.url || null;
  }
}

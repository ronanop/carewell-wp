import { urlFor } from "@/lib/sanity/client";
import type { SanityImage } from "./types";

export function sectionImageUrl(image?: SanityImage, width = 1200) {
  if (!image?.asset) return null;
  try {
    return urlFor(image).width(width).url();
  } catch {
    return image.asset.url || null;
  }
}


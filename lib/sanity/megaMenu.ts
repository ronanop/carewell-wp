import "server-only";

import { sanityClient, urlFor } from "@/lib/sanity/client";
import { MEGA_MENU_PANEL_IMAGE_SIZE } from "@/lib/navigation/megaMenuImage";

type SanityImageField = {
  alt?: string | null;
  asset?: { _ref?: string; _id?: string; url?: string } | null;
} | null;

type SanityMegaMenuCategory = {
  categoryId?: string | null;
  panelImage?: SanityImageField;
} | null;

type SanityMegaMenuDoc = {
  categories?: SanityMegaMenuCategory[] | null;
} | null;

const SERVICES_MEGA_MENU_QUERY = `*[_type == "servicesMegaMenu" && _id == "servicesMegaMenu"][0]{
  categories[]{
    categoryId,
    panelImage{ alt, asset->{ _id, url } }
  }
}`;

function panelImageUrl(image: SanityImageField | undefined): string | undefined {
  if (!image?.asset) return undefined;
  try {
    return urlFor(image)
      .width(MEGA_MENU_PANEL_IMAGE_SIZE.width)
      .height(MEGA_MENU_PANEL_IMAGE_SIZE.height)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return image.asset.url || undefined;
  }
}

/**
 * Map of mega-menu category id → CDN image URL from Sanity Studio.
 * Missing / empty categories are omitted (callers keep code/DB defaults).
 */
export async function getSanityMegaMenuImages(): Promise<
  Map<string, string>
> {
  const map = new Map<string, string>();
  try {
    const doc = await sanityClient.fetch<SanityMegaMenuDoc>(
      SERVICES_MEGA_MENU_QUERY,
    );
    for (const row of doc?.categories ?? []) {
      const id = row?.categoryId?.trim();
      if (!id) continue;
      const src = panelImageUrl(row?.panelImage);
      if (src) map.set(id, src);
    }
  } catch (error) {
    console.error("[CWMC]", {
      context: "getSanityMegaMenuImages",
      message: error instanceof Error ? error.message : "fetch failed",
    });
  }
  return map;
}

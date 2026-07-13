import type { MediaAsset } from "@/types/wordpress-media";

/**
 * Raw WPGraphQL MediaItem node — repository/mapper only.
 */
export type WpMediaNode = {
  databaseId?: number | null;
  title?: string | null;
  sourceUrl?: string | null;
  altText?: string | null;
  mimeType?: string | null;
  mediaType?: string | null;
  date?: string | null;
  modified?: string | null;
  mediaDetails?: {
    width?: number | null;
    height?: number | null;
    sizes?: Array<{
      name?: string | null;
      sourceUrl?: string | null;
      width?: number | null;
      height?: number | null;
    } | null> | null;
  } | null;
};

function pickThumbnailUrl(node: WpMediaNode, fallback: string): string {
  const sizes = node.mediaDetails?.sizes ?? [];
  const preferred = ["thumbnail", "medium", "medium_large", "large"] as const;

  for (const name of preferred) {
    const match = sizes.find(
      (size) => size?.name?.toLowerCase() === name && size.sourceUrl,
    );
    if (match?.sourceUrl) return match.sourceUrl;
  }

  const anySized = sizes.find((size) => size?.sourceUrl);
  return anySized?.sourceUrl ?? fallback;
}

/**
 * Maps a WPGraphQL media node to MediaAsset.
 * Does NOT filter by mime — repository owns image filtering.
 */
export function mapMediaAsset(node: WpMediaNode | null | undefined): MediaAsset | null {
  if (
    typeof node?.databaseId !== "number" ||
    !node.sourceUrl ||
    typeof node.sourceUrl !== "string"
  ) {
    return null;
  }

  const url = node.sourceUrl;

  return {
    id: node.databaseId,
    title: node.title?.trim() || `Media ${node.databaseId}`,
    alt: node.altText?.trim() || "",
    url,
    thumbnailUrl: pickThumbnailUrl(node, url),
    mimeType: node.mimeType?.trim() || "application/octet-stream",
    width:
      typeof node.mediaDetails?.width === "number" ? node.mediaDetails.width : null,
    height:
      typeof node.mediaDetails?.height === "number"
        ? node.mediaDetails.height
        : null,
    createdAt: node.date ?? null,
    updatedAt: node.modified ?? node.date ?? null,
    mediaType: node.mediaType ?? null,
  };
}

export { isImageMimeType, toMediaRef, matchesMediaSearch } from "@/lib/media/mediaDomain";

/** @deprecated Use mapMediaAsset. */
export const mapWordPressMedia = mapMediaAsset;

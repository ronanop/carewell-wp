import type { MediaAsset, MediaRef } from "@/types/wordpress-media";

/**
 * Client-safe media domain helpers (no GraphQL / server imports).
 */

export function isImageMimeType(mimeType: string | null | undefined): boolean {
  if (!mimeType) return false;
  return mimeType.toLowerCase().startsWith("image/");
}

export function toMediaRef(asset: MediaAsset, syncedAt = new Date()): MediaRef {
  return {
    mediaId: asset.id,
    title: asset.title,
    alt: asset.alt,
    mimeType: asset.mimeType,
    sourceUrl: asset.url,
    width: asset.width,
    height: asset.height,
    lastSyncedAt: syncedAt.toISOString(),
    missing: false,
  };
}

export function matchesMediaSearch(asset: MediaAsset, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const filename = asset.url.split("/").pop()?.toLowerCase() ?? "";
  return (
    asset.title.toLowerCase().includes(q) ||
    asset.alt.toLowerCase().includes(q) ||
    asset.mimeType.toLowerCase().includes(q) ||
    filename.includes(q) ||
    String(asset.id).includes(q)
  );
}

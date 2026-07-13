/**
 * MediaAsset — Experience Studio domain model for WordPress media.
 * Never exposes raw GraphQL shapes to UI or services.
 */
export type MediaAsset = {
  /** WordPress media database ID — source of truth. */
  id: number;
  title: string;
  alt: string;
  url: string;
  /** Preferred thumbnail URL for browsing (falls back to `url`). */
  thumbnailUrl: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  mediaType: string | null;
};

export type MediaAssetConnection = {
  items: MediaAsset[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

/**
 * Cached WordPress media snapshot stored inside PresentationConfig.
 * `mediaId` remains authoritative; other fields are metadata cache only.
 */
export type MediaRef = {
  mediaId: number;
  title: string;
  alt: string;
  mimeType: string;
  sourceUrl: string;
  width: number | null;
  height: number | null;
  lastSyncedAt: string;
  /** Set when WordPress no longer returns this asset. */
  missing?: boolean;
};

/** @deprecated Prefer MediaAsset — kept for transitional imports. */
export type WordPressMedia = MediaAsset;

/** @deprecated Prefer MediaAssetConnection. */
export type WordPressMediaConnection = MediaAssetConnection;

/**
 * Enterprise Asset Management System (AMS) domain types.
 * WordPress Media ID remains the authoritative storage key — never duplicate files.
 */

import type { MediaAsset, MediaRef } from "@/types/wordpress-media";

/** Stable asset identity = WordPress media database ID. */
export type AssetId = number;

export type AssetKind =
  | "image"
  | "video"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "other";

export type Asset = MediaAsset & {
  kind: AssetKind;
  caption?: string;
  description?: string;
  fileSize?: number | null;
  authorName?: string | null;
};

export type AssetConnection = {
  items: Asset[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

/** Presentation / Studio reference — alias of MediaRef for AMS vocabulary. */
export type AssetRef = MediaRef;

export type AssetListFilter = {
  first?: number;
  after?: string | null;
  /** Free-text search (provider may apply client-side or server-side). */
  search?: string;
  kind?: AssetKind | "all";
  /** Virtual folder slug (Studio metadata). */
  folderSlug?: string | null;
  favoritesOnly?: boolean;
  recentlyUploaded?: boolean;
  mimePrefix?: string;
  includeTrashed?: boolean;
};

export type AssetUploadInput = {
  bytes: Buffer;
  filename: string;
  mimeType: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
  folderSlug?: string | null;
};

export type AssetMetadataUpdate = {
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
  filename?: string;
};

export type AssetUsageContextType =
  | "wordpress_page"
  | "static_page"
  | "template"
  | "presentation_override"
  | "element_override"
  | "component"
  | "unknown";

export type AssetUsage = {
  wordpressMediaId: AssetId;
  contextType: AssetUsageContextType;
  contextId: string;
  contextLabel: string;
  fieldPath: string;
  editorHref: string | null;
};

export type AssetFolder = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  sortOrder: number;
};

export type AssetEventType =
  | "AssetUploaded"
  | "AssetDeleted"
  | "AssetRenamed"
  | "AssetReplaced"
  | "AssetUpdated"
  | "AssetRestored"
  | "AssetFavorited"
  | "AssetUnfavorited";

export type AssetEvent = {
  type: AssetEventType;
  assetId: AssetId;
  actorUserId?: string | null;
  payload?: Record<string, unknown>;
  occurredAt: string;
};

export type AssetProviderName =
  | "wordpress"
  | "s3"
  | "cloudinary"
  | "azure"
  | "gcs"
  | "local";

import "server-only";

import { toAsset } from "@/lib/assets/domain";
import type { AssetProvider } from "@/lib/assets/providers/types";
import {
  createAuthorizationHeader,
  getWordPressConfig,
} from "@/lib/wordpress/config";
import {
  getMediaRepository,
  type MediaRepository,
} from "@/lib/wordpress/repositories/mediaRepository";
import type {
  Asset,
  AssetConnection,
  AssetListFilter,
  AssetMetadataUpdate,
  AssetUploadInput,
} from "@/types/assets";
import type { MediaAsset } from "@/types/wordpress-media";

type WpMediaRest = {
  id: number;
  source_url?: string;
  title?: { rendered?: string; raw?: string };
  alt_text?: string;
  caption?: { rendered?: string; raw?: string };
  description?: { rendered?: string; raw?: string };
  mime_type?: string;
  media_type?: string;
  date?: string;
  modified?: string;
  media_details?: {
    width?: number;
    height?: number;
    filesize?: number;
    sizes?: Record<string, { source_url?: string; width?: number; height?: number }>;
  };
  author_name?: string;
};

function wordpressRestBase(): string {
  const graphql = process.env.WORDPRESS_GRAPHQL_ENDPOINT?.trim();
  if (!graphql) {
    throw new Error("WORDPRESS_GRAPHQL_ENDPOINT is not configured");
  }
  const url = new URL(graphql);
  return `${url.origin}/wp-json/wp/v2`;
}

function requireAuthHeader(): string {
  const auth = createAuthorizationHeader(getWordPressConfig());
  if (!auth) {
    throw new Error(
      "WordPress Application Password is not configured (WORDPRESS_USERNAME / WORDPRESS_APPLICATION_PASSWORD)",
    );
  }
  return auth;
}

function mapRestToAsset(json: WpMediaRest): Asset {
  const url = json.source_url || "";
  const sizes = json.media_details?.sizes ?? {};
  const thumb =
    sizes.thumbnail?.source_url ||
    sizes.medium?.source_url ||
    sizes.medium_large?.source_url ||
    url;

  const media: MediaAsset = {
    id: json.id,
    title: json.title?.raw || json.title?.rendered || `Media ${json.id}`,
    alt: json.alt_text || "",
    url,
    thumbnailUrl: thumb,
    mimeType: json.mime_type || "application/octet-stream",
    width: json.media_details?.width ?? null,
    height: json.media_details?.height ?? null,
    createdAt: json.date ?? null,
    updatedAt: json.modified ?? json.date ?? null,
    mediaType: json.media_type ?? null,
  };

  return toAsset(media, {
    caption: json.caption?.raw || stripHtml(json.caption?.rendered) || "",
    description:
      json.description?.raw || stripHtml(json.description?.rendered) || "",
    fileSize: json.media_details?.filesize ?? null,
  });
}

function stripHtml(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, "").trim();
}

function enrichFromGraphql(asset: MediaAsset): Asset {
  return toAsset(asset);
}

function matchesKind(asset: Asset, kind: AssetListFilter["kind"]): boolean {
  if (!kind || kind === "all") return true;
  return asset.kind === kind;
}

/**
 * Default AMS provider — WordPress Media Library is the sole binary store.
 * Reads prefer WPGraphQL; writes use WordPress REST (server-side only).
 */
export function createWordPressAssetProvider(
  mediaRepo: MediaRepository = getMediaRepository(),
): AssetProvider {
  return {
    name: "wordpress",

    async list(filter: AssetListFilter): Promise<AssetConnection> {
      const first = filter.first ?? 40;
      const connection = await mediaRepo.listMedia({
        first,
        after: filter.after ?? null,
        mimePrefix: filter.mimePrefix,
        options: { cache: "no-store" },
      });

      let items = connection.items.map(enrichFromGraphql);

      if (filter.kind && filter.kind !== "all") {
        items = items.filter((item) => matchesKind(item, filter.kind));
      }

      if (filter.search?.trim()) {
        const q = filter.search.trim().toLowerCase();
        items = items.filter((item) => {
          const filename = item.url.split("/").pop()?.toLowerCase() ?? "";
          return (
            item.title.toLowerCase().includes(q) ||
            item.alt.toLowerCase().includes(q) ||
            item.mimeType.toLowerCase().includes(q) ||
            filename.includes(q) ||
            String(item.id).includes(q)
          );
        });
      }

      if (filter.recentlyUploaded) {
        items = [...items].sort((a, b) => {
          const da = a.createdAt ? Date.parse(a.createdAt) : 0;
          const db = b.createdAt ? Date.parse(b.createdAt) : 0;
          return db - da;
        });
      }

      return {
        items,
        pageInfo: connection.pageInfo,
      };
    },

    async getById(id: number): Promise<Asset> {
      // Prefer REST for caption/description; fall back to GraphQL.
      try {
        const base = wordpressRestBase();
        const response = await fetch(`${base}/media/${id}?context=edit`, {
          headers: {
            Authorization: requireAuthHeader(),
            Accept: "application/json",
          },
          cache: "no-store",
        });
        if (response.ok) {
          const json = (await response.json()) as WpMediaRest;
          return mapRestToAsset(json);
        }
      } catch {
        // fall through
      }

      const media = await mediaRepo.getById(id, { cache: "no-store" }, { imagesOnly: false });
      return enrichFromGraphql(media);
    },

    async getByIds(ids: number[]): Promise<Asset[]> {
      const media = await mediaRepo.getByIds(ids, {
        next: { revalidate: 3600, tags: ["wordpress-media"] },
      }, { imagesOnly: false });
      return media.map(enrichFromGraphql);
    },

    async upload(input: AssetUploadInput): Promise<Asset> {
      const base = wordpressRestBase();
      const auth = requireAuthHeader();
      const safeName = input.filename.replace(/[^\w.\-()+ ]+/g, "-");

      const response = await fetch(`${base}/media`, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Disposition": `attachment; filename="${safeName}"`,
          "Content-Type": input.mimeType,
        },
        body: new Uint8Array(input.bytes),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `WordPress media upload failed (${response.status}): ${text.slice(0, 240)}`,
        );
      }

      const json = (await response.json()) as WpMediaRest;
      const patch: AssetMetadataUpdate = {};
      if (input.title) patch.title = input.title;
      if (input.alt) patch.alt = input.alt;
      if (input.caption) patch.caption = input.caption;
      if (input.description) patch.description = input.description;

      if (Object.keys(patch).length > 0) {
        return this.updateMetadata(json.id, patch);
      }

      return mapRestToAsset(json);
    },

    async replace(id: number, input: AssetUploadInput) {
      // Core WP REST cannot reliably rewrite attachment binaries in place.
      // Strategy: snapshot → upload new → copy metadata → trash old → callers rewrite usages.
      const previous = await this.getById(id);
      const uploaded = await this.upload({
        ...input,
        title: input.title || previous.title,
        alt: input.alt ?? previous.alt,
        caption: input.caption ?? previous.caption,
        description: input.description ?? previous.description,
      });

      try {
        await this.trash(id);
      } catch {
        // Non-fatal — new asset is live; old may remain until manual cleanup.
      }

      return {
        asset: uploaded,
        idChanged: uploaded.id !== id,
        previousId: id,
      };
    },

    async updateMetadata(id: number, patch: AssetMetadataUpdate): Promise<Asset> {
      const base = wordpressRestBase();
      const auth = requireAuthHeader();
      const body: Record<string, unknown> = {};

      if (patch.title !== undefined) body.title = patch.title;
      if (patch.alt !== undefined) body.alt_text = patch.alt;
      if (patch.caption !== undefined) body.caption = patch.caption;
      if (patch.description !== undefined) body.description = patch.description;
      // Filename rename via REST is limited; title covers editor-facing name.

      const response = await fetch(`${base}/media/${id}`, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `WordPress media update failed (${response.status}): ${text.slice(0, 240)}`,
        );
      }

      const json = (await response.json()) as WpMediaRest;
      return mapRestToAsset(json);
    },

    async trash(id: number): Promise<void> {
      const base = wordpressRestBase();
      const auth = requireAuthHeader();
      const response = await fetch(`${base}/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: auth },
      });
      if (!response.ok && response.status !== 410) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `WordPress media trash failed (${response.status}): ${text.slice(0, 240)}`,
        );
      }
    },

    async restore(id: number): Promise<Asset> {
      const base = wordpressRestBase();
      const auth = requireAuthHeader();
      const response = await fetch(`${base}/media/${id}`, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "inherit" }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `WordPress media restore failed (${response.status}): ${text.slice(0, 240)}`,
        );
      }
      const json = (await response.json()) as WpMediaRest;
      return mapRestToAsset(json);
    },

    async forceDelete(id: number): Promise<void> {
      const base = wordpressRestBase();
      const auth = requireAuthHeader();
      const response = await fetch(`${base}/media/${id}?force=true`, {
        method: "DELETE",
        headers: { Authorization: auth },
      });
      if (!response.ok && response.status !== 404) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `WordPress media force delete failed (${response.status}): ${text.slice(0, 240)}`,
        );
      }
    },
  };
}

let defaultProvider: AssetProvider | undefined;

export function getWordPressAssetProvider(): AssetProvider {
  if (!defaultProvider) {
    defaultProvider = createWordPressAssetProvider();
  }
  return defaultProvider;
}

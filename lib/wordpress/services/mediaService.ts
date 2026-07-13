import "server-only";

import { unstable_cache } from "next/cache";

import { toMediaRef } from "@/lib/media/mediaDomain";
import {
  getMediaRepository,
  type MediaRepository,
} from "@/lib/wordpress/repositories/mediaRepository";
import type {
  MediaAsset,
  MediaAssetConnection,
  MediaRef,
} from "@/types/wordpress-media";

/**
 * MediaService — domain API for Studio + PresentationEngine.
 * Never touches GraphQL documents.
 */
export function createMediaService(repo: MediaRepository = getMediaRepository()) {
  return {
    listImages(input: {
      first?: number;
      after?: string | null;
    }): Promise<MediaAssetConnection> {
      return repo.listImages({
        ...input,
        options: { cache: "no-store" },
      });
    },

    getById(id: number): Promise<MediaAsset> {
      return repo.getById(id, { cache: "no-store" });
    },

    getByIdCached(id: number): Promise<MediaAsset | null> {
      const cached = unstable_cache(
        async () => {
          try {
            return await repo.getById(id, {
              next: { revalidate: 3600, tags: [`media-${id}`] },
            });
          } catch {
            return null;
          }
        },
        [`wp-media-asset-${id}`],
        { revalidate: 3600, tags: [`media-${id}`, "wordpress-media"] },
      );
      return cached();
    },

    resolveMany(ids: number[]): Promise<MediaAsset[]> {
      return repo.getByIds(ids, {
        next: { revalidate: 3600, tags: ["wordpress-media"] },
      });
    },

    /**
     * Refreshes a MediaRef snapshot from WordPress.
     * Marks `missing: true` when the asset no longer exists.
     */
    async refreshMediaRef(ref: MediaRef): Promise<MediaRef> {
      try {
        const asset = await repo.getById(ref.mediaId, { cache: "no-store" });
        return toMediaRef(asset);
      } catch {
        return {
          ...ref,
          missing: true,
          lastSyncedAt: new Date().toISOString(),
        };
      }
    },

    async refreshMediaRefs(refs: MediaRef[]): Promise<MediaRef[]> {
      return Promise.all(refs.map((ref) => this.refreshMediaRef(ref)));
    },

    assetToRef(asset: MediaAsset): MediaRef {
      return toMediaRef(asset);
    },
  };
}

export type MediaService = ReturnType<typeof createMediaService>;

let defaultMediaService: MediaService | undefined;

export function getMediaService(): MediaService {
  if (!defaultMediaService) {
    defaultMediaService = createMediaService();
  }
  return defaultMediaService;
}

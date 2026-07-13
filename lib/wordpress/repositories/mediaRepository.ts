import "server-only";

import {
  getWordPressClient,
  type FetchGraphQLOptions,
  type WordPressGraphQLClient,
} from "@/lib/wordpress/client";
import { NotFoundError } from "@/lib/wordpress/errors";
import { isImageMimeType } from "@/lib/media/mediaDomain";
import {
  mapMediaAsset,
  type WpMediaNode,
} from "@/lib/wordpress/mappers/mediaMapper";
import {
  getMediaItem as getMediaItemQuery,
  getMediaItems as getMediaItemsQuery,
} from "@/lib/wordpress/queries/media";
import type {
  MediaAsset,
  MediaAssetConnection,
} from "@/types/wordpress-media";

export type RepositoryFetchOptions = Omit<
  FetchGraphQLOptions,
  "variables" | "operationName"
>;

interface GetMediaItemData {
  mediaItem?: WpMediaNode | null;
}

interface GetMediaItemsData {
  mediaItems?: {
    nodes?: Array<WpMediaNode | null> | null;
    pageInfo?: {
      hasNextPage?: boolean | null;
      endCursor?: string | null;
    } | null;
  } | null;
}

export interface MediaRepository {
  getById: (
    id: number,
    options?: RepositoryFetchOptions,
  ) => Promise<MediaAsset>;

  /**
   * Lists a page of WordPress media items.
   * Returns images only — filtering happens here, never in GraphQL enums.
   */
  listImages: (input: {
    first?: number;
    after?: string | null;
    options?: RepositoryFetchOptions;
  }) => Promise<MediaAssetConnection>;

  getByIds: (
    ids: number[],
    options?: RepositoryFetchOptions,
  ) => Promise<MediaAsset[]>;
}

/**
 * WordPress media repository — sole GraphQL layer for media.
 * Never uploads. Never uses MimeTypeEnum filters.
 */
export function createMediaRepository(
  client: WordPressGraphQLClient = getWordPressClient(),
): MediaRepository {
  return {
    async getById(id, options = {}) {
      const data = await client.fetchGraphQL<GetMediaItemData>(getMediaItemQuery, {
        ...options,
        variables: {
          id: String(id),
          idType: "DATABASE_ID",
        },
        operationName: "GetMediaItem",
      });

      const mapped = mapMediaAsset(data.mediaItem);
      if (!mapped || !isImageMimeType(mapped.mimeType)) {
        throw new NotFoundError("media", String(id));
      }
      return mapped;
    },

    async listImages({ first = 40, after = null, options = {} }) {
      // Over-fetch slightly so TypeScript image filtering still fills a page.
      const fetchSize = Math.min(Math.max(first * 2, first), 100);

      const data = await client.fetchGraphQL<GetMediaItemsData>(getMediaItemsQuery, {
        ...options,
        variables: {
          first: fetchSize,
          after,
        },
        operationName: "GetMediaItems",
      });

      const images = (data.mediaItems?.nodes ?? [])
        .map((node) => mapMediaAsset(node))
        .filter((item): item is MediaAsset => item !== null)
        .filter((item) => isImageMimeType(item.mimeType))
        .slice(0, first);

      return {
        items: images,
        pageInfo: {
          hasNextPage: Boolean(data.mediaItems?.pageInfo?.hasNextPage),
          endCursor: data.mediaItems?.pageInfo?.endCursor ?? null,
        },
      };
    },

    async getByIds(ids, options = {}) {
      const unique = [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))];
      const results = await Promise.all(
        unique.map(async (id) => {
          try {
            return await this.getById(id, options);
          } catch {
            return null;
          }
        }),
      );
      return results.filter((item): item is MediaAsset => item !== null);
    },
  };
}

let defaultMediaRepository: MediaRepository | undefined;

export function getMediaRepository(): MediaRepository {
  if (!defaultMediaRepository) {
    defaultMediaRepository = createMediaRepository();
  }
  return defaultMediaRepository;
}

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

export type MediaListOptions = {
  /** When true (default for legacy callers), return images only. */
  imagesOnly?: boolean;
  /** Optional MIME prefix filter, e.g. "image/", "video/", "application/pdf". */
  mimePrefix?: string;
};

export interface MediaRepository {
  getById: (
    id: number,
    options?: RepositoryFetchOptions,
    listOptions?: MediaListOptions,
  ) => Promise<MediaAsset>;

  /**
   * Lists a page of WordPress media items (images only — legacy).
   */
  listImages: (input: {
    first?: number;
    after?: string | null;
    options?: RepositoryFetchOptions;
  }) => Promise<MediaAssetConnection>;

  /**
   * Lists media of any type (AMS). Optional mimePrefix filters after map.
   */
  listMedia: (input: {
    first?: number;
    after?: string | null;
    mimePrefix?: string;
    options?: RepositoryFetchOptions;
  }) => Promise<MediaAssetConnection>;

  getByIds: (
    ids: number[],
    options?: RepositoryFetchOptions,
    listOptions?: MediaListOptions,
  ) => Promise<MediaAsset[]>;
}

function passesMimeFilter(
  item: MediaAsset,
  listOptions?: MediaListOptions,
): boolean {
  if (listOptions?.mimePrefix) {
    return item.mimeType
      .toLowerCase()
      .startsWith(listOptions.mimePrefix.toLowerCase());
  }
  if (listOptions?.imagesOnly === false) {
    return true;
  }
  // Default legacy behaviour: images only
  if (listOptions?.imagesOnly === undefined && !listOptions?.mimePrefix) {
    return true; // caller decides
  }
  return isImageMimeType(item.mimeType);
}

/**
 * WordPress media repository — sole GraphQL layer for media.
 * Never uploads. Never uses MimeTypeEnum filters.
 */
export function createMediaRepository(
  client: WordPressGraphQLClient = getWordPressClient(),
): MediaRepository {
  return {
    async getById(id, options = {}, listOptions = { imagesOnly: true }) {
      const data = await client.fetchGraphQL<GetMediaItemData>(getMediaItemQuery, {
        ...options,
        variables: {
          id: String(id),
          idType: "DATABASE_ID",
        },
        operationName: "GetMediaItem",
      });

      const mapped = mapMediaAsset(data.mediaItem);
      if (!mapped) {
        throw new NotFoundError("media", String(id));
      }

      const imagesOnly = listOptions.imagesOnly !== false && !listOptions.mimePrefix;
      if (imagesOnly && !isImageMimeType(mapped.mimeType)) {
        throw new NotFoundError("media", String(id));
      }
      if (listOptions.mimePrefix && !passesMimeFilter(mapped, listOptions)) {
        throw new NotFoundError("media", String(id));
      }

      return mapped;
    },

    async listImages({ first = 40, after = null, options = {} }) {
      return this.listMedia({
        first,
        after,
        mimePrefix: "image/",
        options,
      });
    },

    async listMedia({ first = 40, after = null, mimePrefix, options = {} }) {
      const fetchSize = Math.min(Math.max(first * 2, first), 100);

      const data = await client.fetchGraphQL<GetMediaItemsData>(getMediaItemsQuery, {
        ...options,
        variables: {
          first: fetchSize,
          after,
        },
        operationName: "GetMediaItems",
      });

      const items = (data.mediaItems?.nodes ?? [])
        .map((node) => mapMediaAsset(node))
        .filter((item): item is MediaAsset => item !== null)
        .filter((item) => {
          if (mimePrefix) {
            return item.mimeType.toLowerCase().startsWith(mimePrefix.toLowerCase());
          }
          return true;
        })
        .slice(0, first);

      return {
        items,
        pageInfo: {
          hasNextPage: Boolean(data.mediaItems?.pageInfo?.hasNextPage),
          endCursor: data.mediaItems?.pageInfo?.endCursor ?? null,
        },
      };
    },

    async getByIds(ids, options = {}, listOptions = { imagesOnly: false }) {
      const unique = [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))];
      const results = await Promise.all(
        unique.map(async (id) => {
          try {
            return await this.getById(id, options, listOptions);
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

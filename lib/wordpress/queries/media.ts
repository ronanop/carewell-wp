import { gql } from "graphql-request";

import { MEDIA_FRAGMENT } from "@/lib/wordpress/queries/fragments";

/**
 * Fetch a single media item by ID.
 *
 * Variables: `{ id: ID!, idType: MediaItemIdType = DATABASE_ID }`
 */
export const getMediaItem = gql`
  ${MEDIA_FRAGMENT}
  query GetMediaItem($id: ID!, $idType: MediaItemIdType = DATABASE_ID) {
    mediaItem(id: $id, idType: $idType) {
      ...Media
    }
  }
`;

/**
 * List media items with cursor pagination.
 * No MimeTypeEnum / search filters — those are schema-fragile.
 * Image filtering happens in the repository after mapping.
 *
 * Variables: `{ first: Int!, after: String }`
 */
export const getMediaItems = gql`
  ${MEDIA_FRAGMENT}
  query GetMediaItems($first: Int!, $after: String) {
    mediaItems(first: $first, after: $after) {
      nodes {
        ...Media
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

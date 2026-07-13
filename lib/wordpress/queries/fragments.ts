import { gql } from "graphql-request";

/**
 * SEO fields on WPGraphQL `PostTypeSEO` (Yoast via WPGraphQL SEO).
 * Verified against carewellmedicalcentre.com GraphQL schema.
 */
export const PAGE_SEO_FRAGMENT = gql`
  fragment PageSeo on PostTypeSEO {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
    }
  }
`;

/**
 * Featured image media fields (used via `featuredImage.node`).
 * Verified against carewellmedicalcentre.com GraphQL schema.
 */
export const FEATURED_IMAGE_FRAGMENT = gql`
  fragment FeaturedImage on MediaItem {
    id
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

/**
 * Full media item fields for direct `mediaItem` queries.
 * Schema-agnostic — never filters by MimeTypeEnum.
 */
export const MEDIA_FRAGMENT = gql`
  fragment Media on MediaItem {
    id
    databaseId
    sourceUrl
    altText
    title
    mimeType
    mediaType
    date
    modified
    mediaDetails {
      width
      height
      sizes {
        name
        sourceUrl
        width
        height
      }
    }
  }
`;

/**
 * Navigation menu item fields.
 * Verified against carewellmedicalcentre.com GraphQL schema.
 */
export const MENU_ITEM_FRAGMENT = gql`
  fragment MenuItem on MenuItem {
    id
    databaseId
    label
    url
    path
    target
    parentId
    cssClasses
    order
  }
`;

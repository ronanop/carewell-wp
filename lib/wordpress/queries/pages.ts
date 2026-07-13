import { gql } from "graphql-request";

import {
  FEATURED_IMAGE_FRAGMENT,
  PAGE_SEO_FRAGMENT,
} from "@/lib/wordpress/queries/fragments";

/**
 * Fetch a single page by URI via `nodeByUri`.
 *
 * Variables: `{ uri: String! }`
 */
export const getPageByUri = gql`
  ${PAGE_SEO_FRAGMENT}
  ${FEATURED_IMAGE_FRAGMENT}
  query GetPageByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Page {
        id
        databaseId
        title
        slug
        uri
        content
        date
        modified
        parentId
        featuredImage {
          node {
            ...FeaturedImage
          }
        }
        seo {
          ...PageSeo
        }
      }
    }
  }
`;

/**
 * List pages with cursor pagination (metadata only — no content body).
 * Used by Experience Studio sync and public listings.
 *
 * Variables: `{ first: Int!, after: String }`
 */
export const getPages = gql`
  ${PAGE_SEO_FRAGMENT}
  ${FEATURED_IMAGE_FRAGMENT}
  query GetPages($first: Int!, $after: String) {
    pages(first: $first, after: $after) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        status
        date
        modified
        parentId
        parent {
          node {
            ... on Page {
              databaseId
            }
          }
        }
        template {
          templateName
        }
        featuredImage {
          node {
            ...FeaturedImage
          }
        }
        seo {
          ...PageSeo
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Fetch child pages of a parent page.
 *
 * Variables: `{ id: ID!, idType: PageIdType = DATABASE_ID, first: Int = 100 }`
 */
export const getChildren = gql`
  query GetChildren(
    $id: ID!
    $idType: PageIdType = DATABASE_ID
    $first: Int = 100
  ) {
    page(id: $id, idType: $idType) {
      id
      databaseId
      title
      uri
      children(first: $first) {
        nodes {
          ... on Page {
            id
            databaseId
            title
            slug
            uri
            parentId
          }
        }
      }
    }
  }
`;

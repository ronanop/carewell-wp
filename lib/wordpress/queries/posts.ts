import { gql } from "graphql-request";

import {
  FEATURED_IMAGE_FRAGMENT,
  PAGE_SEO_FRAGMENT,
} from "@/lib/wordpress/queries/fragments";

export const AUTHOR_FRAGMENT = gql`
  fragment BlogAuthor on User {
    id
    databaseId
    name
    slug
    description
    uri
    avatar {
      url
    }
  }
`;

export const CATEGORY_FRAGMENT = gql`
  fragment BlogCategory on Category {
    id
    databaseId
    name
    slug
    count
    uri
    description
  }
`;

export const TAG_FRAGMENT = gql`
  fragment BlogTag on Tag {
    id
    databaseId
    name
    slug
    uri
  }
`;

/**
 * Fetch a single post by URI via `nodeByUri`.
 * Variables: `{ uri: String! }`
 */
export const getPostByUri = gql`
  ${PAGE_SEO_FRAGMENT}
  ${FEATURED_IMAGE_FRAGMENT}
  ${AUTHOR_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${TAG_FRAGMENT}
  query GetPostByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Post {
        id
        databaseId
        title
        slug
        uri
        status
        content
        excerpt
        date
        modified
        commentCount
        author {
          node {
            ...BlogAuthor
          }
        }
        categories {
          nodes {
            ...BlogCategory
          }
        }
        tags {
          nodes {
            ...BlogTag
          }
        }
        featuredImage {
          node {
            ...FeaturedImage
          }
        }
        seo {
          ...PageSeo
        }
        comments(first: 50) {
          nodes {
            id
            databaseId
            content
            date
            parentId
            author {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * List posts with cursor pagination (metadata + excerpt — no full content).
 * Variables: `{ first: Int!, after: String, categorySlug: String, search: String }`
 */
export const getPosts = gql`
  ${PAGE_SEO_FRAGMENT}
  ${FEATURED_IMAGE_FRAGMENT}
  ${AUTHOR_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${TAG_FRAGMENT}
  query GetPosts(
    $first: Int!
    $after: String
    $categorySlug: String
    $tagSlug: String
    $authorName: String
    $search: String
  ) {
    posts(
      first: $first
      after: $after
      where: {
        categoryName: $categorySlug
        tag: $tagSlug
        authorName: $authorName
        search: $search
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        status
        excerpt
        date
        modified
        commentCount
        author {
          node {
            ...BlogAuthor
          }
        }
        categories {
          nodes {
            ...BlogCategory
          }
        }
        tags {
          nodes {
            ...BlogTag
          }
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
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/**
 * Sync metadata only — no content body.
 */
export const getPostsForSync = gql`
  ${PAGE_SEO_FRAGMENT}
  ${FEATURED_IMAGE_FRAGMENT}
  query GetPostsForSync($first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { orderby: { field: MODIFIED, order: DESC } }) {
      nodes {
        databaseId
        title
        slug
        uri
        status
        excerpt
        modified
        author {
          node {
            name
            slug
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        seo {
          title
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
 * Related posts by category slug.
 */
export const getRelatedPosts = gql`
  ${FEATURED_IMAGE_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${AUTHOR_FRAGMENT}
  query GetRelatedPosts($categorySlug: String!, $first: Int!, $notIn: [ID]) {
    posts(
      first: $first
      where: {
        categoryName: $categorySlug
        notIn: $notIn
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        excerpt
        date
        modified
        commentCount
        author {
          node {
            ...BlogAuthor
          }
        }
        categories {
          nodes {
            ...BlogCategory
          }
        }
        tags {
          nodes {
            id
            databaseId
            name
            slug
            uri
          }
        }
        featuredImage {
          node {
            ...FeaturedImage
          }
        }
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const getCategories = gql`
  ${CATEGORY_FRAGMENT}
  query GetBlogCategories($first: Int! = 100) {
    categories(first: $first, where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
      nodes {
        ...BlogCategory
      }
    }
  }
`;

export const getCategoryBySlug = gql`
  ${CATEGORY_FRAGMENT}
  ${FEATURED_IMAGE_FRAGMENT}
  ${AUTHOR_FRAGMENT}
  ${TAG_FRAGMENT}
  ${PAGE_SEO_FRAGMENT}
  query GetCategoryBySlug($slug: [String]!, $first: Int!, $after: String) {
    categories(where: { slug: $slug }) {
      nodes {
        ...BlogCategory
        posts(first: $first, after: $after, where: { status: PUBLISH }) {
          nodes {
            id
            databaseId
            title
            slug
            uri
            excerpt
            date
            modified
            commentCount
            author {
              node {
                ...BlogAuthor
              }
            }
            categories {
              nodes {
                ...BlogCategory
              }
            }
            tags {
              nodes {
                ...BlogTag
              }
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
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
  }
`;

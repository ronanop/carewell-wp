/**
 * Shared WordPress / WPGraphQL infrastructure types.
 * Domain mappers and query fetchers build on these shapes.
 */

/**
 * A single GraphQL error entry returned in a response payload.
 */
export interface GraphQLError {
  /** Human-readable error message from the GraphQL server. */
  message: string;
  /** Source locations within the query document, when provided. */
  locations?: ReadonlyArray<{
    line: number;
    column: number;
  }>;
  /** Path to the response field that triggered the error. */
  path?: ReadonlyArray<string | number>;
  /** Server-specific error metadata. */
  extensions?: Record<string, unknown>;
}

/**
 * Standard GraphQL HTTP response envelope.
 *
 * @typeParam T - Shape of the `data` field for a successful operation.
 */
export interface GraphQLResponse<T> {
  /** Operation result data; may be partial when errors are also present. */
  data?: T | null;
  /** GraphQL-level errors returned alongside or instead of data. */
  errors?: ReadonlyArray<GraphQLError>;
}

/**
 * Minimal page entity returned by WordPress page queries.
 */
export interface PageResult {
  id: string;
  databaseId: number;
  slug: string;
  uri: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  date: string;
  modified: string;
}

/**
 * Minimal media item returned by WordPress media queries.
 */
export interface MediaResult {
  id: string;
  databaseId: number;
  sourceUrl: string;
  altText: string;
  mimeType: string | null;
  title: string | null;
  mediaDetails: {
    width: number | null;
    height: number | null;
  } | null;
}

/**
 * Single navigation menu item from WPGraphQL.
 */
export interface MenuItemResult {
  id: string;
  databaseId: number;
  label: string;
  url: string;
  path: string | null;
  target: string | null;
  parentId: string | null;
  cssClasses: ReadonlyArray<string> | null;
  order: number | null;
}

/**
 * Navigation menu payload returned by WordPress menu queries.
 */
export interface MenuResult {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  locations: ReadonlyArray<string>;
  menuItems: {
    nodes: ReadonlyArray<MenuItemResult>;
  };
}

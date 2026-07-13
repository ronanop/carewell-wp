/**
 * WordPress GraphQL infrastructure — server-only public API.
 *
 * Import from `@/lib/wordpress` in Server Components and server modules only.
 * Do not import this package from Client Components.
 */

import "server-only";

export {
  DEFAULT_BACKOFF_BASE_MS,
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT_MS,
  REQUIRED_WORDPRESS_ENV_VARS,
  assertWordPressEnv,
  createAuthorizationHeader,
  getWordPressConfig,
  isDevelopment,
  type WordPressConfig,
  type WordPressEnv,
} from "@/lib/wordpress/config";

export {
  AuthenticationError,
  GraphQLError,
  NetworkError,
  NotFoundError,
  ResponseError,
  TimeoutError,
  ValidationError,
  WordPressClientError,
  isWordPressClientError,
} from "@/lib/wordpress/errors";

export {
  NON_RETRYABLE_HTTP_STATUSES,
  assertOkResponse,
  buildHttpRequest,
  computeBackoffMs,
  isNonRetryableHttpStatus,
  isRetryableNetworkFailure,
  sleep,
  wordpressFetch,
  type BuildHttpRequestOptions,
  type WordPressFetchCacheOptions,
  type WordPressFetchDependencies,
  type WordPressHttpRequest,
} from "@/lib/wordpress/fetch";

export {
  createWordPressClient,
  fetchGraphQL,
  getWordPressClient,
  type FetchGraphQLOptions,
  type GraphQLVariables,
  type WordPressGraphQLClient,
} from "@/lib/wordpress/client";

export {
  createMenuRepository,
  createPageRepository,
  createMediaRepository,
  createSiteRepository,
  getMenuRepository,
  getPageRepository,
  getMediaRepository,
  getSiteRepository,
  normalizePageUri,
  transformMenuUrl,
  type MenuRepository,
  type MenuRepositoryDependencies,
  type PageRepository,
  type MediaRepository,
  type RepositoryFetchOptions,
  type SiteRepository,
} from "@/lib/wordpress/repositories";

export {
  resolveRoute,
  resolveRouteFromSegments,
  type RouteResult,
} from "@/lib/wordpress/routeResolver";

export {
  buildUriBreadcrumbs,
  humanizeSegment,
  isHandcraftedPath,
  normalizeUri,
  type UriBreadcrumbItem,
} from "@/lib/wordpress/routeUtils";

export type {
  GraphQLError as GraphQLErrorPayload,
  GraphQLResponse,
  MediaResult,
  MenuItemResult,
  MenuResult,
  PageResult,
} from "@/types/wordpress";

export type { FeaturedImage, Page, SeoMetadata } from "@/types/page";
export type { Menu, MenuItem } from "@/types/menu";
export type { GeneralSettings } from "@/types/site";

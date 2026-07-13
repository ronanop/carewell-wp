/**
 * WordPress domain repositories — frontend models only.
 * React components must call these instead of GraphQL documents/clients.
 */

import "server-only";

export {
  createPageRepository,
  getPageRepository,
  normalizePageUri,
  type PageRepository,
  type RepositoryFetchOptions,
} from "@/lib/wordpress/repositories/pageRepository";

export {
  createMenuRepository,
  getMenuRepository,
  transformMenuUrl,
  type MenuRepository,
  type MenuRepositoryDependencies,
} from "@/lib/wordpress/repositories/menuRepository";

export {
  createSiteRepository,
  getSiteRepository,
  type SiteRepository,
} from "@/lib/wordpress/repositories/siteRepository";

export {
  createMediaRepository,
  getMediaRepository,
  type MediaRepository,
} from "@/lib/wordpress/repositories/mediaRepository";

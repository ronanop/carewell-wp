import "server-only";

import {
  getWordPressClient,
  type WordPressGraphQLClient,
} from "@/lib/wordpress/client";
import { getWordPressConfig } from "@/lib/wordpress/config";
import { ValidationError } from "@/lib/wordpress/errors";
import { mapMenu, type WpMenuItem } from "@/lib/wordpress/mappers/menuMapper";
import { getMenu as getMenuQuery } from "@/lib/wordpress/queries/menus";
import type { RepositoryFetchOptions } from "@/lib/wordpress/repositories/pageRepository";
import type { Menu } from "@/types/menu";

/**
 * GraphQL data shape for {@link getMenuQuery}.
 */
interface GetMenuData {
  menuItems?: {
    nodes?: Array<WpMenuItem | null> | null;
  } | null;
}

/**
 * Dependencies for {@link createMenuRepository}.
 */
export interface MenuRepositoryDependencies {
  /** Injectable GraphQL client. */
  client?: WordPressGraphQLClient;
  /** Public site origin used to classify internal vs external links. */
  siteUrl?: string;
}

/**
 * Menu domain repository contract (replaceable via DI).
 */
export interface MenuRepository {
  /**
   * Loads a menu by WordPress location enum value.
   *
   * @param location - Menu location (e.g. `PRIMARY_MENU`).
   * @param options - Optional Next.js fetch cache options.
   */
  getMenu: (
    location: string,
    options?: RepositoryFetchOptions,
  ) => Promise<Menu>;
}

/**
 * Re-export URL helper to preserve the public repository API.
 */
export { transformMenuUrl } from "@/lib/wordpress/mappers/menuMapper";

/**
 * Creates a menu repository bound to a GraphQL client.
 *
 * @param deps - Injectable client and site URL.
 * @returns {@link MenuRepository}.
 */
export function createMenuRepository(
  deps: MenuRepositoryDependencies = {},
): MenuRepository {
  const client = deps.client ?? getWordPressClient();
  const siteUrl = deps.siteUrl ?? getWordPressConfig().siteUrl;

  return {
    async getMenu(location, options = {}) {
      if (!location.trim()) {
        throw new ValidationError("Menu location must not be empty", "getMenu");
      }

      const data = await client.fetchGraphQL<GetMenuData>(getMenuQuery, {
        ...options,
        variables: { location, first: 50 },
        operationName: "GetMenu",
      });

      return mapMenu(location, data.menuItems?.nodes, siteUrl);
    },
  };
}

/** Default menu repository singleton (lazy). */
let defaultMenuRepository: MenuRepository | undefined;

/**
 * Returns the shared menu repository.
 *
 * @returns Default {@link MenuRepository}.
 */
export function getMenuRepository(): MenuRepository {
  if (!defaultMenuRepository) {
    defaultMenuRepository = createMenuRepository();
  }
  return defaultMenuRepository;
}

import "server-only";

import {
  getWordPressClient,
  type WordPressGraphQLClient,
} from "@/lib/wordpress/client";
import { ValidationError } from "@/lib/wordpress/errors";
import {
  mapSiteSettings,
  type WpGeneralSettings,
} from "@/lib/wordpress/mappers/siteMapper";
import { getGeneralSettings as getGeneralSettingsQuery } from "@/lib/wordpress/queries/site";
import type { RepositoryFetchOptions } from "@/lib/wordpress/repositories/pageRepository";
import type { GeneralSettings } from "@/types/site";

/**
 * GraphQL data shape for {@link getGeneralSettingsQuery}.
 */
interface GetGeneralSettingsData {
  generalSettings?: WpGeneralSettings | null;
}

/**
 * Site settings repository contract (replaceable via DI).
 */
export interface SiteRepository {
  /**
   * Loads WordPress general settings.
   *
   * @param options - Optional Next.js fetch cache options.
   */
  getGeneralSettings: (
    options?: RepositoryFetchOptions,
  ) => Promise<GeneralSettings>;
}

/**
 * Creates a site repository bound to a GraphQL client.
 *
 * @param client - Injectable WordPress GraphQL client.
 * @returns {@link SiteRepository}.
 */
export function createSiteRepository(
  client: WordPressGraphQLClient = getWordPressClient(),
): SiteRepository {
  return {
    async getGeneralSettings(options = {}) {
      const data = await client.fetchGraphQL<GetGeneralSettingsData>(
        getGeneralSettingsQuery,
        {
          ...options,
          operationName: "GetGeneralSettings",
        },
      );

      if (!data.generalSettings) {
        throw new ValidationError(
          "General settings payload was empty",
          "getGeneralSettings",
        );
      }

      return mapSiteSettings(data.generalSettings);
    },
  };
}

/** Default site repository singleton (lazy). */
let defaultSiteRepository: SiteRepository | undefined;

/**
 * Returns the shared site repository.
 *
 * @returns Default {@link SiteRepository}.
 */
export function getSiteRepository(): SiteRepository {
  if (!defaultSiteRepository) {
    defaultSiteRepository = createSiteRepository();
  }
  return defaultSiteRepository;
}

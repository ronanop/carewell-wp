/**
 * Pure GraphQL → frontend mappers for WordPress general settings.
 */

import { ValidationError } from "@/lib/wordpress/errors";
import { coerceNullableString } from "@/lib/wordpress/mappers/utils";
import type { GeneralSettings } from "@/types/site";

/**
 * Raw `generalSettings` object from WPGraphQL.
 */
export interface WpGeneralSettings {
  readonly title?: string | null;
  readonly description?: string | null;
  readonly language?: string | null;
  readonly url?: string | null;
  readonly timezone?: string | null;
}

/**
 * Maps raw GraphQL general settings to the frontend {@link GeneralSettings} model.
 *
 * @param raw - Raw `generalSettings` response object.
 * @returns Frontend {@link GeneralSettings}.
 */
export function mapSiteSettings(raw: WpGeneralSettings): GeneralSettings {
  const title = coerceNullableString(raw.title);
  const url = coerceNullableString(raw.url);

  if (!title || !url) {
    throw new ValidationError(
      "General settings are missing required fields (title, url)",
      "getGeneralSettings",
    );
  }

  return {
    title,
    description: coerceNullableString(raw.description) ?? "",
    language: coerceNullableString(raw.language) ?? "",
    url,
    timezone: coerceNullableString(raw.timezone) ?? "",
  };
}

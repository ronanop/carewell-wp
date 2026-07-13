/**
 * WordPress GraphQL → frontend mapper layer (pure functions only).
 */

export {
  coerceNullableNumber,
  coerceNullableString,
  ensureArray,
  mapFeaturedImage,
  normalizeUrl,
  type NormalizedUrl,
  type WpFeaturedImageNode,
} from "@/lib/wordpress/mappers/utils";

export {
  mapPage,
  mapPages,
  mapSeo,
  type WpPageNode,
  type WpSeo,
} from "@/lib/wordpress/mappers/pageMapper";

export {
  mapMenu,
  mapMenuItem,
  nestMenuItems,
  transformMenuUrl,
  type WpMenuItem,
} from "@/lib/wordpress/mappers/menuMapper";

export {
  mapSiteSettings,
  type WpGeneralSettings,
} from "@/lib/wordpress/mappers/siteMapper";

/**
 * WordPress GraphQL query library — documents only.
 * No fetchers, repositories, or UI. Execute via `@/lib/wordpress` client.
 */

export {
  FEATURED_IMAGE_FRAGMENT,
  MEDIA_FRAGMENT,
  MENU_ITEM_FRAGMENT,
  PAGE_SEO_FRAGMENT,
} from "@/lib/wordpress/queries/fragments";

export {
  getChildren,
  getPageByUri,
  getPages,
} from "@/lib/wordpress/queries/pages";

export { getMenu } from "@/lib/wordpress/queries/menus";

export { getMediaItem, getMediaItems } from "@/lib/wordpress/queries/media";

export { getGeneralSettings } from "@/lib/wordpress/queries/site";

/** Feature re-export for SEO consumers. */
export { PAGE_SEO_FRAGMENT as SEO_FRAGMENT } from "@/lib/wordpress/queries/seo";

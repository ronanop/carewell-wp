/**
 * Pure GraphQL → frontend mappers for WordPress pages.
 */

import { ValidationError } from "@/lib/wordpress/errors";
import {
  coerceNullableNumber,
  coerceNullableString,
  ensureArray,
  mapFeaturedImage,
  type WpFeaturedImageNode,
} from "@/lib/wordpress/mappers/utils";
import type { Page, SeoMetadata } from "@/types/page";

/**
 * Raw SEO object from WPGraphQL (PostTypeSEO).
 */
export interface WpSeo {
  readonly title?: string | null;
  readonly metaDesc?: string | null;
  readonly canonical?: string | null;
  readonly opengraphTitle?: string | null;
  readonly opengraphDescription?: string | null;
  readonly opengraphImage?: { readonly sourceUrl?: string | null } | null;
}

/**
 * Raw page node from WPGraphQL page queries.
 */
export interface WpPageNode {
  readonly __typename?: string;
  readonly id?: string | null;
  readonly databaseId?: number | null;
  readonly title?: string | null;
  readonly slug?: string | null;
  readonly uri?: string | null;
  readonly content?: string | null;
  readonly date?: string | null;
  readonly modified?: string | null;
  readonly parentId?: string | null;
  readonly featuredImage?: {
    readonly node?: WpFeaturedImageNode | null;
  } | null;
  readonly seo?: WpSeo | null;
}

/**
 * Maps raw SEO fields to the frontend SEO model.
 *
 * @param seo - Raw GraphQL SEO object.
 * @returns {@link SeoMetadata}, or `null` when absent.
 */
export function mapSeo(seo: WpSeo | null | undefined): SeoMetadata | null {
  if (!seo) {
    return null;
  }

  const title = coerceNullableString(seo.title) ?? "";
  const description = coerceNullableString(seo.metaDesc) ?? "";

  return {
    title,
    description,
    openGraphTitle: coerceNullableString(seo.opengraphTitle) ?? title,
    openGraphDescription:
      coerceNullableString(seo.opengraphDescription) ?? description,
    openGraphImage: coerceNullableString(seo.opengraphImage?.sourceUrl),
    canonicalUrl: coerceNullableString(seo.canonical) ?? "",
  };
}

/**
 * Maps a raw GraphQL page node to the frontend {@link Page} model.
 *
 * @param node - Raw GraphQL page response node.
 * @param context - Validation context for typed errors.
 * @returns Frontend {@link Page}.
 */
export function mapPage(node: WpPageNode, context: string): Page {
  const id = coerceNullableString(node.id);
  const databaseId = coerceNullableNumber(node.databaseId);
  const slug = coerceNullableString(node.slug);
  const uri = coerceNullableString(node.uri);
  const title = coerceNullableString(node.title);

  if (!id || databaseId === null || !slug || !uri || !title) {
    throw new ValidationError(
      "Page is missing required identity fields (id, databaseId, slug, uri, title)",
      context,
    );
  }

  return {
    id,
    databaseId,
    slug,
    uri,
    title,
    content: coerceNullableString(node.content),
    date: coerceNullableString(node.date),
    modified: coerceNullableString(node.modified),
    parentId: coerceNullableString(node.parentId),
    featuredImage: mapFeaturedImage(node.featuredImage?.node),
    seo: mapSeo(node.seo),
  };
}

/**
 * Maps a list of raw page nodes to frontend {@link Page} models.
 *
 * @param nodes - Raw GraphQL page nodes (nullable entries ignored).
 * @param context - Validation context prefix.
 * @returns Frontend page list.
 */
export function mapPages(
  nodes: ReadonlyArray<WpPageNode | null | undefined> | null | undefined,
  context: string,
): Page[] {
  return ensureArray(nodes).map((node, index) =>
    mapPage(node, `${context}[${index}]`),
  );
}

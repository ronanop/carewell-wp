import type { FeaturedImage } from "@/types/page";

/**
 * Shared pure helpers for GraphQL → frontend mappers.
 * No I/O, logging, env access, or caching.
 */

/**
 * Coerces an unknown value to a string, or `null` when absent/non-string.
 *
 * @param value - Raw GraphQL field value.
 * @returns String value, or `null`.
 */
export function coerceNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value;
}

/**
 * Coerces an unknown value to a finite number, or `null`.
 *
 * @param value - Raw GraphQL field value.
 * @returns Number, or `null`.
 */
export function coerceNullableNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

/**
 * Returns a readonly array, treating null/undefined as empty.
 *
 * @typeParam T - Element type.
 * @param value - Nullable array-like input.
 * @returns Concrete array (possibly empty).
 */
export function ensureArray<T>(
  value: ReadonlyArray<T | null | undefined> | null | undefined,
): readonly T[] {
  if (!value) {
    return [];
  }

  return value.filter((item): item is T => item != null);
}

/**
 * Raw featured-image media node from WPGraphQL.
 */
export interface WpFeaturedImageNode {
  readonly id?: string | null;
  readonly sourceUrl?: string | null;
  readonly altText?: string | null;
  readonly mediaDetails?: {
    readonly width?: number | null;
    readonly height?: number | null;
  } | null;
}

/**
 * Maps a featured-image node to the frontend model.
 *
 * @param node - Raw featured image node.
 * @returns Frontend featured image, or `null` when unusable.
 */
export function mapFeaturedImage(
  node: WpFeaturedImageNode | null | undefined,
): FeaturedImage | null {
  const sourceUrl = coerceNullableString(node?.sourceUrl);
  if (!sourceUrl) {
    return null;
  }

  return {
    id: coerceNullableString(node?.id) ?? "",
    sourceUrl,
    altText: coerceNullableString(node?.altText) ?? "",
    width: coerceNullableNumber(node?.mediaDetails?.width),
    height: coerceNullableNumber(node?.mediaDetails?.height),
  };
}

/**
 * Result of normalizing a WordPress menu / content URL.
 */
export interface NormalizedUrl {
  readonly href: string;
  readonly isExternal: boolean;
}

/**
 * Normalizes a WordPress URL for frontend navigation.
 * Internal absolute URLs become paths; external URLs are preserved.
 *
 * @param wpUrl - Raw URL from WordPress.
 * @param siteUrl - Public site origin used to detect internal links.
 * @returns Normalized href and external flag.
 */
export function normalizeUrl(wpUrl: string, siteUrl: string): NormalizedUrl {
  const trimmed = wpUrl.trim();
  if (
    trimmed === "" ||
    trimmed === "#" ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("mailto:")
  ) {
    return { href: trimmed || "#", isExternal: false };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed, siteUrl);
  } catch {
    return { href: trimmed, isExternal: true };
  }

  let siteHost: string;
  try {
    siteHost = new URL(siteUrl).host;
  } catch {
    siteHost = "";
  }

  const isExternal = parsed.host !== "" && parsed.host !== siteHost;
  if (isExternal) {
    return { href: parsed.toString(), isExternal: true };
  }

  const path =
    parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
  const href = `${path}${parsed.search}${parsed.hash}` || "/";
  return { href, isExternal: false };
}

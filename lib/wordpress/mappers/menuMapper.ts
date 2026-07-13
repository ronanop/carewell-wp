/**
 * Pure GraphQL → frontend mappers for WordPress menus.
 */

import { ValidationError } from "@/lib/wordpress/errors";
import {
  coerceNullableNumber,
  coerceNullableString,
  ensureArray,
  normalizeUrl,
} from "@/lib/wordpress/mappers/utils";
import type { Menu, MenuItem } from "@/types/menu";

/**
 * Raw menu item from WPGraphQL.
 */
export interface WpMenuItem {
  readonly id?: string | null;
  readonly databaseId?: number | null;
  readonly label?: string | null;
  readonly url?: string | null;
  readonly path?: string | null;
  readonly target?: string | null;
  readonly parentId?: string | null;
  readonly cssClasses?: ReadonlyArray<string | null> | null;
  readonly order?: number | null;
}

/**
 * Transforms a WordPress menu URL into a frontend href.
 * Preserved as the public helper name used by repositories/consumers.
 *
 * @param wpUrl - Raw URL from WordPress.
 * @param siteUrl - Public site origin.
 * @returns Normalized href and external flag.
 */
export function transformMenuUrl(
  wpUrl: string,
  siteUrl: string,
): { href: string; isExternal: boolean } {
  return normalizeUrl(wpUrl, siteUrl);
}

/**
 * Maps a raw menu item to a flat frontend item (children empty).
 *
 * @param node - Raw GraphQL menu item.
 * @param siteUrl - Public site origin for URL normalization.
 * @param context - Validation context.
 * @returns Flat {@link MenuItem}.
 */
export function mapMenuItem(
  node: WpMenuItem,
  siteUrl: string,
  context: string,
): MenuItem {
  const id = coerceNullableString(node.id);
  const databaseId = coerceNullableNumber(node.databaseId);
  const label = coerceNullableString(node.label);

  if (!id || databaseId === null || !label) {
    throw new ValidationError(
      "Menu item is missing required fields (id, databaseId, label)",
      context,
    );
  }

  const url = coerceNullableString(node.url) ?? "";
  const { href, isExternal } = normalizeUrl(url, siteUrl);
  const rawTarget = coerceNullableString(node.target);
  const target =
    rawTarget === "_blank" || rawTarget === "_self" ? rawTarget : null;

  const cssClasses = ensureArray(node.cssClasses).filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  return {
    id,
    databaseId,
    label,
    href,
    url,
    path: coerceNullableString(node.path),
    target,
    parentId: coerceNullableString(node.parentId),
    cssClasses: [...cssClasses],
    order: coerceNullableNumber(node.order) ?? 0,
    isExternal,
    children: [],
  };
}

/**
 * Nests flat menu items using `parentId`, preserving order.
 *
 * @param items - Flat mapped items.
 * @returns Root-level items with nested `children`.
 */
export function nestMenuItems(items: readonly MenuItem[]): MenuItem[] {
  const byId = new Map<string, MenuItem>();
  for (const item of items) {
    byId.set(item.id, { ...item, children: [] });
  }

  const roots: MenuItem[] = [];
  const sorted = [...byId.values()].sort((a, b) => a.order - b.order);

  for (const item of sorted) {
    const node = byId.get(item.id);
    if (!node) {
      continue;
    }

    if (item.parentId && byId.has(item.parentId)) {
      byId.get(item.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Maps a raw GraphQL menu items connection to the frontend {@link Menu} model.
 *
 * @param location - Menu location enum value.
 * @param nodes - Raw menu item nodes.
 * @param siteUrl - Public site origin for URL normalization.
 * @returns Frontend {@link Menu}.
 */
export function mapMenu(
  location: string,
  nodes: ReadonlyArray<WpMenuItem | null | undefined> | null | undefined,
  siteUrl: string,
): Menu {
  const flat = ensureArray(nodes).map((node, index) =>
    mapMenuItem(node, siteUrl, `getMenu:${location}[${index}]`),
  );

  return {
    location,
    items: nestMenuItems(flat),
  };
}

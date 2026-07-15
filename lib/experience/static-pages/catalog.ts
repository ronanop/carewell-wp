/**
 * Static page catalog — derived from descriptor registry (ADR-015).
 * Kept for bootstrap / list UI compat with StaticPageDefinition.
 */

import {
  descriptorToDefinition,
  getStaticPageDescriptor,
  isRegisteredStaticPageSlug,
  listStaticPageDescriptors,
} from "@/lib/experience/static-pages/registry";
import type {
  StaticPageDefinition,
  StaticPageSlug,
} from "@/types/static-page";

/** @deprecated Prefer registerStaticPageModule — kept for plugin-style append. */
export function registerStaticPage(def: StaticPageDefinition): void {
  // Legacy shims no longer mutate descriptor modules; use registry API.
  void def;
}

export function getStaticPageDef(
  slug: string,
): StaticPageDefinition | undefined {
  const descriptor = getStaticPageDescriptor(slug);
  return descriptor ? descriptorToDefinition(descriptor) : undefined;
}

export function listRegisteredStaticPages(): StaticPageDefinition[] {
  return listStaticPageDescriptors().map(descriptorToDefinition);
}

/** Canonical ordered catalog for admin + bootstrap. */
export const STATIC_PAGE_CATALOG: readonly StaticPageDefinition[] =
  listRegisteredStaticPages();

export function isStaticPageSlug(value: string): value is StaticPageSlug {
  return isRegisteredStaticPageSlug(value);
}

/** Paths reserved from WordPress catch-all (normalized with trailing slash). */
export function staticPageHandcraftedPaths(): string[] {
  return listStaticPageDescriptors().map((page) => {
    if (page.route === "/") return "/";
    const withSlash = page.route.endsWith("/") ? page.route : `${page.route}/`;
    return withSlash.startsWith("/") ? withSlash : `/${withSlash}`;
  });
}

/**
 * Static PageProvider — loads descriptor modules + PresentationConfig overrides.
 * Studio must load static pages through this provider (ADR-015).
 */

import "server-only";

import {
  STATIC_PAGE_CATALOG,
  isStaticPageSlug,
} from "@/lib/experience/static-pages/catalog";
import { getStaticPageDescriptor } from "@/lib/experience/static-pages/registry";
import { getStaticStudioPage } from "@/lib/experience/services/staticPageService";
import type {
  LoadedPage,
  PageDefinition,
  PageProvider,
} from "@/lib/experience/providers/pageProvider";
import type { StaticPageDescriptor } from "@/types/static-page-descriptor";
import type { PresentationConfig } from "@/types/presentation-config";

export type LoadedStaticPage = {
  definition: PageDefinition;
  descriptor: StaticPageDescriptor;
  config: PresentationConfig;
  pageId: string;
  status: "DRAFT" | "PUBLISHED" | "NOT_CONFIGURED";
  /** @deprecated Empty shell retained for VisualBuilder typing only. */
  presentation: LoadedPage["presentation"] | null;
};

export function createStaticPageProvider(): PageProvider & {
  loadStatic(id: string): Promise<LoadedStaticPage | null>;
} {
  return {
    kind: "static",

    async list(): Promise<PageDefinition[]> {
      return STATIC_PAGE_CATALOG.map((def) => ({
        id: def.slug,
        source: "static" as const,
        title: def.title,
        route: def.path,
        category: def.category,
      }));
    },

    async load(id: string): Promise<LoadedPage | null> {
      const loaded = await this.loadStatic(id);
      if (!loaded) return null;
      // Static pages no longer synthesize PresentationPage for canvas (ADR-015).
      // Returned presentation is null; Studio uses loadStatic + page view.
      return {
        definition: loaded.definition,
        presentation: null as unknown as LoadedPage["presentation"],
        config: loaded.config,
      };
    },

    async loadStatic(id: string): Promise<LoadedStaticPage | null> {
      if (!isStaticPageSlug(id)) return null;
      const descriptor = getStaticPageDescriptor(id);
      if (!descriptor) return null;

      const studio = await getStaticStudioPage(id);
      if (!studio?.page) return null;

      return {
        definition: {
          id: studio.page.id,
          source: "static",
          title: descriptor.title,
          route: descriptor.route,
          category: descriptor.category,
        },
        descriptor,
        config: studio.initialConfig,
        pageId: studio.page.id,
        status: studio.status,
        presentation: null,
      };
    },
  };
}

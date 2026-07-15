/**
 * WordPress PageProvider — wraps Studio WP page list / presentation engine.
 */

import "server-only";

import { getPresentationPagePreview } from "@/lib/experience/engine/presentationEngine";
import { listStudioPages } from "@/lib/experience/services/pageListService";
import { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
import {
  createDefaultPresentationConfig,
  parsePresentationConfig,
} from "@/lib/experience/validations/presentationConfig";
import type {
  LoadedPage,
  PageDefinition,
  PageProvider,
} from "@/lib/experience/providers/pageProvider";

export function createWordPressPageProvider(): PageProvider {
  return {
    kind: "wordpress",

    async list(): Promise<PageDefinition[]> {
      const pages = await listStudioPages();
      return pages.map((page) => ({
        id: page.id,
        source: "wordpress" as const,
        title: page.title,
        route: page.uri,
        category: "WordPress",
      }));
    },

    async load(id: string): Promise<LoadedPage | null> {
      const pages = createWordPressPageRepository();
      const page = await pages.findById(id);
      if (!page) return null;

      const config = page.presentation
        ? parsePresentationConfig(page.presentation.config)
        : createDefaultPresentationConfig("generic");

      const presentation = await getPresentationPagePreview(id, config);
      if (!presentation) return null;

      return {
        definition: {
          id: page.id,
          source: "wordpress",
          title: page.title,
          route: page.uri,
          category: "WordPress",
        },
        presentation,
        config,
      };
    },
  };
}

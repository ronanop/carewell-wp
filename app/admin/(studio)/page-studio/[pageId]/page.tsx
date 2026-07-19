import { notFound } from "next/navigation";

import { VisualBuilder } from "@/components/admin/builder/VisualBuilder";
import { getPresentationPagePreview } from "@/lib/experience/engine/presentationEngine";
import { getStudioPlatformCatalog } from "@/lib/experience/platform/catalog";
import { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
import {
  createDefaultPresentationConfig,
  parsePresentationConfig,
} from "@/lib/experience/validations/presentationConfig";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";
import type { PresentationPage } from "@/types/presentation-config";

type PageStudioRouteProps = {
  params: Promise<{ pageId: string }>;
};

/**
 * Experience Studio Visual Builder (Phase 4.1).
 * Full-screen WYSIWYG editor using the same PresentationPageView tree as production.
 */
export default async function PageStudioPage({ params }: PageStudioRouteProps) {
  const { pageId } = await params;
  const pages = createWordPressPageRepository();
  const page = await pages.findById(pageId);
  if (!page) notFound();

  const initialConfig = page.presentation
    ? parsePresentationConfig(page.presentation.config)
    : createDefaultPresentationConfig("generic");

  const previewFromEngine = await getPresentationPagePreview(
    pageId,
    initialConfig,
  );

  const fallbackPreview: PresentationPage = {
    uri: page.uri,
    title: page.title,
    contentHtml: "",
    wordpressStatus: page.status,
    featuredImage: page.featuredImageUrl
      ? {
          databaseId: 0,
          sourceUrl: page.featuredImageUrl,
          altText: page.title,
          width: null,
          height: null,
        }
      : null,
    seo: {
      title: page.seoTitle,
      description: null,
      canonicalUrl: null,
      openGraphTitle: null,
      openGraphDescription: null,
      openGraphImage: page.featuredImageUrl,
    },
    config: initialConfig,
    resolved: {
      heroImage: null,
      ogImage: null,
      sectionMedia: {},
    },
    presentationStatus: page.presentation?.status ?? "NOT_CONFIGURED",
    breadcrumbs: buildUriBreadcrumbs(page.uri).map(({ label, href }) => ({
      label,
      href,
    })),
    pageType: "GENERIC",
    chrome: { consultation: null },
  };

  const catalog = getStudioPlatformCatalog();

  return (
    <VisualBuilder
      pageId={page.id}
      title={page.title}
      uri={page.uri}
      basePage={previewFromEngine ?? fallbackPreview}
      initialConfig={initialConfig}
      catalogBlocks={catalog.blocks.map((block) => ({
        id: block.id,
        name: block.name,
        category: block.category,
        packId: block.packId,
        version: block.version,
      }))}
    />
  );
}

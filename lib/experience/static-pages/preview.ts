/**
 * Builds a PresentationPage shell for static pages.
 * @deprecated ADR-015 — Static Studio mounts real page views. Do not use for canvas.
 * Retained only if a WP-shaped shell is required for shared typing.
 */

import { classifyPage } from "@/lib/experience/engine/pageClassification";
import { resolvePageChrome } from "@/lib/experience/chrome/widgetEngine";
import type { PresentationConfig, PresentationPage } from "@/types/presentation-config";
import type { StaticPageDefinition } from "@/types/static-page";

/** @deprecated Use StaticPageProvider.loadStatic + page views instead. */
export function buildStaticPresentationPage(input: {
  def: StaticPageDefinition;
  config: PresentationConfig;
  presentationStatus: "DRAFT" | "PUBLISHED" | "NOT_CONFIGURED";
}): PresentationPage {
  const { def, config, presentationStatus } = input;
  const uri =
    def.path === "/"
      ? "/"
      : def.path.endsWith("/")
        ? def.path
        : `${def.path}/`;

  const pageType = classifyPage({
    uri,
    title: def.title,
    slug: def.slug,
    templateSlug: config.templateSlug,
    pageTypeOverride: config.pageTypeOverride ?? null,
  });

  return {
    uri,
    title: def.title,
    contentHtml: "",
    wordpressStatus: "static",
    featuredImage: null,
    seo: {
      title: def.title,
      description: def.description,
      canonicalUrl: null,
      openGraphTitle: null,
      openGraphDescription: null,
      openGraphImage: null,
    },
    config,
    resolved: {
      heroImage: null,
      ogImage: null,
      sectionMedia: {},
    },
    presentationStatus,
    breadcrumbs:
      uri === "/"
        ? [{ label: "Home", href: "/" }]
        : [
            { label: "Home", href: "/" },
            { label: def.title, href: uri },
          ],
    pageType,
    chrome: resolvePageChrome({
      uri,
      title: def.title,
      slug: def.slug,
      templateSlug: config.templateSlug,
      pageTypeOverride: config.pageTypeOverride ?? null,
      pageChrome: config.chrome,
      settings: null,
    }),
  };
}

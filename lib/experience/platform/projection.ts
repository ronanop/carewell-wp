/**
 * Extends PresentationEngine with platform BlockDocument projection.
 * Does not replace existing merge/render path — additive only.
 */

import "server-only";

import { createBindingContext } from "@/lib/experience/platform/binding/engine";
import { presentationConfigToBlockDocument } from "@/lib/experience/platform/bridge/presentationBridge";
import {
  resolveBlockTree,
  type ResolvedBlockNode,
} from "@/lib/experience/platform/composition/tree";
import {
  getThemeTokens,
  tokensToCssVars,
} from "@/lib/experience/platform/tokens/engine";
import { getPresentationPage } from "@/lib/experience/engine/presentationEngine";
import type { BlockDocument } from "@/types/studio-platform";

export type PresentationPlatformProjection = {
  document: BlockDocument;
  resolvedTree: ResolvedBlockNode[];
  themeCssVars: Record<string, string>;
};

/**
 * Projects a live PresentationPage into the Plugin SDK block tree.
 * Public rendering continues to use PresentationPageView until Phase 2 renderer ships.
 */
export async function getPresentationPlatformProjection(
  uri: string,
): Promise<PresentationPlatformProjection | null> {
  const page = await getPresentationPage(uri);
  if (!page) return null;

  const document = presentationConfigToBlockDocument(page.config);
  const tokens = getThemeTokens(document.themeId);

  const context = createBindingContext({
    title: page.title,
    uri: page.uri,
    slug: page.uri.replace(/^\/|\/$/g, "") || "home",
    contentHtml: page.contentHtml,
    featuredImage: page.featuredImage
      ? {
          url: page.featuredImage.sourceUrl,
          alt: page.featuredImage.altText,
          width: page.featuredImage.width,
          height: page.featuredImage.height,
        }
      : null,
    seo: {
      title: page.seo.title,
      metaDesc: page.seo.description,
      canonical: page.seo.canonicalUrl,
      ogImage: page.seo.openGraphImage,
    },
    themeVariant: page.config.theme.variant,
    themeId: document.themeId,
  });

  const resolvedTree = resolveBlockTree(document.root, context, {
    templateSlug: page.config.templateSlug,
    themeId: document.themeId,
  });

  return {
    document,
    resolvedTree,
    themeCssVars: tokensToCssVars(tokens),
  };
}

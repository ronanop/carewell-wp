import "server-only";

import { resolvePageChrome } from "@/lib/experience/chrome/widgetEngine";
import { classifyPage } from "@/lib/experience/engine/pageClassification";
import { createConsultationSettingsRepository } from "@/lib/experience/repositories/consultationSettingsRepository";
import { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
import { getCachedPagePresentation } from "@/lib/experience/services/presentationService";
import { getDefaultSite } from "@/lib/experience/services/siteService";
import {
  createDefaultPresentationConfig,
  parsePresentationConfig,
} from "@/lib/experience/validations/presentationConfig";
import { getPageRepository, normalizePageUri } from "@/lib/wordpress/repositories/pageRepository";
import { getMediaService } from "@/lib/wordpress/services/mediaService";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";
import type {
  PresentationConfig,
  PresentationPage,
  ResolvedMedia,
} from "@/types/presentation-config";
import type { FeaturedImage, Page } from "@/types/page";
import type { MediaAsset, MediaRef } from "@/types/wordpress-media";

function assetToResolved(asset: MediaAsset | null | undefined): ResolvedMedia | null {
  if (!asset?.url) return null;
  return {
    databaseId: asset.id,
    sourceUrl: asset.url,
    altText: asset.alt,
    width: asset.width,
    height: asset.height,
  };
}

function refToResolved(ref: MediaRef | null | undefined): ResolvedMedia | null {
  if (!ref?.sourceUrl) {
    if (ref?.mediaId) {
      return {
        databaseId: ref.mediaId,
        sourceUrl: "",
        altText: ref.alt || ref.title,
        width: ref.width,
        height: ref.height,
        missing: true,
      };
    }
    return null;
  }
  return {
    databaseId: ref.mediaId,
    sourceUrl: ref.sourceUrl,
    altText: ref.alt || ref.title,
    width: ref.width,
    height: ref.height,
    missing: ref.missing,
  };
}

function featuredToResolved(image: FeaturedImage | null): ResolvedMedia | null {
  if (!image?.sourceUrl) return null;
  return {
    databaseId: 0,
    sourceUrl: image.sourceUrl,
    altText: image.altText ?? "",
    width: image.width ?? null,
    height: image.height ?? null,
  };
}

function collectMediaRefs(config: PresentationConfig): MediaRef[] {
  const refs: MediaRef[] = [];
  if (config.hero.imageSource === "wordpress-media" && config.hero.media) {
    refs.push(config.hero.media);
  }
  if (config.seo.ogImage) refs.push(config.seo.ogImage);
  for (const section of config.sections) {
    if (section.settings.doctorPhoto) refs.push(section.settings.doctorPhoto);
    refs.push(...section.settings.gallery);
  }
  return refs;
}

function resolveFromMapOrSnapshot(
  ref: MediaRef | null | undefined,
  mediaById: Map<number, ResolvedMedia>,
): ResolvedMedia | null {
  if (!ref) return null;
  return mediaById.get(ref.mediaId) ?? refToResolved(ref);
}

function resolveHeroImage(
  config: PresentationConfig,
  page: Page,
  mediaById: Map<number, ResolvedMedia>,
): ResolvedMedia | null {
  if (!config.hero.enabled || config.hero.imageSource === "none") {
    return null;
  }
  if (config.hero.imageSource === "featured") {
    return featuredToResolved(page.featuredImage);
  }
  return resolveFromMapOrSnapshot(config.hero.media, mediaById);
}

async function buildResolvedMediaMap(
  config: PresentationConfig,
): Promise<Map<number, ResolvedMedia>> {
  const media = getMediaService();
  const refs = collectMediaRefs(config);
  const ids = [...new Set(refs.map((ref) => ref.mediaId))];
  const resolvedList = await media.resolveMany(ids);
  const mediaById = new Map<number, ResolvedMedia>();

  for (const asset of resolvedList) {
    const resolved = assetToResolved(asset);
    if (resolved) mediaById.set(resolved.databaseId, resolved);
  }

  // Snapshot fallback for missing live assets
  for (const ref of refs) {
    if (!mediaById.has(ref.mediaId)) {
      const snapshot = refToResolved({ ...ref, missing: true });
      if (snapshot?.sourceUrl) {
        mediaById.set(ref.mediaId, snapshot);
      } else if (snapshot) {
        mediaById.set(ref.mediaId, snapshot);
      }
    }
  }

  return mediaById;
}

function buildSectionMedia(
  config: PresentationConfig,
  mediaById: Map<number, ResolvedMedia>,
): Record<string, ResolvedMedia[]> {
  const sectionMedia: Record<string, ResolvedMedia[]> = {};
  for (const section of config.sections) {
    const refs = [
      ...(section.settings.doctorPhoto ? [section.settings.doctorPhoto] : []),
      ...section.settings.gallery,
    ];
    sectionMedia[section.id] = refs
      .map((ref) => resolveFromMapOrSnapshot(ref, mediaById))
      .filter((item): item is ResolvedMedia => Boolean(item?.sourceUrl));
  }
  return sectionMedia;
}

async function attachChrome(
  page: Omit<PresentationPage, "pageType" | "chrome"> &
    Partial<Pick<PresentationPage, "pageType" | "chrome">>,
  config: PresentationConfig,
): Promise<PresentationPage> {
  const slug =
    page.uri
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean)
      .pop() ?? "";

  const settings =
    await createConsultationSettingsRepository().getOrCreateDefault();

  const pageType = classifyPage({
    uri: page.uri,
    slug,
    title: page.title,
    templateSlug: config.templateSlug,
    pageTypeOverride: config.pageTypeOverride ?? null,
  });

  const chrome = resolvePageChrome({
    uri: page.uri,
    slug,
    title: page.title,
    templateSlug: config.templateSlug,
    pageTypeOverride: config.pageTypeOverride ?? null,
    settings,
    pageChrome: config.chrome,
  });

  return {
    ...page,
    pageType,
    chrome,
  };
}

/**
 * PresentationEngine — sole merger of WordPress content + PresentationConfig.
 */
export async function getPresentationPage(
  uri: string,
): Promise<PresentationPage | null> {
  const normalizedUri = normalizePageUri(uri);
  const wp = getPageRepository();

  let page: Page;
  try {
    page = await wp.getPageByUri(normalizedUri);
  } catch {
    return null;
  }

  const site = await getDefaultSite();
  const localPages = createWordPressPageRepository();
  const local = await localPages.findByUri(site.id, normalizedUri);

  const config =
    (await getCachedPagePresentation(normalizedUri)) ??
    createDefaultPresentationConfig();

  const presentationStatus = local?.presentation
    ? local.presentation.status
    : "NOT_CONFIGURED";

  const publicConfig =
    presentationStatus === "PUBLISHED"
      ? local?.presentation
        ? parsePresentationConfig(local.presentation.config)
        : config
      : createDefaultPresentationConfig(config.templateSlug);

  const mediaById = await buildResolvedMediaMap(publicConfig);
  const heroImage = resolveHeroImage(publicConfig, page, mediaById);
  const ogImage = resolveFromMapOrSnapshot(publicConfig.seo.ogImage, mediaById);
  const breadcrumbs = buildUriBreadcrumbs(normalizedUri, page.title);

  return attachChrome(
    {
      uri: page.uri,
      title: page.title,
      contentHtml: page.content ?? "",
      wordpressStatus: "publish",
      featuredImage: featuredToResolved(page.featuredImage),
      seo: {
        title: page.seo?.title ?? null,
        description: page.seo?.description ?? null,
        canonicalUrl:
          publicConfig.seo.canonicalOverride ?? page.seo?.canonicalUrl ?? null,
        openGraphTitle: page.seo?.openGraphTitle ?? null,
        openGraphDescription: page.seo?.openGraphDescription ?? null,
        openGraphImage:
          ogImage?.sourceUrl ||
          page.seo?.openGraphImage ||
          page.featuredImage?.sourceUrl ||
          null,
      },
      config: publicConfig,
      resolved: {
        heroImage,
        ogImage,
        sectionMedia: buildSectionMedia(publicConfig, mediaById),
      },
      presentationStatus,
      breadcrumbs,
    },
    publicConfig,
  );
}

export async function getPresentationPagePreview(
  pageId: string,
  draftConfig?: PresentationConfig,
): Promise<PresentationPage | null> {
  const pages = createWordPressPageRepository();
  const local = await pages.findById(pageId);
  if (!local) return null;

  const wp = getPageRepository();
  let page: Page;
  try {
    page = await wp.getPageByUri(local.uri, { cache: "no-store" });
  } catch {
    page = {
      id: String(local.databaseId),
      databaseId: local.databaseId,
      title: local.title,
      slug: local.slug,
      uri: local.uri,
      content: "",
      date: local.lastWordPressModified.toISOString(),
      modified: local.lastWordPressModified.toISOString(),
      parentId: null,
      featuredImage: local.featuredImageUrl
        ? {
            id: "featured",
            sourceUrl: local.featuredImageUrl,
            altText: local.title,
            width: null,
            height: null,
          }
        : null,
      seo: null,
    };
  }

  const config =
    draftConfig ??
    (local.presentation
      ? parsePresentationConfig(local.presentation.config)
      : createDefaultPresentationConfig());

  const mediaById = await buildResolvedMediaMap(config);
  const ogImage = resolveFromMapOrSnapshot(config.seo.ogImage, mediaById);

  return attachChrome(
    {
      uri: page.uri,
      title: page.title,
      contentHtml: page.content ?? "",
      wordpressStatus: local.status,
      featuredImage: featuredToResolved(page.featuredImage),
      seo: {
        title: page.seo?.title ?? local.seoTitle,
        description: page.seo?.description ?? null,
        canonicalUrl:
          config.seo.canonicalOverride ?? page.seo?.canonicalUrl ?? null,
        openGraphTitle: page.seo?.openGraphTitle ?? null,
        openGraphDescription: page.seo?.openGraphDescription ?? null,
        openGraphImage:
          ogImage?.sourceUrl ||
          page.seo?.openGraphImage ||
          page.featuredImage?.sourceUrl ||
          null,
      },
      config,
      resolved: {
        heroImage: resolveHeroImage(config, page, mediaById),
        ogImage,
        sectionMedia: buildSectionMedia(config, mediaById),
      },
      presentationStatus: local.presentation?.status ?? "NOT_CONFIGURED",
      breadcrumbs: buildUriBreadcrumbs(page.uri, page.title),
    },
    config,
  );
}

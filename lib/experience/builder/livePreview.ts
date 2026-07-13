import type {
  PresentationConfig,
  PresentationPage,
  ResolvedMedia,
} from "@/types/presentation-config";

/**
 * Instant client-side preview merge — same tree as production, no server roundtrip.
 */
export function buildLivePreviewPage(
  base: PresentationPage,
  config: PresentationConfig,
): PresentationPage {
  const heroImage = resolveHeroImage(base, config);
  const sectionMedia: Record<string, ResolvedMedia[]> = {};

  for (const section of config.sections) {
    const refs = [
      ...(section.settings.doctorPhoto ? [section.settings.doctorPhoto] : []),
      ...section.settings.gallery,
    ];
    sectionMedia[section.id] = refs
      .filter((ref) => Boolean(ref.sourceUrl))
      .map((ref) => ({
        databaseId: ref.mediaId,
        sourceUrl: ref.sourceUrl,
        altText: ref.alt || ref.title,
        width: ref.width,
        height: ref.height,
        missing: ref.missing,
      }));
  }

  const og = config.seo.ogImage;

  return {
    ...base,
    config,
    seo: {
      ...base.seo,
      canonicalUrl: config.seo.canonicalOverride ?? base.seo.canonicalUrl,
      openGraphImage:
        og?.sourceUrl ||
        base.seo.openGraphImage ||
        base.featuredImage?.sourceUrl ||
        null,
    },
    resolved: {
      heroImage,
      ogImage: og?.sourceUrl
        ? {
            databaseId: og.mediaId,
            sourceUrl: og.sourceUrl,
            altText: og.alt || og.title,
            width: og.width,
            height: og.height,
            missing: og.missing,
          }
        : null,
      sectionMedia,
    },
  };
}

function resolveHeroImage(
  base: PresentationPage,
  config: PresentationConfig,
): ResolvedMedia | null {
  if (!config.hero.enabled || config.hero.imageSource === "none") return null;
  if (config.hero.imageSource === "featured") return base.featuredImage;
  if (config.hero.media?.sourceUrl) {
    return {
      databaseId: config.hero.media.mediaId,
      sourceUrl: config.hero.media.sourceUrl,
      altText: config.hero.media.alt || config.hero.media.title,
      width: config.hero.media.width,
      height: config.hero.media.height,
      missing: config.hero.media.missing,
    };
  }
  return base.featuredImage;
}

import "server-only";

import { resolvePageChrome } from "@/lib/experience/chrome/widgetEngine";
import { classifyPage } from "@/lib/experience/engine/pageClassification";
import { createConsultationSettingsRepository } from "@/lib/experience/repositories/consultationSettingsRepository";
import { createWordPressPostRepository } from "@/lib/experience/repositories/wordpressPostRepository";
import { getCachedBlogPresentation } from "@/lib/experience/services/blogPresentationService";
import { getDefaultSite } from "@/lib/experience/services/siteService";
import {
  createDefaultBlogPresentationConfig,
  parseBlogPresentationConfig,
  type BlogPresentationConfig,
  DEFAULT_BLOG_SIDEBAR,
} from "@/lib/experience/validations/blogPresentationConfig";
import { parseHtmlToArticleAst } from "@/lib/blog/article/parseHtmlToArticleAst";
import { analyzeArticleSemantics } from "@/lib/experience/blog/semantic/analyzeArticle";
import {
  buildComposerSignals,
  composeEditorialLayout,
} from "@/lib/experience/blog/layout/compose";
import { applyContentOverrides } from "@/lib/experience/content/applyOverrides";
import {
  getBlogPostByUri,
  getFeaturedAndLatestPosts,
  getRelatedBlogPosts,
  listBlogPosts,
} from "@/lib/blog/services/blogService";
import { SITE_URL } from "@/lib/seo/constants";
import { getMediaService } from "@/lib/wordpress/services/mediaService";
import { buildBlogUriBreadcrumbs } from "@/lib/wordpress/routeUtils";
import { normalizePageUri } from "@/lib/wordpress/repositories/pageRepository";
import type { BlogAdjacentPost, BlogPost, BlogPostSummary } from "@/types/blog";
import type { BlogDocument } from "@/types/blog-document";
import type { FeaturedImage } from "@/types/page";
import type { MediaAsset, MediaRef } from "@/types/wordpress-media";
import type { ResolvedMedia } from "@/types/presentation-config";

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

function collectMediaRefs(config: BlogPresentationConfig): MediaRef[] {
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

async function buildResolvedMediaMap(
  config: BlogPresentationConfig,
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

  for (const ref of refs) {
    if (!mediaById.has(ref.mediaId)) {
      const snapshot = refToResolved({ ...ref, missing: true });
      if (snapshot) mediaById.set(ref.mediaId, snapshot);
    }
  }

  return mediaById;
}

function resolveFromMapOrSnapshot(
  ref: MediaRef | null | undefined,
  mediaById: Map<number, ResolvedMedia>,
): ResolvedMedia | null {
  if (!ref) return null;
  return mediaById.get(ref.mediaId) ?? refToResolved(ref);
}

function resolveHeroImage(
  config: BlogPresentationConfig,
  post: BlogPost,
  mediaById: Map<number, ResolvedMedia>,
): ResolvedMedia | null {
  if (!config.hero.enabled || config.hero.imageSource === "none") return null;
  if (config.hero.imageSource === "featured") {
    return featuredToResolved(post.featuredImage);
  }
  return resolveFromMapOrSnapshot(config.hero.media, mediaById);
}

function buildSectionMedia(
  config: BlogPresentationConfig,
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

function toAdjacent(post: BlogPostSummary | undefined): BlogAdjacentPost | null {
  if (!post) return null;
  return {
    slug: post.slug,
    uri: post.uri,
    title: post.title,
    featuredImage: post.featuredImage,
    readingTimeMinutes: post.readingTimeMinutes,
    categories: post.categories,
  };
}

async function resolveAdjacent(
  post: BlogPost,
): Promise<{ previous: BlogAdjacentPost | null; next: BlogAdjacentPost | null }> {
  // Approximate prev/next from recent feed around this post.
  const { posts } = await listBlogPosts({ first: 40 });
  const index = posts.findIndex((p) => p.databaseId === post.databaseId);
  if (index < 0) {
    return {
      previous: toAdjacent(posts[1]),
      next: toAdjacent(posts[0]),
    };
  }
  return {
    previous: toAdjacent(posts[index + 1]),
    next: toAdjacent(posts[index - 1]),
  };
}

/**
 * BlogPresentationEngine — sole merger of WordPress Post + BlogPresentationConfig.
 * Parallel to PresentationEngine for Pages.
 */
export async function getBlogDocument(
  uri: string,
): Promise<BlogDocument | null> {
  const normalizedUri = normalizePageUri(uri);
  const post = await getBlogPostByUri(normalizedUri);
  if (!post) return null;

  const site = await getDefaultSite();
  const localPosts = createWordPressPostRepository();
  const local = await localPosts.findByUri(site.id, normalizedUri);

  const cached = await getCachedBlogPresentation(normalizedUri);
  const presentationStatus = local?.presentation
    ? local.presentation.status
    : "NOT_CONFIGURED";

  const publicConfig: BlogPresentationConfig =
    presentationStatus === "PUBLISHED" && local?.presentation
      ? parseBlogPresentationConfig(local.presentation.config)
      : cached
        ? parseBlogPresentationConfig(cached)
        : createDefaultBlogPresentationConfig();

  // Always classify as BLOG for posts
  publicConfig.pageTypeOverride = "BLOG";

  const mediaById = await buildResolvedMediaMap(publicConfig);
  const heroImage = resolveHeroImage(publicConfig, post, mediaById);
  const ogImage = resolveFromMapOrSnapshot(publicConfig.seo.ogImage, mediaById);

  let article;
  let semantic;
  let layout;
  try {
    const articleBase = parseHtmlToArticleAst(post.content ?? "");
    article = {
      ...articleBase,
      content: applyContentOverrides(
        articleBase.content,
        publicConfig.contentOverrides,
      ),
    };
    semantic = analyzeArticleSemantics(article);
    layout = composeEditorialLayout({
      sections: semantic.sections,
      signals: buildComposerSignals({
        sections: semantic.sections,
        faqCount: article.faqs.length,
        readingMinutes: article.readingTimeMinutes || post.readingTimeMinutes,
      }),
      overrides: {
        templateId: publicConfig.layoutTemplateId,
        heroLayout: publicConfig.heroLayout,
        spacingPreset: publicConfig.spacingPreset,
        presentationPolish:
          (publicConfig as { presentationPolish?: import("@/types/editorial-layout").ExperiencePresentationPolish })
            .presentationPolish ?? {
            preferSoftSurfaces: true,
            tightHeroHandoff: true,
            readingMeasure: "comfortable",
            defaultCardStyle: "editorial",
            buttonHierarchy: "primary-secondary-tertiary",
          },
      },
    });
  } catch (error) {
    console.error("[CWMC]", {
      context: "blogPresentationEngine.getBlogDocument",
      uri: post.uri,
      message:
        error instanceof Error ? error.message : "Blog editorial pipeline soft-fail",
    });
    // Soft-fail: empty editorial shell — BlogPresentationPage still mounts;
    // never silently drop to a page-only Gutenberg path for posts.
    article = {
      version: 1 as const,
      content: { version: 1 as const, sourceHash: "empty", nodes: [] },
      blockMeta: {},
      toc: [],
      faqs: [],
      readingTimeMinutes: post.readingTimeMinutes || 1,
      wordCount: 0,
      sourceHash: "empty",
    };
    semantic = { version: 1 as const, sections: [], documentFaqs: [] };
    layout = composeEditorialLayout({
      sections: [],
      signals: buildComposerSignals({
        sections: [],
        faqCount: 0,
        readingMinutes: post.readingTimeMinutes || 1,
      }),
      overrides: {
        templateId: publicConfig.layoutTemplateId,
        heroLayout: publicConfig.heroLayout,
        spacingPreset: publicConfig.spacingPreset,
      },
    });
  }

  const primaryCategory = post.categories[0] ?? null;
  let related: BlogPostSummary[] = [];
  if (primaryCategory) {
    related = await getRelatedBlogPosts({
      categorySlug: primaryCategory.name,
      excludeDatabaseId: post.databaseId,
      first: 6,
    });
  }

  const { previous, next } = await resolveAdjacent(post);
  const { latest, trending } = await getFeaturedAndLatestPosts({ latestCount: 5 });

  const settings =
    await createConsultationSettingsRepository().getOrCreateDefault();

  const pageType = classifyPage({
    uri: post.uri,
    slug: post.slug,
    title: post.title,
    templateSlug: publicConfig.templateSlug,
    pageTypeOverride: "BLOG",
  });

  const chrome = resolvePageChrome({
    uri: post.uri,
    slug: post.slug,
    title: post.title,
    templateSlug: publicConfig.templateSlug,
    pageTypeOverride: "BLOG",
    settings,
    pageChrome: publicConfig.chrome,
  });

  const shareUrl = `${SITE_URL}${post.uri.replace(/\/$/, "")}`;
  const uniqueBreadcrumbs = buildBlogUriBreadcrumbs(post.uri);

  return {
    uri: post.uri,
    slug: post.slug,
    title: post.title,
    wordpressStatus: post.status,
    pageType,
    hero: {
      title: post.title,
      excerpt: post.excerpt,
      featuredImage: heroImage ?? featuredToResolved(post.featuredImage),
      category: primaryCategory,
      categories: post.categories,
      publishedAt: post.date,
      modifiedAt: post.modified,
      author: post.author,
      readingTimeMinutes: article.readingTimeMinutes || post.readingTimeMinutes,
      views: null,
      shareUrl,
    },
    author: post.author,
    tags: post.tags,
    categories: post.categories,
    article,
    semantic,
    layout,
    contentHtml: post.content ?? "",
    toc: article.toc,
    faqs: article.faqs,
    comments: post.comments,
    related,
    previous,
    next,
    popular: trending,
    latest,
    breadcrumbs: uniqueBreadcrumbs,
    seo: {
      title: post.seo?.title ?? null,
      description: post.seo?.description ?? post.excerpt,
      canonicalUrl:
        publicConfig.seo.canonicalOverride ?? post.seo?.canonicalUrl ?? shareUrl,
      openGraphTitle: post.seo?.openGraphTitle ?? null,
      openGraphDescription: post.seo?.openGraphDescription ?? null,
      openGraphImage:
        ogImage?.sourceUrl ||
        post.seo?.openGraphImage ||
        post.featuredImage?.sourceUrl ||
        null,
    },
    config: publicConfig,
    sidebar: publicConfig.blogSidebar ?? DEFAULT_BLOG_SIDEBAR,
    resolved: {
      heroImage: heroImage ?? featuredToResolved(post.featuredImage),
      ogImage,
      sectionMedia: buildSectionMedia(publicConfig, mediaById),
    },
    presentationStatus,
    chrome,
    leadContext: {
      blogUrl: shareUrl,
      blogTitle: post.title,
      category: primaryCategory?.name ?? null,
    },
  };
}

export async function getBlogDocumentPreview(
  postId: string,
  draftConfig?: BlogPresentationConfig,
): Promise<BlogDocument | null> {
  const posts = createWordPressPostRepository();
  const local = await posts.findById(postId);
  if (!local) return null;

  const live = await getBlogPostByUri(local.uri);
  if (!live) {
    // Degraded preview from metadata only
    return null;
  }

  const config =
    draftConfig ??
    (local.presentation
      ? parseBlogPresentationConfig(local.presentation.config)
      : createDefaultBlogPresentationConfig());

  // Reuse public path with forced draft config by temporarily building
  const doc = await getBlogDocument(local.uri);
  if (!doc) return null;

  return {
    ...doc,
    config,
    sidebar: config.blogSidebar ?? DEFAULT_BLOG_SIDEBAR,
    presentationStatus: local.presentation?.status ?? "NOT_CONFIGURED",
  };
}

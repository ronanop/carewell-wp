import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import {
  buildSanityPostMetadata,
  SanityPostTemplate,
} from "@/components/blog/SanityPostTemplate";
import { SanityPageTemplate, buildSanityPageMetadata } from "@/components/pages/SanityPageTemplate";
import {
  buildSanityServiceMetadata,
  SanityServiceTemplate,
} from "@/components/service/SanityServiceTemplate";
import { getSanityPageByUri } from "@/lib/sanity/page";
import {
  getSanityMorePosts,
  getSanityPostByUri,
  getSanityRelatedPostsForService,
  mergeNextPosts,
  postPublicPath,
} from "@/lib/sanity/post";
import { getSanityServiceByUri } from "@/lib/sanity/service";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { isHandcraftedPath, normalizeUri } from "@/lib/routing/uri";

interface CatchAllPageProps {
  params: Promise<{
    uri: string[];
  }>;
}

export const revalidate = 3600;

function isBlogArchiveUri(uri: string): boolean {
  return uri === "/blogs/" || uri === "/blog/";
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { uri } = await params;
  const normalizedUri = normalizeUri(uri);

  if (isBlogArchiveUri(normalizedUri)) {
    return {
      title: `Blog | ${SITE_NAME}`,
      description:
        "Educational articles from Care Well Medical Centre on hair, skin, and cosmetic treatments.",
    };
  }

  if (isHandcraftedPath(normalizedUri)) {
    return { title: `Page Not Found | ${SITE_NAME}` };
  }

  const sanityService = await getSanityServiceByUri(normalizedUri);
  if (sanityService) {
    const meta = buildSanityServiceMetadata(sanityService);
    const raw = sanityService.uri || normalizedUri;
    const path = (raw.startsWith("/") ? raw : `/${raw}`).replace(/\/?$/, "/");
    return {
      ...meta,
      alternates: { canonical: `${SITE_URL}${path}` },
    };
  }

  const sanityPost = await getSanityPostByUri(normalizedUri);
  if (sanityPost) {
    const meta = buildSanityPostMetadata(sanityPost);
    const path = postPublicPath(sanityPost);
    const ogImage = sanityPost.mainImage?.asset?.url || DEFAULT_OG_IMAGE;
    return {
      ...meta,
      alternates: {
        canonical: sanityPost.seo?.canonical || `${SITE_URL}${path}`,
      },
      openGraph: {
        title: String(meta.title),
        description: meta.description ?? undefined,
        url: `${SITE_URL}${path}`,
        siteName: SITE_NAME,
        type: "article",
        images: [{ url: ogImage }],
      },
    };
  }

  const sanityPage = await getSanityPageByUri(normalizedUri);
  if (sanityPage) {
    const meta = buildSanityPageMetadata(sanityPage);
    const raw = sanityPage.uri || normalizedUri;
    const path = (raw.startsWith("/") ? raw : `/${raw}`).replace(/\/?$/, "/");
    const ogImage = sanityPage.mainImage?.asset?.url || DEFAULT_OG_IMAGE;
    return {
      ...meta,
      alternates: { canonical: `${SITE_URL}${path}` },
      openGraph: {
        title: String(meta.title),
        description: meta.description ?? undefined,
        url: `${SITE_URL}${path}`,
        siteName: SITE_NAME,
        type: "website",
        images: [{ url: ogImage }],
      },
    };
  }

  return {
    title: `Page Not Found | ${SITE_NAME}`,
    robots: { index: false, follow: true },
  };
}

/**
 * Catch-all — Sanity services, blog posts, and pages by URI/slug.
 * Handcrafted App Router paths and missing CMS docs → 404.
 */
export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { uri } = await params;
  const normalizedUri = normalizeUri(uri);

  if (normalizedUri === "/blog/" || normalizedUri === "/blogs/") {
    permanentRedirect("/blogs/");
  }

  if (isHandcraftedPath(normalizedUri)) {
    notFound();
  }

  const sanityService = await getSanityServiceByUri(normalizedUri);
  if (sanityService) {
    const relatedPosts = await getSanityRelatedPostsForService({
      category: sanityService.category,
      title: sanityService.title,
      limit: 3,
    });
    return (
      <SanityServiceTemplate
        service={sanityService}
        relatedPosts={relatedPosts}
      />
    );
  }

  const sanityPost = await getSanityPostByUri(normalizedUri);
  if (sanityPost) {
    const more = await getSanityMorePosts(sanityPost._id, 6);
    const nextPosts = mergeNextPosts(
      sanityPost.relatedPosts,
      more,
      sanityPost._id,
      3,
    );
    return <SanityPostTemplate post={sanityPost} nextPosts={nextPosts} />;
  }

  const sanityPage = await getSanityPageByUri(normalizedUri);
  if (sanityPage) {
    return <SanityPageTemplate page={sanityPage} />;
  }

  notFound();
}

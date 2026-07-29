import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SanityPageTemplate, buildSanityPageMetadata } from "@/components/pages/SanityPageTemplate";
import {
  buildSanityServiceMetadata,
  SanityServiceTemplate,
} from "@/components/service/SanityServiceTemplate";
import { getSanityPageByUri } from "@/lib/sanity/page";
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
      title: `Blogs | ${SITE_NAME}`,
      description:
        "Care Well Medical Centre articles — coming soon via Sanity CMS.",
      robots: { index: false, follow: true },
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
 * Catch-all — Sanity services and pages by URI/slug.
 * Handcrafted App Router paths and missing CMS docs → 404.
 */
export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { uri } = await params;
  const normalizedUri = normalizeUri(uri);

  if (normalizedUri === "/blog/") {
    permanentRedirect("/blogs");
  }
  if (normalizedUri === "/blogs/") {
    // WP blog archive removed — Sanity posts not wired yet.
    notFound();
  }

  if (isHandcraftedPath(normalizedUri)) {
    notFound();
  }

  const sanityService = await getSanityServiceByUri(normalizedUri);
  if (sanityService) {
    return <SanityServiceTemplate service={sanityService} />;
  }

  const sanityPage = await getSanityPageByUri(normalizedUri);
  if (sanityPage) {
    return <SanityPageTemplate page={sanityPage} />;
  }

  notFound();
}

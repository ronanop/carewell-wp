import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PresentationPage, RenderMode } from "@carewell/page-renderer";
import { getPresentationPage } from "@/lib/experience/engine/presentationEngine";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import { isHandcraftedPath, normalizeUri } from "@/lib/wordpress/routeUtils";

interface WordPressCatchAllPageProps {
  params: Promise<{
    uri: string[];
  }>;
}

export async function generateMetadata({
  params,
}: WordPressCatchAllPageProps): Promise<Metadata> {
  const { uri } = await params;
  const normalizedUri = normalizeUri(uri);
  if (isHandcraftedPath(normalizedUri)) {
    return { title: `Page Not Found | ${SITE_NAME}` };
  }

  const page = await getPresentationPage(normalizedUri);
  if (!page) {
    return {
      title: `Page Not Found | ${SITE_NAME}`,
      robots: { index: false, follow: true },
    };
  }

  const title = page.seo.title || `${page.title} | ${SITE_NAME}`;
  const description =
    page.seo.description ||
    `${page.title} at Care Well Medical Centre — advanced care in South Delhi.`;
  const canonical =
    page.seo.canonicalUrl ||
    `${SITE_URL}${page.uri.startsWith("/") ? page.uri.replace(/\/$/, "") : `/${page.uri}`}`;
  const ogImage =
    page.seo.openGraphImage || page.featuredImage?.sourceUrl || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: page.seo.openGraphTitle || title,
      description: page.seo.openGraphDescription || description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.openGraphTitle || title,
      description: page.seo.openGraphDescription || description,
      images: [ogImage],
    },
  };
}

/**
 * Catch-all WordPress pages — rendered via PresentationEngine.
 */
export default async function WordPressCatchAllPage({
  params,
}: WordPressCatchAllPageProps) {
  const { uri } = await params;
  const normalizedUri = normalizeUri(uri);

  if (isHandcraftedPath(normalizedUri)) {
    notFound();
  }

  const page = await getPresentationPage(normalizedUri);
  if (!page) {
    notFound();
  }

  const jsonLd = page.config.seo.schemaEnabled
    ? generateBreadcrumbSchema(
        page.breadcrumbs.map((item) => ({
          name: item.label,
          path: item.href === "/" ? "/" : item.href.replace(/\/$/, ""),
        })),
      )
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <PresentationPage page={page} mode={RenderMode.PUBLIC} />
    </>
  );
}

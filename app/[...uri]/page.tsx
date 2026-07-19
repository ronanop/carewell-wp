import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UnifiedExperienceRenderer } from "@/components/experience/UnifiedExperienceRenderer";
import { listBlogCategories } from "@/lib/blog/services/blogService";
import {
  resolveExperienceDocument,
  resolveExperienceSchemas,
} from "@/lib/experience/unified/resolve";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { isHandcraftedPath, normalizeUri } from "@/lib/wordpress/routeUtils";
import { RenderMode } from "@carewell/page-renderer";

interface WordPressCatchAllPageProps {
  params: Promise<{
    uri: string[];
  }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: WordPressCatchAllPageProps): Promise<Metadata> {
  const { uri } = await params;
  const normalizedUri = normalizeUri(uri);
  if (isHandcraftedPath(normalizedUri)) {
    return { title: `Page Not Found | ${SITE_NAME}` };
  }

  const doc = await resolveExperienceDocument(normalizedUri);
  if (!doc) {
    return {
      title: `Page Not Found | ${SITE_NAME}`,
      robots: { index: false, follow: true },
    };
  }

  const title = doc.seo.title || `${doc.title} | ${SITE_NAME}`;
  const description =
    doc.seo.description ||
    `${doc.title} at Care Well Medical Centre — advanced care in South Delhi.`;
  const canonical =
    doc.seo.canonicalUrl ||
    (doc.kind === "blog"
      ? doc.hero.shareUrl
      : `${SITE_URL}${doc.uri.startsWith("/") ? doc.uri.replace(/\/$/, "") : `/${doc.uri}`}`);
  const ogImage =
    doc.seo.openGraphImage ||
    doc.hero.featuredImage?.sourceUrl ||
    DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: doc.seo.openGraphTitle || title,
      description: doc.seo.openGraphDescription || description,
      url: canonical,
      siteName: SITE_NAME,
      type: doc.kind === "blog" ? "article" : "website",
      publishedTime:
        doc.kind === "blog" ? (doc.hero.publishedAt ?? undefined) : undefined,
      modifiedTime:
        doc.kind === "blog" ? (doc.hero.modifiedAt ?? undefined) : undefined,
      authors: doc.author ? [doc.author.name] : undefined,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.seo.openGraphTitle || title,
      description: doc.seo.openGraphDescription || description,
      images: [ogImage],
    },
  };
}

/**
 * Catch-all — Unified Editorial Experience Engine (Phase 7.0).
 * Resolves WordPress Page or Post into ExperienceDocument; one renderer.
 * Preserves all existing URLs.
 */
export default async function WordPressCatchAllPage({
  params,
}: WordPressCatchAllPageProps) {
  const { uri } = await params;
  const normalizedUri = normalizeUri(uri);

  if (isHandcraftedPath(normalizedUri)) {
    notFound();
  }

  const doc = await resolveExperienceDocument(normalizedUri);
  if (!doc) {
    notFound();
  }

  const categories =
    doc.kind === "blog" ? await listBlogCategories() : [];
  const schemas = doc.config.seo.schemaEnabled
    ? await resolveExperienceSchemas(normalizedUri)
    : [];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <UnifiedExperienceRenderer
        document={doc}
        categories={categories}
        mode={RenderMode.PUBLIC}
      />
    </>
  );
}

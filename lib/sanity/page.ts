import { getSanityClient } from "@/lib/sanity/client";
import {
  SANITY_PAGE_BY_SLUG,
  SANITY_PAGE_BY_URI,
} from "@/lib/sanity/queries";

export type SanityPageDoc = {
  _id: string;
  title: string;
  slug: string;
  uri?: string;
  excerpt?: string;
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
  };
  mainImage?: {
    alt?: string;
    asset?: {
      url?: string;
      metadata?: {
        lqip?: string;
        dimensions?: { width?: number; height?: number };
      };
    };
  };
  body?: unknown[];
};

export async function getSanityPageBySlug(
  slug: string,
): Promise<SanityPageDoc | null> {
  const client = await getSanityClient();
  return client.fetch<SanityPageDoc | null>(SANITY_PAGE_BY_SLUG, { slug });
}

/**
 * Resolve a Sanity `page` doc for a public URI (SEO-preserving path).
 */
export async function getSanityPageByUri(
  normalizedUri: string,
): Promise<SanityPageDoc | null> {
  const uri = normalizedUri.endsWith("/")
    ? normalizedUri
    : `${normalizedUri}/`;
  const uriNoSlash = uri.replace(/\/$/, "") || "/";
  const parts = uriNoSlash.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] || "";

  const client = await getSanityClient();

  const byUri = await client.fetch<SanityPageDoc | null>(SANITY_PAGE_BY_URI, {
    uri,
    uriNoSlash,
    slug: "__no_slug_fallback__",
  });
  if (byUri) return byUri;

  if (parts.length === 1 && slug) {
    return getSanityPageBySlug(slug);
  }

  return null;
}

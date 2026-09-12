import { cache } from "react";

import { getSanityLiveClient, sanityClient } from "@/lib/sanity/client";
import {
  SANITY_PAGE_BY_SLUG,
  SANITY_PAGE_BY_URI,
  SANITY_PAGES_LIST,
} from "@/lib/sanity/queries";

export type SanityPageListItem = {
  _id: string;
  title: string;
  slug: string;
  uri?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

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

/** Public path for a CMS page — prefers stored `uri`, else `/{slug}/`. */
export function pagePublicPath(page: {
  uri?: string | null;
  slug?: string | null;
}): string {
  const uri = page.uri?.trim();
  if (uri) {
    const path = uri.startsWith("/") ? uri : `/${uri}`;
    return path.endsWith("/") ? path : `${path}/`;
  }
  const slug = page.slug?.trim();
  if (!slug) return "/";
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

export async function getSanityPagesList(options?: {
  /** Skip API CDN — use for admin inventory refresh. */
  live?: boolean;
}): Promise<SanityPageListItem[]> {
  const client = options?.live ? await getSanityLiveClient() : sanityClient;
  return client.fetch<SanityPageListItem[]>(SANITY_PAGES_LIST);
}

export const getSanityPageBySlug = cache(
  async (slug: string): Promise<SanityPageDoc | null> => {
    return sanityClient.fetch<SanityPageDoc | null>(SANITY_PAGE_BY_SLUG, {
      slug,
    });
  },
);

/**
 * Resolve a Sanity `page` doc for a public URI (SEO-preserving path).
 */
export const getSanityPageByUri = cache(
  async (normalizedUri: string): Promise<SanityPageDoc | null> => {
    const uri = normalizedUri.endsWith("/")
      ? normalizedUri
      : `${normalizedUri}/`;
    const uriNoSlash = uri.replace(/\/$/, "") || "/";
    const parts = uriNoSlash.split("/").filter(Boolean);
    const slug = parts[parts.length - 1] || "";

    const byUri = await sanityClient.fetch<SanityPageDoc | null>(
      SANITY_PAGE_BY_URI,
      {
        uri,
        uriNoSlash,
        slug: "__no_slug_fallback__",
      },
    );
    if (byUri) return byUri;

    if (parts.length === 1 && slug) {
      return getSanityPageBySlug(slug);
    }

    return null;
  },
);

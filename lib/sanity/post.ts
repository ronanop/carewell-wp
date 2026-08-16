import type { HomeBlogPost } from "@/components/home/BlogSection";
import { getSanityClient } from "@/lib/sanity/client";
import {
  SANITY_POST_BY_SLUG,
  SANITY_POST_BY_URI,
  SANITY_POSTS_LATEST,
  SANITY_POSTS_LIST,
  SANITY_POSTS_MORE,
} from "@/lib/sanity/queries";

export type SanityPostImage = {
  alt?: string;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width?: number; height?: number };
    };
  };
};

export type SanityPostCard = {
  _id: string;
  title: string;
  slug: string;
  uri?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  modifiedAt?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
  featured?: boolean | null;
  readTimeMinutes?: number | null;
  authorName?: string | null;
  authorRole?: string | null;
  mainImage?: SanityPostImage | null;
};

export type SanityPostDoc = SanityPostCard & {
  authorImage?: SanityPostImage | null;
  midArticleCta?: {
    enabled?: boolean;
    headline?: string;
    buttonLabel?: string;
  } | null;
  relatedPosts?: SanityPostCard[] | null;
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
  } | null;
  body?: unknown[];
  rawHtml?: string | null;
};

/** Public path for a post — prefers stored WP `uri`, else `/{slug}/`. */
export function postPublicPath(post: {
  uri?: string | null;
  slug?: string | null;
}): string {
  const uri = post.uri?.trim();
  if (uri) {
    const path = uri.startsWith("/") ? uri : `/${uri}`;
    return path.endsWith("/") ? path : `${path}/`;
  }
  const slug = post.slug?.trim();
  if (!slug) return "/blogs/";
  return `/${slug.replace(/^\/+|\/+$/g, "")}/`;
}

export async function getSanityPostsList(): Promise<SanityPostCard[]> {
  const client = await getSanityClient();
  return client.fetch<SanityPostCard[]>(SANITY_POSTS_LIST);
}

export async function getSanityLatestPosts(
  limit = 3,
): Promise<SanityPostCard[]> {
  const client = await getSanityClient();
  return client.fetch<SanityPostCard[]>(SANITY_POSTS_LATEST, { limit });
}

export async function getSanityMorePosts(
  excludeId: string,
  limit = 3,
): Promise<SanityPostCard[]> {
  const client = await getSanityClient();
  return client.fetch<SanityPostCard[]>(SANITY_POSTS_MORE, {
    excludeId,
    limit,
  });
}

/**
 * Prefer CMS related posts, then fill with latest others until `limit`.
 */
export function mergeNextPosts(
  related: SanityPostCard[] | null | undefined,
  more: SanityPostCard[],
  excludeId: string,
  limit = 3,
): SanityPostCard[] {
  const seen = new Set<string>([excludeId]);
  const out: SanityPostCard[] = [];

  for (const post of [...(related || []), ...more]) {
    if (!post?._id || seen.has(post._id)) continue;
    seen.add(post._id);
    out.push(post);
    if (out.length >= limit) break;
  }

  return out;
}

export async function getSanityPostBySlug(
  slug: string,
): Promise<SanityPostDoc | null> {
  const client = await getSanityClient();
  return client.fetch<SanityPostDoc | null>(SANITY_POST_BY_SLUG, { slug });
}

/**
 * Resolve a Sanity `post` for a WordPress-style URI (SEO-preserving root path).
 * Prefers exact `uri` match; falls back to slug only for single-segment URIs.
 */
export async function getSanityPostByUri(
  normalizedUri: string,
): Promise<SanityPostDoc | null> {
  const uri = normalizedUri.endsWith("/")
    ? normalizedUri
    : `${normalizedUri}/`;
  const uriNoSlash = uri.replace(/\/$/, "") || "/";
  const parts = uriNoSlash.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] || "";

  const client = await getSanityClient();

  const byUri = await client.fetch<SanityPostDoc | null>(SANITY_POST_BY_URI, {
    uri,
    uriNoSlash,
    slug: "__no_slug_fallback__",
  });
  if (byUri) return byUri;

  if (parts.length === 1 && slug) {
    return getSanityPostBySlug(slug);
  }

  return null;
}

/** Homepage BlogSection cards from Sanity posts. */
export function toHomeBlogPosts(posts: SanityPostCard[]): HomeBlogPost[] {
  return posts.map((post) => ({
    id: post._id,
    title: post.title,
    excerpt: post.excerpt || "",
    category: post.categories?.[0] || "Insights",
    href: postPublicPath(post),
    imageSrc: post.mainImage?.asset?.url || null,
    imageAlt: post.mainImage?.alt || post.title,
  }));
}

import type { HomeBlogPost } from "@/components/home/BlogSection";
import type { PageBuilderSlot } from "@/lib/blog/pageBuilder";
import {
  getSanityClient,
  getSanityLiveClient,
  sanityClient,
} from "@/lib/sanity/client";
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
  /** Editor-controlled section order. Unset → default layout. */
  pageBuilder?: PageBuilderSlot[] | null;
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
  faqHeading?: string | null;
  faqs?: Array<{ question?: string | null; answer?: string | null }> | null;
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

export async function getSanityPostsList(options?: {
  /** Skip API CDN — use for admin inventory refresh. */
  live?: boolean;
}): Promise<SanityPostCard[]> {
  const client = options?.live
    ? await getSanityLiveClient()
    : await getSanityClient();
  return client.fetch<SanityPostCard[]>(SANITY_POSTS_LIST);
}

export async function getSanityLatestPosts(
  limit = 3,
): Promise<SanityPostCard[]> {
  // CDN client — no draftMode(); safe for ISR homepage / listings.
  return sanityClient.fetch<SanityPostCard[]>(SANITY_POSTS_LATEST, { limit });
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

const SERVICE_CATEGORY_KEYWORDS: Record<string, string[]> = {
  hair: ["hair", "transplant", "prp", "beard", "eyebrow"],
  skin: ["skin", "vitiligo", "acne", "laser", "pigment", "scar"],
  face: ["face", "rhinoplasty", "facelift", "nose", "chin"],
  body: [
    "body",
    "liposuction",
    "lipo",
    "tummy",
    "gynecomastia",
    "breast",
    "abdominal",
  ],
  therapies: ["therapy", "prp", "iv", "wellness"],
  "anti-aging": ["anti-aging", "aging", "botox", "filler", "wrinkle"],
  other: [],
};

const TITLE_KEYWORD_STOP = new Set([
  "with",
  "your",
  "delhi",
  "care",
  "well",
  "medical",
  "centre",
  "center",
  "treatment",
  "procedure",
  "cost",
  "best",
  "top",
  "get",
  "from",
  "after",
  "before",
]);

function titleKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !TITLE_KEYWORD_STOP.has(word));
}

function relatedPostKeywords(options: {
  category?: string | null;
  title?: string | null;
}): string[] {
  const category = options.category?.trim().toLowerCase() || "";
  const fromCategory = SERVICE_CATEGORY_KEYWORDS[category] || [];
  const fromTitle = titleKeywords(options.title || "");
  return [...new Set([...fromTitle, ...fromCategory])];
}

function scoreRelatedPost(post: SanityPostCard, keywords: string[]): number {
  if (!keywords.length) return 0;

  const haystack = [
    post.title,
    post.excerpt,
    ...(post.categories || []),
    ...(post.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return keywords.reduce(
    (score, keyword) => (haystack.includes(keyword.toLowerCase()) ? score + 1 : score),
    0,
  );
}

/** Related blog cards for service pages — category/title match, then latest fill. */
export async function getSanityRelatedPostsForService(options: {
  category?: string | null;
  title?: string | null;
  limit?: number;
}): Promise<SanityPostCard[]> {
  const limit = options.limit ?? 3;
  const keywords = relatedPostKeywords(options);
  const pool = await getSanityLatestPosts(Math.max(limit * 12, 24));

  const ranked = pool
    .map((post) => ({
      post,
      score: scoreRelatedPost(post, keywords),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aTime = Date.parse(a.post.publishedAt || "") || 0;
      const bTime = Date.parse(b.post.publishedAt || "") || 0;
      return bTime - aTime;
    });

  const out: SanityPostCard[] = [];
  const seen = new Set<string>();

  for (const { post, score } of ranked) {
    if (score <= 0 && out.length >= limit) break;
    if (seen.has(post._id)) continue;
    seen.add(post._id);
    out.push(post);
    if (out.length >= limit) break;
  }

  if (out.length >= limit) return out.slice(0, limit);

  for (const { post } of ranked) {
    if (seen.has(post._id)) continue;
    seen.add(post._id);
    out.push(post);
    if (out.length >= limit) break;
  }

  return out.slice(0, limit);
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

import "server-only";

import { cache } from "react";

import { getBlogRepository } from "@/lib/wordpress/repositories/blogRepository";
import type {
  BlogCategory,
  BlogPost,
  BlogPostConnection,
  BlogPostSummary,
} from "@/types/blog";

/**
 * BlogService — application facade over BlogRepository.
 * Cached for React Server Component request deduplication.
 */
export const getBlogPostByUri = cache(async (uri: string): Promise<BlogPost | null> => {
  try {
    return await getBlogRepository().getPostByUri(uri);
  } catch {
    return null;
  }
});

export const listBlogPosts = cache(
  async (options?: {
    first?: number;
    after?: string | null;
    categorySlug?: string | null;
    tagSlug?: string | null;
    search?: string | null;
  }): Promise<BlogPostConnection> => {
    return getBlogRepository().listPosts(options);
  },
);

export const listBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  return getBlogRepository().listCategories();
});

export const getRelatedBlogPosts = cache(
  async (input: {
    categorySlug: string;
    excludeDatabaseId: number;
    first?: number;
  }): Promise<BlogPostSummary[]> => {
    return getBlogRepository().getRelatedPosts(input);
  },
);

export const getBlogCategoryPage = cache(
  async (
    slug: string,
    options?: { first?: number; after?: string | null },
  ) => {
    return getBlogRepository().getCategoryWithPosts(slug, options);
  },
);

export async function getFeaturedAndLatestPosts(options?: {
  featuredCount?: number;
  latestCount?: number;
}): Promise<{
  featured: BlogPostSummary | null;
  latest: BlogPostSummary[];
  trending: BlogPostSummary[];
}> {
  const featuredCount = options?.featuredCount ?? 1;
  const latestCount = options?.latestCount ?? 12;
  const { posts } = await listBlogPosts({ first: Math.max(featuredCount + latestCount, 12) });
  const featured = posts[0] ?? null;
  const latest = posts.slice(featuredCount);
  // Trending proxy: most recent with images (real analytics later).
  const trending = posts.filter((p) => p.featuredImage).slice(0, 6);
  return { featured, latest, trending };
}

/**
 * Paginate through WordPress until every published post summary is collected.
 * Suitable for archive UIs; posts are metadata-only (no HTML bodies).
 */
export const listAllBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
  const all: BlogPostSummary[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let guard = 0;

  while (hasNextPage && guard < 40) {
    guard += 1;
    const page = await getBlogRepository().listPosts({
      first: 50,
      after,
    });
    all.push(...page.posts);
    hasNextPage = page.pageInfo.hasNextPage;
    after = page.pageInfo.endCursor;
    if (!after) hasNextPage = false;
  }

  return all;
});

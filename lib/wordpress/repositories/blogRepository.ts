import "server-only";

import {
  getWordPressClient,
  type FetchGraphQLOptions,
  type WordPressGraphQLClient,
} from "@/lib/wordpress/client";
import { NotFoundError } from "@/lib/wordpress/errors";
import {
  mapBlogCategory,
  mapBlogPost,
  mapBlogPosts,
  mapBlogPostSummary,
  type WpCategoryNode,
  type WpPostNode,
} from "@/lib/wordpress/mappers/blogMapper";
import { coerceNullableString, ensureArray } from "@/lib/wordpress/mappers/utils";
import { normalizePageUri } from "@/lib/wordpress/repositories/pageRepository";
import {
  getCategories as getCategoriesQuery,
  getCategoryBySlug as getCategoryBySlugQuery,
  getPostByUri as getPostByUriQuery,
  getPosts as getPostsQuery,
  getPostsForSync as getPostsForSyncQuery,
  getRelatedPosts as getRelatedPostsQuery,
} from "@/lib/wordpress/queries/posts";
import type {
  BlogCategory,
  BlogPost,
  BlogPostConnection,
  BlogPostSummary,
} from "@/types/blog";
import type { WordPressPostSyncMeta } from "@/types/wordpress-post-sync";

interface GetPostByUriData {
  nodeByUri?: WpPostNode | null;
}

interface GetPostsData {
  posts?: {
    nodes?: Array<WpPostNode | null> | null;
    pageInfo?: {
      hasNextPage?: boolean | null;
      hasPreviousPage?: boolean | null;
      startCursor?: string | null;
      endCursor?: string | null;
    } | null;
  } | null;
}

interface GetPostsForSyncData {
  posts?: {
    nodes?: Array<{
      databaseId?: number | null;
      title?: string | null;
      slug?: string | null;
      uri?: string | null;
      status?: string | null;
      excerpt?: string | null;
      modified?: string | null;
      author?: {
        node?: { name?: string | null; slug?: string | null } | null;
      } | null;
      categories?: {
        nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null;
      } | null;
      featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
      seo?: { title?: string | null } | null;
    } | null> | null;
    pageInfo?: {
      hasNextPage?: boolean | null;
      endCursor?: string | null;
    } | null;
  } | null;
}

interface GetRelatedData {
  posts?: { nodes?: Array<WpPostNode | null> | null } | null;
}

interface GetCategoriesData {
  categories?: { nodes?: Array<WpCategoryNode | null> | null } | null;
}

interface GetCategoryBySlugData {
  categories?: {
    nodes?: Array<
      (WpCategoryNode & {
        posts?: GetPostsData["posts"];
      }) | null
    > | null;
  } | null;
}

export type RepositoryFetchOptions = Omit<
  FetchGraphQLOptions,
  "variables" | "operationName"
>;

export type ListPostsOptions = {
  first?: number;
  after?: string | null;
  categorySlug?: string | null;
  tagSlug?: string | null;
  authorName?: string | null;
  search?: string | null;
} & RepositoryFetchOptions;

export interface BlogRepository {
  getPostByUri: (
    uri: string,
    options?: RepositoryFetchOptions,
  ) => Promise<BlogPost>;

  listPosts: (options?: ListPostsOptions) => Promise<BlogPostConnection>;

  listPostsForSync: (
    options?: RepositoryFetchOptions,
  ) => Promise<WordPressPostSyncMeta[]>;

  getRelatedPosts: (input: {
    categorySlug: string;
    excludeDatabaseId: number;
    first?: number;
  }, options?: RepositoryFetchOptions) => Promise<BlogPostSummary[]>;

  listCategories: (
    options?: RepositoryFetchOptions,
  ) => Promise<BlogCategory[]>;

  getCategoryWithPosts: (
    slug: string,
    options?: { first?: number; after?: string | null } & RepositoryFetchOptions,
  ) => Promise<{
    category: BlogCategory;
    posts: BlogPostSummary[];
    pageInfo: BlogPostConnection["pageInfo"];
  } | null>;
}

function mapSyncMeta(
  node: NonNullable<NonNullable<GetPostsForSyncData["posts"]>["nodes"]>[number],
): WordPressPostSyncMeta | null {
  if (!node) return null;
  if (
    typeof node.databaseId !== "number" ||
    !node.slug ||
    !node.uri ||
    !node.title
  ) {
    return null;
  }

  const modifiedRaw = node.modified ?? null;
  const modifiedAt = modifiedRaw ? new Date(modifiedRaw) : new Date();

  return {
    databaseId: node.databaseId,
    uri: normalizePageUri(node.uri),
    slug: node.slug,
    title: node.title,
    status: (node.status ?? "publish").toLowerCase(),
    excerpt: coerceNullableString(node.excerpt)?.replace(/<[^>]+>/g, " ").trim() || null,
    featuredImageUrl: node.featuredImage?.node?.sourceUrl ?? null,
    seoTitle: node.seo?.title?.trim() || null,
    modifiedAt: Number.isNaN(modifiedAt.getTime()) ? new Date() : modifiedAt,
    authorName: node.author?.node?.name ?? null,
    authorSlug: node.author?.node?.slug ?? null,
    categoryNames: ensureArray(node.categories?.nodes)
      .map((c) => c?.name)
      .filter((n): n is string => Boolean(n)),
    categorySlugs: ensureArray(node.categories?.nodes)
      .map((c) => c?.slug)
      .filter((n): n is string => Boolean(n)),
  };
}

export function createBlogRepository(
  client: WordPressGraphQLClient = getWordPressClient(),
): BlogRepository {
  return {
    async getPostByUri(uri, options = {}) {
      const normalizedUri = normalizePageUri(uri);
      const data = await client.fetchGraphQL<GetPostByUriData>(getPostByUriQuery, {
        ...options,
        variables: { uri: normalizedUri },
        operationName: "GetPostByUri",
      });

      const node = data.nodeByUri;
      if (
        !node ||
        (node.__typename !== undefined && node.__typename !== "Post") ||
        typeof node.databaseId !== "number" ||
        !node.slug
      ) {
        throw new NotFoundError("post", normalizedUri);
      }

      return mapBlogPost(node, `getPostByUri:${normalizedUri}`);
    },

    async listPosts(options = {}) {
      const {
        first = 12,
        after = null,
        categorySlug = null,
        tagSlug = null,
        authorName = null,
        search = null,
        ...fetchOptions
      } = options;

      const data = await client.fetchGraphQL<GetPostsData>(getPostsQuery, {
        ...fetchOptions,
        variables: {
          first,
          after,
          categorySlug: categorySlug || undefined,
          tagSlug: tagSlug || undefined,
          authorName: authorName || undefined,
          search: search || undefined,
        },
        operationName: "GetPosts",
      });

      return {
        posts: mapBlogPosts(data.posts?.nodes, "listPosts"),
        pageInfo: {
          hasNextPage: Boolean(data.posts?.pageInfo?.hasNextPage),
          hasPreviousPage: Boolean(data.posts?.pageInfo?.hasPreviousPage),
          startCursor: data.posts?.pageInfo?.startCursor ?? null,
          endCursor: data.posts?.pageInfo?.endCursor ?? null,
        },
      };
    },

    async listPostsForSync(options = {}) {
      const results: WordPressPostSyncMeta[] = [];
      let after: string | null = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const data: GetPostsForSyncData = await client.fetchGraphQL<GetPostsForSyncData>(
          getPostsForSyncQuery,
          {
            ...options,
            variables: { first: 50, after },
            operationName: "GetPostsForSync",
          },
        );

        for (const node of data.posts?.nodes ?? []) {
          const meta = mapSyncMeta(node);
          if (meta) results.push(meta);
        }

        hasNextPage = Boolean(data.posts?.pageInfo?.hasNextPage);
        after = data.posts?.pageInfo?.endCursor ?? null;
        if (!after) hasNextPage = false;
      }

      return results;
    },

    async getRelatedPosts(input, options = {}) {
      const data = await client.fetchGraphQL<GetRelatedData>(getRelatedPostsQuery, {
        ...options,
        variables: {
          categorySlug: input.categorySlug,
          first: input.first ?? 6,
          notIn: [input.excludeDatabaseId],
        },
        operationName: "GetRelatedPosts",
      });

      return mapBlogPosts(data.posts?.nodes, "getRelatedPosts");
    },

    async listCategories(options = {}) {
      const data = await client.fetchGraphQL<GetCategoriesData>(getCategoriesQuery, {
        ...options,
        variables: { first: 100 },
        operationName: "GetBlogCategories",
      });

      return ensureArray(data.categories?.nodes)
        .map(mapBlogCategory)
        .filter((c): c is BlogCategory => Boolean(c));
    },

    async getCategoryWithPosts(slug, options = {}) {
      const { first = 12, after = null, ...fetchOptions } = options;
      const data = await client.fetchGraphQL<GetCategoryBySlugData>(
        getCategoryBySlugQuery,
        {
          ...fetchOptions,
          variables: { slug: [slug], first, after },
          operationName: "GetCategoryBySlug",
        },
      );

      const node = data.categories?.nodes?.[0];
      if (!node) return null;

      const category = mapBlogCategory(node);
      if (!category) return null;

      return {
        category,
        posts: mapBlogPosts(node.posts?.nodes, `category:${slug}`),
        pageInfo: {
          hasNextPage: Boolean(node.posts?.pageInfo?.hasNextPage),
          hasPreviousPage: Boolean(node.posts?.pageInfo?.hasPreviousPage),
          startCursor: node.posts?.pageInfo?.startCursor ?? null,
          endCursor: node.posts?.pageInfo?.endCursor ?? null,
        },
      };
    },
  };
}

let defaultBlogRepository: BlogRepository | undefined;

export function getBlogRepository(): BlogRepository {
  if (!defaultBlogRepository) {
    defaultBlogRepository = createBlogRepository();
  }
  return defaultBlogRepository;
}

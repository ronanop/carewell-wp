/**
 * Frontend blog domain models — WordPress Posts mapped for the Blog Engine.
 * Never expose raw GraphQL shapes to UI.
 */

import type { FeaturedImage, SeoMetadata } from "@/types/page";

export type BlogAuthor = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  uri: string;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  count: number;
  uri: string;
  description: string | null;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  uri: string;
};

export type BlogComment = {
  id: string;
  databaseId: number;
  content: string;
  date: string | null;
  authorName: string;
  parentId: string | null;
  replies: BlogComment[];
};

/** Card / listing projection — no full HTML body. */
export type BlogPostSummary = {
  id: string;
  databaseId: number;
  slug: string;
  uri: string;
  title: string;
  excerpt: string | null;
  date: string | null;
  modified: string | null;
  commentCount: number;
  readingTimeMinutes: number;
  featuredImage: FeaturedImage | null;
  author: BlogAuthor | null;
  categories: BlogCategory[];
  tags: BlogTag[];
  seo: SeoMetadata | null;
};

/** Full WordPress post for article rendering. */
export type BlogPost = BlogPostSummary & {
  content: string | null;
  status: string;
  comments: BlogComment[];
};

export type BlogPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type BlogPostConnection = {
  posts: BlogPostSummary[];
  pageInfo: BlogPageInfo;
};

export type BlogAdjacentPost = Pick<
  BlogPostSummary,
  "slug" | "uri" | "title" | "featuredImage" | "readingTimeMinutes" | "categories"
>;

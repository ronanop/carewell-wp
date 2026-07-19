/**
 * Pure GraphQL → frontend mappers for WordPress blog posts.
 */

import { ValidationError } from "@/lib/wordpress/errors";
import {
  coerceNullableNumber,
  coerceNullableString,
  ensureArray,
  mapFeaturedImage,
  type WpFeaturedImageNode,
} from "@/lib/wordpress/mappers/utils";
import { mapSeo, type WpSeo } from "@/lib/wordpress/mappers/pageMapper";
import { estimateReadingTimeMinutes } from "@/lib/blog/readingTime";
import type {
  BlogAuthor,
  BlogCategory,
  BlogComment,
  BlogPost,
  BlogPostSummary,
  BlogTag,
} from "@/types/blog";

export interface WpAuthorNode {
  readonly id?: string | null;
  readonly databaseId?: number | null;
  readonly name?: string | null;
  readonly slug?: string | null;
  readonly description?: string | null;
  readonly uri?: string | null;
  readonly avatar?: { readonly url?: string | null } | null;
}

export interface WpCategoryNode {
  readonly id?: string | null;
  readonly databaseId?: number | null;
  readonly name?: string | null;
  readonly slug?: string | null;
  readonly count?: number | null;
  readonly uri?: string | null;
  readonly description?: string | null;
}

export interface WpTagNode {
  readonly id?: string | null;
  readonly databaseId?: number | null;
  readonly name?: string | null;
  readonly slug?: string | null;
  readonly uri?: string | null;
}

export interface WpCommentNode {
  readonly id?: string | null;
  readonly databaseId?: number | null;
  readonly content?: string | null;
  readonly date?: string | null;
  readonly parentId?: string | null;
  readonly author?: {
    readonly node?: { readonly name?: string | null } | null;
  } | null;
}

export interface WpPostNode {
  readonly __typename?: string;
  readonly id?: string | null;
  readonly databaseId?: number | null;
  readonly title?: string | null;
  readonly slug?: string | null;
  readonly uri?: string | null;
  readonly status?: string | null;
  readonly content?: string | null;
  readonly excerpt?: string | null;
  readonly date?: string | null;
  readonly modified?: string | null;
  readonly commentCount?: number | null;
  readonly author?: { readonly node?: WpAuthorNode | null } | null;
  readonly categories?: {
    readonly nodes?: ReadonlyArray<WpCategoryNode | null> | null;
  } | null;
  readonly tags?: {
    readonly nodes?: ReadonlyArray<WpTagNode | null> | null;
  } | null;
  readonly featuredImage?: {
    readonly node?: WpFeaturedImageNode | null;
  } | null;
  readonly seo?: WpSeo | null;
  readonly comments?: {
    readonly nodes?: ReadonlyArray<WpCommentNode | null> | null;
  } | null;
}

function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0 ? text : null;
}

export function mapBlogAuthor(
  node: WpAuthorNode | null | undefined,
): BlogAuthor | null {
  if (!node) return null;
  const name = coerceNullableString(node.name);
  const slug = coerceNullableString(node.slug);
  if (!name || !slug) return null;

  const id =
    coerceNullableString(node.id) ??
    (typeof node.databaseId === "number" ? String(node.databaseId) : slug);

  return {
    id,
    name,
    slug,
    description: stripHtml(node.description) ?? coerceNullableString(node.description),
    avatarUrl: coerceNullableString(node.avatar?.url),
    uri: coerceNullableString(node.uri) ?? `/author/${slug}/`,
  };
}

export function mapBlogCategory(
  node: WpCategoryNode | null | undefined,
): BlogCategory | null {
  if (!node) return null;
  const name = coerceNullableString(node.name);
  const slug = coerceNullableString(node.slug);
  if (!name || !slug) return null;

  return {
    id:
      coerceNullableString(node.id) ??
      (typeof node.databaseId === "number" ? String(node.databaseId) : slug),
    name,
    slug,
    count: coerceNullableNumber(node.count) ?? 0,
    uri: coerceNullableString(node.uri) ?? `/category/${slug}/`,
    description: coerceNullableString(node.description),
  };
}

export function mapBlogTag(node: WpTagNode | null | undefined): BlogTag | null {
  if (!node) return null;
  const name = coerceNullableString(node.name);
  const slug = coerceNullableString(node.slug);
  if (!name || !slug) return null;

  return {
    id:
      coerceNullableString(node.id) ??
      (typeof node.databaseId === "number" ? String(node.databaseId) : slug),
    name,
    slug,
    uri: coerceNullableString(node.uri) ?? `/tag/${slug}/`,
  };
}

function mapCommentsFlat(
  nodes: ReadonlyArray<WpCommentNode | null | undefined> | null | undefined,
): BlogComment[] {
  const flat: BlogComment[] = [];
  for (const node of ensureArray(nodes)) {
    const id = coerceNullableString(node.id);
    const databaseId = coerceNullableNumber(node.databaseId);
    if (!id || databaseId === null) continue;
    flat.push({
      id,
      databaseId,
      content: coerceNullableString(node.content) ?? "",
      date: coerceNullableString(node.date),
      authorName: coerceNullableString(node.author?.node?.name) ?? "Anonymous",
      parentId: coerceNullableString(node.parentId),
      replies: [],
    });
  }

  const byId = new Map(flat.map((c) => [c.id, { ...c, replies: [] as BlogComment[] }]));
  const roots: BlogComment[] = [];

  for (const comment of byId.values()) {
    if (comment.parentId && byId.has(comment.parentId)) {
      byId.get(comment.parentId)!.replies.push(comment);
    } else {
      roots.push(comment);
    }
  }

  return roots;
}

function mapSummaryFields(
  node: WpPostNode,
  context: string,
): Omit<BlogPostSummary, "readingTimeMinutes"> & { content?: string | null } {
  const id = coerceNullableString(node.id);
  const databaseId = coerceNullableNumber(node.databaseId);
  const slug = coerceNullableString(node.slug);
  const uri = coerceNullableString(node.uri);
  const title = coerceNullableString(node.title);

  if (!id || databaseId === null || !slug || !uri || !title) {
    throw new ValidationError(
      "Post is missing required identity fields (id, databaseId, slug, uri, title)",
      context,
    );
  }

  const categories = ensureArray(node.categories?.nodes)
    .map(mapBlogCategory)
    .filter((c): c is BlogCategory => Boolean(c));

  const tags = ensureArray(node.tags?.nodes)
    .map(mapBlogTag)
    .filter((t): t is BlogTag => Boolean(t));

  return {
    id,
    databaseId,
    slug,
    uri,
    title,
    excerpt: stripHtml(node.excerpt),
    date: coerceNullableString(node.date),
    modified: coerceNullableString(node.modified),
    commentCount: coerceNullableNumber(node.commentCount) ?? 0,
    featuredImage: mapFeaturedImage(node.featuredImage?.node),
    author: mapBlogAuthor(node.author?.node),
    categories,
    tags,
    seo: mapSeo(node.seo),
    content: coerceNullableString(node.content),
  };
}

/**
 * Maps a raw GraphQL post node to {@link BlogPostSummary}.
 */
export function mapBlogPostSummary(
  node: WpPostNode,
  context: string,
): BlogPostSummary {
  const fields = mapSummaryFields(node, context);
  const { content, ...rest } = fields;
  return {
    ...rest,
    readingTimeMinutes: estimateReadingTimeMinutes(content ?? rest.excerpt ?? ""),
  };
}

/**
 * Maps a raw GraphQL post node to full {@link BlogPost}.
 */
export function mapBlogPost(node: WpPostNode, context: string): BlogPost {
  const fields = mapSummaryFields(node, context);
  const content = fields.content ?? null;
  const { content: _c, ...summary } = fields;

  return {
    ...summary,
    content,
    status: (coerceNullableString(node.status) ?? "publish").toLowerCase(),
    readingTimeMinutes: estimateReadingTimeMinutes(content ?? summary.excerpt ?? ""),
    comments: mapCommentsFlat(node.comments?.nodes),
  };
}

export function mapBlogPosts(
  nodes: ReadonlyArray<WpPostNode | null | undefined> | null | undefined,
  context: string,
): BlogPostSummary[] {
  return ensureArray(nodes).map((node, index) =>
    mapBlogPostSummary(node, `${context}[${index}]`),
  );
}

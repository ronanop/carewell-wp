import "server-only";

import { getBlogRepository } from "@/lib/wordpress/repositories/blogRepository";
import { createWordPressPostRepository } from "@/lib/experience/repositories/wordpressPostRepository";
import { writeAuditLog } from "@/lib/experience/services/auditService";
import { getDefaultSite } from "@/lib/experience/services/siteService";
import type { SyncSummary } from "@/lib/experience/services/syncService";

function isUnchanged(
  existing: {
    title: string;
    uri: string;
    slug: string;
    status: string;
    excerpt: string | null;
    featuredImageUrl: string | null;
    seoTitle: string | null;
    authorName: string | null;
    authorSlug: string | null;
    categorySlugs: string;
    categoryNames: string;
    lastWordPressModified: Date;
  },
  incoming: {
    title: string;
    uri: string;
    slug: string;
    status: string;
    excerpt: string | null;
    featuredImageUrl: string | null;
    seoTitle: string | null;
    authorName: string | null;
    authorSlug: string | null;
    categorySlugs: string;
    categoryNames: string;
    modifiedAt: Date;
  },
): boolean {
  return (
    existing.title === incoming.title &&
    existing.uri === incoming.uri &&
    existing.slug === incoming.slug &&
    existing.status === incoming.status &&
    existing.excerpt === incoming.excerpt &&
    existing.featuredImageUrl === incoming.featuredImageUrl &&
    existing.seoTitle === incoming.seoTitle &&
    existing.authorName === incoming.authorName &&
    existing.authorSlug === incoming.authorSlug &&
    existing.categorySlugs === incoming.categorySlugs &&
    existing.categoryNames === incoming.categoryNames &&
    existing.lastWordPressModified.getTime() === incoming.modifiedAt.getTime()
  );
}

/**
 * Synchronizes WordPress post metadata into Experience Studio.
 * UPSERT only — never stores HTML body.
 */
export async function syncWordPressPosts(options?: {
  userId?: string | null;
  databaseIds?: number[];
}): Promise<SyncSummary> {
  const site = await getDefaultSite();
  const wp = getBlogRepository();
  const local = createWordPressPostRepository();

  const summary: SyncSummary = {
    added: 0,
    updated: 0,
    unchanged: 0,
    failed: 0,
    totalFetched: 0,
    errors: [],
  };

  let remotePosts;
  try {
    remotePosts = await wp.listPostsForSync({ cache: "no-store" });
  } catch (error) {
    summary.failed = 1;
    summary.errors.push(
      error instanceof Error ? error.message : "Failed to fetch posts",
    );
    return summary;
  }

  if (options?.databaseIds?.length) {
    const allow = new Set(options.databaseIds);
    remotePosts = remotePosts.filter((p) => allow.has(p.databaseId));
  }

  summary.totalFetched = remotePosts.length;

  for (const incoming of remotePosts) {
    try {
      const existing = await local.findByUri(site.id, incoming.uri);
      const categorySlugs = incoming.categorySlugs.join(",");
      const categoryNames = incoming.categoryNames.join(",");

      const payload = {
        databaseId: incoming.databaseId,
        uri: incoming.uri,
        slug: incoming.slug,
        title: incoming.title,
        status: incoming.status,
        excerpt: incoming.excerpt,
        featuredImageUrl: incoming.featuredImageUrl,
        seoTitle: incoming.seoTitle,
        authorName: incoming.authorName,
        authorSlug: incoming.authorSlug,
        categorySlugs,
        categoryNames,
        modifiedAt: incoming.modifiedAt,
      };

      if (
        existing &&
        isUnchanged(
          {
            title: existing.title,
            uri: existing.uri,
            slug: existing.slug,
            status: existing.status,
            excerpt: existing.excerpt,
            featuredImageUrl: existing.featuredImageUrl,
            seoTitle: existing.seoTitle,
            authorName: existing.authorName,
            authorSlug: existing.authorSlug,
            categorySlugs: existing.categorySlugs,
            categoryNames: existing.categoryNames,
            lastWordPressModified: existing.lastWordPressModified,
          },
          payload,
        )
      ) {
        summary.unchanged += 1;
        continue;
      }

      await local.upsertMeta(site.id, payload);
      if (existing) summary.updated += 1;
      else summary.added += 1;
    } catch (error) {
      summary.failed += 1;
      summary.errors.push(
        error instanceof Error
          ? `${incoming.slug}: ${error.message}`
          : `${incoming.slug}: unknown error`,
      );
    }
  }

  await writeAuditLog({
    userId: options?.userId ?? null,
    action: "wordpress.posts.sync",
    entityType: "WordPressPost",
    entityId: site.id,
    summary: `Added ${summary.added}, updated ${summary.updated}, unchanged ${summary.unchanged}, failed ${summary.failed}`,
  });

  return summary;
}

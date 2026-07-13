import "server-only";

import { getPageRepository } from "@/lib/wordpress/repositories/pageRepository";
import { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
import { writeAuditLog } from "@/lib/experience/services/auditService";
import { getDefaultSite } from "@/lib/experience/services/siteService";

export type SyncSummary = {
  added: number;
  updated: number;
  unchanged: number;
  failed: number;
  totalFetched: number;
  errors: string[];
};

function isUnchanged(
  existing: {
    title: string;
    uri: string;
    slug: string;
    status: string;
    wpTemplate: string | null;
    featuredImageUrl: string | null;
    seoTitle: string | null;
    parentDatabaseId: number | null;
    lastWordPressModified: Date;
  },
  incoming: {
    title: string;
    uri: string;
    slug: string;
    status: string;
    wpTemplate: string | null;
    featuredImageUrl: string | null;
    seoTitle: string | null;
    parentDatabaseId: number | null;
    modifiedAt: Date;
  },
): boolean {
  return (
    existing.title === incoming.title &&
    existing.uri === incoming.uri &&
    existing.slug === incoming.slug &&
    existing.status === incoming.status &&
    existing.wpTemplate === incoming.wpTemplate &&
    existing.featuredImageUrl === incoming.featuredImageUrl &&
    existing.seoTitle === incoming.seoTitle &&
    existing.parentDatabaseId === incoming.parentDatabaseId &&
    existing.lastWordPressModified.getTime() === incoming.modifiedAt.getTime()
  );
}

/**
 * Synchronizes WordPress page metadata into Experience Studio.
 * UPSERT only — never deletes local rows automatically.
 */
export async function syncWordPressPages(options?: {
  userId?: string | null;
  databaseIds?: number[];
}): Promise<SyncSummary> {
  const site = await getDefaultSite();
  const wp = getPageRepository();
  const local = createWordPressPageRepository();

  const summary: SyncSummary = {
    added: 0,
    updated: 0,
    unchanged: 0,
    failed: 0,
    totalFetched: 0,
    errors: [],
  };

  let remotePages;
  try {
    remotePages = await wp.listPagesForSync({ cache: "no-store" });
  } catch (error) {
    summary.failed = 1;
    summary.errors.push(
      error instanceof Error ? error.message : "Failed to fetch WordPress pages",
    );
    return summary;
  }

  const filtered = options?.databaseIds?.length
    ? remotePages.filter((page) =>
        options.databaseIds!.includes(page.databaseId),
      )
    : remotePages;

  summary.totalFetched = filtered.length;
  const now = new Date();
  const existing = await local.findByDatabaseIds(
    site.id,
    filtered.map((page) => page.databaseId),
  );
  const existingById = new Map(
    existing.map((page) => [page.databaseId, page]),
  );

  for (const page of filtered) {
    try {
      const current = existingById.get(page.databaseId);
      if (current && isUnchanged(current, page)) {
        await local.upsertMeta(site.id, {
          databaseId: page.databaseId,
          uri: page.uri,
          slug: page.slug,
          title: page.title,
          status: page.status,
          wpTemplate: page.wpTemplate,
          featuredImageUrl: page.featuredImageUrl,
          seoTitle: page.seoTitle,
          parentDatabaseId: page.parentDatabaseId,
          lastWordPressModified: page.modifiedAt,
          lastSyncedAt: now,
        });
        summary.unchanged += 1;
        continue;
      }

      await local.upsertMeta(site.id, {
        databaseId: page.databaseId,
        uri: page.uri,
        slug: page.slug,
        title: page.title,
        status: page.status,
        wpTemplate: page.wpTemplate,
        featuredImageUrl: page.featuredImageUrl,
        seoTitle: page.seoTitle,
        parentDatabaseId: page.parentDatabaseId,
        lastWordPressModified: page.modifiedAt,
        lastSyncedAt: now,
      });

      if (current) {
        summary.updated += 1;
      } else {
        summary.added += 1;
      }
    } catch (error) {
      summary.failed += 1;
      summary.errors.push(
        `${page.uri}: ${error instanceof Error ? error.message : "upsert failed"}`,
      );
    }
  }

  await writeAuditLog({
    userId: options?.userId,
    action: "wordpress.pages.sync",
    entityType: "WordPressPage",
    summary: `Added ${summary.added}, updated ${summary.updated}, unchanged ${summary.unchanged}, failed ${summary.failed}`,
  });

  return summary;
}

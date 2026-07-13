import "server-only";

import {
  computePresentationBadges,
  type PageListItem,
  type PresentationBadge,
} from "@/lib/experience/pages/pageList";
import { createWordPressPageRepository } from "@/lib/experience/repositories/wordpressPageRepository";
import { getDefaultSite } from "@/lib/experience/services/siteService";

export type PageListQuery = {
  search?: string;
  status?: "all" | "published" | "draft" | "configured" | "not_configured" | "outdated";
  sort?: "title" | "modified" | "synced";
  order?: "asc" | "desc";
};

function matchesBadgeFilter(
  badges: PresentationBadge[],
  status: PageListQuery["status"],
): boolean {
  if (!status || status === "all") return true;
  return badges.includes(status);
}

/**
 * Builds the Pages module table rows from local WordPress metadata.
 */
export async function listStudioPages(
  query: PageListQuery = {},
): Promise<PageListItem[]> {
  const site = await getDefaultSite();
  const pages = createWordPressPageRepository();
  const rows = await pages.list(site.id);

  const search = query.search?.trim().toLowerCase() ?? "";
  const sort = query.sort ?? "title";
  const order = query.order ?? "asc";

  let items: PageListItem[] = rows.map((page) => {
    const badges = computePresentationBadges({
      wpStatus: page.status,
      presentation: page.presentation
        ? {
            status: page.presentation.status,
            updatedAt: page.presentation.updatedAt,
          }
        : null,
      lastWordPressModified: page.lastWordPressModified,
    });

    return {
      id: page.id,
      databaseId: page.databaseId,
      title: page.title,
      uri: page.uri,
      slug: page.slug,
      wpStatus: page.status,
      wpTemplate: page.wpTemplate,
      templateName: page.presentation?.template?.name ?? null,
      modifiedAt: page.lastWordPressModified.toISOString(),
      lastSyncedAt: page.lastSyncedAt.toISOString(),
      badges,
      presentationId: page.presentation?.id ?? null,
    };
  });

  if (search) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.uri.toLowerCase().includes(search) ||
        item.slug.toLowerCase().includes(search),
    );
  }

  items = items.filter((item) => matchesBadgeFilter(item.badges, query.status));

  items.sort((a, b) => {
    let cmp = 0;
    if (sort === "modified") {
      cmp = a.modifiedAt.localeCompare(b.modifiedAt);
    } else if (sort === "synced") {
      cmp = a.lastSyncedAt.localeCompare(b.lastSyncedAt);
    } else {
      cmp = a.title.localeCompare(b.title);
    }
    return order === "desc" ? -cmp : cmp;
  });

  return items;
}

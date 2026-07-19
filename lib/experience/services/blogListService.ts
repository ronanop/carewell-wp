import "server-only";

import { createWordPressPostRepository } from "@/lib/experience/repositories/wordpressPostRepository";
import {
  computePresentationBadges,
  type PresentationBadge,
} from "@/lib/experience/pages/pageList";
import { getDefaultSite } from "@/lib/experience/services/siteService";

export type BlogListItem = {
  id: string;
  databaseId: number;
  title: string;
  uri: string;
  slug: string;
  wpStatus: string;
  authorName: string | null;
  categoryNames: string[];
  modifiedAt: string;
  lastSyncedAt: string;
  badges: PresentationBadge[];
  presentationId: string | null;
  featuredImageUrl: string | null;
};

export async function listStudioBlogs(): Promise<BlogListItem[]> {
  const site = await getDefaultSite();
  const posts = await createWordPressPostRepository().listBySite(site.id);

  return posts.map((post) => ({
    id: post.id,
    databaseId: post.databaseId,
    title: post.title,
    uri: post.uri,
    slug: post.slug,
    wpStatus: post.status,
    authorName: post.authorName,
    categoryNames: post.categoryNames
      ? post.categoryNames.split(",").filter(Boolean)
      : [],
    modifiedAt: post.lastWordPressModified.toISOString(),
    lastSyncedAt: post.lastSyncedAt.toISOString(),
    badges: computePresentationBadges({
      wpStatus: post.status,
      presentation: post.presentation
        ? {
            status: post.presentation.status,
            updatedAt: post.presentation.updatedAt,
          }
        : null,
      lastWordPressModified: post.lastWordPressModified,
    }),
    presentationId: post.presentation?.id ?? null,
    featuredImageUrl: post.featuredImageUrl,
  }));
}

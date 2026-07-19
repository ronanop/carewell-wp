/**
 * WordPress post metadata for Experience Studio sync — never includes HTML body.
 */

export type WordPressPostSyncMeta = {
  databaseId: number;
  uri: string;
  slug: string;
  title: string;
  status: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  seoTitle: string | null;
  modifiedAt: Date;
  authorName: string | null;
  authorSlug: string | null;
  categoryNames: string[];
  categorySlugs: string[];
};

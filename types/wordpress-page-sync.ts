/**
 * WordPress page metadata for Experience Studio sync.
 * Never includes article HTML.
 */
export type WordPressPageSyncMeta = {
  databaseId: number;
  uri: string;
  slug: string;
  title: string;
  status: string;
  wpTemplate: string | null;
  featuredImageUrl: string | null;
  seoTitle: string | null;
  modifiedAt: Date;
  parentDatabaseId: number | null;
};

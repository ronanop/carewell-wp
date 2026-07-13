/**
 * Frontend page domain model — never expose raw GraphQL shapes to UI.
 */

/**
 * Normalized featured image for `next/image` and cards.
 */
export interface FeaturedImage {
  id: string;
  sourceUrl: string;
  altText: string;
  width: number | null;
  height: number | null;
}

/**
 * Normalized SEO metadata for `generateMetadata`.
 */
export interface SeoMetadata {
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string | null;
  canonicalUrl: string;
}

/**
 * WordPress page as consumed by the Next.js frontend.
 */
export interface Page {
  id: string;
  databaseId: number;
  slug: string;
  uri: string;
  title: string;
  content: string | null;
  date: string | null;
  modified: string | null;
  parentId: string | null;
  featuredImage: FeaturedImage | null;
  seo: SeoMetadata | null;
}

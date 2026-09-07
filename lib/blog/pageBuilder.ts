/**
 * Blog post page builder — section keys editors can add / remove / reorder in Sanity.
 * Content still lives on named document fields (body, midArticleCta, author*, …).
 * When `pageBuilder` is unset, the public template uses DEFAULT_BLOG_SECTION_ORDER.
 */

export const BLOG_SECTION_KEYS = [
  "hero",
  "toc",
  "body",
  "midCta",
  "endCta",
  "doctor",
  "faq",
  "nextPosts",
] as const;

export type BlogSectionKey = (typeof BLOG_SECTION_KEYS)[number];

export const BLOG_SECTION_LABELS: Record<BlogSectionKey, string> = {
  hero: "Hero (image, title, meta)",
  toc: "Table of contents",
  body: "Article body",
  midCta: "Mid-article CTA",
  endCta: "End-of-article CTA",
  doctor: "Doctor card",
  faq: "Blog FAQs",
  nextPosts: "Next / related posts",
};

export const BLOG_SECTION_LIST_OPTIONS = BLOG_SECTION_KEYS.map((value) => ({
  title: BLOG_SECTION_LABELS[value],
  value,
}));

/** Default article order — matches the pre–page-builder template. */
export const DEFAULT_BLOG_SECTION_ORDER: BlogSectionKey[] = [
  "hero",
  "toc",
  "body",
  "midCta",
  "endCta",
  "doctor",
  "faq",
  "nextPosts",
];

export type PageBuilderSlot = {
  _key?: string;
  _type?: string;
  section?: string | null;
};

const KEY_SET = new Set<string>(BLOG_SECTION_KEYS);

export function isBlogSectionKey(value: unknown): value is BlogSectionKey {
  return typeof value === "string" && KEY_SET.has(value);
}

/**
 * Resolve render order for a blog post.
 * - `undefined` / `null` → default order (legacy posts)
 * - `[]` → intentionally no builder sections
 * - otherwise → editor order (invalid / duplicate keys dropped)
 */
export function resolveBlogSectionOrder(
  pageBuilder: PageBuilderSlot[] | null | undefined,
): BlogSectionKey[] {
  if (pageBuilder == null) {
    return DEFAULT_BLOG_SECTION_ORDER;
  }

  const seen = new Set<BlogSectionKey>();
  const order: BlogSectionKey[] = [];

  for (const slot of pageBuilder) {
    const key = slot?.section;
    if (!isBlogSectionKey(key) || seen.has(key)) continue;
    seen.add(key);
    order.push(key);
  }

  return order;
}

import type { Metadata } from "next";

import { SanityBlogListing } from "@/components/blog/SanityPostTemplate";
import { getSanityPostsList } from "@/lib/sanity/post";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: `Blog | ${SITE_NAME}`,
  description:
    "Educational articles from Care Well Medical Centre on hair, skin, and cosmetic treatments.",
  alternates: { canonical: `${SITE_URL}/blogs/` },
};

type BlogsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { q } = await searchParams;
  const query = (q || "").trim().toLowerCase();
  const posts = await getSanityPostsList();
  const filtered = query
    ? posts.filter((post) => {
        const haystack = [
          post.title,
          post.excerpt,
          ...(post.categories || []),
          ...(post.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : posts;

  return <SanityBlogListing posts={filtered} searchQuery={q || ""} />;
}

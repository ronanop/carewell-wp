import type { Metadata } from "next";

import { BlogsArchiveRoute } from "@/components/blog/BlogsArchiveRoute";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: `Blogs | ${SITE_NAME}`,
  description:
    "Browse all Care Well Medical Centre articles on hair restoration, aesthetics, peptide therapy, and wellness.",
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    title: `Blogs | ${SITE_NAME}`,
    description:
      "Clinical articles and patient guides from Care Well Medical Centre, South Delhi.",
    url: `${SITE_URL}/blogs`,
    type: "website",
  },
};

/**
 * Public blog archive at /blogs — all WordPress posts with search & sort.
 */
export default async function BlogsArchivePage() {
  return <BlogsArchiveRoute />;
}

import { BlogArchive } from "@/components/blog/BlogArchive";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import {
  listAllBlogPosts,
  listBlogCategories,
} from "@/lib/blog/services/blogService";

/**
 * Shared /blogs archive shell — used by `app/blogs` and catch-all fallback.
 * Soft-fails WordPress errors so the archive still renders on Vercel.
 */
export async function BlogsArchiveRoute() {
  const [posts, categories] = await Promise.all([
    listAllBlogPosts().catch(() => []),
    listBlogCategories().catch(() => []),
  ]);

  return (
    <>
      <NavbarPlaceholder />
      <main className="min-h-screen bg-background">
        <BlogArchive posts={posts} categories={categories} />
      </main>
      <FooterPlaceholder />
    </>
  );
}

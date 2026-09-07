import Link from "next/link";

import { AdminCmsInventory } from "@/components/admin/AdminCmsInventory";
import { AdminRefreshButton } from "@/components/admin/AdminRefreshButton";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/admin/requireSession";
import {
  sanityDocumentManageUrl,
  sanityProjectManageUrl,
} from "@/lib/sanity/manageUrl";
import { getSanityPostsList, postPublicPath } from "@/lib/sanity/post";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Blogs | Care Well Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(value?: string | null) {
  if (!value) return null;
  const t = Date.parse(value);
  if (Number.isNaN(t)) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(t);
}

export default async function AdminBlogsPage() {
  await requireAdminSession();
  const posts = await getSanityPostsList({ live: true });

  const rows = posts.map((post) => ({
    id: post._id,
    title: post.title || "(Untitled)",
    slug: post.slug || "",
    uri: post.uri || null,
    href: postPublicPath(post),
    editUrl: sanityDocumentManageUrl(post._id),
    meta: formatDate(post.publishedAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
            Blogs
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            All Sanity posts with slug, URI, and live public path. Edit content
            in Sanity; this list is for inventory and quick links.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminRefreshButton path="/admin/blogs" />
          <Link
            href="/blogs"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "no-underline",
            )}
          >
            Blog index
          </Link>
          <a
            href={sanityProjectManageUrl()}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "text-white no-underline hover:text-white hover:no-underline",
            )}
          >
            Open Sanity
          </a>
        </div>
      </div>

      <AdminCmsInventory
        rows={rows}
        emptyLabel="No blog posts found in Sanity."
        searchPlaceholder="Search blogs by title, slug, or URI…"
      />
    </div>
  );
}

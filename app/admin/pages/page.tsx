import Link from "next/link";

import { AdminCmsInventory } from "@/components/admin/AdminCmsInventory";
import { AdminRefreshButton } from "@/components/admin/AdminRefreshButton";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/admin/requireSession";
import {
  sanityDocumentManageUrl,
  sanityProjectManageUrl,
} from "@/lib/sanity/manageUrl";
import { getSanityPagesList, pagePublicPath } from "@/lib/sanity/page";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pages | Care Well Admin",
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

export default async function AdminPagesPage() {
  await requireAdminSession();
  const pages = await getSanityPagesList({ live: true });

  const rows = pages.map((page) => ({
    id: page._id,
    title: page.title || "(Untitled)",
    slug: page.slug || "",
    uri: page.uri || null,
    href: pagePublicPath(page),
    editUrl: sanityDocumentManageUrl(page._id),
    meta: formatDate(page.publishedAt || page.updatedAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
            Pages
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            All Sanity CMS pages with slug, URI, and public link. Handcrafted
            routes (home, about, contact, legal) are not listed here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminRefreshButton path="/admin/pages" />
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "no-underline",
            )}
          >
            View site
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
        emptyLabel="No CMS pages found in Sanity."
        searchPlaceholder="Search pages by title, slug, or URI…"
      />
    </div>
  );
}

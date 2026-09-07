import Link from "next/link";

import { AdminCmsInventory } from "@/components/admin/AdminCmsInventory";
import { AdminRefreshButton } from "@/components/admin/AdminRefreshButton";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/admin/requireSession";
import {
  sanityDocumentManageUrl,
  sanityProjectManageUrl,
} from "@/lib/sanity/manageUrl";
import {
  getSanityServicesList,
  servicePublicPath,
} from "@/lib/sanity/service";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Services | Care Well Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await requireAdminSession();
  const services = await getSanityServicesList({ live: true });

  const rows = services.map((service) => ({
    id: service._id,
    title: service.title || "(Untitled)",
    slug: service.slug || "",
    uri: service.uri || null,
    href: servicePublicPath(service),
    editUrl: sanityDocumentManageUrl(service._id),
    meta: service.category || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
            Services
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            All Sanity service pages with slug, URI, and live public path. Use
            the copy buttons to grab a slug or path quickly; edit content in
            Sanity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminRefreshButton path="/admin/services" />
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
        emptyLabel="No service pages found in Sanity."
        searchPlaceholder="Search services by title, slug, or URI…"
      />
    </div>
  );
}

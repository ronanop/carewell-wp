import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/requireSession";
import { buttonVariants } from "@/components/ui/button";
import { sanityProjectId } from "@/lib/sanity/client";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Website content | Care Well Admin",
  robots: { index: false, follow: false },
};

const MANAGE = `https://www.sanity.io/manage/project/${sanityProjectId}`;

const LINKS: {
  title: string;
  description: string;
  href: string;
  external: boolean;
  cta: string;
}[] = [
  {
    title: "Services",
    description:
      "Inventory of all service pages with slug, URI, and copy buttons.",
    href: "/admin/services",
    external: false,
    cta: "View services inventory →",
  },
  {
    title: "Blog posts",
    description: "Inventory of all posts with slug, URI, and public links.",
    href: "/admin/blogs",
    external: false,
    cta: "View blog inventory →",
  },
  {
    title: "Pages",
    description: "Inventory of all CMS pages with slug, URI, and public links.",
    href: "/admin/pages",
    external: false,
    cta: "View pages inventory →",
  },
  {
    title: "Navigation",
    description: "Header/menu structure.",
    href: MANAGE,
    external: true,
    cta: "Open in Sanity →",
  },
  {
    title: "Homepage",
    description:
      "Hero & section images, homepage button links, service cards, footer links.",
    href: MANAGE,
    external: true,
    cta: "Open in Sanity →",
  },
  {
    title: "Site settings",
    description: "Phone, WhatsApp, address, hours, hello bar, OG defaults.",
    href: MANAGE,
    external: true,
    cta: "Open in Sanity →",
  },
  {
    title: "Redirects",
    description: "301/302 URL redirects (wired into the live site).",
    href: MANAGE,
    external: true,
    cta: "Open in Sanity →",
  },
  {
    title: "Gallery & testimonials",
    description: "Reusable before/after and patient quotes.",
    href: MANAGE,
    external: true,
    cta: "Open in Sanity →",
  },
];

const cardClass =
  "block h-full rounded-xl border border-slate-200 bg-white p-5 no-underline transition hover:border-primary/30 hover:shadow-sm";

export default async function AdminContentPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
          Website content
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Content is edited in <strong>Sanity</strong> (CMS). This admin panel
          manages leads and staff — use the links below to open Sanity or browse
          inventories.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={MANAGE}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "default" }),
            "text-white no-underline hover:text-white hover:no-underline",
          )}
        >
          Open Sanity Manage
        </a>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
        >
          Preview public site
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((item) => (
          <li key={item.title}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={cardClass}
              >
                <h2 className="font-heading text-base font-semibold text-[#0A2540]">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-3 text-sm font-medium text-primary">{item.cta}</p>
              </a>
            ) : (
              <Link href={item.href} className={cardClass}>
                <h2 className="font-heading text-base font-semibold text-[#0A2540]">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-3 text-sm font-medium text-primary">{item.cta}</p>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

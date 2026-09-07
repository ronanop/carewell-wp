import Link from "next/link";

import { requireAdminSession } from "@/lib/admin/requireSession";
import { getContentDashboardStats } from "@/lib/admin/contentStats";
import { getLeadDashboardStats } from "@/lib/admin/leadStats";
import { getVisitorDashboardStats } from "@/lib/analytics/stats";
import { formatLeadStatus } from "@/lib/leads/adminSerialize";
import { buttonVariants } from "@/components/ui/button";
import { sanityProjectId } from "@/lib/sanity/client";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin dashboard | Care Well",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const [leads, visitors, content] = await Promise.all([
    getLeadDashboardStats(),
    getVisitorDashboardStats(),
    getContentDashboardStats(),
  ]);

  const studioManage = `https://www.sanity.io/manage/project/${sanityProjectId}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Clinic ops console — visitors, leads, and content at a glance.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-500">
          Visitors
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Visitors today"
            value={String(visitors.visitorsToday)}
            hint="Unique visitors"
          />
          <StatCard
            label="Visitors · 7 days"
            value={String(visitors.visitors7d)}
          />
          <StatCard
            label="Visitors · 30 days"
            value={String(visitors.visitors30d)}
          />
          <StatCard
            label="Pageviews today"
            value={String(visitors.pageviewsToday)}
          />
          <StatCard
            label="Pageviews · 7 days"
            value={String(visitors.pageviews7d)}
          />
          <StatCard
            label="Pageviews · 30 days"
            value={String(visitors.pageviews30d)}
          />
        </div>
        {visitors.pageviews30d === 0 ? (
          <p className="text-xs text-slate-500">
            No pageviews recorded yet — open the public site (not /admin) to
            start collecting.
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-500">
          Leads
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total leads"
            value={String(leads.total)}
            href="/admin/leads"
          />
          <StatCard
            label="New"
            value={String(leads.newCount)}
            href="/admin/leads?status=NEW"
          />
          <StatCard
            label="Today"
            value={String(leads.todayCount)}
            href="/admin/leads"
          />
          <StatCard
            label="Last 7 days"
            value={String(leads.weekCount)}
            href="/admin/leads"
          />
          <StatCard
            label="Unassigned"
            value={String(leads.unassignedCount)}
            href="/admin/leads"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-500">
          Website content
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Blog posts"
            value={String(content.posts)}
            href="/admin/blogs"
          />
          <StatCard
            label="CMS pages"
            value={String(content.pages)}
            href="/admin/pages"
          />
          <StatCard
            label="Services"
            value={String(content.services)}
            href="/admin/content"
          />
        </div>
      </section>

      {visitors.topPages.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Top pages · 7 days
          </h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {visitors.topPages.map((row) => (
              <li
                key={row.path}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <Link
                  href={row.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 truncate font-mono text-xs text-primary no-underline hover:underline"
                  title={row.path}
                >
                  {row.path}
                </Link>
                <span className="shrink-0 font-semibold text-[#0A2540]">
                  {row.views}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-6">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Top pages · 7 days
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            No pageviews yet. Browse the public site to start collecting visitor
            data.
          </p>
        </section>
      )}

      {leads.byStatus.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Leads by status
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {leads.byStatus.map((row) => (
              <li key={row.status}>
                <Link
                  href={`/admin/leads?status=${row.status}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm no-underline hover:border-primary/30 hover:bg-slate-50"
                >
                  <span>{formatLeadStatus(row.status)}</span>
                  <span className="font-semibold text-[#0A2540]">{row.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Operations
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/admin/leads" className="text-primary hover:underline">
                Manage leads
              </Link>
            </li>
            <li>
              <Link
                href="/admin/leads/export"
                className="text-primary hover:underline"
              >
                Export leads CSV
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="text-primary hover:underline">
                Staff users & roles
              </Link>
            </li>
            <li>
              <Link href="/admin/blogs" className="text-primary hover:underline">
                Blog inventory
              </Link>
            </li>
            <li>
              <Link href="/admin/pages" className="text-primary hover:underline">
                Pages inventory
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Website content (Sanity)
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Edit services, blogs, pages, redirects, and site settings in Sanity
            Studio — not duplicated here.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={studioManage}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "text-white no-underline hover:text-white hover:no-underline",
              )}
            >
              Open Sanity Manage
            </a>
            <Link
              href="/admin/content"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "no-underline",
              )}
            >
              Content shortcuts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: string;
  href?: string;
  hint?: string;
}) {
  const inner = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-semibold text-[#0A2540]">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl border border-slate-200 bg-white p-5 no-underline shadow-sm transition hover:border-primary/30 hover:shadow-md"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {inner}
    </div>
  );
}

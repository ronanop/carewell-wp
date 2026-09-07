import Link from "next/link";

import {
  formatAdminDateOnly,
  formatAdminTimeOnly,
  formatLeadId,
  formatLeadPriority,
  formatLeadSourcePage,
  formatLeadStatus,
  toAdminLeadListItem,
} from "@/lib/leads/adminSerialize";
import { listLeadsAction } from "@/lib/leads/actions/leadActions";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/types";
import { hasLeadPermission } from "@/lib/leads/rbac";
import { requireAdminSession } from "@/lib/admin/requireSession";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Leads | Care Well Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = params.status?.trim() || undefined;
  const priority = params.priority?.trim() || undefined;
  const search = params.q?.trim() || undefined;

  const result = await listLeadsAction({
    status,
    priority,
    search,
    page,
    pageSize: 50,
  });

  if (!result.ok) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        {result.message}
      </div>
    );
  }

  const { items, total, pageSize } = result.data;
  const leads = items.map(toAdminLeadListItem);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canWrite = hasLeadPermission(session.user.role!, "leads:write");

  function hrefFor(next: {
    status?: string;
    priority?: string;
    q?: string;
    page?: number;
  }) {
    const sp = new URLSearchParams();
    const s = next.status ?? status;
    const p = next.priority ?? priority;
    const q = next.q ?? search;
    const pg = next.page ?? page;
    if (s) sp.set("status", s);
    if (p) sp.set("priority", p);
    if (q) sp.set("q", q);
    if (pg > 1) sp.set("page", String(pg));
    const qs = sp.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
            Leads
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {total} enquir{total === 1 ? "y" : "ies"} collected
            {canWrite ? "" : " · read only"}
          </p>
        </div>
        {/* File download — raw anchor is intentional */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/admin/leads/export"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "no-underline",
          )}
        >
          Export CSV
        </a>
      </div>

      <form
        method="get"
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="q" className="mb-1 block text-xs font-medium text-slate-600">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={search || ""}
            placeholder="Lead ID, name, phone, email, page…"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-xs font-medium text-slate-600"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status || ""}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">All</option>
            {LEAD_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="priority"
            className="mb-1 block text-xs font-medium text-slate-600"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={priority || ""}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">All</option>
            {LEAD_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "h-10 text-white")}
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="max-h-[min(70vh,44rem)] overflow-auto">
          <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50 text-[0.65rem] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[7.5rem] px-3 py-2.5 font-medium">Lead ID</th>
                <th className="w-[7rem] px-3 py-2.5 font-medium">Filled date</th>
                <th className="w-[6.5rem] px-3 py-2.5 font-medium">Filled time</th>
                <th className="w-[12rem] px-3 py-2.5 font-medium">Patient</th>
                <th className="w-[11rem] px-3 py-2.5 font-medium">Source page</th>
                <th className="w-[9rem] px-3 py-2.5 font-medium">Treatment</th>
                <th className="w-[12rem] px-3 py-2.5 font-medium">Message</th>
                <th className="w-[7rem] px-3 py-2.5 font-medium">Contact</th>
                <th className="w-[7rem] px-3 py-2.5 font-medium">Status</th>
                <th className="w-[5.5rem] px-3 py-2.5 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No leads yet. Submit a consultation form on the public site
                    to see entries here.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const source = formatLeadSourcePage(lead);
                  const leadId = formatLeadId(lead);
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="px-3 py-2.5 align-top">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-mono text-xs font-semibold text-primary no-underline hover:underline"
                          title={lead.uuid || lead.id}
                        >
                          {leadId}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 align-top text-slate-700">
                        {formatAdminDateOnly(lead.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 align-top text-slate-700">
                        {formatAdminTimeOnly(lead.createdAt)}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="block truncate font-medium text-[#0A2540] no-underline hover:text-primary hover:underline"
                          title={lead.name}
                        >
                          {lead.name}
                        </Link>
                        <div className="mt-0.5 truncate text-xs text-slate-500" title={lead.phone}>
                          {lead.phone}
                        </div>
                        {lead.email ? (
                          <div
                            className="truncate text-xs text-slate-400"
                            title={lead.email}
                          >
                            {lead.email}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        {source.href ? (
                          <Link
                            href={source.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={source.href}
                            className="block truncate text-xs text-primary no-underline hover:underline"
                          >
                            {source.label}
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">{source.label}</span>
                        )}
                        {(lead.pageUri || lead.pageSlug) && (
                          <div
                            className="mt-0.5 truncate font-mono text-[0.65rem] text-slate-400"
                            title={lead.pageUri || lead.pageSlug || undefined}
                          >
                            {lead.pageUri || `/${lead.pageSlug}/`}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <span className="line-clamp-2 text-slate-700">
                          {lead.treatment || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <span
                          className="line-clamp-2 text-xs text-slate-600"
                          title={lead.message || undefined}
                        >
                          {lead.message || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 align-top text-xs text-slate-600">
                        <div>{lead.preferredContactMethod}</div>
                        {lead.preferredTime ? (
                          <div className="text-slate-400">{lead.preferredTime}</div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-medium text-slate-700">
                          {formatLeadStatus(lead.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 align-top text-xs text-slate-700">
                        {formatLeadPriority(lead.priority)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">
            Page {page} of {totalPages} · showing {leads.length} of {total}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={hrefFor({ page: page - 1 })}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "no-underline",
                )}
              >
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                href={hrefFor({ page: page + 1 })}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "no-underline",
                )}
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

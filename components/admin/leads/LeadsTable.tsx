import Link from "next/link";

import type { LeadRecord } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

const statusTone: Record<string, string> = {
  NEW: "bg-sky-100 text-sky-800",
  CONTACT_ATTEMPTED: "bg-amber-100 text-amber-900",
  CONTACTED: "bg-indigo-100 text-indigo-900",
  INTERESTED: "bg-violet-100 text-violet-900",
  QUALIFIED: "bg-teal-100 text-teal-900",
  APPOINTMENT_SCHEDULED: "bg-cyan-100 text-cyan-900",
  APPOINTMENT_COMPLETED: "bg-emerald-100 text-emerald-900",
  TREATMENT_STARTED: "bg-emerald-100 text-emerald-900",
  CONVERTED: "bg-green-100 text-green-900",
  LOST: "bg-stone-200 text-stone-700",
  SPAM: "bg-rose-100 text-rose-800",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export function LeadsTable({ leads }: { leads: LeadRecord[] }) {
  if (!leads.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="font-heading text-h3 font-semibold text-foreground">
          No leads yet
        </p>
        <p className="mt-2 text-body text-muted-foreground">
          Consultation requests from the public site will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-small">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Patient</th>
            <th className="px-4 py-3 font-medium">Treatment</th>
            <th className="px-4 py-3 font-medium">Source page</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-border/70 last:border-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-medium text-foreground no-underline hover:text-primary hover:underline"
                >
                  {lead.name}
                </Link>
                <p className="text-muted-foreground">{lead.phone}</p>
              </td>
              <td className="px-4 py-3 text-foreground">
                {lead.treatment ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {lead.pageTitle ?? lead.pageSlug ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex rounded-md px-2 py-0.5 text-[0.6875rem] font-medium capitalize",
                    statusTone[lead.status] ?? "bg-muted text-foreground",
                  )}
                >
                  {statusLabel(lead.status).toLowerCase()}
                </span>
              </td>
              <td className="px-4 py-3 capitalize text-foreground">
                {lead.priority.toLowerCase()}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {lead.createdAt.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

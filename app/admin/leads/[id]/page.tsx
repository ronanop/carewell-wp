import Link from "next/link";
import { notFound } from "next/navigation";

import {
  LeadAssignForm,
  LeadNoteForm,
  LeadStatusPriorityForm,
} from "@/components/admin/leads/LeadDetailForms";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/admin/requireSession";
import { getLeadDetailAction } from "@/lib/leads/actions/leadActions";
import {
  formatAdminDate,
  formatLeadPriority,
  formatLeadSourcePage,
  formatLeadStatus,
  toAdminLeadDetail,
} from "@/lib/leads/adminSerialize";
import { hasLeadPermission } from "@/lib/leads/rbac";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Lead detail | Care Well Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdminSession();
  const { id } = await params;
  const result = await getLeadDetailAction(id);

  if (!result.ok) {
    if (result.message === "Lead not found") notFound();
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        {result.message}
      </div>
    );
  }

  const lead = toAdminLeadDetail(result.data);
  const canWrite = hasLeadPermission(session.user.role!, "leads:write");
  const source = formatLeadSourcePage(lead);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="text-sm font-medium text-primary no-underline hover:underline"
          >
            ← Back to leads
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-[#0A2540]">
            {lead.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {formatLeadStatus(lead.status)} · {formatLeadPriority(lead.priority)}{" "}
            · score {lead.leadScore}
          </p>
        </div>
        <a
          href={`tel:${lead.phone}`}
          className={cn(buttonVariants({ variant: "call", size: "sm" }), "no-underline")}
        >
          Call {lead.phone}
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Enquiry
          </h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Phone
              </dt>
              <dd className="mt-0.5 text-slate-800">{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </dt>
              <dd className="mt-0.5 text-slate-800">{lead.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Treatment
              </dt>
              <dd className="mt-0.5 text-slate-800">{lead.treatment || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Preferred contact
              </dt>
              <dd className="mt-0.5 text-slate-800">
                {lead.preferredContactMethod}
                {lead.preferredTime ? ` · ${lead.preferredTime}` : ""}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Message
              </dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-slate-800">
                {lead.message || "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Submitted from
              </dt>
              <dd className="mt-0.5 text-slate-800">
                {source.href ? (
                  <Link
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary no-underline hover:underline"
                  >
                    {source.label}
                  </Link>
                ) : (
                  source.label
                )}
                {(lead.pageUri || lead.pageSlug || lead.currentUrl) && (
                  <div className="mt-1 font-mono text-xs text-slate-500">
                    {lead.pageUri ||
                      (lead.pageSlug ? `/${lead.pageSlug}/` : null) ||
                      lead.currentUrl}
                  </div>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Created
              </dt>
              <dd className="mt-0.5 text-slate-800">
                {formatAdminDate(lead.createdAt)}
              </dd>
            </div>
            {(lead.utmSource || lead.utmCampaign) && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Attribution
                </dt>
                <dd className="mt-0.5 text-slate-800">
                  {[lead.utmSource, lead.utmMedium, lead.utmCampaign]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Update
          </h2>
          <LeadStatusPriorityForm
            leadId={lead.id}
            status={lead.status}
            priority={lead.priority}
            canWrite={canWrite}
          />
          <div className="border-t border-slate-100 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Assignment
            </h3>
            <LeadAssignForm
              leadId={lead.id}
              assignedStaff={lead.assignedStaff}
              assignedDoctor={lead.assignedDoctor}
              canWrite={canWrite}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Notes
          </h2>
          <div className="mt-4">
            <LeadNoteForm leadId={lead.id} canWrite={canWrite} />
          </div>
          <ul className="mt-6 space-y-3">
            {lead.notes.length === 0 ? (
              <li className="text-sm text-slate-500">No notes yet.</li>
            ) : (
              lead.notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm"
                >
                  <p className="whitespace-pre-wrap text-slate-800">{note.body}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatAdminDate(note.createdAt)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-semibold text-[#0A2540]">
            Timeline
          </h2>
          <ol className="mt-4 space-y-3">
            {lead.timeline.length === 0 ? (
              <li className="text-sm text-slate-500">No activity yet.</li>
            ) : (
              lead.timeline.map((event) => (
                <li
                  key={event.id}
                  className="border-l-2 border-primary/30 pl-3 text-sm"
                >
                  <p className="font-medium text-slate-800">{event.title}</p>
                  {event.description ? (
                    <p className="mt-0.5 text-slate-600">{event.description}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-slate-500">
                    {formatAdminDate(event.createdAt)} · {event.eventType}
                  </p>
                </li>
              ))
            )}
          </ol>
        </section>
      </div>
    </div>
  );
}

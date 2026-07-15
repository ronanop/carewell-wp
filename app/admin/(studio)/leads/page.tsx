import { auth } from "@/auth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadsTable } from "@/components/admin/leads/LeadsTable";
import { hasLeadPermission } from "@/lib/leads/rbac";
import { createLeadService } from "@/lib/leads/services/leadService";
import type { LeadStatus } from "@/lib/leads/types";
import { leadStatusSchema } from "@/lib/leads/validators";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  status?: string;
  q?: string;
  page?: string;
}>;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.role || !hasLeadPermission(session.user.role, "leads:read")) {
    return (
      <div>
        <AdminPageHeader title="Leads" description="Access denied." />
      </div>
    );
  }

  const params = await searchParams;
  const statusParsed = params.status
    ? leadStatusSchema.safeParse(params.status)
    : null;
  const status = statusParsed?.success
    ? (statusParsed.data as LeadStatus)
    : undefined;
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const result = await createLeadService().listLeads(
    {
      status,
      search: params.q?.trim() || undefined,
    },
    page,
    25,
  );

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        description="Patient consultation enquiries captured by the Lead Engine. Timeline and assignment live on each lead."
      />

      <form className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end" method="get">
        <div className="min-w-0 flex-1">
          <label htmlFor="leads-q" className="text-small font-medium text-foreground">
            Search
          </label>
          <input
            id="leads-q"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Name, phone, email, treatment…"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-small"
          />
        </div>
        <div>
          <label
            htmlFor="leads-status"
            className="text-small font-medium text-foreground"
          >
            Status
          </label>
          <select
            id="leads-status"
            name="status"
            defaultValue={status ?? ""}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-small sm:w-48"
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="APPOINTMENT_SCHEDULED">Appointment scheduled</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
            <option value="SPAM">Spam</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-small font-medium text-primary-foreground"
        >
          Filter
        </button>
      </form>

      <p className="mb-3 text-small text-muted-foreground">
        {result.total} lead{result.total === 1 ? "" : "s"}
      </p>
      <LeadsTable leads={result.items} />
    </div>
  );
}

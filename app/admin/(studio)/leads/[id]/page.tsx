import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadAdminControls } from "@/components/admin/leads/LeadAdminControls";
import { LeadTimeline } from "@/components/admin/leads/LeadTimeline";
import { hasLeadPermission } from "@/lib/leads/rbac";
import { createLeadService } from "@/lib/leads/services/leadService";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.role || !hasLeadPermission(session.user.role, "leads:read")) {
    return (
      <div>
        <AdminPageHeader title="Lead" description="Access denied." />
      </div>
    );
  }

  const { id } = await params;
  const lead = await createLeadService().getLeadDetail(id);
  if (!lead) {
    notFound();
  }

  const canWrite = hasLeadPermission(session.user.role, "leads:write");

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/leads"
          className="text-small text-muted-foreground no-underline hover:text-primary hover:underline"
        >
          ← Back to leads
        </Link>
      </div>

      <AdminPageHeader
        title={lead.name}
        description={`${lead.phone}${lead.email ? ` · ${lead.email}` : ""}`}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-heading text-h3 font-semibold text-foreground">
              Enquiry
            </h2>
            <dl className="mt-4 grid gap-3 text-small sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Treatment</dt>
                <dd className="mt-0.5 font-medium">{lead.treatment ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Preferred contact</dt>
                <dd className="mt-0.5 font-medium capitalize">
                  {lead.preferredContactMethod.toLowerCase()}
                  {lead.preferredTime
                    ? ` · ${lead.preferredTime.toLowerCase()}`
                    : ""}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Score</dt>
                <dd className="mt-0.5 font-medium">{lead.leadScore}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Source page</dt>
                <dd className="mt-0.5 font-medium">
                  {lead.pageTitle ?? lead.pageSlug ?? "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Message</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-foreground">
                  {lead.message ?? "—"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-heading text-h3 font-semibold text-foreground">
              Attribution
            </h2>
            <dl className="mt-4 grid gap-3 text-small sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">URL</dt>
                <dd className="mt-0.5 break-all">{lead.currentUrl ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Referrer</dt>
                <dd className="mt-0.5 break-all">{lead.referrer ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">UTM</dt>
                <dd className="mt-0.5">
                  {[lead.utmSource, lead.utmMedium, lead.utmCampaign]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Device</dt>
                <dd className="mt-0.5">
                  {[lead.device, lead.browser, lead.os]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 font-heading text-h3 font-semibold text-foreground">
              Timeline
            </h2>
            <LeadTimeline events={lead.timeline} />
          </section>
        </div>

        <aside>
          {canWrite ? (
            <LeadAdminControls
              leadId={lead.id}
              status={lead.status}
              priority={lead.priority}
              assignedStaff={lead.assignedStaff}
              assignedDoctor={lead.assignedDoctor}
            />
          ) : (
            <div className="rounded-xl border border-border bg-surface p-5 text-small text-muted-foreground">
              Read-only access
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

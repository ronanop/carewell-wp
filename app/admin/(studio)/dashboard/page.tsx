import {
  Activity,
  Database,
  FileText,
  LayoutTemplate,
  Server,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SyncWordPressButton } from "@/components/admin/pages/SyncWordPressButton";
import { StatCard } from "@/components/admin/StatCard";
import { getDashboardSummary } from "@/lib/experience/services/dashboardService";

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Website experience health at a glance. Content stays in WordPress — this studio controls presentation."
        actions={<SyncWordPressButton />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Synced pages"
          value={summary.pageExperiences}
          hint="WordPress pages mirrored locally"
          icon={FileText}
        />
        <StatCard
          label="Templates"
          value={summary.templates}
          hint="Hair, plastic, skin, wellness, blog…"
          icon={LayoutTemplate}
        />
        <StatCard
          label="Studio users"
          value={summary.users}
          hint="RBAC: Admin, Editor, Marketing, Developer"
          icon={Users}
        />
        <StatCard
          label="Database"
          value={summary.databaseConfigured ? "Configured" : "Pending"}
          hint={
            summary.databaseConfigured
              ? "DATABASE_URL detected"
              : "Add DATABASE_URL to enable persistence"
          }
          icon={Database}
          tone={summary.databaseConfigured ? "success" : "warning"}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-heading text-h4 font-semibold text-foreground">
            System health
          </h2>
          <ul className="mt-4 space-y-3 text-small">
            <li className="flex items-center justify-between gap-3 border-b border-border/60 py-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Server className="size-4" aria-hidden />
                WPGraphQL
              </span>
              <span className="font-medium text-foreground">
                {process.env.WORDPRESS_GRAPHQL_ENDPOINT
                  ? "Endpoint set"
                  : "Not configured"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3 border-b border-border/60 py-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Database className="size-4" aria-hidden />
                Experience DB
              </span>
              <span className="font-medium text-foreground">
                {summary.databaseConfigured ? "Ready" : "Placeholder"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Activity className="size-4" aria-hidden />
                Cache / revalidation
              </span>
              <span className="font-medium text-foreground">Phase pending</span>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-heading text-h4 font-semibold text-foreground">
            Quick actions
          </h2>
          <ul className="mt-4 space-y-2 text-small">
            <li>
              <Link
                href="/admin/pages"
                className="block rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground hover:no-underline"
              >
                Sync WordPress pages → Pages module
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pages"
                className="block rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground hover:no-underline"
              >
                Open Page Studio from a synced page
              </Link>
            </li>
            <li className="rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground">
              Templates, Doctors, Gallery remain placeholders
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

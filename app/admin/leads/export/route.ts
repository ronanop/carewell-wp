import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createLeadService } from "@/lib/leads/services/leadService";
import { hasLeadPermission } from "@/lib/leads/rbac";

function csvEscape(value: string | null | undefined): string {
  const raw = value ?? "";
  if (/[",\n]/.test(raw)) {
    return `"${raw.replaceAll('"', '""')}"`;
  }
  return raw;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.role || !hasLeadPermission(session.user.role, "leads:read")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await createLeadService().listLeads({}, 1, 5000);
  const header = [
    "id",
    "createdAt",
    "name",
    "phone",
    "email",
    "treatment",
    "status",
    "priority",
    "pageTitle",
    "pageUri",
    "pageSlug",
    "currentUrl",
    "utmSource",
    "utmCampaign",
    "message",
  ];

  const lines = [
    header.join(","),
    ...result.items.map((lead) =>
      [
        lead.id,
        lead.createdAt.toISOString(),
        lead.name,
        lead.phone,
        lead.email,
        lead.treatment,
        lead.status,
        lead.priority,
        lead.pageTitle,
        lead.pageUri,
        lead.pageSlug,
        lead.currentUrl,
        lead.utmSource,
        lead.utmCampaign,
        lead.message,
      ]
        .map((cell) => csvEscape(cell == null ? "" : String(cell)))
        .join(","),
    ),
  ];

  const body = lines.join("\n");
  const filename = `carewell-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

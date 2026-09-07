import type {
  LeadDetail,
  LeadNoteRecord,
  LeadPriority,
  LeadRecord,
  LeadStatus,
  LeadTimelineRecord,
} from "@/lib/leads/types";

/** JSON-safe lead shapes for admin UI (Dates → ISO strings). */

export type AdminLeadListItem = Omit<
  LeadRecord,
  "createdAt" | "updatedAt" | "lastActivityAt" | "deletedAt"
> & {
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  deletedAt: string | null;
};

export type AdminLeadNote = Omit<LeadNoteRecord, "createdAt"> & {
  createdAt: string;
};

export type AdminLeadTimelineItem = Omit<LeadTimelineRecord, "createdAt"> & {
  createdAt: string;
};

export type AdminLeadDetail = Omit<
  LeadDetail,
  "createdAt" | "updatedAt" | "lastActivityAt" | "deletedAt" | "notes" | "timeline"
> & {
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  deletedAt: string | null;
  notes: AdminLeadNote[];
  timeline: AdminLeadTimelineItem[];
};

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.toISOString();
}

export function toAdminLeadListItem(lead: LeadRecord): AdminLeadListItem {
  return {
    ...lead,
    createdAt: iso(lead.createdAt)!,
    updatedAt: iso(lead.updatedAt)!,
    lastActivityAt: iso(lead.lastActivityAt)!,
    deletedAt: iso(lead.deletedAt),
  };
}

export function toAdminLeadDetail(lead: LeadDetail): AdminLeadDetail {
  return {
    ...lead,
    createdAt: iso(lead.createdAt)!,
    updatedAt: iso(lead.updatedAt)!,
    lastActivityAt: iso(lead.lastActivityAt)!,
    deletedAt: iso(lead.deletedAt),
    notes: lead.notes.map((note) => ({
      ...note,
      createdAt: iso(note.createdAt)!,
    })),
    timeline: lead.timeline.map((event) => ({
      ...event,
      createdAt: iso(event.createdAt)!,
    })),
  };
}

export function formatLeadStatus(status: LeadStatus): string {
  return status.replaceAll("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export function formatLeadPriority(priority: LeadPriority): string {
  return priority.charAt(0) + priority.slice(1).toLowerCase();
}

export function formatAdminDate(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAdminDateOnly(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function formatAdminTimeOnly(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

/** Short human-readable lead reference from uuid / id. */
export function formatLeadId(lead: { uuid?: string | null; id: string }): string {
  const raw = (lead.uuid || lead.id).replace(/-/g, "").toUpperCase();
  return `CW-${raw.slice(0, 8)}`;
}

/** Best-effort public path label for where the form was submitted. */
export function formatLeadSourcePage(lead: {
  pageTitle?: string | null;
  pageUri?: string | null;
  pageSlug?: string | null;
  currentUrl?: string | null;
}): { label: string; href: string | null } {
  const pathFromUrl = (() => {
    const raw = lead.currentUrl?.trim();
    if (!raw) return null;
    try {
      const u = new URL(raw);
      return u.pathname + (u.search || "");
    } catch {
      return raw.startsWith("/") ? raw : null;
    }
  })();

  const path =
    lead.pageUri?.trim() ||
    pathFromUrl ||
    (lead.pageSlug?.trim() ? `/${lead.pageSlug.replace(/^\/+|\/+$/g, "")}/` : null);

  const title = lead.pageTitle?.trim() || null;
  const label = title || path || "Unknown page";
  const href = path
    ? path.startsWith("http")
      ? path
      : path.startsWith("/")
        ? path
        : `/${path}`
    : lead.currentUrl?.trim() || null;

  return { label, href };
}

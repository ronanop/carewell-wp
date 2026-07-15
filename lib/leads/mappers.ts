import "server-only";

import type {
  Lead,
  LeadNote,
  LeadTimelineEvent,
  Prisma,
} from "@prisma/client";

import type {
  LeadDetail,
  LeadListFilters,
  LeadListResult,
  LeadNoteRecord,
  LeadRecord,
  LeadTimelineRecord,
} from "@/lib/leads/types";

export function mapLead(row: Lead): LeadRecord {
  return {
    id: row.id,
    uuid: row.uuid,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    treatment: row.treatment,
    preferredContactMethod: row.preferredContactMethod,
    preferredTime: row.preferredTime,
    pageTitle: row.pageTitle,
    pageSlug: row.pageSlug,
    pageUri: row.pageUri,
    pageId: row.pageId,
    presentationPageId: row.presentationPageId,
    presentationVersion: row.presentationVersion,
    template: row.template,
    theme: row.theme,
    currentUrl: row.currentUrl,
    referrer: row.referrer,
    utmSource: row.utmSource,
    utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign,
    utmContent: row.utmContent,
    utmTerm: row.utmTerm,
    device: row.device,
    browser: row.browser,
    os: row.os,
    screenSize: row.screenSize,
    language: row.language,
    country: row.country,
    ip: row.ip,
    sessionId: row.sessionId,
    visitorId: row.visitorId,
    timezone: row.timezone,
    leadScore: row.leadScore,
    status: row.status,
    priority: row.priority,
    assignedDoctor: row.assignedDoctor,
    assignedStaff: row.assignedStaff,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lastActivityAt: row.lastActivityAt,
    deletedAt: row.deletedAt,
  };
}

export function mapTimeline(row: LeadTimelineEvent): LeadTimelineRecord {
  return {
    id: row.id,
    leadId: row.leadId,
    eventType: row.eventType,
    title: row.title,
    description: row.description,
    metadata: row.metadata,
    performedByUserId: row.performedByUserId,
    systemGenerated: row.systemGenerated,
    createdAt: row.createdAt,
  };
}

export function mapNote(row: LeadNote): LeadNoteRecord {
  return {
    id: row.id,
    leadId: row.leadId,
    body: row.body,
    createdByUserId: row.createdByUserId,
    createdAt: row.createdAt,
  };
}

export function mapLeadDetail(
  row: Lead & {
    timeline: LeadTimelineEvent[];
    notes: LeadNote[];
  },
): LeadDetail {
  return {
    ...mapLead(row),
    timeline: row.timeline.map(mapTimeline),
    notes: row.notes.map(mapNote),
  };
}

export function buildLeadWhere(
  filters: LeadListFilters = {},
): Prisma.LeadWhereInput {
  const and: Prisma.LeadWhereInput[] = [];

  if (!filters.includeDeleted) {
    and.push({ deletedAt: null });
  }

  if (filters.status) {
    and.push({
      status: Array.isArray(filters.status)
        ? { in: filters.status }
        : filters.status,
    });
  }

  if (filters.priority) {
    and.push({
      priority: Array.isArray(filters.priority)
        ? { in: filters.priority }
        : filters.priority,
    });
  }

  if (filters.treatment) {
    and.push({
      treatment: { contains: filters.treatment, mode: "insensitive" },
    });
  }

  if (filters.pageSlug) {
    and.push({ pageSlug: filters.pageSlug });
  }

  if (filters.assignedStaff) {
    and.push({ assignedStaff: filters.assignedStaff });
  }

  if (filters.assignedDoctor) {
    and.push({ assignedDoctor: filters.assignedDoctor });
  }

  if (filters.from || filters.to) {
    and.push({
      createdAt: {
        ...(filters.from ? { gte: filters.from } : {}),
        ...(filters.to ? { lte: filters.to } : {}),
      },
    });
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { email: { contains: q, mode: "insensitive" } },
        { treatment: { contains: q, mode: "insensitive" } },
        { pageTitle: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
}

export type { LeadListResult };

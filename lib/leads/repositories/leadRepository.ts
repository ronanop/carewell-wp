import "server-only";

import type { Prisma } from "@prisma/client";

import { getPrisma } from "@/lib/leads/db";
import {
  buildLeadWhere,
  mapLead,
  mapLeadDetail,
  mapNote,
  mapTimeline,
} from "@/lib/leads/mappers";
import type {
  LeadDetail,
  LeadListFilters,
  LeadListResult,
  LeadNoteRecord,
  LeadRecord,
  LeadTimelineEventType,
  LeadTimelineRecord,
} from "@/lib/leads/types";

export type CreateLeadData = Prisma.LeadCreateInput;

export type AppendTimelineData = {
  leadId: string;
  eventType: LeadTimelineEventType;
  title: string;
  description?: string | null;
  metadata?: Prisma.InputJsonValue;
  performedByUserId?: string | null;
  systemGenerated?: boolean;
};

export function createLeadRepository(client = getPrisma()) {
  return {
    async create(data: CreateLeadData): Promise<LeadRecord> {
      const row = await client.lead.create({ data });
      return mapLead(row);
    },

    async findById(id: string): Promise<LeadRecord | null> {
      const row = await client.lead.findFirst({
        where: { id, deletedAt: null },
      });
      return row ? mapLead(row) : null;
    },

    async findDetailById(id: string): Promise<LeadDetail | null> {
      const row = await client.lead.findFirst({
        where: { id },
        include: {
          timeline: { orderBy: { createdAt: "desc" } },
          notes: { orderBy: { createdAt: "desc" } },
        },
      });
      return row ? mapLeadDetail(row) : null;
    },

    async list(
      filters: LeadListFilters = {},
      page = 1,
      pageSize = 20,
    ): Promise<LeadListResult> {
      const where = buildLeadWhere(filters);
      const skip = (page - 1) * pageSize;

      const [rows, total] = await Promise.all([
        client.lead.findMany({
          where,
          orderBy: [{ lastActivityAt: "desc" }, { createdAt: "desc" }],
          skip,
          take: pageSize,
        }),
        client.lead.count({ where }),
      ]);

      return {
        items: rows.map(mapLead),
        total,
        page,
        pageSize,
      };
    },

    async update(
      id: string,
      data: Prisma.LeadUpdateInput,
    ): Promise<LeadRecord> {
      const row = await client.lead.update({
        where: { id },
        data: {
          ...data,
          lastActivityAt: new Date(),
        },
      });
      return mapLead(row);
    },

    async findRecentDuplicates(input: {
      phone: string;
      email?: string | null;
      visitorId?: string | null;
      withinHours?: number;
    }): Promise<LeadRecord[]> {
      const since = new Date(
        Date.now() - (input.withinHours ?? 72) * 60 * 60 * 1000,
      );
      const or: Prisma.LeadWhereInput[] = [{ phone: input.phone }];
      if (input.email) {
        or.push({ email: input.email });
      }
      if (input.visitorId) {
        or.push({ visitorId: input.visitorId });
      }

      const rows = await client.lead.findMany({
        where: {
          deletedAt: null,
          createdAt: { gte: since },
          OR: or,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
      return rows.map(mapLead);
    },

    async softDelete(id: string): Promise<LeadRecord> {
      return this.update(id, { deletedAt: new Date(), status: "ARCHIVED" });
    },
  };
}

export function createTimelineRepository(client = getPrisma()) {
  return {
    async append(data: AppendTimelineData): Promise<LeadTimelineRecord> {
      const row = await client.leadTimelineEvent.create({
        data: {
          leadId: data.leadId,
          eventType: data.eventType,
          title: data.title,
          description: data.description ?? null,
          metadata: data.metadata ?? undefined,
          performedByUserId: data.performedByUserId ?? null,
          systemGenerated: data.systemGenerated ?? true,
        },
      });
      return mapTimeline(row);
    },

    async listForLead(leadId: string): Promise<LeadTimelineRecord[]> {
      const rows = await client.leadTimelineEvent.findMany({
        where: { leadId },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(mapTimeline);
    },
  };
}

export function createNoteRepository(client = getPrisma()) {
  return {
    async create(input: {
      leadId: string;
      body: string;
      createdByUserId?: string | null;
    }): Promise<LeadNoteRecord> {
      const row = await client.leadNote.create({
        data: {
          leadId: input.leadId,
          body: input.body,
          createdByUserId: input.createdByUserId ?? null,
        },
      });
      return mapNote(row);
    },
  };
}

export type LeadRepository = ReturnType<typeof createLeadRepository>;
export type TimelineRepository = ReturnType<typeof createTimelineRepository>;
export type NoteRepository = ReturnType<typeof createNoteRepository>;

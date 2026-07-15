import "server-only";

import { publishLeadEvent } from "@/lib/leads/events/publisher";
import {
  createLeadRepository,
  createNoteRepository,
  createTimelineRepository,
  type LeadRepository,
  type NoteRepository,
  type TimelineRepository,
} from "@/lib/leads/repositories/leadRepository";
import type {
  LeadDetail,
  LeadListFilters,
  LeadListResult,
  LeadPriority,
  LeadRecord,
  LeadStatus,
} from "@/lib/leads/types";
import type { CreateLeadInput } from "@/lib/leads/validators";

function scoreLead(input: CreateLeadInput): number {
  let score = 10;
  if (input.email) score += 5;
  if (input.treatment) score += 10;
  if (input.message && input.message.length > 40) score += 8;
  if (input.preferredContactMethod === "WHATSAPP") score += 5;
  if (input.utmSource) score += 3;
  if (input.utmCampaign) score += 3;
  return Math.min(score, 100);
}

export function createLeadService(deps?: {
  leads?: LeadRepository;
  timeline?: TimelineRepository;
  notes?: NoteRepository;
}) {
  const leads = deps?.leads ?? createLeadRepository();
  const timeline = deps?.timeline ?? createTimelineRepository();
  const notes = deps?.notes ?? createNoteRepository();

  return {
    async submitConsultation(
      input: CreateLeadInput,
      meta?: { ip?: string | null },
    ): Promise<{ lead: LeadRecord; duplicateIds: string[] }> {
      if (input.website) {
        throw new Error("Submission rejected");
      }

      const duplicates = await leads.findRecentDuplicates({
        phone: input.phone,
        email: input.email,
        visitorId: input.visitorId,
      });

      const lead = await leads.create({
        name: input.name,
        phone: input.phone,
        email: input.email ?? null,
        message: input.message ?? null,
        treatment: input.treatment ?? null,
        preferredContactMethod: input.preferredContactMethod,
        preferredTime: input.preferredTime ?? null,
        pageTitle: input.pageTitle ?? null,
        pageSlug: input.pageSlug ?? null,
        pageUri: input.pageUri ?? null,
        pageId: input.pageId ?? null,
        presentationPageId: input.presentationPageId ?? null,
        presentationVersion: input.presentationVersion ?? null,
        template: input.template ?? null,
        theme: input.theme ?? null,
        currentUrl: input.currentUrl ?? null,
        referrer: input.referrer ?? null,
        utmSource: input.utmSource ?? null,
        utmMedium: input.utmMedium ?? null,
        utmCampaign: input.utmCampaign ?? null,
        utmContent: input.utmContent ?? null,
        utmTerm: input.utmTerm ?? null,
        device: input.device ?? null,
        browser: input.browser ?? null,
        os: input.os ?? null,
        screenSize: input.screenSize ?? null,
        language: input.language ?? null,
        country: input.country ?? null,
        ip: meta?.ip ?? null,
        sessionId: input.sessionId ?? null,
        visitorId: input.visitorId ?? null,
        timezone: input.timezone ?? null,
        leadScore: scoreLead(input),
        status: "NEW",
        priority: duplicates.length ? "HIGH" : "MEDIUM",
      });

      const createdEvent = await timeline.append({
        leadId: lead.id,
        eventType: "LEAD_CREATED",
        title: "Consultation request received",
        description: input.treatment
          ? `Interest: ${input.treatment}`
          : "New patient consultation enquiry",
        metadata: {
          pageSlug: input.pageSlug,
          utmSource: input.utmSource,
          utmCampaign: input.utmCampaign,
        },
        systemGenerated: true,
      });

      await publishLeadEvent({
        type: "LeadCreated",
        leadId: lead.id,
        uuid: lead.uuid,
        pageSlug: lead.pageSlug,
        treatment: lead.treatment,
        at: new Date().toISOString(),
      });

      await publishLeadEvent({
        type: "LeadTimelineCreated",
        leadId: lead.id,
        eventType: "LEAD_CREATED",
        timelineId: createdEvent.id,
        at: createdEvent.createdAt.toISOString(),
      });

      const duplicateIds = duplicates.map((d) => d.id);
      if (duplicateIds.length) {
        const dupEvent = await timeline.append({
          leadId: lead.id,
          eventType: "DUPLICATE_DETECTED",
          title: "Possible duplicate enquiry",
          description: `Matched ${duplicateIds.length} recent lead(s) by phone/email/visitor`,
          metadata: { duplicateIds },
          systemGenerated: true,
        });
        await publishLeadEvent({
          type: "LeadDuplicateDetected",
          leadId: lead.id,
          duplicateOfIds: duplicateIds,
          at: dupEvent.createdAt.toISOString(),
        });
      }

      await publishLeadEvent({
        type: "FormAnalytics",
        leadId: lead.id,
        name: "consultation_submitted",
        payload: {
          pageSlug: lead.pageSlug,
          treatment: lead.treatment,
          preferredContactMethod: lead.preferredContactMethod,
        },
        at: new Date().toISOString(),
      });

      return { lead, duplicateIds };
    },

    async listLeads(
      filters: LeadListFilters = {},
      page = 1,
      pageSize = 20,
    ): Promise<LeadListResult> {
      return leads.list(filters, page, pageSize);
    },

    async getLeadDetail(id: string): Promise<LeadDetail | null> {
      return leads.findDetailById(id);
    },

    async updateStatus(input: {
      leadId: string;
      status: LeadStatus;
      note?: string;
      actorUserId?: string | null;
    }): Promise<LeadRecord> {
      const existing = await leads.findById(input.leadId);
      if (!existing) {
        throw new Error("Lead not found");
      }

      const updated = await leads.update(input.leadId, {
        status: input.status,
      });

      const eventType =
        input.status === "CONVERTED"
          ? ("LEAD_CONVERTED" as const)
          : input.status === "LOST"
            ? ("LEAD_LOST" as const)
            : input.status === "SPAM"
              ? ("SPAM_MARKED" as const)
              : ("STATUS_CHANGED" as const);

      const timelineEvent = await timeline.append({
        leadId: input.leadId,
        eventType,
        title: `Status → ${input.status.replaceAll("_", " ").toLowerCase()}`,
        description:
          input.note ??
          `Changed from ${existing.status} to ${input.status}`,
        metadata: { from: existing.status, to: input.status },
        performedByUserId: input.actorUserId,
        systemGenerated: !input.actorUserId,
      });

      await publishLeadEvent({
        type: "LeadStatusChanged",
        leadId: input.leadId,
        from: existing.status,
        to: input.status,
        at: timelineEvent.createdAt.toISOString(),
      });

      return updated;
    },

    async updatePriority(input: {
      leadId: string;
      priority: LeadPriority;
      actorUserId?: string | null;
    }): Promise<LeadRecord> {
      const existing = await leads.findById(input.leadId);
      if (!existing) {
        throw new Error("Lead not found");
      }

      const updated = await leads.update(input.leadId, {
        priority: input.priority,
      });

      const timelineEvent = await timeline.append({
        leadId: input.leadId,
        eventType: "PRIORITY_CHANGED",
        title: `Priority → ${input.priority.toLowerCase()}`,
        description: `Changed from ${existing.priority} to ${input.priority}`,
        metadata: { from: existing.priority, to: input.priority },
        performedByUserId: input.actorUserId,
        systemGenerated: !input.actorUserId,
      });

      await publishLeadEvent({
        type: "LeadPriorityChanged",
        leadId: input.leadId,
        from: existing.priority,
        to: input.priority,
        at: timelineEvent.createdAt.toISOString(),
      });

      return updated;
    },

    async assign(input: {
      leadId: string;
      assignedStaff?: string | null;
      assignedDoctor?: string | null;
      actorUserId?: string | null;
    }): Promise<LeadRecord> {
      const existing = await leads.findById(input.leadId);
      if (!existing) {
        throw new Error("Lead not found");
      }

      const updated = await leads.update(input.leadId, {
        ...(input.assignedStaff !== undefined
          ? { assignedStaff: input.assignedStaff }
          : {}),
        ...(input.assignedDoctor !== undefined
          ? { assignedDoctor: input.assignedDoctor }
          : {}),
      });

      const timelineEvent = await timeline.append({
        leadId: input.leadId,
        eventType: "LEAD_ASSIGNED",
        title: "Lead assignment updated",
        description: [
          input.assignedStaff !== undefined
            ? `Staff: ${input.assignedStaff ?? "unassigned"}`
            : null,
          input.assignedDoctor !== undefined
            ? `Doctor: ${input.assignedDoctor ?? "unassigned"}`
            : null,
        ]
          .filter(Boolean)
          .join(" · "),
        metadata: {
          assignedStaff: updated.assignedStaff,
          assignedDoctor: updated.assignedDoctor,
        },
        performedByUserId: input.actorUserId,
        systemGenerated: !input.actorUserId,
      });

      await publishLeadEvent({
        type: "LeadAssigned",
        leadId: input.leadId,
        assignedStaff: updated.assignedStaff,
        assignedDoctor: updated.assignedDoctor,
        at: timelineEvent.createdAt.toISOString(),
      });

      return updated;
    },

    async addNote(input: {
      leadId: string;
      body: string;
      actorUserId?: string | null;
    }) {
      const existing = await leads.findById(input.leadId);
      if (!existing) {
        throw new Error("Lead not found");
      }

      const note = await notes.create({
        leadId: input.leadId,
        body: input.body,
        createdByUserId: input.actorUserId,
      });

      await leads.update(input.leadId, {});

      const timelineEvent = await timeline.append({
        leadId: input.leadId,
        eventType: "INTERNAL_NOTE_ADDED",
        title: "Internal note added",
        description: input.body.slice(0, 280),
        metadata: { noteId: note.id },
        performedByUserId: input.actorUserId,
        systemGenerated: false,
      });

      await publishLeadEvent({
        type: "LeadNoteAdded",
        leadId: input.leadId,
        noteId: note.id,
        at: timelineEvent.createdAt.toISOString(),
      });

      return note;
    },
  };
}

export type LeadService = ReturnType<typeof createLeadService>;

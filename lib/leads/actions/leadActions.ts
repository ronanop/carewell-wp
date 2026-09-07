"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { createLeadService } from "@/lib/leads/services/leadService";
import type {
  ActionResult,
  LeadDetail,
  LeadRecord,
} from "@/lib/leads/types";
import { requireLeadPermission } from "@/lib/leads/rbac";
import {
  addLeadNoteSchema,
  assignLeadSchema,
  createLeadInputSchema,
  leadListQuerySchema,
  updateLeadPrioritySchema,
  updateLeadStatusSchema,
} from "@/lib/leads/validators";
import {
  checkRateLimit,
  clientIpFromHeaders,
} from "@/lib/security/rateLimit";

function getService() {
  return createLeadService();
}

/**
 * Public consultation capture — no auth required.
 * In-memory IP rate limit (single Node process on Hostinger).
 */
export async function submitConsultationLeadAction(
  raw: unknown,
): Promise<ActionResult<{ leadId: string; uuid: string }>> {
  const parsed = createLeadInputSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid form data";
    return { ok: false, message: first };
  }

  try {
    const headerStore = await headers();
    const ip = clientIpFromHeaders(headerStore);
    const limited = checkRateLimit(`lead-submit:${ip}`, 5, 60_000);
    if (!limited.ok) {
      return {
        ok: false,
        message: "Too many requests. Please wait a minute and try again.",
      };
    }

    const { lead } = await getService().submitConsultation(parsed.data, {
      ip: ip === "unknown" ? null : ip,
    });

    return {
      ok: true,
      data: { leadId: lead.id, uuid: lead.uuid },
      message: "Thank you — we will contact you shortly.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to submit consultation request",
    };
  }
}

export async function updateLeadStatusAction(
  raw: unknown,
): Promise<ActionResult<LeadRecord>> {
  const session = await auth();
  if (!session?.user?.role) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    requireLeadPermission(session.user.role, "leads:write");
  } catch {
    return { ok: false, message: "Forbidden" };
  }

  const parsed = updateLeadStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  try {
    const lead = await getService().updateStatus({
      ...parsed.data,
      actorUserId: session.user.id,
    });
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${lead.id}`);
    return { ok: true, data: lead, message: "Status updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}

export async function updateLeadPriorityAction(
  raw: unknown,
): Promise<ActionResult<LeadRecord>> {
  const session = await auth();
  if (!session?.user?.role) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    requireLeadPermission(session.user.role, "leads:write");
  } catch {
    return { ok: false, message: "Forbidden" };
  }

  const parsed = updateLeadPrioritySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  try {
    const lead = await getService().updatePriority({
      ...parsed.data,
      actorUserId: session.user.id,
    });
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${lead.id}`);
    return { ok: true, data: lead, message: "Priority updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}

export async function assignLeadAction(
  raw: unknown,
): Promise<ActionResult<LeadRecord>> {
  const session = await auth();
  if (!session?.user?.role) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    requireLeadPermission(session.user.role, "leads:write");
  } catch {
    return { ok: false, message: "Forbidden" };
  }

  const parsed = assignLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  try {
    const lead = await getService().assign({
      ...parsed.data,
      actorUserId: session.user.id,
    });
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${lead.id}`);
    return { ok: true, data: lead, message: "Assignment updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Assign failed",
    };
  }
}

export async function addLeadNoteAction(
  raw: unknown,
): Promise<ActionResult<{ noteId: string }>> {
  const session = await auth();
  if (!session?.user?.role) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    requireLeadPermission(session.user.role, "leads:write");
  } catch {
    return { ok: false, message: "Forbidden" };
  }

  const parsed = addLeadNoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  try {
    const note = await getService().addNote({
      ...parsed.data,
      actorUserId: session.user.id,
    });
    revalidatePath(`/admin/leads/${parsed.data.leadId}`);
    return {
      ok: true,
      data: { noteId: note.id },
      message: "Note added",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not add note",
    };
  }
}

export async function listLeadsAction(raw?: {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<
  ActionResult<{
    items: LeadRecord[];
    total: number;
    page: number;
    pageSize: number;
  }>
> {
  const session = await auth();
  if (!session?.user?.role) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    requireLeadPermission(session.user.role, "leads:read");
  } catch {
    return { ok: false, message: "Forbidden" };
  }

  const parsed = leadListQuerySchema.safeParse({
    status: raw?.status || undefined,
    priority: raw?.priority || undefined,
    search: raw?.search || undefined,
    page: raw?.page ?? 1,
    pageSize: raw?.pageSize ?? 20,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid filters",
    };
  }

  try {
    const { page, pageSize, status, priority, search, ...rest } = parsed.data;
    const result = await getService().listLeads(
      {
        ...rest,
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(search ? { search } : {}),
      },
      page,
      pageSize,
    );
    return { ok: true, data: result, message: "OK" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not list leads",
    };
  }
}

export async function getLeadDetailAction(
  leadId: string,
): Promise<ActionResult<LeadDetail>> {
  const session = await auth();
  if (!session?.user?.role) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    requireLeadPermission(session.user.role, "leads:read");
  } catch {
    return { ok: false, message: "Forbidden" };
  }

  if (!leadId?.trim()) {
    return { ok: false, message: "Lead id required" };
  }

  try {
    const detail = await getService().getLeadDetail(leadId);
    if (!detail) {
      return { ok: false, message: "Lead not found" };
    }
    return { ok: true, data: detail, message: "OK" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not load lead",
    };
  }
}

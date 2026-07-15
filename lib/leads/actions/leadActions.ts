"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { createLeadService } from "@/lib/leads/services/leadService";
import type { ActionResult, LeadRecord } from "@/lib/leads/types";
import { requireLeadPermission } from "@/lib/leads/rbac";
import {
  addLeadNoteSchema,
  assignLeadSchema,
  createLeadInputSchema,
  updateLeadPrioritySchema,
  updateLeadStatusSchema,
} from "@/lib/leads/validators";

function getService() {
  return createLeadService();
}

/**
 * Public consultation capture — no auth required.
 * Rate limiting / CAPTCHA can wrap this later without changing the contract.
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
    const forwarded = headerStore.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ??
      headerStore.get("x-real-ip") ??
      null;

    const { lead } = await getService().submitConsultation(parsed.data, {
      ip,
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

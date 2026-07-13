"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  rollbackPresentationVersion,
  savePagePresentation,
} from "@/lib/experience/services/presentationService";
import { syncWordPressPages } from "@/lib/experience/services/syncService";
import {
  presentationConfigSchema,
  type PresentationConfigInput,
} from "@/lib/experience/validations/presentationConfig";

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string };

export async function syncAllWordPressPagesAction(): Promise<
  ActionResult<{
    added: number;
    updated: number;
    unchanged: number;
    failed: number;
  }>
> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    const summary = await syncWordPressPages({ userId: session.user.id });
    revalidatePath("/admin/pages");
    revalidatePath("/admin/dashboard");
    return {
      ok: true,
      data: {
        added: summary.added,
        updated: summary.updated,
        unchanged: summary.unchanged,
        failed: summary.failed,
      },
      message: `Sync complete — ${summary.added} added, ${summary.updated} updated, ${summary.unchanged} unchanged${summary.failed ? `, ${summary.failed} failed` : ""}`,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "WordPress sync failed",
    };
  }
}

export async function syncSelectedWordPressPagesAction(
  databaseIds: number[],
): Promise<ActionResult<{ updated: number }>> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  if (!databaseIds.length) {
    return { ok: false, message: "Select at least one page" };
  }

  try {
    const summary = await syncWordPressPages({
      userId: session.user.id,
      databaseIds,
    });
    revalidatePath("/admin/pages");
    return {
      ok: true,
      data: { updated: summary.added + summary.updated + summary.unchanged },
      message: `Synced ${databaseIds.length} selected page(s)`,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Selected sync failed",
    };
  }
}

export async function savePagePresentationAction(input: {
  pageId: string;
  data: PresentationConfigInput;
  publish?: boolean;
  note?: string;
}): Promise<ActionResult<{ presentationId: string }>> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  const parsed = presentationConfigSchema.safeParse(input.data);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid presentation data",
    };
  }

  try {
    const saved = await savePagePresentation({
      pageId: input.pageId,
      data: parsed.data,
      userId: session.user.id,
      publish: input.publish,
      note: input.note,
    });
    return {
      ok: true,
      data: { presentationId: saved.id },
      message: input.publish
        ? "Presentation published"
        : "Draft saved",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to save presentation",
    };
  }
}

export async function rollbackPresentationAction(input: {
  pageId: string;
  version: number;
}): Promise<ActionResult<{ presentationId: string }>> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    const saved = await rollbackPresentationVersion({
      pageId: input.pageId,
      version: input.version,
      userId: session.user.id,
    });
    return {
      ok: true,
      data: { presentationId: saved.id },
      message: `Rolled back to version ${input.version}`,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Rollback failed",
    };
  }
}

"use server";

import { auth } from "@/auth";
import {
  listStaticStudioPages,
  saveStaticPagePresentation,
} from "@/lib/experience/services/staticPageService";
import {
  presentationConfigSchema,
  type PresentationConfigInput,
} from "@/lib/experience/validations/presentationConfig";
import type { StaticPageListItem } from "@/types/static-page";

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string };

export async function listStaticPagesAction(): Promise<
  ActionResult<StaticPageListItem[]>
> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    const pages = await listStaticStudioPages();
    return { ok: true, data: pages, message: "OK" };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to list static pages",
    };
  }
}

export async function saveStaticPagePresentationAction(input: {
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
      message: parsed.error.issues[0]?.message ?? "Invalid configuration",
    };
  }

  try {
    const result = await saveStaticPagePresentation({
      pageId: input.pageId,
      data: parsed.data,
      publish: input.publish,
      note: input.note,
      userId: session.user.id,
    });
    return {
      ok: true,
      data: result,
      message: input.publish
        ? "Static page published"
        : "Static page draft saved",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to save presentation",
    };
  }
}

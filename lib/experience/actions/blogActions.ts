"use server";

import { revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { syncWordPressPosts } from "@/lib/experience/services/blogSyncService";
import {
  publishBlogPresentation,
  saveBlogPresentationDraft,
} from "@/lib/experience/services/blogPresentationService";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function syncAllWordPressPostsAction() {
  const session = await requireSession();
  const summary = await syncWordPressPosts({ userId: session.user.id });
  revalidateTag("blogs");
  return summary;
}

export async function syncSelectedWordPressPostsAction(databaseIds: number[]) {
  const session = await requireSession();
  const summary = await syncWordPressPosts({
    userId: session.user.id,
    databaseIds,
  });
  revalidateTag("blogs");
  return summary;
}

export async function saveBlogDraftAction(
  postId: string,
  config: BlogPresentationConfig,
) {
  const session = await requireSession();
  await saveBlogPresentationDraft(postId, config, session.user.id);
  revalidateTag("blogs");
  return { ok: true };
}

export async function publishBlogAction(
  postId: string,
  config: BlogPresentationConfig,
) {
  const session = await requireSession();
  await publishBlogPresentation(postId, config, session.user.id);
  revalidateTag("blogs");
  return { ok: true };
}

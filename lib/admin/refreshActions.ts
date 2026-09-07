"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin/requireSession";

const ALLOWED = new Set([
  "/admin/blogs",
  "/admin/pages",
  "/admin/services",
  "/admin",
]);

/** Bust Next cache for an admin inventory route after Sanity publishes. */
export async function refreshAdminCmsPathAction(path: string) {
  await requireAdminSession();
  if (!ALLOWED.has(path)) {
    throw new Error("Invalid refresh path");
  }
  revalidatePath(path);
  revalidatePath("/admin");
}

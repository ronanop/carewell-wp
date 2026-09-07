import { redirect } from "next/navigation";

import { auth } from "@/auth";

/** Require a signed-in admin session or redirect to login. */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

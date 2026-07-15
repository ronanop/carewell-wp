import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in | Experience Studio",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  let session: Awaited<ReturnType<typeof auth>> = null;
  let authError: string | null = null;

  try {
    session = await auth();
  } catch {
    authError =
      "Auth is not configured on this deployment. Set AUTH_SECRET (and AUTH_URL) in Vercel Environment Variables, then redeploy.";
  }

  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary font-heading text-body font-semibold text-primary-foreground">
            CW
          </div>
          <h1 className="mt-5 font-heading text-h3 font-semibold text-foreground">
            Experience Studio
          </h1>
          <p className="mt-2 text-small text-muted-foreground">
            Presentation management for Care Well Medical Centre.
            WordPress remains your content source of truth.
          </p>
        </div>
        {authError ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-small text-foreground"
          >
            {authError}
          </p>
        ) : (
          <LoginForm />
        )}
        <p className="mt-6 text-center text-[0.75rem] text-muted-foreground">
          Requires <code className="text-foreground">AUTH_SECRET</code>,{" "}
          <code className="text-foreground">DATABASE_URL</code> (Render), and a
          seeded admin user.
        </p>
      </div>
    </div>
  );
}

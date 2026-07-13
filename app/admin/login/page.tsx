import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in | Experience Studio",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
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
        <LoginForm />
        <p className="mt-6 text-center text-[0.75rem] text-muted-foreground">
          Connect <code className="text-foreground">DATABASE_URL</code> and seed
          a user to enable sign-in.
        </p>
      </div>
    </div>
  );
}

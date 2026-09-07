import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import {
  checkRateLimit,
  clientIpFromHeaders,
  safeAdminCallbackUrl,
} from "@/lib/security/rateLimit";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin login | Care Well",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = safeAdminCallbackUrl(params.callbackUrl);

  if (session?.user) {
    redirect(callbackUrl);
  }

  const errorMessage =
    params.error === "CredentialsSignin"
      ? "Invalid email or password."
      : params.error === "RateLimited"
        ? "Too many sign-in attempts. Wait a minute and try again."
        : params.error
          ? "Sign-in failed. Try again."
          : null;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
        Leads admin
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign in with your Care Well staff account.
      </p>

      {errorMessage ? (
        <p
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <form
        className="mt-6 space-y-4"
        action={async (formData) => {
          "use server";
          const email = String(formData.get("email") || "");
          const password = String(formData.get("password") || "");
          const nextUrl = safeAdminCallbackUrl(
            String(formData.get("callbackUrl") || "/admin/leads"),
          );

          const headerStore = await headers();
          const ip = clientIpFromHeaders(headerStore);
          const limited = checkRateLimit(`admin-login:${ip}`, 8, 60_000);
          if (!limited.ok) {
            redirect("/admin/login?error=RateLimited");
          }

          try {
            await signIn("credentials", {
              email,
              password,
              redirectTo: nextUrl,
            });
          } catch (error) {
            if (error instanceof AuthError) {
              redirect(`/admin/login?error=${error.type}`);
            }
            throw error;
          }
        }}
      >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

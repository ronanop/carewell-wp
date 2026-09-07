import { LogOut } from "lucide-react";

import { auth, signOut } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminNavProgress } from "@/components/admin/AdminNavProgress";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIDEBAR_W = "w-[14.5rem]";
const SIDEBAR_PL = "pl-[14.5rem]";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] text-slate-900">
        <header className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-3 sm:px-6">
            <SiteLogo href="/admin/login" />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/80 bg-white",
          SIDEBAR_W,
        )}
      >
        <div className="flex h-[4.25rem] shrink-0 items-center border-b border-slate-200/80 px-3">
          <SiteLogo href="/admin" />
        </div>

        <AdminNav />

        <div className="mt-auto shrink-0 border-t border-slate-200/80 p-3">
          <p
            className="truncate px-1 text-xs text-slate-500"
            title={session.user.email ?? undefined}
          >
            {session.user.email}
          </p>
          {session.user.role ? (
            <p className="mt-0.5 px-1 text-[0.65rem] font-medium uppercase tracking-wide text-slate-400">
              {session.user.role}
            </p>
          ) : null}
          <form
            className="mt-3"
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex w-full cursor-pointer items-center justify-center gap-2",
              )}
            >
              <LogOut className="size-3.5 shrink-0" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className={cn("min-h-screen", SIDEBAR_PL)}>
        <AdminNavProgress />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

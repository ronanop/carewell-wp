"use client";

import { Bell, Moon, Search } from "lucide-react";

import { logoutAction } from "@/lib/experience/actions/authActions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AdminTopbarProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
}

export function AdminTopbar({
  userName,
  userEmail,
  userRole,
}: AdminTopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-6">
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search pages, templates, doctors…"
          className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-small text-foreground outline-none ring-ring placeholder:text-muted-foreground focus-visible:ring-2"
          aria-label="Search studio"
          disabled
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Quick actions"
          disabled
        >
          <span className="text-small font-medium">⌘K</span>
        </button>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
          disabled
        >
          <Bell className="size-4" />
        </button>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle dark mode"
          disabled
        >
          <Moon className="size-4" />
        </button>

        <div className="ml-1 flex items-center gap-3 border-l border-border pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-small font-medium text-foreground">
              {userName || "Studio user"}
            </p>
            <p className="text-[0.6875rem] text-muted-foreground">
              {userRole || "EDITOR"} · {userEmail || ""}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "no-underline",
              )}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

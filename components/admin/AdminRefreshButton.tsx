"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";

import { refreshAdminCmsPathAction } from "@/lib/admin/refreshActions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminRefreshButtonProps = {
  path: "/admin/blogs" | "/admin/pages" | "/admin/services";
};

export function AdminRefreshButton({ path }: AdminRefreshButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      title="Fetch latest from Sanity"
      onClick={() => {
        startTransition(async () => {
          await refreshAdminCmsPathAction(path);
          router.refresh();
        });
      }}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "cursor-pointer disabled:opacity-60",
      )}
    >
      <RefreshCw
        className={cn("size-3.5 shrink-0", pending && "animate-spin")}
        aria-hidden
      />
      {pending ? "Refreshing…" : "Refresh"}
    </button>
  );
}

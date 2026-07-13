"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/button";
import { syncAllWordPressPagesAction } from "@/lib/experience/actions/pageActions";

export function SyncWordPressButton() {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSync() {
    setBusy(true);
    try {
      const result = await syncAllWordPressPagesAction();
      if (result.ok && result.data) {
        toast(
          `Added ${result.data.added} · Updated ${result.data.updated} · Unchanged ${result.data.unchanged}${result.data.failed ? ` · Failed ${result.data.failed}` : ""}`,
          result.data.failed ? "info" : "success",
        );
        startTransition(() => router.refresh());
      } else if (!result.ok) {
        toast(result.message, "error");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleSync}
      disabled={busy || isPending}
    >
      {busy ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <RefreshCw className="size-3.5" />
      )}
      Sync WordPress
    </Button>
  );
}

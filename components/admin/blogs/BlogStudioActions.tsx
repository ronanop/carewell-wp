"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/button";
import {
  publishBlogAction,
  saveBlogDraftAction,
} from "@/lib/experience/actions/blogActions";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";

export function BlogStudioActions({
  postId,
  initialConfig,
}: {
  postId: string;
  initialConfig: BlogPresentationConfig;
}) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [pending, startTransition] = useTransition();

  function saveDraft() {
    startTransition(async () => {
      try {
        await saveBlogDraftAction(postId, initialConfig);
        toast("Draft saved", "success");
        router.refresh();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Save failed",
          "error",
        );
      }
    });
  }

  function publish() {
    startTransition(async () => {
      try {
        await publishBlogAction(postId, initialConfig);
        toast("Published", "success");
        router.refresh();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Publish failed",
          "error",
        );
      }
    });
  }

  return (
    <>
      <Button type="button" variant="outline" disabled={pending} onClick={saveDraft}>
        Save draft
      </Button>
      <Button type="button" disabled={pending} onClick={publish}>
        Publish presentation
      </Button>
    </>
  );
}

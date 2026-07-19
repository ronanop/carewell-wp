"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { PresentationPolishControls } from "@/components/admin/PresentationPolishControls";
import { useAdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/button";
import { saveBlogDraftAction } from "@/lib/experience/actions/blogActions";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";
import type { ExperiencePresentationPolish } from "@/types/editorial-layout";

const DEFAULT_POLISH: ExperiencePresentationPolish = {
  preferSoftSurfaces: true,
  tightHeroHandoff: true,
  readingMeasure: "comfortable",
  defaultCardStyle: "editorial",
  buttonHierarchy: "primary-secondary-tertiary",
};

/**
 * Blog Studio — presentation polish editor (Phase 8.1).
 * Persists on ExperienceConfig.presentationPolish via draft save.
 */
export function BlogStudioPolishPanel({
  postId,
  initialConfig,
}: {
  postId: string;
  initialConfig: BlogPresentationConfig;
}) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const existing = (
    initialConfig as BlogPresentationConfig & {
      presentationPolish?: ExperiencePresentationPolish;
    }
  ).presentationPolish;

  const [polish, setPolish] = useState<ExperiencePresentationPolish>({
    ...DEFAULT_POLISH,
    ...existing,
  });

  function save() {
    startTransition(async () => {
      try {
        const next = {
          ...initialConfig,
          presentationPolish: polish,
        } as BlogPresentationConfig;
        await saveBlogDraftAction(postId, next);
        toast("Presentation polish saved", "success");
        router.refresh();
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Save failed",
          "error",
        );
      }
    });
  }

  return (
    <div className="space-y-3">
      <PresentationPolishControls value={polish} onChange={setPolish} />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={save}
      >
        Save polish
      </Button>
    </div>
  );
}

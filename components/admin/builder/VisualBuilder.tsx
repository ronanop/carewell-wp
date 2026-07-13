"use client";

import { useCallback, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useAdminToast } from "@/components/admin/AdminToast";
import { BuilderInspector } from "@/components/admin/builder/BuilderInspector";
import { BuilderLeftSidebar } from "@/components/admin/builder/BuilderLeftSidebar";
import {
  BuilderProvider,
  useBuilderMeta,
} from "@/components/admin/builder/BuilderProvider";
import { BuilderToolbar } from "@/components/admin/builder/BuilderToolbar";
import { CommandPalette } from "@/components/admin/builder/CommandPalette";
import { EditorCanvas } from "@/components/admin/builder/EditorCanvas";
import { savePagePresentationAction } from "@/lib/experience/actions/pageActions";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { presentationConfigSchema } from "@/lib/experience/validations/presentationConfig";
import type { PresentationConfig } from "@/types/presentation-config";
import type { PresentationPage } from "@/types/presentation-config";

type CatalogBlock = {
  id: string;
  name: string;
  category: string;
  packId: string;
  version: string;
};

export function VisualBuilder({
  pageId,
  title,
  uri,
  basePage,
  initialConfig,
  catalogBlocks,
}: {
  pageId: string;
  title: string;
  uri: string;
  basePage: PresentationPage;
  initialConfig: PresentationConfig;
  catalogBlocks: CatalogBlock[];
}) {
  return (
    <BuilderProvider
      pageId={pageId}
      basePage={basePage}
      initialConfig={initialConfig}
      title={title}
      uri={uri}
    >
      <VisualBuilderInner catalogBlocks={catalogBlocks} />
    </BuilderProvider>
  );
}

function VisualBuilderInner({
  catalogBlocks,
}: {
  catalogBlocks: CatalogBlock[];
}) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { pageId, title, uri } = useBuilderMeta();
  const [, startTransition] = useTransition();

  const persist = useCallback(
    async (publish: boolean) => {
      const config = useEditorStore.getState().config;
      const parsed = presentationConfigSchema.safeParse(config);
      if (!parsed.success) {
        toast(
          parsed.error.issues[0]?.message ?? "Invalid configuration",
          "error",
        );
        return;
      }

      useEditorStore.getState().setSaving(true);
      try {
        const result = await savePagePresentationAction({
          pageId,
          data: parsed.data,
          publish,
        });
        if (result.ok) {
          useEditorStore.getState().markSaved();
          toast(result.message, "success");
          startTransition(() => router.refresh());
        } else {
          useEditorStore.getState().setSaving(false);
          toast(result.message, "error");
        }
      } catch {
        useEditorStore.getState().setSaving(false);
        toast("Save failed", "error");
      }
    },
    [pageId, toast, router],
  );

  const dirty = useEditorStore((s) => s.dirty);
  const saving = useEditorStore((s) => s.saving);
  const config = useEditorStore((s) => s.config);

  useEffect(() => {
    if (!dirty || saving) return;
    const timer = window.setTimeout(() => {
      void persist(false);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [dirty, saving, config, persist]);

  useEffect(() => {
    function onSave() {
      void persist(false);
    }
    window.addEventListener("builder:save", onSave);
    return () => window.removeEventListener("builder:save", onSave);
  }, [persist]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-100">
      <BuilderToolbar
        title={title}
        uri={uri}
        onSave={() => void persist(false)}
        onPublish={() => void persist(true)}
      />
      <div className="flex min-h-0 flex-1">
        <BuilderLeftSidebar catalogBlocks={catalogBlocks} />
        <EditorCanvas />
        <BuilderInspector />
      </div>
      <CommandPalette
        catalogBlocks={catalogBlocks}
        onSave={() => void persist(false)}
        onPublish={() => void persist(true)}
      />
    </div>
  );
}

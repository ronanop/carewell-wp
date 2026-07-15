"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

import { useEditorStore } from "@/lib/experience/builder/editorStore";
import type { PresentationConfig } from "@/types/presentation-config";
import type { PresentationPage } from "@/types/presentation-config";
import type { StaticPageDescriptor } from "@/types/static-page-descriptor";

export type BuilderPersistenceKind = "wordpress" | "static";

type BuilderMeta = {
  pageId: string;
  basePage: PresentationPage | null;
  title: string;
  uri: string;
  persistenceKind: BuilderPersistenceKind;
  staticDescriptor: StaticPageDescriptor | null;
  staticPageSlug: string | null;
};

const BuilderMetaContext = createContext<BuilderMeta | null>(null);

/**
 * Hydrates EditorStore and provides immutable page metadata.
 * Editor UI state lives in useEditorStore — not in React component trees.
 */
export function BuilderProvider({
  pageId,
  basePage,
  initialConfig,
  title,
  uri,
  persistenceKind = "wordpress",
  staticDescriptor = null,
  staticPageSlug = null,
  children,
}: {
  pageId: string;
  basePage: PresentationPage | null;
  initialConfig: PresentationConfig;
  title: string;
  uri: string;
  persistenceKind?: BuilderPersistenceKind;
  staticDescriptor?: StaticPageDescriptor | null;
  staticPageSlug?: string | null;
  children: ReactNode;
}) {
  useEffect(() => {
    useEditorStore.getState().hydrate({ pageId, config: initialConfig });
  }, [pageId, initialConfig]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      const store = useEditorStore.getState();
      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        store.setCommandPaletteOpen(!store.commandPaletteOpen);
        return;
      }

      if (mod && event.key.toLowerCase() === "s") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("builder:save"));
        return;
      }

      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) store.redo();
        else store.undo();
        return;
      }

      if (mod && event.key.toLowerCase() === "d") {
        event.preventDefault();
        const id = store.selectedIds[0];
        if (id) store.duplicateSection(id);
        return;
      }

      if (mod && event.key.toLowerCase() === "c" && !typing) {
        store.copySelection();
        return;
      }

      if (mod && event.key.toLowerCase() === "v" && !typing) {
        event.preventDefault();
        store.pasteClipboard();
        return;
      }

      if (event.key === "Escape") {
        if (store.commandPaletteOpen) {
          store.setCommandPaletteOpen(false);
          return;
        }
        if (store.dragging) {
          store.setDragging(null);
          store.setDropTarget(null);
          return;
        }
        store.clearSelection();
        return;
      }

      if (typing) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        // Static pages: do not delete handcrafted sections from the tree.
        if (persistenceKind === "static") return;
        store.deleteSections(store.selectedIds);
      }
    }

    function onWheel(event: WheelEvent) {
      if (!(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      const store = useEditorStore.getState();
      const delta = event.deltaY > 0 ? -5 : 5;
      store.setZoom(store.zoom + delta);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [persistenceKind]);

  return (
    <BuilderMetaContext.Provider
      value={{
        pageId,
        basePage,
        title,
        uri,
        persistenceKind,
        staticDescriptor,
        staticPageSlug,
      }}
    >
      {children}
    </BuilderMetaContext.Provider>
  );
}

export function useBuilderMeta(): BuilderMeta {
  const ctx = useContext(BuilderMetaContext);
  if (!ctx) throw new Error("useBuilderMeta must be used within BuilderProvider");
  return ctx;
}

"use client";

/**
 * Editor overlay context — selection / hover live in editorStore.
 * Provider exists so static + WP canvases share one overlay lifecycle hook point.
 */

import { createContext, useContext, type ReactNode } from "react";

type EditorOverlayContextValue = {
  enabled: boolean;
};

const EditorOverlayContext = createContext<EditorOverlayContextValue>({
  enabled: true,
});

export function EditorOverlayProvider({
  enabled = true,
  children,
}: {
  enabled?: boolean;
  children: ReactNode;
}) {
  return (
    <EditorOverlayContext.Provider value={{ enabled }}>
      {children}
    </EditorOverlayContext.Provider>
  );
}

export function useEditorOverlay(): EditorOverlayContextValue {
  return useContext(EditorOverlayContext);
}

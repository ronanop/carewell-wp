/**
 * No-op editor store stub — Experience Studio builder removed.
 * EditableElement still calls these hooks (Rules of Hooks); public mode ignores them.
 */
import { create } from "zustand";

type NoopEditorStore = {
  selectedElementId: string | null;
  editingElementId: string | null;
  selectElement: (id: string | null) => void;
  hoverElement: (id: string | null) => void;
  setEditingElement: (id: string | null) => void;
};

export const useEditorStore = create<NoopEditorStore>(() => ({
  selectedElementId: null,
  editingElementId: null,
  selectElement: () => {},
  hoverElement: () => {},
  setEditingElement: () => {},
}));

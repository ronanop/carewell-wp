import { create } from "zustand";
import {
  groupLayoutSections,
  insertLayoutSection,
  orderSectionsByLayout,
  removeLayoutSection,
  reorderLayoutSection,
  syncLayoutFromSections,
  ungroupSectionsContaining,
  type LayoutTree,
} from "@carewell/layout-engine";

import { createDefaultPresentationConfig } from "@/lib/experience/validations/presentationConfig";
import { setElementOverrideField } from "@/lib/experience/static-pages/elementOverrides";
import type {
  PresentationConfig,
  SectionConfig,
  SectionType,
} from "@/types/presentation-config";

export type EditorDevice = "desktop" | "tablet" | "mobile";
export type EditorLeftTab = "pages" | "layers" | "components" | "assets";

export type DragPayload =
  | { kind: "section"; sectionId: string; duplicate?: boolean }
  | { kind: "library"; sectionType: SectionType };

export type DropTarget = {
  /** Insert before this section id, or null to append. */
  beforeId: string | null;
  targetSectionId?: string | null;
  zone?: string;
};

type EditorStore = {
  pageId: string;
  config: PresentationConfig;
  past: PresentationConfig[];
  future: PresentationConfig[];

  selectedIds: string[];
  hoveredId: string | null;
  lockedIds: string[];
  collapsedIds: string[];

  /** Content AST node selection (inside decomposed RichContent). */
  selectedContentId: string | null;
  hoveredContentId: string | null;
  editingContentId: string | null;

  /** Static element selection (ADR-016 — universal content editing). */
  selectedElementId: string | null;
  hoveredElementId: string | null;
  editingElementId: string | null;

  /** System page chrome selection (not a content section). */
  selectedChromeId: "consultation-sidebar" | null;

  device: EditorDevice;
  zoom: number;
  leftTab: EditorLeftTab;
  showGuides: boolean;
  showBaselineGrid: boolean;

  dragging: DragPayload | null;
  dropTarget: DropTarget | null;

  dirty: boolean;
  saving: boolean;
  lastSavedAt: string | null;

  clipboard: SectionConfig | null;
  commandPaletteOpen: boolean;

  hydrate: (input: {
    pageId: string;
    config: PresentationConfig;
  }) => void;

  setConfig: (config: PresentationConfig, pushHistory?: boolean) => void;
  updateConfig: (
    updater: (prev: PresentationConfig) => PresentationConfig,
    pushHistory?: boolean,
  ) => void;

  undo: () => void;
  redo: () => void;

  select: (sectionId: string | null, opts?: { additive?: boolean }) => void;
  selectChrome: (chromeId: "consultation-sidebar" | null) => void;
  hover: (sectionId: string | null) => void;
  clearSelection: () => void;

  selectContent: (nodeId: string | null) => void;
  hoverContent: (nodeId: string | null) => void;
  setEditingContent: (nodeId: string | null) => void;

  selectElement: (elementId: string | null) => void;
  hoverElement: (elementId: string | null) => void;
  setEditingElement: (elementId: string | null) => void;
  setElementField: (
    elementId: string,
    field: string,
    value: unknown,
    pushHistory?: boolean,
  ) => void;

  setDevice: (device: EditorDevice) => void;
  setZoom: (zoom: number) => void;
  setLeftTab: (tab: EditorLeftTab) => void;
  setShowGuides: (show: boolean) => void;
  setShowBaselineGrid: (show: boolean) => void;

  toggleLock: (sectionId: string) => void;
  toggleCollapsed: (sectionId: string) => void;
  toggleVisibility: (sectionId: string) => void;

  duplicateSection: (sectionId: string) => void;
  deleteSections: (sectionIds: string[]) => void;
  addSection: (sectionType: SectionType, beforeId?: string | null) => void;
  reorderSection: (fromId: string, beforeId: string | null) => void;
  setSectionSpacing: (
    sectionId: string,
    spacing: SectionConfig["spacing"],
  ) => void;

  setDragging: (payload: DragPayload | null) => void;
  setDropTarget: (target: DropTarget | null) => void;
  commitDrop: () => void;

  copySelection: () => void;
  pasteClipboard: () => void;
  groupSelection: () => void;
  ungroupSelection: () => void;

  insertSectionTemplate: (
    types: SectionType[],
    beforeId?: string | null,
  ) => void;

  patchContentNodeStyles: (
    nodeId: string,
    styles: import("@/types/content-ast").ContentNodeStyles,
    pushHistory?: boolean,
  ) => void;
  patchHeroImageTransform: (
    transform: NonNullable<
      import("@/types/presentation-config").HeroConfig["imageTransform"]
    >,
    pushHistory?: boolean,
  ) => void;

  markSaved: () => void;
  setSaving: (saving: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  canUndo: () => boolean;
  canRedo: () => boolean;
  getLayoutTree: () => LayoutTree;
};

const MAX_HISTORY = 50;

function cloneConfig(config: PresentationConfig): PresentationConfig {
  return structuredClone(config);
}

function dedupeContentSections(config: PresentationConfig): PresentationConfig {
  let seenContent = false;
  const sections = config.sections.filter((section) => {
    if (section.type !== "content") return true;
    if (seenContent) return false;
    seenContent = true;
    return true;
  });
  if (sections.length === config.sections.length) return config;
  return { ...config, sections };
}

function ensureLayoutTree(config: PresentationConfig): LayoutTree {
  return syncLayoutFromSections(
    config.sections.map((s) => ({ id: s.id, type: s.type })),
    config.layoutTree ?? null,
  );
}

function withLayoutTree(
  config: PresentationConfig,
  tree: LayoutTree,
): PresentationConfig {
  const sections = orderSectionsByLayout(config.sections, tree);
  return { ...config, sections, layoutTree: tree };
}

function createDefaultSection(type: SectionType): SectionConfig {
  return {
    id: `${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    enabled: true,
    variant: "default",
    spacing: "default",
    background: "none",
    animation: "inherit",
    visibility: "always",
    settings: {
      doctorPhoto: null,
      gallery: [],
      heading: null,
      supportingText: null,
    },
  };
}

function pushHistory(
  past: PresentationConfig[],
  current: PresentationConfig,
): PresentationConfig[] {
  return [...past, cloneConfig(current)].slice(-MAX_HISTORY);
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  pageId: "",
  config: createDefaultPresentationConfig("generic"),
  past: [],
  future: [],
  selectedIds: [],
  hoveredId: null,
  lockedIds: [],
  collapsedIds: [],
  selectedContentId: null,
  hoveredContentId: null,
  editingContentId: null,
  selectedElementId: null,
  hoveredElementId: null,
  editingElementId: null,
  selectedChromeId: null,
  device: "desktop",
  zoom: 100,
  leftTab: "layers",
  showGuides: true,
  showBaselineGrid: false,
  dragging: null,
  dropTarget: null,
  dirty: false,
  saving: false,
  lastSavedAt: null,
  clipboard: null,
  commandPaletteOpen: false,

  hydrate: ({ pageId, config }) => {
    const deduped = dedupeContentSections(cloneConfig(config));
    const tree = ensureLayoutTree(deduped);
    const next = withLayoutTree(deduped, tree);
    const removedDupes = next.sections.length !== config.sections.length;
    set({
      pageId,
      config: next,
      past: [],
      future: [],
      selectedIds: [],
      hoveredId: null,
      lockedIds: [],
      selectedContentId: null,
      hoveredContentId: null,
      editingContentId: null,
      selectedElementId: null,
      hoveredElementId: null,
      editingElementId: null,
      selectedChromeId: null,
      dirty: removedDupes,
      saving: false,
      lastSavedAt: null,
      dragging: null,
      dropTarget: null,
    });
  },

  setConfig: (config, pushHistoryFlag = true) => {
    const state = get();
    const tree = ensureLayoutTree(config);
    const next = withLayoutTree(config, tree);
    if (!pushHistoryFlag) {
      set({ config: next, dirty: true });
      return;
    }
    set({
      config: next,
      past: pushHistory(state.past, state.config),
      future: [],
      dirty: true,
    });
  },

  updateConfig: (updater, pushHistoryFlag = true) => {
    const state = get();
    const next = updater(state.config);
    get().setConfig(next, pushHistoryFlag);
  },

  undo: () => {
    const state = get();
    if (!state.past.length) return;
    const previous = state.past[state.past.length - 1]!;
    set({
      config: previous,
      past: state.past.slice(0, -1),
      future: [cloneConfig(state.config), ...state.future].slice(0, MAX_HISTORY),
      dirty: true,
    });
  },

  redo: () => {
    const state = get();
    if (!state.future.length) return;
    const [next, ...rest] = state.future;
    set({
      config: next!,
      past: pushHistory(state.past, state.config),
      future: rest,
      dirty: true,
    });
  },

  select: (sectionId, opts) => {
    if (!sectionId) {
      set({
        selectedIds: [],
        selectedContentId: null,
        editingContentId: null,
        selectedElementId: null,
        editingElementId: null,
        selectedChromeId: null,
      });
      return;
    }
    if (get().lockedIds.includes(sectionId)) return;
    if (opts?.additive) {
      const current = get().selectedIds;
      set({
        selectedIds: current.includes(sectionId)
          ? current.filter((id) => id !== sectionId)
          : [...current, sectionId],
        selectedContentId: null,
        editingContentId: null,
        selectedElementId: null,
        editingElementId: null,
        selectedChromeId: null,
      });
      return;
    }
    set({
      selectedIds: [sectionId],
      selectedContentId: null,
      editingContentId: null,
      selectedElementId: null,
      editingElementId: null,
      selectedChromeId: null,
    });
  },

  selectChrome: (chromeId) =>
    set({
      selectedChromeId: chromeId,
      selectedIds: [],
      selectedContentId: null,
      editingContentId: null,
      selectedElementId: null,
      editingElementId: null,
    }),

  hover: (sectionId) => set({ hoveredId: sectionId }),

  clearSelection: () =>
    set({
      selectedIds: [],
      hoveredId: null,
      selectedContentId: null,
      hoveredContentId: null,
      editingContentId: null,
      selectedElementId: null,
      hoveredElementId: null,
      editingElementId: null,
      selectedChromeId: null,
    }),

  selectContent: (nodeId) =>
    set({
      selectedContentId: nodeId,
      editingContentId: null,
      selectedElementId: null,
      editingElementId: null,
      selectedChromeId: null,
    }),

  hoverContent: (nodeId) => set({ hoveredContentId: nodeId }),

  setEditingContent: (nodeId) => set({ editingContentId: nodeId }),

  selectElement: (elementId) =>
    set({
      selectedElementId: elementId,
      editingElementId: null,
      selectedContentId: null,
      editingContentId: null,
      selectedChromeId: null,
      // Keep section selection for parent context when possible
      selectedIds: elementId
        ? [
            elementId.split(".").slice(0, 2).join("."),
          ]
        : get().selectedIds,
    }),

  hoverElement: (elementId) => set({ hoveredElementId: elementId }),

  setEditingElement: (elementId) =>
    set({
      editingElementId: elementId,
      selectedElementId: elementId ?? get().selectedElementId,
    }),

  setElementField: (elementId, field, value, pushHistoryFlag = true) => {
    get().updateConfig(
      (prev) => setElementOverrideField(prev, elementId, field, value),
      pushHistoryFlag,
    );
  },

  setDevice: (device) => set({ device }),
  setZoom: (zoom) => set({ zoom: Math.min(200, Math.max(25, zoom)) }),
  setLeftTab: (tab) => set({ leftTab: tab }),
  setShowGuides: (show) => set({ showGuides: show }),
  setShowBaselineGrid: (show) => set({ showBaselineGrid: show }),

  toggleLock: (sectionId) => {
    const locked = get().lockedIds;
    set({
      lockedIds: locked.includes(sectionId)
        ? locked.filter((id) => id !== sectionId)
        : [...locked, sectionId],
      selectedIds: get().selectedIds.filter((id) => id !== sectionId),
    });
  },

  toggleCollapsed: (sectionId) => {
    const collapsed = get().collapsedIds;
    set({
      collapsedIds: collapsed.includes(sectionId)
        ? collapsed.filter((id) => id !== sectionId)
        : [...collapsed, sectionId],
    });
  },

  toggleVisibility: (sectionId) => {
    get().updateConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section,
      ),
    }));
  },

  duplicateSection: (sectionId) => {
    const state = get();
    const index = state.config.sections.findIndex((s) => s.id === sectionId);
    if (index < 0) return;
    const source = state.config.sections[index]!;
    const copy = {
      ...structuredClone(source),
      id: `${source.type}-${Date.now().toString(36)}`,
    };
    const tree = insertLayoutSection(
      ensureLayoutTree(state.config),
      { id: copy.id, type: copy.type },
      state.config.sections[index + 1]?.id ?? null,
    );
    get().setConfig(
      withLayoutTree({ ...state.config, sections: [...state.config.sections, copy] }, tree),
    );
    set({ selectedIds: [copy.id] });
  },

  deleteSections: (sectionIds) => {
    if (!sectionIds.length) return;
    const locked = new Set(get().lockedIds);
    const remove = new Set(sectionIds.filter((id) => !locked.has(id)));
    if (!remove.size) return;
    const state = get();
    let tree = ensureLayoutTree(state.config);
    for (const id of remove) {
      tree = removeLayoutSection(tree, id);
    }
    get().setConfig(
      withLayoutTree(
        {
          ...state.config,
          sections: state.config.sections.filter((s) => !remove.has(s.id)),
        },
        tree,
      ),
    );
    set({
      selectedIds: state.selectedIds.filter((id) => !remove.has(id)),
    });
  },

  addSection: (sectionType, beforeId = null) => {
    const state = get();
    if (
      sectionType === "content" &&
      state.config.sections.some((s) => s.type === "content")
    ) {
      const existing = state.config.sections.find((s) => s.type === "content");
      if (existing) set({ selectedIds: [existing.id], leftTab: "layers" });
      return;
    }
    const section = createDefaultSection(sectionType);
    const tree = insertLayoutSection(
      ensureLayoutTree(state.config),
      { id: section.id, type: section.type },
      beforeId,
    );
    get().setConfig(
      withLayoutTree(
        { ...state.config, sections: [...state.config.sections, section] },
        tree,
      ),
    );
    set({ selectedIds: [section.id], leftTab: "layers" });
  },

  reorderSection: (fromId, beforeId) => {
    const state = get();
    if (fromId === beforeId) return;
    const tree = reorderLayoutSection(
      ensureLayoutTree(state.config),
      fromId,
      beforeId,
    );
    get().setConfig(withLayoutTree(state.config, tree));
  },

  setSectionSpacing: (sectionId, spacing) => {
    get().updateConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, spacing } : section,
      ),
    }));
  },

  setDragging: (payload) => set({ dragging: payload }),
  setDropTarget: (target) => set({ dropTarget: target }),

  commitDrop: () => {
    const { dragging, dropTarget } = get();
    if (!dragging || !dropTarget) {
      set({ dragging: null, dropTarget: null });
      return;
    }
    if (dragging.kind === "section") {
      if (dragging.duplicate) {
        get().duplicateSection(dragging.sectionId);
        const copyId = get().selectedIds[0];
        if (copyId) get().reorderSection(copyId, dropTarget.beforeId);
      } else {
        get().reorderSection(dragging.sectionId, dropTarget.beforeId);
      }
    } else {
      get().addSection(dragging.sectionType, dropTarget.beforeId);
    }
    set({ dragging: null, dropTarget: null });
  },

  copySelection: () => {
    const id = get().selectedIds[0];
    if (!id) return;
    const section = get().config.sections.find((s) => s.id === id);
    if (!section) return;
    set({ clipboard: structuredClone(section) });
  },

  pasteClipboard: () => {
    const clip = get().clipboard;
    if (!clip) return;
    const copy = {
      ...structuredClone(clip),
      id: `${clip.type}-${Date.now().toString(36)}`,
    };
    const state = get();
    const selected = state.selectedIds[0];
    const beforeId = selected
      ? (state.config.sections[
          state.config.sections.findIndex((s) => s.id === selected) + 1
        ]?.id ?? null)
      : null;
    const tree = insertLayoutSection(
      ensureLayoutTree(state.config),
      { id: copy.id, type: copy.type },
      beforeId,
    );
    get().setConfig(
      withLayoutTree(
        { ...state.config, sections: [...state.config.sections, copy] },
        tree,
      ),
    );
    set({ selectedIds: [copy.id] });
  },

  groupSelection: () => {
    const ids = get().selectedIds;
    if (ids.length < 2) return;
    const state = get();
    const tree = groupLayoutSections(ensureLayoutTree(state.config), ids);
    get().setConfig(withLayoutTree(state.config, tree));
  },

  ungroupSelection: () => {
    const ids = get().selectedIds;
    if (!ids.length) return;
    const state = get();
    const tree = ungroupSectionsContaining(ensureLayoutTree(state.config), ids);
    get().setConfig(withLayoutTree(state.config, tree));
  },

  insertSectionTemplate: (types, beforeId = null) => {
    if (!types.length) return;
    const state = get();
    let tree = ensureLayoutTree(state.config);
    const added: SectionConfig[] = [];
    let insertBefore = beforeId;

    for (let i = types.length - 1; i >= 0; i -= 1) {
      const type = types[i]!;
      if (
        type === "content" &&
        (state.config.sections.some((s) => s.type === "content") ||
          added.some((s) => s.type === "content"))
      ) {
        continue;
      }
      const section = createDefaultSection(type);
      added.unshift(section);
      tree = insertLayoutSection(
        tree,
        { id: section.id, type: section.type },
        insertBefore,
      );
      insertBefore = section.id;
    }

    if (!added.length) return;
    get().setConfig(
      withLayoutTree(
        {
          ...state.config,
          sections: [...state.config.sections, ...added],
        },
        tree,
      ),
    );
    set({ selectedIds: [added[0]!.id], leftTab: "layers" });
  },

  patchContentNodeStyles: (nodeId, styles, pushHistory = true) => {
    get().updateConfig((prev) => {
      const existing = prev.contentOverrides.nodes[nodeId] ?? {};
      return {
        ...prev,
        contentOverrides: {
          ...prev.contentOverrides,
          nodes: {
            ...prev.contentOverrides.nodes,
            [nodeId]: {
              ...existing,
              styles: {
                ...existing.styles,
                ...styles,
              },
            },
          },
        },
      };
    }, pushHistory);
  },

  patchHeroImageTransform: (transform, pushHistory = true) => {
    get().updateConfig(
      (prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          imageTransform: {
            ...prev.hero.imageTransform,
            ...transform,
          },
        },
      }),
      pushHistory,
    );
  },

  markSaved: () =>
    set({
      dirty: false,
      saving: false,
      lastSavedAt: new Date().toISOString(),
    }),

  setSaving: (saving) => set({ saving }),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  getLayoutTree: () => ensureLayoutTree(get().config),
}));

export function createSectionFromType(type: SectionType): SectionConfig {
  return createDefaultSection(type);
}

/** Map Plugin SDK category → PresentationConfig section type. */
export const CATEGORY_TO_SECTION: Record<string, SectionType> = {
  Hero: "hero",
  Trust: "trust",
  Content: "content",
  Layout: "content",
  Doctor: "doctor",
  Gallery: "gallery",
  Pricing: "pricing",
  Timeline: "timeline",
  FAQ: "faq",
  Location: "location",
  Related: "related-treatments",
  Testimonials: "testimonials",
  CTA: "cta",
};

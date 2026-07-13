"use client";

import NextLink from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  GripVertical,
  Layers,
  LayoutTemplate,
  Lock,
  Trash2,
  Unlock,
} from "lucide-react";

import { useBuilderMeta } from "@/components/admin/builder/BuilderProvider";
import { ComponentLibrary } from "@/components/admin/builder/ComponentLibrary";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";

type CatalogBlock = {
  id: string;
  name: string;
  category: string;
  packId: string;
  version: string;
};

const TABS = [
  { id: "pages", label: "Pages", icon: FileText },
  { id: "layers", label: "Layers", icon: Layers },
  { id: "components", label: "Library", icon: LayoutTemplate },
  { id: "assets", label: "Assets", icon: FolderOpen },
] as const;

export function BuilderLeftSidebar({
  catalogBlocks,
}: {
  catalogBlocks: CatalogBlock[];
}) {
  const leftTab = useEditorStore((s) => s.leftTab);
  const setLeftTab = useEditorStore((s) => s.setLeftTab);

  return (
    <aside className="flex w-[15%] min-w-[220px] max-w-[280px] shrink-0 flex-col border-r border-border/80 bg-white/80 backdrop-blur-xl">
      <div className="flex gap-1 border-b border-border/80 p-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[0.625rem] font-medium transition",
                leftTab === tab.id
                  ? "bg-sky-50 text-sky-700 shadow-sm"
                  : "text-muted-foreground hover:bg-muted/70",
              )}
              onClick={() => setLeftTab(tab.id)}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {leftTab === "pages" ? <PagesPanel /> : null}
        {leftTab === "layers" ? <LayerTree /> : null}
        {leftTab === "components" ? (
          <ComponentLibrary catalogBlocks={catalogBlocks} />
        ) : null}
        {leftTab === "assets" ? (
          <EmptyPanel
            title="Assets"
            body="WordPress media opens from image fields. Full asset dock expands next."
          />
        ) : null}
      </div>
    </aside>
  );
}

function PagesPanel() {
  const { title, uri } = useBuilderMeta();
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-muted/20 px-3 py-3">
        <p className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
          Current page
        </p>
        <p className="mt-1 text-small font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 truncate text-[0.6875rem] text-muted-foreground">
          {uri}
        </p>
      </div>
      <NextLink
        href="/admin/pages"
        className="block rounded-xl border border-dashed border-border px-3 py-3 text-small text-muted-foreground no-underline transition hover:border-sky-300 hover:bg-sky-50/50 hover:text-foreground"
      >
        ← Back to all pages
      </NextLink>
    </div>
  );
}

function LayerTree() {
  const sections = useEditorStore((s) => s.config.sections);
  const layoutTree = useEditorStore((s) => s.config.layoutTree);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const lockedIds = useEditorStore((s) => s.lockedIds);
  const collapsedIds = useEditorStore((s) => s.collapsedIds);
  const select = useEditorStore((s) => s.select);
  const toggleCollapsed = useEditorStore((s) => s.toggleCollapsed);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const duplicateSection = useEditorStore((s) => s.duplicateSection);
  const deleteSections = useEditorStore((s) => s.deleteSections);
  const setDragging = useEditorStore((s) => s.setDragging);
  const setDropTarget = useEditorStore((s) => s.setDropTarget);
  const commitDrop = useEditorStore((s) => s.commitDrop);
  const dropTarget = useEditorStore((s) => s.dropTarget);
  const dragging = useEditorStore((s) => s.dragging);

  if (!sections.length) {
    return (
      <EmptyPanel
        title="No layers"
        body="Insert a component from the Library to start building."
      />
    );
  }

  const groupedIds = new Set<string>();
  for (const child of layoutTree?.root.children ?? []) {
    if (child.kind !== "group") continue;
    for (const leaf of child.children) {
      if (leaf.sectionId) groupedIds.add(leaf.sectionId);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
          Page
        </span>
        <span className="text-[0.6875rem] text-muted-foreground">
          {sections.length} blocks
        </span>
      </div>
      <ul className="space-y-0.5">
        {sections.map((section) => {
          const selected = selectedIds.includes(section.id);
          const locked = lockedIds.includes(section.id);
          const collapsed = collapsedIds.includes(section.id);
          const insertHere =
            Boolean(dragging) && dropTarget?.beforeId === section.id;
          const inGroup = groupedIds.has(section.id);

          return (
            <li key={section.id}>
              {insertHere ? (
                <div className="mx-1 my-1 h-0.5 rounded-full bg-sky-500" />
              ) : null}
              <div
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-1 py-1 text-small",
                  selected ? "bg-sky-50 text-sky-900" : "hover:bg-muted/80",
                  !section.enabled && "opacity-50",
                  inGroup && "ring-1 ring-inset ring-sky-200",
                )}
                draggable={!locked}
                onDragStart={() => {
                  setDragging({ kind: "section", sectionId: section.id });
                }}
                onDragEnd={() => {
                  setDragging(null);
                  setDropTarget(null);
                }}
                onDragOver={(event) => {
                  if (!dragging) return;
                  event.preventDefault();
                  setDropTarget({ beforeId: section.id });
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  commitDrop();
                }}
              >
                <button
                  type="button"
                  className="rounded p-0.5 text-muted-foreground hover:bg-white"
                  onClick={() => toggleCollapsed(section.id)}
                >
                  {collapsed ? (
                    <ChevronRight className="size-3.5" />
                  ) : (
                    <ChevronDown className="size-3.5" />
                  )}
                </button>
                <GripVertical className="size-3.5 shrink-0 cursor-grab text-muted-foreground/70" />
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left capitalize"
                  onClick={(event) =>
                    select(section.id, {
                      additive: event.shiftKey || event.metaKey || event.ctrlKey,
                    })
                  }
                >
                  {section.type}
                </button>
                <button
                  type="button"
                  className="rounded p-1 opacity-0 transition group-hover:opacity-100"
                  title="Duplicate"
                  onClick={() => duplicateSection(section.id)}
                >
                  <Copy className="size-3" />
                </button>
                <button
                  type="button"
                  className="rounded p-1 text-muted-foreground hover:bg-white"
                  onClick={() => toggleVisibility(section.id)}
                >
                  {section.enabled ? (
                    <Eye className="size-3.5" />
                  ) : (
                    <EyeOff className="size-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  className="rounded p-1 text-muted-foreground hover:bg-white"
                  onClick={() => toggleLock(section.id)}
                >
                  {locked ? (
                    <Lock className="size-3.5" />
                  ) : (
                    <Unlock className="size-3.5 opacity-40" />
                  )}
                </button>
                <button
                  type="button"
                  className="rounded p-1 text-muted-foreground opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  onClick={() => deleteSections([section.id])}
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
      <p className="text-small font-medium text-foreground">{title}</p>
      <p className="mt-2 text-[0.75rem] text-muted-foreground">{body}</p>
    </div>
  );
}

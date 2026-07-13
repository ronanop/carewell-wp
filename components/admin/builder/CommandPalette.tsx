"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Eye,
  FileImage,
  LayoutTemplate,
  Redo2,
  Save,
  Search,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";

import {
  CATEGORY_TO_SECTION,
  useEditorStore,
} from "@/lib/experience/builder/editorStore";
import type { SectionType } from "@/types/presentation-config";

type CatalogBlock = {
  id: string;
  name: string;
  category: string;
};

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Search;
  run: () => void;
};

export function CommandPalette({
  catalogBlocks,
  onSave,
  onPublish,
}: {
  catalogBlocks: CatalogBlock[];
  onSave: () => void;
  onPublish: () => void;
}) {
  const open = useEditorStore((s) => s.commandPaletteOpen);
  const setOpen = useEditorStore((s) => s.setCommandPaletteOpen);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const store = useEditorStore.getState();
    const insertCommands: Command[] = catalogBlocks.map((block) => ({
      id: `insert-${block.id}`,
      label: `Insert ${block.name}`,
      hint: block.category,
      icon: LayoutTemplate,
      run: () => {
        const type: SectionType =
          CATEGORY_TO_SECTION[block.category] ?? "content";
        const selected = store.selectedIds[0];
        const sections = store.config.sections;
        const idx = selected
          ? sections.findIndex((s) => s.id === selected)
          : -1;
        const beforeId =
          idx >= 0 ? (sections[idx + 1]?.id ?? null) : null;
        store.addSection(type, beforeId);
      },
    }));

    return [
      {
        id: "save",
        label: "Save draft",
        hint: "⌘S",
        icon: Save,
        run: onSave,
      },
      {
        id: "publish",
        label: "Publish",
        icon: Upload,
        run: onPublish,
      },
      {
        id: "undo",
        label: "Undo",
        hint: "⌘Z",
        icon: Undo2,
        run: () => store.undo(),
      },
      {
        id: "redo",
        label: "Redo",
        hint: "⌘⇧Z",
        icon: Redo2,
        run: () => store.redo(),
      },
      {
        id: "duplicate",
        label: "Duplicate selection",
        hint: "⌘D",
        icon: Copy,
        run: () => {
          const id = store.selectedIds[0];
          if (id) store.duplicateSection(id);
        },
      },
      {
        id: "delete",
        label: "Delete selection",
        hint: "⌫",
        icon: Trash2,
        run: () => store.deleteSections(store.selectedIds),
      },
      {
        id: "layers",
        label: "Jump to Layers",
        icon: Eye,
        run: () => store.setLeftTab("layers"),
      },
      {
        id: "components",
        label: "Search Components",
        icon: Search,
        run: () => store.setLeftTab("components"),
      },
      {
        id: "assets",
        label: "Open Media / Assets",
        icon: FileImage,
        run: () => store.setLeftTab("assets"),
      },
      ...insertCommands,
    ];
  }, [catalogBlocks, onSave, onPublish]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.slice(0, 12);
    return commands
      .filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(q) ||
          cmd.hint?.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [commands, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-900/40 px-4 pt-[15vh] backdrop-blur-sm"
      onMouseDown={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border/80 bg-white/95 shadow-2xl backdrop-blur-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Insert block, save, jump to layer…"
            className="h-12 w-full bg-transparent text-small outline-none"
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
              if (event.key === "Enter" && filtered[0]) {
                filtered[0].run();
                setOpen(false);
              }
            }}
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <li key={cmd.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-small hover:bg-sky-50"
                  onClick={() => {
                    cmd.run();
                    setOpen(false);
                  }}
                >
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="flex-1 font-medium text-foreground">
                    {cmd.label}
                  </span>
                  {cmd.hint ? (
                    <span className="text-[0.6875rem] text-muted-foreground">
                      {cmd.hint}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
          {!filtered.length ? (
            <li className="px-3 py-8 text-center text-small text-muted-foreground">
              No matching commands
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

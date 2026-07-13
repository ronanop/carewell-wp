"use client";

import NextLink from "next/link";
import {
  Grid3X3,
  History,
  Magnet,
  Monitor,
  Redo2,
  Save,
  Search,
  Smartphone,
  Tablet,
  Undo2,
  Eye,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";

export function BuilderToolbar({
  title,
  uri,
  onSave,
  onPublish,
}: {
  title: string;
  uri: string;
  onSave: () => void;
  onPublish: () => void;
}) {
  const device = useEditorStore((s) => s.device);
  const zoom = useEditorStore((s) => s.zoom);
  const dirty = useEditorStore((s) => s.dirty);
  const saving = useEditorStore((s) => s.saving);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  const pastLen = useEditorStore((s) => s.past.length);
  const futureLen = useEditorStore((s) => s.future.length);
  const setDevice = useEditorStore((s) => s.setDevice);
  const setZoom = useEditorStore((s) => s.setZoom);
  const showGuides = useEditorStore((s) => s.showGuides);
  const showBaselineGrid = useEditorStore((s) => s.showBaselineGrid);
  const setShowGuides = useEditorStore((s) => s.setShowGuides);
  const setShowBaselineGrid = useEditorStore((s) => s.setShowBaselineGrid);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const setCommandPaletteOpen = useEditorStore((s) => s.setCommandPaletteOpen);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-white/80 px-3 backdrop-blur-xl">
      <div className="min-w-0 flex-1">
        <NextLink
          href="/admin/pages"
          className="text-[0.6875rem] text-muted-foreground no-underline hover:text-foreground hover:underline"
        >
          Pages
        </NextLink>
        <p className="truncate text-small font-semibold text-foreground">
          {title}
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/30 p-1">
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-white hover:text-foreground disabled:opacity-40"
          disabled={!pastLen}
          onClick={undo}
          aria-label="Undo"
        >
          <Undo2 className="size-4" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-white hover:text-foreground disabled:opacity-40"
          disabled={!futureLen}
          onClick={redo}
          aria-label="Redo"
        >
          <Redo2 className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/30 p-1">
        {(
          [
            ["desktop", Monitor],
            ["tablet", Tablet],
            ["mobile", Smartphone],
          ] as const
        ).map(([id, Icon]) => (
          <button
            key={id}
            type="button"
            className={cn(
              "rounded-lg p-2",
              device === id
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setDevice(id)}
            aria-label={id}
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-border/80 px-3 py-1.5 text-[0.75rem] text-muted-foreground">
        Zoom
        <select
          className="rounded-md border-0 bg-transparent text-foreground outline-none"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        >
          {[25, 50, 75, 100, 125, 150, 200].map((value) => (
            <option key={value} value={value}>
              {value}%
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-md px-1.5 text-[0.6875rem] text-foreground hover:bg-muted"
          onClick={() => setZoom(100)}
          title="Actual size"
        >
          100
        </button>
        <button
          type="button"
          className="rounded-md px-1.5 text-[0.6875rem] text-foreground hover:bg-muted"
          onClick={() => setZoom(75)}
          title="Fit width"
        >
          Fit
        </button>
      </label>

      <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/30 p-1">
        <button
          type="button"
          className={cn(
            "rounded-lg p-2",
            showGuides
              ? "bg-white text-sky-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setShowGuides(!showGuides)}
          aria-label="Toggle snap guides"
          title="Snap guides"
        >
          <Magnet className="size-4" />
        </button>
        <button
          type="button"
          className={cn(
            "rounded-lg p-2",
            showBaselineGrid
              ? "bg-white text-sky-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setShowBaselineGrid(!showBaselineGrid)}
          aria-label="Toggle baseline grid"
          title="8px baseline grid"
        >
          <Grid3X3 className="size-4" />
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-[0.75rem] text-muted-foreground lg:inline">
          {dirty
            ? saving
              ? "Saving…"
              : "Unsaved changes"
            : lastSavedAt
              ? "Saved"
              : "Up to date"}
        </span>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-small font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="size-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[0.625rem] md:inline">
            ⌘K
          </kbd>
        </button>
        <a
          href={uri}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-small font-medium text-muted-foreground no-underline hover:bg-muted hover:text-foreground hover:no-underline"
        >
          <Eye className="size-3.5" />
          Preview
        </a>
        <Button type="button" variant="outline" size="sm" onClick={onSave}>
          <Save className="size-3.5" />
          Save
        </Button>
        <Button type="button" size="sm" onClick={onPublish}>
          <Upload className="size-3.5" />
          Publish
        </Button>
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          aria-label="History"
          title="Version history"
        >
          <History className="size-4" />
        </button>
      </div>
    </header>
  );
}

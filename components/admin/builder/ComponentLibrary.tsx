"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  GripVertical,
  LayoutTemplate,
  Search,
  Star,
} from "lucide-react";

import {
  CATEGORY_TO_SECTION,
  useEditorStore,
} from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";
import type { SectionType } from "@/types/presentation-config";

type CatalogBlock = {
  id: string;
  name: string;
  category: string;
  packId: string;
  version: string;
};

const LIBRARY_CATEGORIES = [
  "Medical",
  "Layout",
  "Typography",
  "Hero",
  "Content",
  "Doctor",
  "Gallery",
  "Forms",
  "Media",
  "Navigation",
  "Marketing",
  "Pricing",
  "Timeline",
  "FAQ",
  "Location",
  "Testimonials",
  "CTA",
  "Related",
  "Trust",
  "Advanced",
] as const;

const SECTION_TEMPLATES: Array<{
  id: string;
  name: string;
  description: string;
  types: SectionType[];
}> = [
  {
    id: "tpl-landing-hero",
    name: "Landing hero",
    description: "Hero + trust + CTA",
    types: ["hero", "trust", "cta"],
  },
  {
    id: "tpl-doctor-spotlight",
    name: "Doctor spotlight",
    description: "Doctor + testimonials + CTA",
    types: ["doctor", "testimonials", "cta"],
  },
  {
    id: "tpl-gallery-story",
    name: "Gallery story",
    description: "Gallery + timeline + FAQ",
    types: ["gallery", "timeline", "faq"],
  },
  {
    id: "tpl-pricing-close",
    name: "Pricing close",
    description: "Pricing + FAQ + location",
    types: ["pricing", "faq", "location"],
  },
  {
    id: "tpl-full-clinic",
    name: "Clinic landing",
    description: "Hero → doctor → gallery → CTA",
    types: ["hero", "doctor", "gallery", "cta"],
  },
];

const FAVORITES_KEY = "cw-studio-favorites";
const RECENT_KEY = "cw-studio-recent";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(ids.slice(0, 24)));
}

/**
 * Searchable component library — drag onto canvas or click to insert.
 */
export function ComponentLibrary({
  catalogBlocks,
}: {
  catalogBlocks: CatalogBlock[];
}) {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() =>
    readList(FAVORITES_KEY),
  );
  const [recent, setRecent] = useState<string[]>(() => readList(RECENT_KEY));
  const addSection = useEditorStore((s) => s.addSection);
  const insertSectionTemplate = useEditorStore((s) => s.insertSectionTemplate);
  const setDragging = useEditorStore((s) => s.setDragging);
  const setDropTarget = useEditorStore((s) => s.setDropTarget);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalogBlocks;
    return catalogBlocks.filter(
      (block) =>
        block.name.toLowerCase().includes(q) ||
        block.category.toLowerCase().includes(q) ||
        block.id.toLowerCase().includes(q) ||
        block.packId.toLowerCase().includes(q),
    );
  }, [catalogBlocks, query]);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTION_TEMPLATES;
    return SECTION_TEMPLATES.filter(
      (tpl) =>
        tpl.name.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q),
    );
  }, [query]);

  const byCategory = useMemo(() => {
    const map = new Map<string, CatalogBlock[]>();
    for (const block of filtered) {
      const cat = normalizeCategory(block.category);
      const list = map.get(cat) ?? [];
      list.push(block);
      map.set(cat, list);
    }
    const ordered: Array<[string, CatalogBlock[]]> = [];
    for (const cat of LIBRARY_CATEGORIES) {
      const list = map.get(cat);
      if (list?.length) ordered.push([cat, list]);
    }
    for (const [cat, list] of map) {
      if (!LIBRARY_CATEGORIES.includes(cat as (typeof LIBRARY_CATEGORIES)[number])) {
        ordered.push([cat, list]);
      }
    }
    return ordered;
  }, [filtered]);

  const favoriteBlocks = catalogBlocks.filter((b) => favorites.includes(b.id));
  const recentBlocks = recent
    .map((id) => catalogBlocks.find((b) => b.id === id))
    .filter(Boolean) as CatalogBlock[];

  function insertBlock(block: CatalogBlock) {
    const sectionType: SectionType =
      CATEGORY_TO_SECTION[block.category] ??
      CATEGORY_TO_SECTION[normalizeCategory(block.category)] ??
      "gallery";
    const store = useEditorStore.getState();
    const selected = store.selectedIds[0];
    const sections = store.config.sections;
    const idx = selected
      ? sections.findIndex((s) => s.id === selected)
      : -1;
    const beforeId = idx >= 0 ? (sections[idx + 1]?.id ?? null) : null;
    addSection(sectionType, beforeId);

    const nextRecent = [block.id, ...recent.filter((id) => id !== block.id)];
    setRecent(nextRecent);
    writeList(RECENT_KEY, nextRecent);
  }

  function insertTemplate(types: SectionType[]) {
    const store = useEditorStore.getState();
    const selected = store.selectedIds[0];
    const sections = store.config.sections;
    const idx = selected
      ? sections.findIndex((s) => s.id === selected)
      : -1;
    const beforeId = idx >= 0 ? (sections[idx + 1]?.id ?? null) : null;
    insertSectionTemplate(types, beforeId);
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [id, ...favorites];
    setFavorites(next);
    writeList(FAVORITES_KEY, next);
  }

  return (
    <div className="space-y-4">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components…"
          className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-small outline-none ring-ring focus:ring-2"
        />
      </label>

      {filteredTemplates.length ? (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            <LayoutTemplate className="size-3" />
            My Templates
          </p>
          <div className="grid gap-2">
            {filteredTemplates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                className="rounded-xl border border-sky-200/80 bg-sky-50/40 px-3 py-2.5 text-left transition hover:border-sky-400 hover:bg-sky-50"
                onClick={() => insertTemplate(tpl.types)}
              >
                <p className="text-small font-medium text-foreground">
                  {tpl.name}
                </p>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  {tpl.description} · {tpl.types.length} sections
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {favoriteBlocks.length ? (
        <BlockGroup
          title="Favorites"
          icon={Star}
          blocks={favoriteBlocks}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onInsert={insertBlock}
          onDragStart={(_block, sectionType) => {
            setDragging({ kind: "library", sectionType });
          }}
          onDragEnd={() => {
            setDragging(null);
            setDropTarget(null);
          }}
        />
      ) : null}

      {recentBlocks.length ? (
        <BlockGroup
          title="Recently used"
          icon={Clock}
          blocks={recentBlocks}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onInsert={insertBlock}
          onDragStart={(_block, sectionType) => {
            setDragging({ kind: "library", sectionType });
          }}
          onDragEnd={() => {
            setDragging(null);
            setDropTarget(null);
          }}
        />
      ) : null}

      {byCategory.map(([category, blocks]) => (
        <BlockGroup
          key={category}
          title={category}
          icon={LayoutTemplate}
          blocks={blocks}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onInsert={insertBlock}
          onDragStart={(_block, sectionType) => {
            setDragging({ kind: "library", sectionType });
          }}
          onDragEnd={() => {
            setDragging(null);
            setDropTarget(null);
          }}
        />
      ))}
    </div>
  );
}

function BlockGroup({
  title,
  icon: Icon,
  blocks,
  favorites,
  onToggleFavorite,
  onInsert,
  onDragStart,
  onDragEnd,
}: {
  title: string;
  icon: typeof Star;
  blocks: CatalogBlock[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onInsert: (block: CatalogBlock) => void;
  onDragStart: (block: CatalogBlock, sectionType: SectionType) => void;
  onDragEnd: () => void;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" />
        {title}
      </p>
      <div className="grid gap-2">
        {blocks.map((block) => {
          const sectionType: SectionType =
            CATEGORY_TO_SECTION[block.category] ??
            CATEGORY_TO_SECTION[normalizeCategory(block.category)] ??
            "gallery";
          const isFav = favorites.includes(block.id);
          return (
            <div
              key={block.id}
              draggable
              className="group relative cursor-grab rounded-xl border border-border bg-muted/15 px-3 py-2.5 text-left transition hover:border-sky-300 hover:bg-sky-50/60 active:cursor-grabbing"
              onClick={() => onInsert(block)}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "copy";
                event.dataTransfer.setData(
                  "application/x-editor-library",
                  sectionType,
                );
                onDragStart(block, sectionType);
              }}
              onDragEnd={onDragEnd}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" />
                <div className="min-w-0 flex-1">
                  <p className="text-small font-medium text-foreground">
                    {block.name}
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    {block.category} · Responsive · Drag to canvas
                  </p>
                </div>
                <button
                  type="button"
                  className={cn(
                    "rounded p-1 opacity-0 transition group-hover:opacity-100",
                    isFav && "opacity-100 text-amber-500",
                  )}
                  title="Favorite"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(block.id);
                  }}
                >
                  <Star
                    className={cn("size-3.5", isFav && "fill-amber-400")}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function normalizeCategory(category: string): string {
  if (/medical|doctor|clinic/i.test(category)) return "Medical";
  if (/form/i.test(category)) return "Forms";
  if (/media|image|video/i.test(category)) return "Media";
  if (/nav/i.test(category)) return "Navigation";
  if (/market|promo/i.test(category)) return "Marketing";
  if (/type|text|heading/i.test(category)) return "Typography";
  if (/advanced|custom/i.test(category)) return "Advanced";
  return category;
}

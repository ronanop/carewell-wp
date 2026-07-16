"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type DragEvent,
  type ClipboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Copy,
  FileText,
  Film,
  FolderPlus,
  Grid2X2,
  Heart,
  List,
  Loader2,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/assets/domain";
import {
  createAssetFolderAction,
  getAssetByIdAction,
  listAssetFoldersAction,
  listAssetsAction,
  listAssetUsagesAction,
  moveAssetToFolderAction,
  rebuildAssetUsageIndexAction,
  setAssetFavoriteAction,
  syncAssetsFromWordPressAction,
  trashAssetAction,
  updateAssetMetadataAction,
  uploadAssetAction,
} from "@/lib/assets/actions/assetActions";
import { cn } from "@/lib/utils";
import type {
  Asset,
  AssetFolder,
  AssetKind,
  AssetUsage,
} from "@/types/assets";

export type AssetManagerMode = "page" | "dialog";

export type AssetManagerProps = {
  mode?: AssetManagerMode;
  onSelect?: (asset: Asset) => void;
  selectedMediaId?: number | null;
  /** When true, only image assets are listed (picker for image fields). */
  imagesOnly?: boolean;
  className?: string;
};

type UploadJob = {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
  previewUrl?: string;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64 || "");
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function kindIcon(kind: AssetKind) {
  if (kind === "video") return Film;
  if (kind === "image") return null;
  return FileText;
}

const AssetCard = memo(function AssetCard({
  asset,
  selected,
  view,
  onSelect,
}: {
  asset: Asset;
  selected: boolean;
  view: "grid" | "list";
  onSelect: (asset: Asset) => void;
}) {
  const Icon = kindIcon(asset.kind);

  if (view === "list") {
    return (
      <button
        type="button"
        onClick={() => onSelect(asset)}
        className={cn(
          "grid w-full grid-cols-[3rem_1fr_6rem_5rem_7rem] items-center gap-3 rounded-lg border px-3 py-2 text-left text-[0.75rem] transition-colors",
          selected
            ? "border-primary bg-primary/5"
            : "border-border hover:bg-muted/50",
        )}
      >
        <div className="relative size-12 overflow-hidden rounded-md bg-muted">
          {asset.kind === "image" ? (
            <Image
              src={asset.thumbnailUrl || asset.url}
              alt={asset.alt || asset.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {Icon ? <Icon className="size-4" /> : null}
            </div>
          )}
        </div>
        <span className="truncate font-medium text-foreground">{asset.title}</span>
        <span className="truncate text-muted-foreground">{asset.kind}</span>
        <span className="text-muted-foreground">{formatBytes(asset.fileSize)}</span>
        <span className="text-muted-foreground">{formatDate(asset.createdAt)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(asset)}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-muted text-left transition-all",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-primary/40 hover:shadow-md",
      )}
    >
      <div className="relative aspect-square">
        {asset.kind === "image" ? (
          <Image
            src={asset.thumbnailUrl || asset.url}
            alt={asset.alt || asset.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, 16vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            {Icon ? <Icon className="size-8" /> : null}
            <span className="text-[0.625rem] uppercase tracking-wide">
              {asset.kind}
            </span>
          </div>
        )}
        {selected ? (
          <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
            <Check className="size-3.5" />
          </span>
        ) : null}
      </div>
      <div className="truncate px-2 py-1.5 text-[0.6875rem] text-muted-foreground">
        {asset.title}
      </div>
    </button>
  );
});

export function AssetManager({
  mode = "page",
  onSelect,
  selectedMediaId = null,
  imagesOnly = false,
  className,
}: AssetManagerProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kind, setKind] = useState<AssetKind | "all">(
    imagesOnly ? "image" : "all",
  );
  const [folderSlug, setFolderSlug] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [folders, setFolders] = useState<AssetFolder[]>([]);
  const [items, setItems] = useState<Asset[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [usages, setUsages] = useState<AssetUsage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [isPending, startTransition] = useTransition();
  const [initialLoading, setInitialLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [titleDraft, setTitleDraft] = useState("");
  const [captionDraft, setCaptionDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(t);
  }, [search]);

  const loadFolders = useCallback(() => {
    startTransition(async () => {
      const result = await listAssetFoldersAction();
      if (result.ok) setFolders(result.data);
    });
  }, []);

  const loadPage = useCallback(
    (modeLoad: "replace" | "append", after: string | null = null) => {
      const requestId = ++requestIdRef.current;
      startTransition(async () => {
        if (modeLoad === "replace") setInitialLoading(true);
        setError(null);
        const result = await listAssetsAction({
          after,
          first: 40,
          search: debouncedSearch || undefined,
          kind: imagesOnly ? "image" : kind,
          folderSlug,
          favoritesOnly,
          recentlyUploaded: recentOnly,
          mimePrefix: imagesOnly ? "image/" : undefined,
        });
        if (requestId !== requestIdRef.current) return;
        if (!result.ok) {
          setError(result.message);
          setInitialLoading(false);
          return;
        }
        setItems((prev) => {
          if (modeLoad === "replace") return result.data.items;
          const seen = new Set(prev.map((i) => i.id));
          const merged = [...prev];
          for (const item of result.data.items) {
            if (!seen.has(item.id)) merged.push(item);
          }
          return merged;
        });
        setHasNext(result.data.pageInfo.hasNextPage);
        setCursor(result.data.pageInfo.endCursor);
        setInitialLoading(false);
      });
    },
    [
      debouncedSearch,
      kind,
      folderSlug,
      favoritesOnly,
      recentOnly,
      imagesOnly,
    ],
  );

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  useEffect(() => {
    const input = folderInputRef.current;
    if (!input) return;
    input.setAttribute("webkitdirectory", "");
    input.setAttribute("directory", "");
  }, []);

  useEffect(() => {
    setItems([]);
    setCursor(null);
    loadPage("replace", null);
  }, [loadPage]);

  useEffect(() => {
    if (!selectedMediaId) return;
    const local = items.find((i) => i.id === selectedMediaId);
    if (local) {
      setSelected(local);
      return;
    }
    startTransition(async () => {
      const result = await getAssetByIdAction(selectedMediaId);
      if (result.ok) setSelected(result.data);
    });
  }, [selectedMediaId, items]);

  useEffect(() => {
    if (!selected) {
      setUsages([]);
      return;
    }
    setAltDraft(selected.alt);
    setTitleDraft(selected.title);
    setCaptionDraft(selected.caption || "");
    startTransition(async () => {
      const result = await listAssetUsagesAction(selected.id);
      if (result.ok) setUsages(result.data);
    });
  }, [selected]);

  useEffect(() => {
    if (!hasNext || isPending) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadPage("append", cursor);
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNext, isPending, cursor, loadPage]);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      for (const file of list) {
        const jobId = `${Date.now()}-${file.name}-${Math.random()}`;
        const previewUrl = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;
        setJobs((prev) => [
          {
            id: jobId,
            name: file.name,
            progress: 10,
            status: "uploading",
            previewUrl,
          },
          ...prev,
        ]);
        try {
          const dataBase64 = await fileToBase64(file);
          setJobs((prev) =>
            prev.map((j) =>
              j.id === jobId ? { ...j, progress: 55 } : j,
            ),
          );
          const result = await uploadAssetAction({
            dataBase64,
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            folderSlug,
          });
          if (!result.ok) throw new Error(result.message);
          setJobs((prev) =>
            prev.map((j) =>
              j.id === jobId ? { ...j, progress: 100, status: "done" } : j,
            ),
          );
          loadPage("replace", null);
        } catch (err) {
          setJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    status: "error",
                    error: err instanceof Error ? err.message : "Upload failed",
                  }
                : j,
            ),
          );
        }
      }
    },
    [folderSlug, loadPage],
  );

  function onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer.files?.length) {
      void uploadFiles(event.dataTransfer.files);
    }
  }

  function onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length) {
      event.preventDefault();
      void uploadFiles(files);
    }
  }

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1200);
  }

  async function saveMetadata() {
    if (!selected) return;
    const result = await updateAssetMetadataAction({
      id: selected.id,
      patch: {
        title: titleDraft,
        alt: altDraft,
        caption: captionDraft,
      },
    });
    if (result.ok) {
      setSelected(result.data);
      setItems((prev) =>
        prev.map((i) => (i.id === result.data.id ? result.data : i)),
      );
    } else {
      setError(result.message);
    }
  }

  async function handleTrash() {
    if (!selected) return;
    if (usages.length > 0) {
      const ok = window.confirm(
        `This asset is used in ${usages.length} place(s). Move to trash anyway?`,
      );
      if (!ok) return;
    }
    const result = await trashAssetAction(selected.id);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSelected(null);
    loadPage("replace", null);
  }

  const filtered = useMemo(() => items, [items]);

  return (
    <div
      ref={dropRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onPaste={onPaste}
      className={cn(
        "flex min-h-0 flex-col bg-surface",
        mode === "page" ? "h-[calc(100vh-8rem)]" : "h-full",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
        <label className="relative min-w-[12rem] flex-1">
          <span className="sr-only">Search assets</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filename, alt, caption…"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-small outline-none ring-ring focus:ring-2"
          />
        </label>

        <select
          value={kind}
          disabled={imagesOnly}
          onChange={(e) => setKind(e.target.value as AssetKind | "all")}
          className="h-9 rounded-lg border border-border bg-background px-2 text-small"
        >
          <option value="all">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="pdf">PDF</option>
          <option value="document">Documents</option>
          <option value="spreadsheet">Spreadsheets</option>
          <option value="presentation">Presentations</option>
          <option value="archive">Archives</option>
        </select>

        <Button
          type="button"
          variant={favoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setFavoritesOnly((v) => !v)}
        >
          <Star className="size-3.5" />
          Favorites
        </Button>
        <Button
          type="button"
          variant={recentOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setRecentOnly((v) => !v)}
        >
          Recent
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-3.5" />
          Upload
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => folderInputRef.current?.click()}
        >
          Folder
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const name = window.prompt("Folder name");
            if (!name) return;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            startTransition(async () => {
              await createAssetFolderAction({ slug, name });
              loadFolders();
            });
          }}
        >
          <FolderPlus className="size-3.5" />
          New Folder
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await syncAssetsFromWordPressAction();
              loadPage("replace", null);
            });
          }}
        >
          <RefreshCw className={cn("size-3.5", isPending && "animate-spin")} />
          Sync
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
          aria-label="Toggle view"
        >
          {view === "grid" ? (
            <List className="size-3.5" />
          ) : (
            <Grid2X2 className="size-3.5" />
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[14rem_minmax(0,1fr)_22rem]">
        {/* Folders */}
        <aside className="hidden min-h-0 overflow-y-auto border-r border-border p-3 md:block">
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Folders
          </p>
          <button
            type="button"
            onClick={() => setFolderSlug(null)}
            className={cn(
              "mb-1 w-full rounded-md px-2 py-1.5 text-left text-small",
              folderSlug === null
                ? "bg-primary/10 font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            All assets
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => setFolderSlug(folder.slug)}
              className={cn(
                "mb-1 w-full rounded-md px-2 py-1.5 text-left text-small",
                folderSlug === folder.slug
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {folder.name}
            </button>
          ))}
          {mode === "page" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-4 w-full justify-start"
              onClick={() => {
                startTransition(async () => {
                  await rebuildAssetUsageIndexAction();
                });
              }}
            >
              Rebuild usage index
            </Button>
          ) : null}
        </aside>

        {/* Grid */}
        <div className="min-h-0 min-w-0 overflow-y-auto p-3 sm:p-4">
          {error ? (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-small text-red-800">
              {error}
            </div>
          ) : null}

          {initialLoading && items.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : null}

          {!initialLoading && filtered.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <p className="font-medium text-foreground">No assets found</p>
              <p className="mt-1 max-w-sm text-small text-muted-foreground">
                Drag & drop files here, paste an image, or use Upload. Files are
                stored in WordPress Media Library.
              </p>
            </div>
          ) : null}

          {filtered.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  : "flex flex-col gap-1"
              }
            >
              {filtered.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  selected={selected?.id === asset.id}
                  view={view}
                  onSelect={setSelected}
                />
              ))}
            </div>
          ) : null}

          <div ref={sentinelRef} className="h-8 w-full" />
          {isPending && items.length > 0 ? (
            <div className="flex justify-center py-3 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
            </div>
          ) : null}
        </div>

        {/* Inspector */}
        <aside className="hidden min-h-0 overflow-y-auto border-l border-border bg-muted/15 p-4 md:block">
          {selected ? (
            <div className="space-y-3">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                {selected.kind === "image" ? (
                  <Image
                    src={selected.url}
                    alt={selected.alt || selected.title}
                    fill
                    className="object-cover"
                    sizes="352px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <FileText className="size-10" />
                  </div>
                )}
              </div>

              <label className="block space-y-1 text-[0.75rem]">
                <span className="text-muted-foreground">Title</span>
                <input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background px-2"
                />
              </label>
              <label className="block space-y-1 text-[0.75rem]">
                <span className="text-muted-foreground">Alt text</span>
                <input
                  value={altDraft}
                  onChange={(e) => setAltDraft(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background px-2"
                />
              </label>
              <label className="block space-y-1 text-[0.75rem]">
                <span className="text-muted-foreground">Caption</span>
                <textarea
                  value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5"
                />
              </label>

              <dl className="space-y-2 text-[0.75rem]">
                <Meta label="WordPress ID" value={String(selected.id)} mono />
                <Meta label="Mime" value={selected.mimeType} />
                <Meta
                  label="Dimensions"
                  value={
                    selected.width && selected.height
                      ? `${selected.width} × ${selected.height}`
                      : "—"
                  }
                />
                <Meta label="Size" value={formatBytes(selected.fileSize)} />
                <Meta label="Uploaded" value={formatDate(selected.createdAt)} />
                <Meta label="Modified" value={formatDate(selected.updatedAt)} />
                <Meta label="URL" value={selected.url} />
              </dl>

              <div className="flex flex-wrap gap-1.5">
                <Button type="button" size="sm" onClick={() => void saveMetadata()}>
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    void setAssetFavoriteAction({
                      mediaId: selected.id,
                      favorite: true,
                    })
                  }
                >
                  <Heart className="size-3.5" />
                  Favorite
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void copyText("url", selected.url)}
                >
                  <Copy className="size-3.5" />
                  {copied === "url" ? "Copied" : "URL"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void copyText("id", String(selected.id))}
                >
                  ID
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const slug = window.prompt(
                      "Move to folder slug",
                      folderSlug || "gallery",
                    );
                    if (!slug) return;
                    void moveAssetToFolderAction({
                      mediaId: selected.id,
                      folderSlug: slug,
                    });
                  }}
                >
                  Move
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => void handleTrash()}
                >
                  <Trash2 className="size-3.5" />
                  Trash
                </Button>
              </div>

              <div>
                <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  Used on
                </p>
                {usages.length === 0 ? (
                  <p className="text-[0.75rem] text-muted-foreground">
                    Not referenced in Studio presentations.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {usages.map((u) => (
                      <li key={`${u.contextId}-${u.fieldPath}`}>
                        {u.editorHref ? (
                          <Link
                            href={u.editorHref}
                            className="text-[0.75rem] text-primary hover:underline"
                          >
                            {u.contextLabel}
                            <span className="text-muted-foreground">
                              {" "}
                              · {u.fieldPath}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-[0.75rem]">
                            {u.contextLabel}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {onSelect ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => onSelect(selected)}
                >
                  Insert asset
                </Button>
              ) : null}
            </div>
          ) : (
            <p className="text-small text-muted-foreground">
              Select an asset to inspect metadata, usage, and actions.
            </p>
          )}

          {jobs.length > 0 ? (
            <div className="mt-6 space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  Upload queue
                </p>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setJobs([])}
                  aria-label="Clear queue"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              {jobs.slice(0, 8).map((job) => (
                <div
                  key={job.id}
                  className="rounded-md border border-border bg-background px-2 py-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[0.6875rem]">
                    <span className="truncate">{job.name}</span>
                    <span className="text-muted-foreground">
                      {job.status === "error"
                        ? "Error"
                        : job.status === "done"
                          ? "Done"
                          : `${job.progress}%`}
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded bg-muted">
                    <div
                      className={cn(
                        "h-full transition-all",
                        job.status === "error" ? "bg-red-500" : "bg-primary",
                      )}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  {job.error ? (
                    <p className="mt-1 text-[0.625rem] text-red-600">
                      {job.error}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("break-all text-foreground", mono && "font-mono")}>
        {value}
      </dd>
    </div>
  );
}

/**
 * Production WordPress Media Browser.
 * Browses / searches / selects WordPress assets — never uploads.
 */

"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getWordPressMediaByIdAction,
  listWordPressImagesAction,
} from "@/lib/experience/actions/mediaActions";
import { matchesMediaSearch } from "@/lib/media/mediaDomain";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/types/wordpress-media";

export type MediaBrowserProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  title?: string;
  selectedMediaId?: number | null;
};

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

function buildWordPressEditUrl(mediaId: number): string {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (endpoint) {
    return `${endpoint.replace(/\/$/, "")}/wp-admin/upload.php?item=${mediaId}`;
  }
  return `#wp-media-${mediaId}`;
}

const ThumbnailCard = memo(function ThumbnailCard({
  asset,
  selected,
  onSelect,
}: {
  asset: MediaAsset;
  selected: boolean;
  onSelect: (asset: MediaAsset) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(asset)}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-muted text-left transition-all [content-visibility:auto] [contain-intrinsic-size:160px]",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-primary/40 hover:shadow-md",
      )}
    >
      <div className="relative aspect-square">
        <Image
          src={asset.thumbnailUrl || asset.url}
          alt={asset.alt || asset.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="160px"
        />
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

export function MediaBrowser({
  open,
  onClose,
  onSelect,
  title = "WordPress Media",
  selectedMediaId = null,
}: MediaBrowserProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [initialLoading, setInitialLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(
    () => items.filter((item) => matchesMediaSearch(item, debouncedSearch)),
    [items, debouncedSearch],
  );

  const loadPage = useCallback(
    (mode: "replace" | "append", after: string | null = null) => {
      const requestId = ++requestIdRef.current;
      startTransition(async () => {
        if (mode === "replace") setInitialLoading(true);
        setError(null);
        const result = await listWordPressImagesAction({
          after,
          first: 40,
        });
        if (requestId !== requestIdRef.current) return;

        if (!result.ok) {
          setError(result.message);
          setInitialLoading(false);
          return;
        }

        setItems((prev) => {
          if (mode === "replace") return result.data.items;
          const seen = new Set(prev.map((item) => item.id));
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
    [],
  );

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setDebouncedSearch("");
    setItems([]);
    setCursor(null);
    setSelected(null);
    setError(null);
    loadPage("replace", null);
  }, [open, loadPage]);

  useEffect(() => {
    if (!open || !selectedMediaId) return;
    const local = items.find((item) => item.id === selectedMediaId);
    if (local) {
      setSelected(local);
      return;
    }
    startTransition(async () => {
      const result = await getWordPressMediaByIdAction(selectedMediaId);
      if (result.ok) setSelected(result.data);
    });
  }, [open, selectedMediaId, items]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Infinite scroll
  useEffect(() => {
    if (!open || !hasNext || isPending) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadPage("append", cursor);
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open, hasNext, isPending, cursor, loadPage]);

  // Keep loading more while searching and no matches yet.
  useEffect(() => {
    if (!open || !debouncedSearch.trim() || !hasNext || isPending) return;
    if (filtered.length >= 12) return;
    loadPage("append", cursor);
  }, [
    open,
    debouncedSearch,
    filtered.length,
    hasNext,
    isPending,
    cursor,
    loadPage,
  ]);

  async function copyUrl() {
    if (!selected?.url) return;
    await navigator.clipboard.writeText(selected.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          className="flex h-[min(92vh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div>
              <h2 className="font-heading text-h4 font-semibold text-foreground">
                {title}
              </h2>
              <p className="text-[0.75rem] text-muted-foreground">
                Browse WordPress Media Library — uploads stay in WordPress.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close media browser"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="flex min-h-0 flex-col border-b border-border lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Search media</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search title, filename, alt, mime…"
                    className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-small outline-none ring-ring focus:ring-2"
                    autoFocus
                  />
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => loadPage("replace", null)}
                >
                  <RefreshCw
                    className={cn("size-3.5", isPending && "animate-spin")}
                  />
                  Refresh
                </Button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                    <div className="flex items-start gap-2 text-red-800">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                      <div>
                        <p className="text-small font-medium">
                          Couldn’t load WordPress media
                        </p>
                        <p className="mt-1 text-[0.75rem]">{error}</p>
                        <Button
                          type="button"
                          size="sm"
                          className="mt-3"
                          onClick={() => loadPage("replace", null)}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {initialLoading && items.length === 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={index}
                        className="aspect-square animate-pulse rounded-xl bg-muted"
                      />
                    ))}
                  </div>
                ) : null}

                {!error && !initialLoading && filtered.length === 0 ? (
                  <div className="flex min-h-48 flex-col items-center justify-center text-center">
                    <p className="font-medium text-foreground">No images found</p>
                    <p className="mt-1 max-w-sm text-small text-muted-foreground">
                      {debouncedSearch
                        ? "Try another search, or load more from WordPress."
                        : "Upload images in WordPress Media Library, then refresh."}
                    </p>
                  </div>
                ) : null}

                {filtered.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {filtered.map((asset) => (
                      <ThumbnailCard
                        key={asset.id}
                        asset={asset}
                        selected={selected?.id === asset.id}
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
            </div>

            <aside className="hidden min-h-0 overflow-y-auto bg-muted/20 p-4 lg:block">
              {selected ? (
                <div className="space-y-3">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={selected.url}
                      alt={selected.alt || selected.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                  <dl className="space-y-2.5 text-[0.75rem]">
                    <Meta label="Title" value={selected.title} />
                    <Meta label="Alt text" value={selected.alt || "—"} />
                    <Meta
                      label="WordPress Media ID"
                      value={String(selected.id)}
                      mono
                    />
                    <Meta
                      label="Dimensions"
                      value={
                        selected.width && selected.height
                          ? `${selected.width} × ${selected.height}`
                          : "—"
                      }
                    />
                    <Meta label="Mime Type" value={selected.mimeType} />
                    <Meta
                      label="Upload Date"
                      value={formatDate(selected.createdAt)}
                    />
                    <Meta
                      label="Modified Date"
                      value={formatDate(selected.updatedAt)}
                    />
                  </dl>
                  <div className="flex flex-col gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyUrl}
                    >
                      <Copy className="size-3.5" />
                      {copied ? "Copied" : "Copy URL"}
                    </Button>
                    <a
                      href={buildWordPressEditUrl(selected.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-3 text-small font-medium text-foreground no-underline hover:bg-muted hover:no-underline"
                    >
                      <ExternalLink className="size-3.5" />
                      Open in WordPress
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-small text-muted-foreground">
                  Select an image to preview details.
                </p>
              )}
            </aside>
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-border px-4 py-3 sm:px-5">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selected}
              onClick={() => {
                if (!selected) return;
                onSelect(selected);
                onClose();
              }}
            >
              Select Image
            </Button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
      <dd
        className={cn(
          "break-words text-foreground",
          mono && "font-mono",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

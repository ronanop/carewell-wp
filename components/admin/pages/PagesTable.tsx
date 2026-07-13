"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import { useAdminToast } from "@/components/admin/AdminToast";
import {
  PresentationStatusBadge,
  WpStatusBadge,
} from "@/components/admin/pages/PresentationStatusBadge";
import { Button } from "@/components/ui/button";
import {
  syncAllWordPressPagesAction,
  syncSelectedWordPressPagesAction,
} from "@/lib/experience/actions/pageActions";
import type { PageListItem } from "@/lib/experience/pages/pageList";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

type FilterStatus =
  | "all"
  | "published"
  | "draft"
  | "configured"
  | "not_configured"
  | "outdated";

type SortKey = "title" | "modified" | "synced";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function PagesTable({ initialPages }: { initialPages: PageListItem[] }) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [isPending, startTransition] = useTransition();
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [sort, setSort] = useState<SortKey>("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = [...initialPages];

    if (q) {
      rows = rows.filter(
        (row) =>
          row.title.toLowerCase().includes(q) ||
          row.uri.toLowerCase().includes(q) ||
          row.slug.toLowerCase().includes(q),
      );
    }

    if (status !== "all") {
      rows = rows.filter((row) => row.badges.includes(status));
    }

    rows.sort((a, b) => {
      let cmp = 0;
      if (sort === "modified") cmp = a.modifiedAt.localeCompare(b.modifiedAt);
      else if (sort === "synced")
        cmp = a.lastSyncedAt.localeCompare(b.lastSyncedAt);
      else cmp = a.title.localeCompare(b.title);
      return order === "desc" ? -cmp : cmp;
    });

    return rows;
  }, [initialPages, search, status, sort, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const allVisibleSelected =
    pageRows.length > 0 && pageRows.every((row) => selected.has(row.id));

  function toggleSort(next: SortKey) {
    if (sort === next) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(next);
      setOrder("asc");
    }
  }

  function toggleSelectAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        pageRows.forEach((row) => next.delete(row.id));
      } else {
        pageRows.forEach((row) => next.add(row.id));
      }
      return next;
    });
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSyncAll() {
    setSyncing(true);
    try {
      const result = await syncAllWordPressPagesAction();
      if (result.ok) {
        toast(result.message, "success");
        startTransition(() => router.refresh());
      } else {
        toast(result.message, "error");
      }
    } finally {
      setSyncing(false);
    }
  }

  async function handleSyncSelected() {
    const ids = initialPages
      .filter((row) => selected.has(row.id))
      .map((row) => row.databaseId);

    if (!ids.length) {
      toast("Select at least one page", "info");
      return;
    }

    setSyncing(true);
    try {
      const result = await syncSelectedWordPressPagesAction(ids);
      if (result.ok) {
        toast(result.message, "success");
        setSelected(new Set());
        startTransition(() => router.refresh());
      } else {
        toast(result.message, "error");
      }
    } finally {
      setSyncing(false);
    }
  }

  function handleRefresh() {
    startTransition(() => router.refresh());
    toast("Page list refreshed", "info");
  }

  const busy = syncing || isPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search pages</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search title, URI, or slug…"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-small outline-none ring-ring focus:ring-2"
            />
          </label>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as FilterStatus);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-background px-3 text-small outline-none ring-ring focus:ring-2"
            aria-label="Filter by presentation status"
          >
            <option value="all">All statuses</option>
            <option value="configured">Configured</option>
            <option value="not_configured">Not configured</option>
            <option value="outdated">Outdated</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={busy}
          >
            <RefreshCw className={cn("size-3.5", busy && "animate-spin")} />
            Refresh
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSyncSelected}
            disabled={busy || selected.size === 0}
          >
            Sync Selected
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSyncAll}
            disabled={busy}
          >
            {syncing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            Sync All
          </Button>
        </div>
      </div>

      {selected.size > 0 ? (
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-small">
          <span className="text-foreground">
            {selected.size} page{selected.size === 1 ? "" : "s"} selected
          </span>
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setSelected(new Set())}
          >
            Clear selection
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {initialPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted">
              <Sparkles className="size-5 text-primary" />
            </div>
            <h3 className="font-heading text-h4 font-semibold text-foreground">
              No WordPress pages yet
            </h3>
            <p className="mt-2 max-w-md text-small text-muted-foreground">
              Sync from WordPress to import page metadata. Article content stays
              in WordPress — only presentation is configured here.
            </p>
            <Button
              type="button"
              className="mt-6"
              onClick={handleSyncAll}
              disabled={busy}
            >
              {syncing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Sync WordPress
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-small text-muted-foreground">
            No pages match your search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead className="border-b border-border bg-muted/40 text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible pages"
                      className="size-4 rounded border-border"
                    />
                  </th>
                  <th className="px-3 py-3">
                    <SortButton
                      label="Title"
                      active={sort === "title"}
                      onClick={() => toggleSort("title")}
                    />
                  </th>
                  <th className="px-3 py-3">URI</th>
                  <th className="px-3 py-3">Template</th>
                  <th className="px-3 py-3">
                    <SortButton
                      label="Modified"
                      active={sort === "modified"}
                      onClick={() => toggleSort("modified")}
                    />
                  </th>
                  <th className="px-3 py-3">Presentation</th>
                  <th className="px-3 py-3">
                    <SortButton
                      label="Last Sync"
                      active={sort === "synced"}
                      onClick={() => toggleSort("synced")}
                    />
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.015 }}
                    className="border-b border-border/70 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Select ${row.title}`}
                        className="size-4 rounded border-border"
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">
                          {row.title}
                        </span>
                        <WpStatusBadge status={row.wpStatus} />
                      </div>
                    </td>
                    <td className="max-w-[14rem] truncate px-3 py-3.5 font-mono text-[0.75rem] text-muted-foreground">
                      {row.uri}
                    </td>
                    <td className="px-3 py-3.5 text-small text-muted-foreground">
                      {row.templateName ?? row.wpTemplate ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-small text-muted-foreground">
                      {formatDate(row.modifiedAt)}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {row.badges.map((badge) => (
                          <PresentationStatusBadge key={badge} badge={badge} />
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-small text-muted-foreground">
                      {formatDate(row.lastSyncedAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/page-studio/${row.id}`}
                          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-[0.75rem] font-medium text-primary-foreground no-underline hover:bg-primary/90 hover:no-underline"
                        >
                          Open Studio
                        </Link>
                        <a
                          href={row.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`View ${row.title} on site`}
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-small text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SortButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 font-medium uppercase tracking-wide",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      <ArrowUpDown className="size-3" />
    </button>
  );
}

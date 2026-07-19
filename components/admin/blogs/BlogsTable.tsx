"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";

import { useAdminToast } from "@/components/admin/AdminToast";
import {
  PresentationStatusBadge,
  WpStatusBadge,
} from "@/components/admin/pages/PresentationStatusBadge";
import { Button } from "@/components/ui/button";
import {
  syncAllWordPressPostsAction,
  syncSelectedWordPressPostsAction,
} from "@/lib/experience/actions/blogActions";
import type { BlogListItem } from "@/lib/experience/services/blogListService";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

type FilterStatus =
  | "all"
  | "published"
  | "draft"
  | "configured"
  | "not_configured"
  | "outdated";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function BlogsTable({ initialBlogs }: { initialBlogs: BlogListItem[] }) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [isPending, startTransition] = useTransition();
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [author, setAuthor] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const authors = useMemo(() => {
    const set = new Set<string>();
    for (const row of initialBlogs) {
      if (row.authorName) set.add(row.authorName);
    }
    return [...set].sort();
  }, [initialBlogs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = [...initialBlogs];

    if (q) {
      rows = rows.filter(
        (row) =>
          row.title.toLowerCase().includes(q) ||
          row.uri.toLowerCase().includes(q) ||
          row.slug.toLowerCase().includes(q) ||
          row.categoryNames.some((c) => c.toLowerCase().includes(q)),
      );
    }

    if (status !== "all") {
      rows = rows.filter((row) => row.badges.includes(status));
    }

    if (author !== "all") {
      rows = rows.filter((row) => row.authorName === author);
    }

    return rows;
  }, [initialBlogs, search, status, author]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function runSync(selectedOnly: boolean) {
    setSyncing(true);
    try {
      const summary = selectedOnly
        ? await syncSelectedWordPressPostsAction(
            pageRows
              .filter((r) => selected.has(r.id))
              .map((r) => r.databaseId),
          )
        : await syncAllWordPressPostsAction();
      toast(
        `Sync complete — added ${summary.added}, updated ${summary.updated}, unchanged ${summary.unchanged}`,
        "success",
      );
      startTransition(() => router.refresh());
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Sync failed",
        "error",
      );
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search blogs…"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as FilterStatus);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="configured">Configured</option>
            <option value="not_configured">Not configured</option>
            <option value="outdated">Outdated</option>
          </select>
          <select
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="all">All authors</option>
            {authors.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            disabled={syncing || isPending}
            onClick={() => runSync(false)}
          >
            {syncing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Sync WordPress
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Author</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Categories</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Modified</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows.map((row) => (
              <tr key={row.id} className="bg-surface hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{row.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{row.uri}</div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {row.authorName ?? "—"}
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                  {row.categoryNames.slice(0, 2).join(", ") || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <WpStatusBadge status={row.wpStatus} />
                    {row.badges.map((badge) => (
                      <PresentationStatusBadge key={badge} badge={badge} />
                    ))}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {formatDate(row.modifiedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/blog-studio/${row.id}`}
                      className={cn(
                        "rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
                      )}
                    >
                      Edit
                    </Link>
                    <a
                      href={row.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
                      aria-label="Preview"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {!pageRows.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No blogs synced yet. Click Sync WordPress to import post metadata.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages} · {filtered.length} posts
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

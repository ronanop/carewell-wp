"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Search } from "lucide-react";

import {
  PresentationStatusBadge,
} from "@/components/admin/pages/PresentationStatusBadge";
import type { StaticPageListItem } from "@/types/static-page";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | string;

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function statusFilterValue(
  status: StaticPageListItem["status"],
): "published" | "draft" | "not_configured" {
  if (status === "PUBLISHED") return "published";
  if (status === "DRAFT") return "draft";
  return "not_configured";
}

export function StaticPagesTable({
  initialPages,
}: {
  initialPages: StaticPageListItem[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<"all" | "published" | "draft" | "not_configured">(
    "all",
  );

  const categories = useMemo(() => {
    return Array.from(new Set(initialPages.map((row) => row.category))).sort();
  }, [initialPages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialPages.filter((row) => {
      if (q) {
        const hay =
          `${row.title} ${row.path} ${row.slug} ${row.description} ${row.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category !== "all" && row.category !== category) return false;
      if (status !== "all" && statusFilterValue(row.status) !== status) {
        return false;
      }
      return true;
    });
  }, [initialPages, search, status, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[16rem] flex-1">
          <span className="sr-only">Search static pages</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, route, slug…"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-small outline-none ring-ring focus:ring-2"
          />
        </label>
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as typeof status)
          }
          className="h-10 rounded-lg border border-border bg-background px-3 text-small"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="not_configured">Not configured</option>
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 rounded-lg border border-border bg-background px-3 text-small"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-small">
          <thead className="border-b border-border bg-muted/40 text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last modified</th>
              <th className="px-4 py-3 font-medium">Sections</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.slug}
                className="border-b border-border/70 last:border-0"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{row.title}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    {row.description}
                  </p>
                </td>
                <td className="px-4 py-3 font-mono text-[0.75rem] text-muted-foreground">
                  {row.path}
                </td>
                <td className="px-4 py-3">
                  <PresentationStatusBadge
                    badge={statusFilterValue(row.status)}
                  />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(row.updatedAt)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.sectionCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={row.path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-[0.75rem] font-medium text-foreground no-underline hover:bg-muted hover:no-underline"
                    >
                      <ExternalLink className="size-3.5" />
                      Preview
                    </Link>
                    <Link
                      href={`/admin/static-pages/${row.slug}`}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[0.75rem] font-medium text-primary-foreground no-underline hover:opacity-90 hover:no-underline",
                        !row.pageId && "pointer-events-none opacity-50",
                      )}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No static pages match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

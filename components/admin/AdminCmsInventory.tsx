"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ExternalLink, Pencil, Search } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type AdminCmsRow = {
  id: string;
  title: string;
  slug: string;
  uri: string | null;
  href: string;
  editUrl: string;
  meta?: string | null;
};

type AdminCmsInventoryProps = {
  rows: AdminCmsRow[];
  emptyLabel: string;
  searchPlaceholder?: string;
};

export function AdminCmsInventory({
  rows,
  emptyLabel,
  searchPlaceholder = "Search title, slug, or URI…",
}: AdminCmsInventoryProps) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    if (!deferred) return rows;
    return rows.filter((row) => {
      const haystack = [row.title, row.slug, row.uri || "", row.href]
        .join(" ")
        .toLowerCase();
      return haystack.includes(deferred);
    });
  }, [deferred, rows]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative block min-w-[14rem] flex-1 max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none ring-primary/30 placeholder:text-slate-400 focus:ring-2"
          />
        </label>
        <p className="text-sm text-slate-500">
          {filtered.length === rows.length
            ? `${rows.length} total`
            : `${filtered.length} of ${rows.length}`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          {rows.length === 0 ? emptyLabel : "No matches for that search."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="max-h-[min(70vh,42rem)] overflow-auto">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-[38%] px-3 py-2.5 font-semibold">Title</th>
                  <th className="w-[22%] px-3 py-2.5 font-semibold">Slug</th>
                  <th className="w-[28%] px-3 py-2.5 font-semibold">Path</th>
                  <th className="w-[12%] px-3 py-2.5 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => {
                  const path = row.uri || row.href;
                  return (
                    <tr
                      key={row.id}
                      className="h-10 hover:bg-slate-50/80"
                    >
                      <td className="px-3 py-1.5">
                        <p
                          className="truncate font-medium text-slate-900"
                          title={row.title}
                        >
                          {row.title}
                        </p>
                        {row.meta ? (
                          <p className="truncate text-[0.65rem] leading-tight text-slate-400">
                            {row.meta}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-3 py-1.5">
                        <code
                          className="block truncate rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700"
                          title={row.slug || undefined}
                        >
                          {row.slug || "—"}
                        </code>
                      </td>
                      <td className="px-3 py-1.5">
                        <Link
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={path}
                          className="flex min-w-0 items-center gap-1 text-primary no-underline hover:underline"
                        >
                          <span className="truncate font-mono text-xs">
                            {path}
                          </span>
                          <ExternalLink
                            className="size-3 shrink-0 opacity-60"
                            aria-hidden
                          />
                        </Link>
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={row.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open live page"
                            className={cn(
                              "inline-flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 no-underline hover:bg-slate-50 hover:text-primary hover:no-underline",
                            )}
                          >
                            <ExternalLink className="size-3.5" aria-hidden />
                            <span className="sr-only">View</span>
                          </Link>
                          <a
                            href={row.editUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Edit in Sanity"
                            className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 no-underline hover:bg-slate-50 hover:text-primary hover:no-underline"
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            <span className="sr-only">Edit</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

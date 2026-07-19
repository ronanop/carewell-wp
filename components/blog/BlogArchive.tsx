"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BlogCard } from "@/components/blog/BlogChrome";
import type { BlogCategory, BlogPostSummary } from "@/types/blog";

export type BlogSortKey = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "category";

const PAGE_SIZE = 8;

function primaryCategoryName(post: BlogPostSummary): string {
  return post.categories[0]?.name?.toLowerCase() ?? "";
}

function filterAndSortPosts(
  posts: BlogPostSummary[],
  query: string,
  categorySlug: string,
  sort: BlogSortKey,
): BlogPostSummary[] {
  const q = query.trim().toLowerCase();

  let next = posts.filter((post) => {
    if (categorySlug && !post.categories.some((c) => c.slug === categorySlug)) {
      return false;
    }
    if (!q) return true;
    const hay = [
      post.title,
      post.excerpt ?? "",
      ...post.categories.map((c) => c.name),
      ...post.tags.map((t) => t.name),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });

  next = [...next].sort((a, b) => {
    switch (sort) {
      case "name-asc":
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      case "name-desc":
        return b.title.localeCompare(a.title, undefined, { sensitivity: "base" });
      case "category": {
        const byCat = primaryCategoryName(a).localeCompare(primaryCategoryName(b));
        if (byCat !== 0) return byCat;
        return (b.date ?? "").localeCompare(a.date ?? "");
      }
      case "date-asc":
        return (a.date ?? "").localeCompare(b.date ?? "");
      case "date-desc":
      default:
        return (b.date ?? "").localeCompare(a.date ?? "");
    }
  });

  return next;
}

const controlClass =
  "h-10 w-full rounded-lg border border-border/80 bg-background/90 px-3 text-sm outline-none focus:border-primary";

export function BlogArchive({
  posts,
  categories,
}: {
  posts: BlogPostSummary[];
  categories: BlogCategory[];
}) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [sort, setSort] = useState<BlogSortKey>("date-desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () => filterAndSortPosts(posts, query, categorySlug, sort),
    [posts, query, categorySlug, sort],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, categorySlug, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, filtered.length, visible.length]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-primary/[0.03]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Care Well Journal
              </p>
              <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                All blogs
              </h1>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                Evidence-led articles on hair, aesthetics, regenerative medicine,
                and wellness.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-sm">
                <span className="sr-only">Search</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles…"
                  className={controlClass}
                  aria-label="Search blogs"
                />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="text-sm">
                  <span className="sr-only">Category</span>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className={controlClass}
                    aria-label="Filter by category"
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  <span className="sr-only">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as BlogSortKey)}
                    className={controlClass}
                    aria-label="Sort blogs"
                  >
                    <option value="date-desc">Newest</option>
                    <option value="date-asc">Oldest</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="category">Category</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Showing {visible.length} of {filtered.length} article
          {filtered.length === 1 ? "" : "s"}
          {posts.length !== filtered.length
            ? ` (from ${posts.length} total)`
            : null}
        </p>

        {visible.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {visible.map((post) => (
              <BlogCard key={post.id} post={post} imageFit="contain" />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No articles match your search. Try another keyword or category.
          </p>
        )}

        {hasMore ? (
          <div ref={sentinelRef} className="flex justify-center py-10" aria-hidden>
            <span className="text-sm text-muted-foreground">Loading more…</span>
          </div>
        ) : filtered.length > 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            You’ve reached the end of the list.
          </p>
        ) : null}
      </div>
    </>
  );
}

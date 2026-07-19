"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import { EditorialHero } from "@/components/blog/EditorialHero";
import type { ArticleTocItem } from "@/types/article-ast";
import type { BlogDocument } from "@/types/blog-document";
import type { BlogPostSummary } from "@/types/blog";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export { BlogBreadcrumb, BlogShareBar } from "@/components/blog/BlogMeta";

export function BlogHero({ doc }: { doc: BlogDocument }) {
  return <EditorialHero doc={doc} />;
}

export function BlogTableOfContents({
  items,
  className,
  searchable = false,
}: {
  items: ArticleTocItem[];
  className?: string;
  searchable?: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  const filtered = query.trim()
    ? items.filter((item) =>
        item.text.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : items;

  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === activeId),
  );
  const progress = items.length
    ? Math.round(((activeIndex + 1) / items.length) * 100)
    : 0;

  return (
    <nav
      className={cn(
        "rounded-2xl border border-border bg-surface/90 p-4 backdrop-blur",
        className,
      )}
      aria-label="Table of contents"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>
      <p className="mt-1.5 text-[0.6875rem] text-muted-foreground">
        {progress}% through sections
      </p>

      {open ? (
        <>
          {searchable ? (
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headings…"
              className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
              aria-label="Search table of contents"
            />
          ) : null}
          <ul className="mt-3 max-h-[50vh] space-y-1 overflow-y-auto text-sm">
            {filtered.map((item) => (
              <li key={item.id} style={{ paddingLeft: (item.level - 2) * 12 }}>
                <a
                  href={`#${item.id}`}
                  onClick={() =>
                    emitEditorialEvent({
                      type: "toc_navigated",
                      anchorId: item.id,
                    })
                  }
                  className={cn(
                    "block rounded-md px-2 py-1.5 transition",
                    activeId === item.id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </nav>
  );
}



export function BlogAuthorBox({
  author,
  articlesCount,
}: {
  author: NonNullable<BlogDocument["author"]>;
  articlesCount?: number | null;
}) {
  return (
    <section className="mt-12 flex flex-col gap-5 rounded-2xl border border-border bg-gradient-to-br from-surface to-muted/30 p-6 sm:flex-row">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-heading text-2xl font-semibold text-primary">
            {author.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Written by
        </p>
        <h2 className="mt-1 font-heading text-xl font-semibold">{author.name}</h2>
        {typeof articlesCount === "number" ? (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {articlesCount} articles
          </p>
        ) : null}
        {author.description ? (
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {author.description}
          </p>
        ) : null}
        <Link
          href="/about/dr-sandeep-bhasin/"
          className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          View profile
        </Link>
      </div>
    </section>
  );
}

export function BlogTags({ tags }: { tags: BlogDocument["tags"] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={tag.uri}
          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground/75 transition hover:border-primary/40 hover:text-primary"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}

export function BlogPrevNext({
  previous,
  next,
}: {
  previous: BlogDocument["previous"];
  next: BlogDocument["next"];
}) {
  if (!previous && !next) return null;
  return (
    <nav className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Post navigation">
      {previous ? (
        <Link
          href={previous.uri}
          className="group rounded-2xl border border-border bg-surface p-4 transition hover:border-primary/30"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Previous</p>
          <p className="mt-2 font-heading font-semibold group-hover:text-primary">
            {previous.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {previous.readingTimeMinutes} min read
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.uri}
          className="group rounded-2xl border border-border bg-surface p-4 text-right transition hover:border-primary/30"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Next</p>
          <p className="mt-2 font-heading font-semibold group-hover:text-primary">
            {next.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {next.readingTimeMinutes} min read
          </p>
        </Link>
      ) : null}
    </nav>
  );
}

export function BlogRelatedPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-14">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        Related articles
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export function BlogCard({
  post,
  featured = false,
  imageFit = "cover",
}: {
  post: BlogPostSummary;
  featured?: boolean;
  /** Use `contain` for text-heavy thumbnails so copy is not cropped. */
  imageFit?: "cover" | "contain";
}) {
  return (
    <article
      className={cn(
        "cw-card group flex flex-col overflow-hidden",
        featured && "sm:col-span-2 sm:grid sm:grid-cols-2",
      )}
    >
      <Link
        href={post.uri}
        className={cn(
          "relative block overflow-hidden",
          imageFit === "contain"
            ? "aspect-[16/10] bg-muted/60"
            : "aspect-[16/10] bg-muted",
        )}
      >
        {post.featuredImage?.sourceUrl ? (
          <Image
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.altText || post.title}
            fill
            className={cn(
              "transition duration-500 group-hover:scale-[var(--motion-scale-hover)]",
              imageFit === "contain"
                ? "object-contain object-center p-1"
                : "object-cover",
            )}
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 50vw"
            }
          />
        ) : (
          <div className="flex size-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {post.title}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.categories[0] ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {post.categories[0].name}
          </p>
        ) : null}
        <h3 className={cn("mt-2 font-heading font-semibold leading-snug", featured ? "text-2xl" : "text-lg")}>
          <Link href={post.uri} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        ) : null}
        <p className="mt-auto pt-4 text-xs text-muted-foreground">
          {post.readingTimeMinutes} min read
          {post.date
            ? ` · ${formatDate(post.date)}`
            : null}
        </p>
      </div>
    </article>
  );
}

export function BlogComments({
  comments,
}: {
  comments: BlogDocument["comments"];
}) {
  if (!comments.length) {
    return (
      <section className="mt-12 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Comments are closed or none yet. Join the conversation on our consultation line.
      </section>
    );
  }

  return (
    <section className="mt-12" aria-label="Comments">
      <h2 className="font-heading text-xl font-semibold">Comments</h2>
      <ul className="mt-4 space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </section>
  );
}

function CommentItem({
  comment,
  depth = 0,
}: {
  comment: BlogDocument["comments"][number];
  depth?: number;
}) {
  return (
    <li className={cn("rounded-xl border border-border bg-surface p-4", depth > 0 && "ml-6")}>
      <p className="text-sm font-medium">{comment.authorName}</p>
      {comment.date ? (
        <time className="text-xs text-muted-foreground" dateTime={comment.date}>
          {formatDate(comment.date)}
        </time>
      ) : null}
      <div
        className="mt-2 text-sm leading-relaxed text-foreground/85"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      {comment.replies.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

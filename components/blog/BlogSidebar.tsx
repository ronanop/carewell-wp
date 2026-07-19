"use client";

import Link from "next/link";

import { BlogTableOfContents } from "@/components/blog/BlogChrome";
import {
  ConsultationSidebarCard,
} from "@/components/leads/ConsultationSidebar";
import { cn } from "@/lib/utils";
import type { BlogDocument } from "@/types/blog-document";
import type { BlogCategory, BlogPostSummary } from "@/types/blog";

export function BlogSidebar({
  doc,
  categories,
  className,
  /** When true, consultation card edge-fills the sticky shell (service pages). */
  fillConsultation = false,
}: {
  doc: BlogDocument;
  categories: BlogCategory[];
  className?: string;
  fillConsultation?: boolean;
}) {
  const widgets = [...doc.sidebar.widgets]
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order);

  const consultation = doc.chrome?.consultation ?? null;
  const consultationOnly =
    fillConsultation &&
    widgets.length === 1 &&
    widgets[0]?.id === "consultation";

  return (
    <aside
      className={cn(
        "space-y-6 lg:sticky lg:self-start",
        // Service consultation-only: sit flush under navbar (h-[4.75rem]).
        // Blog sidebars keep a comfortable gap below the sticky header.
        consultationOnly ? "lg:top-[4.75rem]" : "lg:top-24",
        consultationOnly
          ? "lg:overflow-hidden lg:rounded-[var(--radius-3xl)] lg:border lg:border-border/50 lg:bg-surface-glass lg:p-0 lg:shadow-glass lg:backdrop-blur-md"
          : "lg:rounded-[var(--radius-3xl)] lg:border lg:border-border/50 lg:bg-surface-glass lg:p-4 lg:shadow-glass lg:backdrop-blur-md",
        className,
      )}
    >
      {widgets.map((widget) => {
        switch (widget.id) {
          case "progress":
            return (
              <ReadingProgressCard
                key="progress"
                minutes={doc.hero.readingTimeMinutes}
              />
            );
          case "toc":
            return (
              <BlogTableOfContents
                key="toc"
                items={doc.toc}
                searchable
                className="hidden lg:block"
              />
            );
          case "consultation":
            return consultation ? (
              <div
                key="consultation"
                data-lead-blog-url={doc.leadContext.blogUrl}
                className={cn(consultationOnly && "h-full w-full")}
              >
                <ConsultationSidebarCard
                  chrome={consultation}
                  compactTop={consultationOnly}
                  className={
                    consultationOnly
                      ? "h-full w-full rounded-none border-0 shadow-none backdrop-blur-none"
                      : undefined
                  }
                />
              </div>
            ) : (
              <BlogCtaCard
                key="consultation"
                title="Book a consultation"
                body="Speak with our clinical team about personalised treatment options."
                href="/contact/"
                cta="Book now"
              />
            );
          case "doctor":
            return null;
          case "categories":
            return (
              <SidebarList
                key="categories"
                title="Categories"
                items={categories.slice(0, 10).map((c) => ({
                  label: `${c.name} (${c.count})`,
                  href: c.uri,
                }))}
              />
            );
          case "popular":
          case "trending":
            return (
              <PostListWidget
                key={widget.id}
                title={widget.id === "popular" ? "Popular" : "Trending"}
                posts={doc.popular}
              />
            );
          case "latest":
            return (
              <PostListWidget key="latest" title="Latest" posts={doc.latest} />
            );
          case "newsletter":
            return (
              <BlogCtaCard
                key="newsletter"
                title="Stay informed"
                body="Clinical insights on hair, aesthetics, and wellness — no spam."
                href="/contact/"
                cta="Get updates"
              />
            );
          case "whatsapp":
            return (
              <BlogCtaCard
                key="whatsapp"
                title="WhatsApp us"
                body="Quick questions? Message our care team on WhatsApp."
                href="https://wa.me/919811003148"
                cta="Chat now"
                external
              />
            );
          case "appointment":
            return (
              <BlogCtaCard
                key="appointment"
                title="Book appointment"
                body="Reserve a clinic visit at Care Well Medical Centre, South Delhi."
                href="/contact/"
                cta="Book appointment"
              />
            );
          case "search":
            return (
              <form
                key="search"
                action="/blogs"
                method="get"
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <label htmlFor="blog-search" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Search
                </label>
                <input
                  id="blog-search"
                  name="q"
                  type="search"
                  placeholder="Search articles…"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </form>
            );
          default:
            return null;
        }
      })}
    </aside>
  );
}

function ReadingProgressCard({ minutes }: { minutes: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Reading
      </p>
      <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
        {minutes}
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          min
        </span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Estimated time · progress tracked in the top bar
      </p>
    </div>
  );
}

function SidebarList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string }>;
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-foreground/80 transition hover:text-primary"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostListWidget({
  title,
  posts,
}: {
  title: string;
  posts: BlogPostSummary[];
}) {
  if (!posts.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="mt-3 space-y-3">
        {posts.slice(0, 5).map((post) => (
          <li key={post.id}>
            <Link
              href={post.uri}
              className="text-sm font-medium leading-snug text-foreground/90 hover:text-primary"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlogCtaCard({
  title,
  body,
  href,
  cta,
  external,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  external?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
      <p className="font-heading text-base font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {cta}
        </a>
      ) : (
        <Link
          href={href}
          className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

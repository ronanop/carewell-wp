import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { BlogDoctorCard } from "@/components/blog/BlogDoctorCard";
import { BlogFaqAccordion } from "@/components/blog/BlogFaqAccordion";
import { BlogNextPosts } from "@/components/blog/BlogNextPosts";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { SanityPortableText } from "@/components/sanity/SanityPortableText";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveBlogSectionOrder,
  type BlogSectionKey,
} from "@/lib/blog/pageBuilder";
import { transformBlogHtmlEmbeds } from "@/lib/blog/youtubeEmbed";
import {
  stripInlineFaqFromHtml,
  stripInlineFaqFromPortableText,
} from "@/lib/blog/stripInlineFaqs";
import { urlFor } from "@/lib/sanity/client";
import type { SanityPostCard, SanityPostDoc } from "@/lib/sanity/post";
import {
  extractPortableTextToc,
  tocHeadingIdMap,
} from "@/lib/sanity/portableTextToc";
import { cn } from "@/lib/utils";

function formatDate(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Prefer splitting before a section heading near the midpoint. */
function splitBodyAtSection(
  body: unknown[],
): { before: unknown[]; after: unknown[] } {
  if (body.length < 6) {
    return { before: body, after: [] };
  }

  const mid = Math.floor(body.length / 2);
  const isHeading = (node: unknown) => {
    const block = node as { _type?: string; style?: string };
    return (
      block._type === "block" &&
      (block.style === "h2" || block.style === "h3")
    );
  };

  let splitAt = -1;
  for (let i = mid; i < body.length - 1; i++) {
    if (isHeading(body[i])) {
      splitAt = i;
      break;
    }
  }
  if (splitAt < 0) {
    for (let i = mid; i >= Math.floor(body.length * 0.25); i--) {
      if (isHeading(body[i])) {
        splitAt = i;
        break;
      }
    }
  }
  if (splitAt < 0) splitAt = mid;

  return {
    before: body.slice(0, splitAt),
    after: body.slice(splitAt),
  };
}

function MidArticleCta({
  headline,
  buttonLabel,
}: {
  headline: string;
  buttonLabel: string;
}) {
  return (
    <aside className="my-12 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-surface to-accent/10 px-5 py-7 sm:px-8 sm:py-8">
      <p className="text-label uppercase tracking-wide text-primary">
        Free consultation
      </p>
      <p className="mt-2 max-w-xl font-heading text-lg font-semibold leading-snug text-[#0A2540] sm:text-xl">
        {headline}
      </p>
      <Link
        href="/contact/"
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-5 inline-flex h-11 items-center gap-2 no-underline hover:no-underline",
        )}
      >
        {buttonLabel}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </aside>
  );
}

type BlogRenderContext = {
  post: SanityPostDoc;
  nextPosts: SanityPostCard[];
  order: BlogSectionKey[];
  body: unknown[];
  tocItems: ReturnType<typeof extractPortableTextToc>;
  headingIds: Record<string, string>;
  authorName: string;
  authorRole: string;
  published: string | null;
  hero: string | null;
  category?: string;
  ctaEnabled: boolean;
  midHeadline: string;
  midButton: string;
  /** When midCta is in the builder, body injects it mid-article and skips the standalone slot. */
  injectMidInBody: boolean;
  midConsumed: { current: boolean };
};

function renderBlogSection(
  key: BlogSectionKey,
  ctx: BlogRenderContext,
): ReactNode {
  const {
    post,
    nextPosts,
    body,
    tocItems,
    headingIds,
    authorName,
    authorRole,
    published,
    hero,
    category,
    ctaEnabled,
    midHeadline,
    midButton,
    injectMidInBody,
    midConsumed,
  } = ctx;

  switch (key) {
    case "hero": {
      return (
        <header key={key}>
          {hero ? (
            <div className="overflow-hidden rounded-sm border border-border/40 bg-muted">
              <Image
                src={hero}
                alt={post.mainImage?.alt || post.title}
                width={1400}
                height={700}
                className="h-auto w-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
              />
            </div>
          ) : null}

          {category ? (
            <p
              className={cn(
                "text-[0.8125rem] font-medium tracking-wide text-muted-foreground",
                hero ? "mt-5 sm:mt-6" : "mt-0",
              )}
            >
              {category}
            </p>
          ) : null}

          <h1
            className={cn(
              "font-heading text-[1.75rem] font-bold leading-[1.2] tracking-tight text-[#1a1a1a] text-balance sm:text-[2.125rem] sm:leading-[1.18]",
              category ? "mt-2" : hero ? "mt-5 sm:mt-6" : "mt-0",
            )}
          >
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted-foreground">
            <span className="font-medium text-foreground/80">{authorName}</span>
            {published ? (
              <>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <time dateTime={post.publishedAt || undefined}>{published}</time>
              </>
            ) : null}
            {post.readTimeMinutes ? (
              <>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <span>{post.readTimeMinutes} min read</span>
              </>
            ) : null}
          </div>
        </header>
      );
    }
    case "toc":
      return <BlogTableOfContents key={key} items={tocItems} />;
    case "body": {
      if (body.length > 0) {
        const shouldSplit = injectMidInBody && ctaEnabled;
        if (shouldSplit) {
          const { before, after } = splitBodyAtSection(body);
          const showMid = after.length > 0;
          if (showMid) midConsumed.current = true;
          return (
            <div key={key}>
              {before.length > 0 ? (
                <SanityPortableText
                  value={before}
                  headingIds={headingIds}
                  variant="blog"
                />
              ) : null}
              {showMid ? (
                <MidArticleCta headline={midHeadline} buttonLabel={midButton} />
              ) : null}
              {after.length > 0 ? (
                <SanityPortableText
                  value={after}
                  headingIds={headingIds}
                  variant="blog"
                />
              ) : null}
            </div>
          );
        }
        return (
          <SanityPortableText
            key={key}
            value={body}
            headingIds={headingIds}
            variant="blog"
          />
        );
      }
      if (post.rawHtml) {
        return (
          <div
            key={key}
            className="blog-prose"
            dangerouslySetInnerHTML={{
              __html: transformBlogHtmlEmbeds(
                stripInlineFaqFromHtml(post.rawHtml),
              ),
            }}
          />
        );
      }
      return (
        <p key={key} className="text-muted-foreground">
          No article content yet.
        </p>
      );
    }
    case "midCta": {
      if (midConsumed.current) return null;
      if (!ctaEnabled) return null;
      midConsumed.current = true;
      return (
        <MidArticleCta
          key={key}
          headline={midHeadline}
          buttonLabel={midButton}
        />
      );
    }
    case "endCta": {
      if (!ctaEnabled) return null;
      return (
        <MidArticleCta
          key={key}
          headline="Ready to discuss your treatment options?"
          buttonLabel="Book free consultation"
        />
      );
    }
    case "doctor":
      return (
        <BlogDoctorCard
          key={key}
          authorName={authorName}
          authorRole={authorRole}
        />
      );
    case "faq":
      return <BlogFaqAccordion key={key} />;
    case "nextPosts":
      return <BlogNextPosts key={key} posts={nextPosts} />;
    default:
      return null;
  }
}

/** Sections that sit inside the main article column (beside the sidebar). */
const MAIN_COLUMN_KEYS = new Set<BlogSectionKey>([
  "hero",
  "toc",
  "body",
  "midCta",
  "endCta",
  "doctor",
]);

/** Full-bleed sections below the article grid. */
const BELOW_ARTICLE_KEYS = new Set<BlogSectionKey>(["faq", "nextPosts"]);

export function BlogPageBuilderMainColumn({
  post,
  nextPosts = [],
}: {
  post: SanityPostDoc;
  nextPosts?: SanityPostCard[];
}) {
  const order = resolveBlogSectionOrder(post.pageBuilder);
  const body = stripInlineFaqFromPortableText(
    Array.isArray(post.body) ? post.body : [],
  );
  const tocItems = extractPortableTextToc(body);
  const headingIds = tocHeadingIdMap(tocItems);
  const authorName = post.authorName || "Dr. Sandeep Bhasin";
  const authorRole = post.authorRole || "Cosmetic & Plastic Surgeon";
  const published = formatDate(post.publishedAt);
  const hero = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1400).height(700).fit("crop").url()
    : null;
  const category = post.categories?.[0];
  const cta = post.midArticleCta;
  const ctaEnabled = cta?.enabled !== false;
  const midHeadline =
    cta?.headline || "Have questions? Book a free 15-min consultation";
  const midButton = cta?.buttonLabel || "Book free consultation";
  const injectMidInBody = order.includes("midCta") && order.includes("body");
  const midConsumed = { current: false };

  const ctx: BlogRenderContext = {
    post,
    nextPosts,
    order,
    body,
    tocItems,
    headingIds,
    authorName,
    authorRole,
    published,
    hero,
    category: category || undefined,
    ctaEnabled,
    midHeadline,
    midButton,
    injectMidInBody,
    midConsumed,
  };

  const mainKeys = order.filter((k) => MAIN_COLUMN_KEYS.has(k));

  return (
    <>
      {mainKeys.map((key, index) => {
        const node = renderBlogSection(key, ctx);
        if (!node) return null;
        const isFirst = index === 0;
        const afterHero = !isFirst && mainKeys[0] === "hero" && index === 1;
        return (
          <div
            key={key}
            className={cn(
              key !== "hero" && isFirst && "mt-8 sm:mt-10",
              afterHero && "mt-8 sm:mt-10",
            )}
          >
            {node}
          </div>
        );
      })}
    </>
  );
}

export function BlogPageBuilderBelowArticle({
  post,
  nextPosts = [],
}: {
  post: SanityPostDoc;
  nextPosts?: SanityPostCard[];
}) {
  const order = resolveBlogSectionOrder(post.pageBuilder);
  const belowKeys = order.filter((k) => BELOW_ARTICLE_KEYS.has(k));
  const midConsumed = { current: true };
  const ctx: BlogRenderContext = {
    post,
    nextPosts,
    order,
    body: [],
    tocItems: [],
    headingIds: {},
    authorName: post.authorName || "Dr. Sandeep Bhasin",
    authorRole: post.authorRole || "Cosmetic & Plastic Surgeon",
    published: null,
    hero: null,
    ctaEnabled: post.midArticleCta?.enabled !== false,
    midHeadline: "",
    midButton: "",
    injectMidInBody: false,
    midConsumed,
  };

  return <>{belowKeys.map((key) => renderBlogSection(key, ctx))}</>;
}

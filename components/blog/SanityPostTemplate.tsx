import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { BlogDoctorCard } from "@/components/blog/BlogDoctorCard";
import { BlogFaqAccordion } from "@/components/blog/BlogFaqAccordion";
import { BlogNextPosts } from "@/components/blog/BlogNextPosts";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { SanityPortableText } from "@/components/sanity/SanityPortableText";
import { buttonVariants } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/client";
import {
  postPublicPath,
  type SanityPostCard,
  type SanityPostDoc,
} from "@/lib/sanity/post";
import {
  extractPortableTextToc,
  tocHeadingIdMap,
} from "@/lib/sanity/portableTextToc";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/constants";
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

export function buildSanityPostMetadata(post: SanityPostDoc): Metadata {
  const title = post.seo?.title || `${post.title} | ${SITE_NAME}`;
  const description =
    post.seo?.description ||
    post.excerpt ||
    `${post.title} — Care Well Medical Centre insights.`;
  return {
    title,
    description,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
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

function PostCard({ post }: { post: SanityPostCard }) {
  const href = postPublicPath(post);
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(675).fit("crop").url()
    : null;
  const date = formatDate(post.publishedAt);
  const excerpt =
    post.excerpt?.trim() ||
    `Doctor-led guidance on ${post.title}, including what to expect and what to discuss with your doctor.`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-surface transition-colors hover:border-primary/25">
      <Link
        href={href}
        className="flex h-full flex-col no-underline hover:no-underline"
      >
        {imageUrl ? (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-secondary via-surface to-primary/5" />
        )}
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          {post.categories?.[0] ? (
            <p className="text-label uppercase text-accent">
              {post.categories[0]}
            </p>
          ) : null}
          <h2 className="mt-2 font-heading text-[1.0625rem] font-semibold leading-snug text-[#0A2540] transition-colors group-hover:text-primary sm:text-h4">
            {post.title}
          </h2>
          <p className="mt-2 min-h-[4.75rem] line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-slate-600 sm:min-h-[5.25rem] sm:text-[1.05rem]">
            {excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted-foreground">
            {date ? (
              <time dateTime={post.publishedAt || undefined}>{date}</time>
            ) : null}
            {post.readTimeMinutes ? (
              <span>{post.readTimeMinutes} min read</span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function SanityBlogListing({
  posts,
  searchQuery = "",
}: {
  posts: SanityPostCard[];
  searchQuery?: string;
}) {
  const q = searchQuery.trim();

  return (
    <>
      <NavbarPlaceholder />
      <main className="bg-background">
        <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-background">
          <div className="container-content section-padding">
            <p className="text-label uppercase text-accent">From our clinic</p>
            <h1 className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#0A2540] sm:text-h1">
              Blog
            </h1>
            <p className="mt-3 max-w-2xl text-[1.2rem] font-medium leading-relaxed text-slate-700 sm:text-[1.35rem]">
              Educational articles to help you make informed decisions about
              hair, skin, and cosmetic care.
            </p>
            {q ? (
              <p className="mt-4 text-small text-muted-foreground">
                Showing results for{" "}
                <span className="font-medium text-foreground">“{q}”</span>
                {" · "}
                <Link href="/blogs/" className="text-primary hover:underline">
                  Clear search
                </Link>
              </p>
            ) : null}
          </div>
        </section>

        <section className="container-content section-padding">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">
              {q
                ? `No articles matched “${q}”.`
                : "No articles published yet."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
        <BlogFaqAccordion />
      </main>
      <FooterPlaceholder />
    </>
  );
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

export function SanityPostTemplate({
  post,
  nextPosts = [],
}: {
  post: SanityPostDoc;
  /** Other articles to show after the doctor card (related + latest). */
  nextPosts?: SanityPostCard[];
}) {
  const path = postPublicPath(post);
  const published = formatDate(post.publishedAt);
  const hero = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1400).height(700).fit("crop").url()
    : null;
  const category = post.categories?.[0];
  const cta = post.midArticleCta;
  const showCta = cta?.enabled !== false;
  const authorName = post.authorName || "Dr. Sandeep Bhasin";
  const authorRole = post.authorRole || "Cosmetic & Plastic Surgeon";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo?.description || post.excerpt || undefined,
    image: hero ? [hero] : [DEFAULT_OG_IMAGE],
    datePublished: post.publishedAt || undefined,
    dateModified: post.modifiedAt || post.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
  };

  const body = Array.isArray(post.body) ? post.body : [];
  const tocItems = extractPortableTextToc(body);
  const headingIds = tocHeadingIdMap(tocItems);
  const { before: firstHalf, after: secondHalf } = splitBodyAtSection(body);
  const showMidCta = showCta && secondHalf.length > 0;

  return (
    <>
      <NavbarPlaceholder />
      <main className="bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article>
          <div className="container-content pt-6 pb-10 sm:pt-8 sm:pb-12">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 text-[0.8125rem] leading-snug sm:mb-6"
            >
              <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <li>
                  <Link
                    href="/"
                    className="font-medium text-primary no-underline transition-colors hover:text-primary-800 hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-muted-foreground/50">
                  »
                </li>
                <li>
                  <Link
                    href="/blogs/"
                    className="font-medium text-primary no-underline transition-colors hover:text-primary-800 hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden className="text-muted-foreground/50">
                  »
                </li>
                <li
                  className="line-clamp-1 text-muted-foreground"
                  aria-current="page"
                >
                  {post.title}
                </li>
              </ol>
            </nav>

            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:gap-12 xl:grid-cols-[minmax(0,48rem)_minmax(260px,300px)] xl:justify-between">
              <div className="min-w-0">
                <header>
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
                    <span className="font-medium text-foreground/80">
                      {authorName}
                    </span>
                    {published ? (
                      <>
                        <span aria-hidden className="text-border">
                          ·
                        </span>
                        <time dateTime={post.publishedAt || undefined}>
                          {published}
                        </time>
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

                <div className="mt-8 sm:mt-10">
                  <BlogTableOfContents items={tocItems} />

                  {body.length > 0 ? (
                    <>
                      {firstHalf.length > 0 ? (
                        <SanityPortableText
                          value={firstHalf}
                          headingIds={headingIds}
                          variant="blog"
                        />
                      ) : null}
                      {showMidCta ? (
                        <MidArticleCta
                          headline={
                            cta?.headline ||
                            "Have questions? Book a free 15-min consultation"
                          }
                          buttonLabel={
                            cta?.buttonLabel || "Book free consultation"
                          }
                        />
                      ) : null}
                      {secondHalf.length > 0 ? (
                        <SanityPortableText
                          value={secondHalf}
                          headingIds={headingIds}
                          variant="blog"
                        />
                      ) : null}
                    </>
                  ) : post.rawHtml ? (
                    <div
                      className="blog-prose"
                      dangerouslySetInnerHTML={{ __html: post.rawHtml }}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      No article content yet.
                    </p>
                  )}

                  {showCta ? (
                    <MidArticleCta
                      headline="Ready to discuss your treatment options?"
                      buttonLabel="Book free consultation"
                    />
                  ) : null}

                  <BlogDoctorCard
                    authorName={authorName}
                    authorRole={authorRole}
                  />
                </div>
              </div>

              <BlogSidebar className="max-lg:border-t max-lg:border-border max-lg:pt-8" />
            </div>
          </div>
        </article>

        <BlogFaqAccordion />
        <BlogNextPosts posts={nextPosts} />
      </main>
      <FooterPlaceholder />
    </>
  );
}

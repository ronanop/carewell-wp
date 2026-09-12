import Link from "next/link";
import type { Metadata } from "next";

import {
  BlogPageBuilderBelowArticle,
  BlogPageBuilderMainColumn,
} from "@/components/blog/BlogPageBuilderSections";
import { BlogFaqAccordion } from "@/components/blog/BlogFaqAccordion";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { urlFor } from "@/lib/sanity/client";
import {
  postPublicPath,
  type SanityPostCard,
  type SanityPostDoc,
} from "@/lib/sanity/post";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/constants";

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
                <BlogPostCard key={post._id} post={post} />
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

export function SanityPostTemplate({
  post,
  nextPosts = [],
}: {
  post: SanityPostDoc;
  /** Other articles to show after the doctor card (related + latest). */
  nextPosts?: SanityPostCard[];
}) {
  const path = postPublicPath(post);
  const hero = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1400).height(700).fit("crop").url()
    : null;
  const authorName = post.authorName || "Dr. Sandeep Bhasin";

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

  const faqItems = (post.faqs ?? [])
    .map((faq) => ({
      question: faq.question?.trim() || "",
      answer: faq.answer?.trim() || "",
    }))
    .filter((faq) => faq.question && faq.answer);

  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <NavbarPlaceholder />
      <main className="bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {faqJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        ) : null}

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
                <BlogPageBuilderMainColumn
                  post={post}
                  nextPosts={nextPosts}
                />
              </div>

              <BlogSidebar className="max-lg:border-t max-lg:border-border max-lg:pt-8" />
            </div>
          </div>
        </article>

        <BlogPageBuilderBelowArticle post={post} nextPosts={nextPosts} />
      </main>
      <FooterPlaceholder />
    </>
  );
}

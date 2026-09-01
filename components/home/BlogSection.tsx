"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HOME_BLOG_DEFAULTS } from "@/components/home/homeContent.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { resolveElementText } from "@/lib/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HEADING = "Latest insights";
const DEFAULT_DESCRIPTION =
  "Educational articles written to help you make informed decisions about your care.";

/** Serializable card projection for homepage (from WordPress BlogPostSummary). */
export type HomeBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  href: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

type BlogCardPost = HomeBlogPost & { __index: number };

export function BlogSection({
  posts: livePosts,
}: {
  /** Latest WordPress posts — public homepage. Omit in Studio (uses repeater defaults). */
  posts?: HomeBlogPost[];
}) {
  const { config, mode } = useStaticEditContext();

  const heading = resolveElementText(
    config,
    "home.blog.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.blog.description",
    DEFAULT_DESCRIPTION,
  );

  const useLivePosts = Array.isArray(livePosts) && mode === "public";

  const posts: BlogCardPost[] = useLivePosts
    ? livePosts.map((post, index) => ({ ...post, __index: index }))
    : resolveRepeaterItems(
        config,
        "home.blog",
        HOME_BLOG_DEFAULTS.map((item) => ({ ...item })),
        ["title", "excerpt", "category", "href"],
      ).map((item) => ({
        id: `studio-${item.__index}`,
        title: String(item.title ?? ""),
        excerpt: String(item.excerpt ?? ""),
        category: String(item.category ?? ""),
        href: String(item.href ?? "#"),
        __index: item.__index,
      }));

  return (
    <section className="bg-background">
      <div className="container-content section-padding max-[767px]:!py-6">
        <StaggerReveal stepMs={70}>
          <EditableElement
            id="home.blog.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="font-heading text-[1.5rem] font-bold leading-tight text-foreground sm:text-[2.7rem]"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.blog.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mt-3 max-w-[19rem] text-[0.78rem] font-medium leading-[1.5] text-muted-foreground sm:mt-4 sm:max-w-2xl sm:text-[1.25rem] sm:leading-[1.7]"
          >
            {({ value }) => value || description}
          </EditableElement>
        </StaggerReveal>

        {posts.length > 0 ? (
          <StaggerReveal
            stepMs={90}
            className="mt-5 grid-cw max-[767px]:gap-3 sm:mt-10"
          >
            {posts.map((post) => {
              const excerpt =
                post.excerpt.trim() ||
                `Doctor-led guidance on ${post.title}, including what to expect and what to discuss with your doctor.`;
              const card = (
                <Link
                  href={post.href}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface no-underline transition-colors hover:border-primary/30 hover:no-underline"
                >
                  {post.imageSrc ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <Image
                        src={post.imageSrc}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-secondary via-surface to-primary/5" />
                  )}
                  <div className="flex flex-1 flex-col p-3 sm:p-6">
                    {useLivePosts ? (
                      <>
                        {post.category ? (
                          <p className="text-[0.7rem] font-medium uppercase text-accent sm:text-[0.9rem]">
                            {post.category}
                          </p>
                        ) : null}
                        <h3 className="mt-1.5 font-heading text-[0.95rem] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:mt-3 sm:text-[1.8rem]">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 min-h-[3.75rem] flex-1 line-clamp-3 text-[0.75rem] leading-relaxed text-slate-600 sm:mt-3 sm:min-h-[4.75rem] sm:text-[1.05rem]">
                          {excerpt}
                        </p>
                      </>
                    ) : (
                      <>
                        <EditableElement
                          id={`home.blog.item.${post.__index}.category`}
                          kind="label"
                          defaultValue={post.category}
                          as="p"
                          className="text-[0.7rem] font-medium uppercase text-accent sm:text-[0.9rem]"
                        >
                          {({ value }) => value || post.category}
                        </EditableElement>
                        <h3 className="mt-1.5 font-heading text-[0.95rem] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:mt-3 sm:text-[1.8rem]">
                          {post.title}
                        </h3>
                        <EditableElement
                          id={`home.blog.item.${post.__index}.excerpt`}
                          kind="paragraph"
                          defaultValue={excerpt}
                          as="p"
                          className="mt-1.5 min-h-[3.75rem] flex-1 line-clamp-3 text-[0.75rem] leading-relaxed text-slate-600 sm:mt-3 sm:min-h-[4.75rem] sm:text-[1.05rem]"
                        >
                          {({ value }) => value || excerpt}
                        </EditableElement>
                      </>
                    )}
                    <span className="mt-3 inline-flex min-h-10 items-center gap-2 text-[0.75rem] font-medium text-primary sm:mt-6 sm:min-h-11 sm:text-[1.05rem]">
                      Read article
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );

              return (
                <article
                  key={post.id}
                  className="col-span-4 md:col-span-2 lg:col-span-4"
                >
                  {useLivePosts ? (
                    card
                  ) : (
                    <EditableElement
                      id={`home.blog.item.${post.__index}.title`}
                      kind="card"
                      defaultValue={post.title}
                    >
                      {() => card}
                    </EditableElement>
                  )}
                </article>
              );
            })}
          </StaggerReveal>
        ) : null}

        <StaggerReveal className="mt-6 sm:mt-12">
          <Link
            href="/blogs"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-10 text-[0.75rem] no-underline hover:no-underline sm:h-11 sm:text-[1.05rem]",
            )}
          >
            Read our blog
          </Link>
        </StaggerReveal>
      </div>
    </section>
  );
}

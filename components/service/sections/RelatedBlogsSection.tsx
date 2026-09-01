import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlogPostCard } from "@/components/blog/BlogPostCard";
import type { SanityPostCard } from "@/lib/sanity/post";
import { cn } from "@/lib/utils";

import type { SectionBaseProps } from "./types";

export type RelatedBlogsSectionProps = SectionBaseProps & {
  posts?: SanityPostCard[] | null;
  eyebrow?: string;
  title?: string;
};

/**
 * Related blog grid below related services on service pages.
 */
export function RelatedBlogsSection({
  id = "related-blogs",
  eyebrow = "Insights",
  title = "Related articles",
  posts,
  className,
}: RelatedBlogsSectionProps) {
  const list = (posts ?? []).filter((post) => post?._id && post.title?.trim());
  if (!list.length) return null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("relative", className)}
    >
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          {eyebrow ? (
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={`${id}-heading`}
            className={cn(
              "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
              eyebrow ? "mt-2" : undefined,
            )}
          >
            {title}
          </h2>
        </header>

        <ul className="mx-auto grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {list.map((post) => (
            <li key={post._id} className="min-w-0 h-full">
              <BlogPostCard post={post} imageFit="contain" />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="/blogs/"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-[#1557A0]/25 bg-white px-5 py-2.5",
              "text-sm font-semibold text-[#1557A0] no-underline",
              "transition-[border-color,box-shadow,color] duration-200",
              "hover:border-[#1557A0]/45 hover:text-[#0A2E52]",
              "hover:shadow-[0_8px_24px_-16px_rgba(21,87,160,0.35)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
            )}
          >
            View all articles
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { buttonVariants } from "@/components/ui/button";
import type { SanityPostCard } from "@/lib/sanity/post";
import { cn } from "@/lib/utils";

export function BlogNextPosts({
  posts,
  className,
}: {
  posts: SanityPostCard[];
  className?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="blog-next-heading"
      className={cn("border-t border-border bg-secondary/25", className)}
    >
      <div className="container-content section-padding">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-label uppercase text-accent">Keep reading</p>
            <h2
              id="blog-next-heading"
              className="mt-2 font-heading text-h3 font-semibold text-[#0A2540]"
            >
              Next blogs
            </h2>
          </div>
          <Link
            href="/blogs/"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-10 gap-2 no-underline hover:no-underline",
            )}
          >
            View all articles
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/client";
import {
  postPublicPath,
  type SanityPostCard,
} from "@/lib/sanity/post";
import { cn } from "@/lib/utils";

function formatDate(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function NextPostCard({ post }: { post: SanityPostCard }) {
  const href = postPublicPath(post);
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(800).height(500).fit("crop").url()
    : null;
  const date = formatDate(post.publishedAt);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-surface transition-colors hover:border-primary/25">
      <Link
        href={href}
        className="flex h-full flex-col no-underline hover:no-underline"
      >
        {imageUrl ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-secondary via-surface to-primary/5" />
        )}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {post.categories?.[0] ? (
            <p className="text-label uppercase text-accent">
              {post.categories[0]}
            </p>
          ) : null}
          <h3 className="mt-2 font-heading text-[1.0625rem] font-semibold leading-snug text-[#0A2540] transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-3 min-h-[4.75rem] flex-1 text-[1rem] font-medium leading-relaxed text-slate-600 sm:text-[1.1rem]">
              {post.excerpt}
            </p>
          ) : (
            <div className="mt-2 flex-1" />
          )}
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
            <NextPostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

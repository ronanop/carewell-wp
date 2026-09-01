import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/lib/sanity/client";
import { postPublicPath, type SanityPostCard } from "@/lib/sanity/post";
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

export function BlogPostCard({
  post,
  imageFit = "cover",
}: {
  post: SanityPostCard;
  /** `contain` shows the full image without cropping (service related articles). */
  imageFit?: "cover" | "contain";
}) {
  const href = postPublicPath(post);
  const imageUrl = post.mainImage?.asset
    ? imageFit === "contain"
      ? urlFor(post.mainImage).width(800).fit("max").url()
      : urlFor(post.mainImage).width(800).height(500).fit("crop").url()
    : null;
  const date = formatDate(post.publishedAt);
  const excerpt =
    post.excerpt?.trim() ||
    `Doctor-led guidance on ${post.title}, including what to expect and what to discuss with your doctor.`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(10,46,82,0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#1557A0]/45 hover:shadow-[0_12px_28px_-16px_rgba(21,87,160,0.35)]">
      <Link
        href={href}
        className="flex h-full flex-col no-underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2"
      >
        {imageUrl ? (
          <div
            className={cn(
              "relative overflow-hidden bg-slate-100",
              imageFit === "contain"
                ? "h-44 sm:h-48"
                : "aspect-[16/10]",
            )}
          >
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className={cn(
                imageFit === "contain"
                  ? "object-contain"
                  : "object-cover transition-transform duration-300 group-hover:scale-[1.02]",
              )}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div
            className={cn(
              "bg-gradient-to-br from-slate-100 via-white to-[#1557A0]/5",
              imageFit === "contain" ? "h-44 sm:h-48" : "aspect-[16/10]",
            )}
          />
        )}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {post.categories?.[0] ? (
            <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-[#1557A0] uppercase">
              {post.categories[0]}
            </p>
          ) : null}
          <h3 className="mt-2 font-heading text-lg font-semibold leading-snug tracking-tight text-[#0A2E52] transition-colors group-hover:text-[#1557A0]">
            {post.title}
          </h3>
          <p className="mt-2 min-h-[4.5rem] line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
            {excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
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

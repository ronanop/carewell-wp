import type { CSSProperties } from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { sectionImageUrl } from "./image";
import type {
  SectionBaseProps,
  TestimonialItem,
  VideoTestimonial,
} from "./types";

export type TestimonialsSectionProps = SectionBaseProps & {
  /** CMS: testimonialsSection.eyebrow */
  eyebrow?: string;
  /** CMS: testimonialsSection.heading */
  title?: string;
  /** CMS: testimonialsSection.items[] (or testimonial refs) */
  items?: TestimonialItem[];
  /** CMS: testimonialsSection.videoEnabled */
  videoEnabled?: boolean;
  /** CMS: testimonialsSection.videoEyebrow */
  videoEyebrow?: string;
  /** CMS: testimonialsSection.videoHeading */
  videoTitle?: string;
  /** CMS: testimonialsSection.videos[] */
  videos?: VideoTestimonial[];
};

function idFromUrl(url?: string) {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "").split("/")[0] || null;
    }
    return u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop() || null;
  } catch {
    return null;
  }
}

function resolveVideoId(video: VideoTestimonial): string | null {
  return video.youtubeId?.trim() || idFromUrl(video.url) || null;
}

function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < clamped
              ? "fill-[#1557A0] text-[#1557A0]"
              : "fill-transparent text-slate-300",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

function QuoteCard({ item, index }: { item: TestimonialItem; index: number }) {
  const src = sectionImageUrl(item.photo, 120);
  const name = item.patientName?.trim() || "Patient";
  const quote = item.quote!.trim();

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6",
        "shadow-[0_1px_2px_rgba(10,46,82,0.04)]",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:border-[#1557A0]/35",
        "hover:shadow-[0_14px_36px_-18px_rgba(21,87,160,0.35)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1557A0]/10 text-[#1557A0]"
          aria-hidden
        >
          <Quote className="size-4" strokeWidth={2.25} />
        </span>
        {typeof item.rating === "number" && item.rating > 0 ? (
          <StarRating rating={item.rating} />
        ) : null}
      </div>

      <blockquote className="mt-4 flex-1">
        <p className="text-[0.9375rem] leading-relaxed text-slate-700 text-pretty">
          “{quote}”
        </p>
      </blockquote>

      <footer className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        {src ? (
          <Image
            src={src}
            alt={item.photo?.alt || name}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-2 ring-[#F6F8FC]"
          />
        ) : (
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0A2E52] font-heading text-sm font-semibold text-white"
            aria-hidden
          >
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0A2E52]">{name}</p>
          {item.treatment?.trim() ? (
            <p className="truncate text-xs text-slate-500">{item.treatment.trim()}</p>
          ) : null}
        </div>
        <span className="sr-only">Testimonial {index + 1}</span>
      </footer>
    </article>
  );
}

function YouTubePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 68 48"
      width="68"
      height="48"
      aria-hidden
    >
      <path
        fill="#FF0000"
        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
      />
      <path fill="#fff" d="M45 24 27 14v20z" />
    </svg>
  );
}

function VideoCard({
  video,
  youtubeId,
  thumb,
  inertDuplicate = false,
}: {
  video: VideoTestimonial;
  youtubeId: string;
  thumb: string;
  inertDuplicate?: boolean;
}) {
  const title = video.title?.trim() || "Patient story";
  const href = `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <article
      className="svc-testimonials-video-card w-[min(15rem,78vw)] shrink-0 sm:w-[17.5rem]"
      aria-hidden={inertDuplicate || undefined}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={inertDuplicate ? -1 : undefined}
        className={cn(
          "group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white no-underline",
          "border border-slate-200/90",
          "shadow-[0_4px_18px_rgba(10,46,82,0.08)]",
          "transition-[box-shadow,transform,border-color] duration-300",
          "hover:-translate-y-0.5 hover:border-[#1557A0]/40 hover:no-underline",
          "hover:shadow-[0_12px_28px_rgba(10,46,82,0.14)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
        )}
      >
        <div className="relative aspect-video shrink-0 overflow-hidden bg-[#0A2E52]/90">
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="280px"
          />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          >
            <YouTubePlayIcon className="h-10 w-auto sm:h-11" />
          </span>
        </div>
        <div className="px-3.5 py-3 sm:px-4 sm:py-3.5">
          <p className="font-heading text-sm font-semibold leading-snug text-[#0A2E52] sm:text-[0.9375rem]">
            <span className="line-clamp-2">{title}</span>
            <span className="sr-only"> (opens on YouTube)</span>
          </p>
        </div>
      </a>
    </article>
  );
}

type ResolvedVideo = {
  key: string;
  video: VideoTestimonial;
  youtubeId: string;
  thumb: string;
};

/**
 * Patient quote cards + optional YouTube video strip.
 * React owns layout/animation; CMS owns copy, toggle, and video links.
 * Empty quotes AND (videos off or empty) → null; otherwise show whichever is present.
 */
export function TestimonialsSection({
  id = "testimonials",
  eyebrow,
  title,
  items = [],
  videoEnabled = false,
  videoEyebrow,
  videoTitle,
  videos = [],
  className,
}: TestimonialsSectionProps) {
  const quotes = (items ?? []).filter((item) => Boolean(item.quote?.trim()));

  const resolvedVideos: ResolvedVideo[] = videoEnabled
    ? (videos ?? []).flatMap((video, i) => {
        const youtubeId = resolveVideoId(video);
        if (!youtubeId) return [];
        const override = sectionImageUrl(video.thumbnail, 480);
        return [
          {
            key: `${youtubeId}-${i}`,
            video,
            youtubeId,
            thumb: override || youtubeThumb(youtubeId),
          },
        ];
      })
    : [];

  const showQuotes = quotes.length > 0;
  const showVideos = resolvedVideos.length > 0;
  if (!showQuotes && !showVideos) return null;

  const marqueeDurationSec = Math.max(resolvedVideos.length * 9, 28);
  const quoteHeading = title?.trim() || undefined;
  const videoHeading = videoTitle?.trim() || undefined;

  const showQuoteHeader = Boolean(eyebrow?.trim() || quoteHeading);
  const showVideoHeader = Boolean(videoEyebrow?.trim() || videoHeading);
  const showTopBlock = showQuotes || showVideoHeader;

  return (
    <section
      id={id}
      aria-labelledby={
        quoteHeading
          ? `${id}-heading`
          : videoHeading
            ? `${id}-video-heading`
            : undefined
      }
      className={cn(
        "relative overflow-x-hidden border-y border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      <style>{`
        @keyframes svc-testimonials-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        .svc-testimonials-marquee {
          overflow: hidden;
          width: 100%;
        }

        .svc-testimonials-marquee__track {
          display: flex;
          width: max-content;
          animation: svc-testimonials-marquee var(--svc-testimonials-marquee-duration, 36s) linear infinite;
          will-change: transform;
        }

        .svc-testimonials-marquee__set {
          display: flex;
          gap: 1rem;
          padding-inline-end: 1rem;
        }

        @media (min-width: 640px) {
          .svc-testimonials-marquee__set {
            gap: 1.25rem;
            padding-inline-end: 1.25rem;
          }
        }

        .svc-testimonials-marquee:hover .svc-testimonials-marquee__track,
        .svc-testimonials-marquee:focus-within .svc-testimonials-marquee__track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .svc-testimonials-marquee {
            overflow: visible;
            padding-inline: 1rem;
          }

          @media (min-width: 640px) {
            .svc-testimonials-marquee {
              padding-inline: 1.5rem;
            }
          }

          @media (min-width: 1024px) {
            .svc-testimonials-marquee {
              padding-inline: 2rem;
            }
          }

          .svc-testimonials-marquee__track {
            display: block;
            width: 100%;
            max-width: 72rem;
            margin-inline: auto;
            animation: none !important;
            transform: none !important;
            will-change: auto;
          }

          .svc-testimonials-marquee__duplicate {
            display: none !important;
          }

          .svc-testimonials-marquee__set {
            display: grid;
            width: 100%;
            gap: 1rem;
            padding-inline-end: 0;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
          }

          .svc-testimonials-video-card {
            width: 100% !important;
          }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_20%_0%,rgba(21,87,160,0.07),transparent_55%)]"
        aria-hidden
      />

      {showTopBlock ? (
        <div
          className={cn(
            "relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
            showQuotes
              ? "py-12 sm:py-14 lg:py-16"
              : "pt-12 sm:pt-14 lg:pt-16 pb-6 sm:pb-8",
          )}
        >
          {showQuotes ? (
            <div>
              {showQuoteHeader ? (
                <header className="mb-8 max-w-2xl sm:mb-10">
                  {eyebrow?.trim() ? (
                    <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                      {eyebrow.trim()}
                    </p>
                  ) : null}
                  {quoteHeading ? (
                    <h2
                      id={`${id}-heading`}
                      className={cn(
                        "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
                        eyebrow?.trim() ? "mt-2" : undefined,
                      )}
                    >
                      {quoteHeading}
                    </h2>
                  ) : null}
                </header>
              ) : null}

              <ul
                className={cn(
                  "grid list-none gap-4 p-0 sm:gap-5",
                  "grid-cols-[repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]",
                  quotes.length === 1
                    ? "max-w-md"
                    : quotes.length === 2
                      ? "max-w-3xl"
                      : undefined,
                )}
              >
                {quotes.map((item, i) => (
                  <li key={`${item.patientName ?? "t"}-${i}`} className="min-w-0">
                    <QuoteCard item={item} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {showVideos && showVideoHeader ? (
            <header
              className={cn(
                "max-w-2xl",
                showQuotes ? "mt-12 sm:mt-14 mb-0" : undefined,
              )}
            >
              {videoEyebrow?.trim() ? (
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                  {videoEyebrow.trim()}
                </p>
              ) : null}
              {videoHeading ? (
                <h2
                  id={`${id}-video-heading`}
                  className={cn(
                    "font-heading text-xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-2xl",
                    videoEyebrow?.trim() ? "mt-2" : undefined,
                  )}
                >
                  {videoHeading}
                </h2>
              ) : null}
            </header>
          ) : null}
        </div>
      ) : null}

      {showVideos ? (
        <div
          className={cn(
            "svc-testimonials-marquee relative pb-12 sm:pb-14 lg:pb-16",
            !showTopBlock && "pt-12 sm:pt-14 lg:pt-16",
            showTopBlock && "pt-6 sm:pt-8",
          )}
          style={
            {
              "--svc-testimonials-marquee-duration": `${marqueeDurationSec}s`,
            } as CSSProperties
          }
        >
          <div className="svc-testimonials-marquee__track">
            <div className="svc-testimonials-marquee__set">
              {resolvedVideos.map((v) => (
                <VideoCard
                  key={v.key}
                  video={v.video}
                  youtubeId={v.youtubeId}
                  thumb={v.thumb}
                />
              ))}
            </div>
            <div
              className="svc-testimonials-marquee__set svc-testimonials-marquee__duplicate"
              aria-hidden
            >
              {resolvedVideos.map((v) => (
                <VideoCard
                  key={`${v.key}-dup`}
                  video={v.video}
                  youtubeId={v.youtubeId}
                  thumb={v.thumb}
                  inertDuplicate
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

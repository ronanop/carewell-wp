"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import { resolveElementText } from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const CHANNEL_VIDEOS_URL =
  "https://www.youtube.com/@CareWellMedicalCentre/videos";

const DEFAULT_OVERLINE = "Patient stories";
const DEFAULT_HEADING = "Watch Patient Testimonials";
const DEFAULT_DESCRIPTION =
  "Hear from patients about their care journey at Care Well Medical Centre — real experiences, shared in their own words.";

const DEFAULT_CATEGORY_LABEL = "PATIENT STORY";

/** Serializable video card for homepage (from YouTube channel RSS). */
export type HomeYouTubeVideo = {
  id: string;
  title: string;
  href: string;
  thumbnailUrl: string;
};

/**
 * Short uppercase label for the card footer.
 * No category field on RSS items — derive from title keywords, else default.
 */
export function deriveVideoCategoryLabel(title: string): string {
  const t = title.toLowerCase();

  if (
    /\bbefore\b[\s&/-]*\bafter\b|\btransformation\b|\bresults?\b/.test(t)
  ) {
    return "BEFORE & AFTER EXPERIENCE";
  }
  if (/\brecover|\bconfidence|\bjourney\b/.test(t)) {
    return "RECOVERY & CONFIDENCE";
  }
  if (/\bfeedback\b|\breview\b|\bhappy client/.test(t)) {
    return "PATIENT FEEDBACK";
  }
  if (
    /\bskin\b|\brejuvenat|\bfacial\b|\bacne\b|\bpigment|\blaser\b|\bglow\b/.test(
      t,
    )
  ) {
    return "SKIN REJUVENATION";
  }

  return DEFAULT_CATEGORY_LABEL;
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

function TestimonialVideoCard({
  video,
  inertDuplicate = false,
}: {
  video: HomeYouTubeVideo;
  /** Second loop copy — hidden from AT / keyboard. */
  inertDuplicate?: boolean;
}) {
  const categoryLabel = deriveVideoCategoryLabel(video.title);

  return (
    <article
      className="home-testimonials-card w-[min(14.5rem,78vw)] shrink-0 sm:w-[17.5rem]"
      aria-hidden={inertDuplicate || undefined}
    >
      <a
        href={video.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={inertDuplicate ? -1 : undefined}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-xl bg-white no-underline",
          "shadow-[0_4px_18px_rgba(10,37,64,0.08)]",
          "transition-[box-shadow,transform] duration-300",
          "hover:no-underline hover:shadow-[0_8px_28px_rgba(10,37,64,0.12)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        {/* ~2/3 — thumbnail + YouTube play control */}
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted">
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="280px"
          />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          >
            <YouTubePlayIcon className="h-10 w-auto sm:h-12" />
          </span>
        </div>

        {/* ~1/3 — category + title */}
        <div className="flex min-h-[5.25rem] flex-1 flex-col gap-1.5 px-3.5 py-3 sm:min-h-[6.25rem] sm:px-5 sm:py-4">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-primary sm:text-[0.6875rem]">
            {categoryLabel}
          </p>
          <h3 className="font-heading text-[0.875rem] font-bold leading-snug text-[#0A2540] sm:text-base">
            <span className="line-clamp-2">{video.title}</span>
            <span className="sr-only"> (opens on YouTube)</span>
          </h3>
        </div>
      </a>
    </article>
  );
}

export function TestimonialsSection({
  videos: liveVideos,
}: {
  /** Latest channel videos — public homepage. Omit in Studio. */
  videos?: HomeYouTubeVideo[];
}) {
  const { config, mode } = useStaticEditContext();

  const overline = resolveElementText(
    config,
    "home.testimonials.overline",
    DEFAULT_OVERLINE,
  );
  const heading = resolveElementText(
    config,
    "home.testimonials.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.testimonials.description",
    DEFAULT_DESCRIPTION,
  );

  const videos =
    Array.isArray(liveVideos) && mode === "public" ? liveVideos : [];

  // Fail soft on public: no broken empty chrome when YouTube is unavailable.
  if (mode === "public" && videos.length === 0) {
    return null;
  }

  const marqueeDurationSec = Math.max(videos.length * 9, 28);

  return (
    <section className="overflow-x-hidden bg-muted/30 section-padding">
      <style>{`
        @keyframes home-testimonials-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        .home-testimonials-marquee {
          overflow: hidden;
          width: 100%;
        }

        .home-testimonials-marquee__track {
          display: flex;
          width: max-content;
          animation: home-testimonials-marquee var(--home-testimonials-marquee-duration, 36s) linear infinite;
          will-change: transform;
        }

        /* Equal-width sets (cards + trailing gap) so translateX(-50%) loops without a jump. */
        .home-testimonials-marquee__set {
          display: flex;
          gap: 1rem;
          padding-inline-end: 1rem;
        }

        @media (min-width: 640px) {
          .home-testimonials-marquee__set {
            gap: 1.5rem;
            padding-inline-end: 1.5rem;
          }
        }

        .home-testimonials-marquee:hover .home-testimonials-marquee__track,
        .home-testimonials-marquee:focus-within .home-testimonials-marquee__track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-testimonials-marquee {
            overflow-x: auto;
            overscroll-behavior-x: contain;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x proximity;
            padding-bottom: 0.25rem;
          }

          .home-testimonials-marquee__track {
            animation: none !important;
            transform: none !important;
            will-change: auto;
          }

          .home-testimonials-marquee__duplicate {
            display: none !important;
          }

          .home-testimonials-marquee__set {
            padding-inline-end: 0;
            padding-inline-start: var(--container-padding-x);
          }

          .home-testimonials-marquee article {
            scroll-snap-align: start;
          }

          .home-testimonials-marquee article:last-child {
            margin-inline-end: var(--container-padding-x);
          }
        }
      `}</style>

      {/* Header stays content-width; marquee is a sibling so it spans the viewport. */}
      <div className="container-content">
        <div>
          <EditableElement
            id="home.testimonials.overline"
            kind="label"
            defaultValue={DEFAULT_OVERLINE}
            as="p"
            className="text-label uppercase text-accent"
          >
            {({ value }) => value || overline}
          </EditableElement>
          <EditableElement
            id="home.testimonials.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="mt-3 font-heading text-[1.5rem] font-bold leading-tight text-[#0A2540] sm:text-h2"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.testimonials.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mt-3 max-w-2xl text-body leading-relaxed text-muted-foreground sm:mt-4 sm:text-body-lg"
          >
            {({ value }) => value || description}
          </EditableElement>
        </div>
      </div>

      {videos.length > 0 ? (
        <div
          className="home-testimonials-marquee mt-8 sm:mt-12"
          style={
            {
              "--home-testimonials-marquee-duration": `${marqueeDurationSec}s`,
            } as CSSProperties
          }
        >
          <div className="home-testimonials-marquee__track">
            <div className="home-testimonials-marquee__set">
              {videos.map((video) => (
                <TestimonialVideoCard key={video.id} video={video} />
              ))}
            </div>
            <div
              className="home-testimonials-marquee__set home-testimonials-marquee__duplicate"
              aria-hidden
            >
              {videos.map((video) => (
                <TestimonialVideoCard
                  key={`${video.id}-dup`}
                  video={video}
                  inertDuplicate
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="container-content">
          <p className="mt-10 text-small text-muted-foreground">
            Latest videos from the CareWell YouTube channel appear here on the
            live site.
          </p>
        </div>
      )}

      <div className="container-content mt-8 sm:mt-12">
        <Link
          href={CHANNEL_VIDEOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "h-11 no-underline hover:no-underline",
          )}
        >
          View more on YouTube
        </Link>
      </div>
    </section>
  );
}

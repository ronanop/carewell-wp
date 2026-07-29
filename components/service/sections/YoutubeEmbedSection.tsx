import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type YoutubeEmbedSectionProps = SectionBaseProps & {
  /** CMS: section eyebrow — hidden when empty */
  eyebrow?: string;
  /** CMS: section heading / accessible iframe title — hidden when empty */
  title?: string;
  /** CMS: howItWorks.youtubeId (or equivalent) */
  youtubeId?: string;
  /** Alternate: full YouTube URL — parsed when youtubeId is absent */
  url?: string;
  /** Nest inside another section (e.g. HowItWorks) — frame only, no chrome */
  bare?: boolean;
};

function idFromUrl(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v") || u.pathname.split("/").pop() || null;
  } catch {
    return null;
  }
}

function VideoFrame({
  vid,
  title,
  className,
}: {
  vid: string;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0A2E52]",
        "shadow-[0_16px_48px_-28px_rgba(10,46,82,0.55)]",
        "ring-1 ring-[#1557A0]/10",
        className,
      )}
    >
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${vid}`}
          title={title?.trim() || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}

/**
 * YouTube embed — full-width brand section or bare frame for nesting.
 * React owns chrome/layout; CMS owns eyebrow, title, video id/url.
 * Empty video → null.
 */
export function YoutubeEmbedSection({
  id = "video",
  eyebrow,
  title,
  youtubeId,
  url,
  bare = false,
  className,
}: YoutubeEmbedSectionProps) {
  const vid = (youtubeId?.trim() || idFromUrl(url)) ?? null;
  if (!vid) return null;

  const frame = <VideoFrame vid={vid} title={title} />;

  if (bare) {
    return <div className={className}>{frame}</div>;
  }

  const headingId = title ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "relative border-y border-slate-200/80 bg-[#FAFBFE]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_180px_at_50%_0%,rgba(21,87,160,0.08),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F6F8FC]/80 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(eyebrow || title) && (
          <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            {eyebrow ? (
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id={headingId}
                className={cn(
                  "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
                  eyebrow ? "mt-2" : undefined,
                )}
              >
                {title}
              </h2>
            ) : null}
          </header>
        )}

        <div className="mx-auto max-w-3xl">{frame}</div>
      </div>
    </section>
  );
}

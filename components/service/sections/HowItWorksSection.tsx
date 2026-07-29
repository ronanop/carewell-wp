import { YoutubeEmbedSection } from "./YoutubeEmbedSection";
import { HowItWorksSteps } from "./HowItWorksSteps";
import { cn } from "@/lib/utils";
import type { ProcessStep, SectionBaseProps } from "./types";

export type HowItWorksSectionProps = SectionBaseProps & {
  /** CMS: howItWorks.eyebrow */
  eyebrow?: string;
  /** CMS: howItWorks.heading */
  title?: string;
  /** CMS: howItWorks.steps */
  steps?: ProcessStep[];
  /** CMS: howItWorks.stepLabel — prefix before step number */
  stepLabel?: string;
  /** CMS: howItWorks.youtubeId */
  youtubeId?: string;
  /** CMS: howItWorks.youtubeTitle */
  youtubeTitle?: string;
};

/**
 * Process steps + optional video.
 * React owns layout/animation; CMS owns all copy. Empty steps+video → null.
 * Step grid auto-fits any count (not locked to 5).
 */
export function HowItWorksSection({
  id = "how-it-works",
  eyebrow,
  title,
  steps = [],
  stepLabel,
  youtubeId,
  youtubeTitle,
  className,
}: HowItWorksSectionProps) {
  const list = (steps ?? []).filter((s) => s.title?.trim());
  const videoId = youtubeId?.trim() || undefined;
  if (!list.length && !videoId) return null;

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn(
        "relative border-y border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_50%_0%,rgba(21,87,160,0.07),transparent_55%)]"
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
                id={`${id}-heading`}
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

        {list.length ? (
          <HowItWorksSteps steps={list} stepLabel={stepLabel} />
        ) : null}

        {videoId ? (
          <div className={cn("mx-auto max-w-3xl", list.length ? "mt-10" : undefined)}>
            <YoutubeEmbedSection
              youtubeId={videoId}
              title={youtubeTitle}
              bare
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

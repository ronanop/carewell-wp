import Image from "next/image";

import { SanityPortableText } from "@/components/sanity/SanityPortableText";
import { cn } from "@/lib/utils";
import { InsightCallout } from "./InsightCallout";
import { sectionImageUrl } from "./image";
import type { SanityImage, SectionBaseProps } from "./types";

export type OverviewSectionProps = SectionBaseProps & {
  /** CMS: overview.eyebrow */
  eyebrow?: string;
  /** CMS: overview.heading */
  title?: string;
  /** CMS: overview.body (Portable Text) */
  body?: unknown[];
  /** CMS: overview.illustration */
  illustration?: SanityImage;
  /** CMS: overview.insightsEyebrow */
  insightsEyebrow?: string;
  /** CMS: overview.insightsTitle */
  insightsTitle?: string;
  /** CMS: overview.insights */
  insights?: string[];
};

/**
 * Service overview — editorial copy + optional illustration + insights.
 * React owns layout; all copy/media from CMS. Empty body+insights → null.
 */
export function OverviewSection({
  id = "overview",
  eyebrow,
  title,
  body,
  illustration,
  insightsEyebrow,
  insightsTitle,
  insights,
  className,
}: OverviewSectionProps) {
  const insightItems = (insights ?? []).map((s) => s.trim()).filter(Boolean);
  const hasBody = Boolean(body?.length);
  if (!hasBody && !insightItems.length) return null;

  const src = sectionImageUrl(illustration, 900);
  const alt = illustration?.alt || title || "Treatment overview";

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={cn(
        "relative border-b border-slate-200/80 bg-white",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(720px_120px_at_0%_0%,rgba(21,87,160,0.06),transparent_65%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div
          className={cn(
            "grid items-start gap-10",
            src
              ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:gap-14"
              : undefined,
          )}
        >
          <div className="min-w-0">
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

            {hasBody ? (
              <div
                className={cn(
                  "max-w-none text-[1.0625rem] leading-[1.7] text-slate-700",
                  "[&_p]:mt-4 [&_p:first-child]:mt-5",
                  "[&_strong]:font-semibold [&_strong]:text-[#0A2E52]",
                  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
                  "[&_a]:font-medium [&_a]:text-[#1557A0] [&_a]:underline-offset-2 hover:[&_a]:underline",
                )}
              >
                <SanityPortableText value={body!} />
              </div>
            ) : null}

            {insightItems.length ? (
              <InsightCallout
                className="mt-8"
                layout="card"
                eyebrow={insightsEyebrow}
                title={insightsTitle}
                items={insightItems}
              />
            ) : null}
          </div>

          {src ? (
            <figure className="relative lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-[0_16px_40px_-24px_rgba(10,46,82,0.45)]">
                <Image
                  src={src}
                  alt={alt}
                  width={640}
                  height={480}
                  className="aspect-[4/3] h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
              {illustration?.alt ? (
                <figcaption className="mt-3 text-center text-xs text-slate-500">
                  {illustration.alt}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}

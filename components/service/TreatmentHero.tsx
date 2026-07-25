"use client";

import { memo } from "react";
import Image from "next/image";

import { BlogBreadcrumb } from "@/components/blog/BlogMeta";
import { ContactActions } from "@/components/shared/ContactActions";
import type { ExperienceDocument } from "@/types/experience-document";

/** Default full-bleed hero background for all service pages (not per-page WP media). */
const SERVICE_HERO_BACKGROUND_SRC = "/images/service-hero-background.jpg";

/**
 * TreatmentHero — full-width treatment copy (no featured-image column).
 * Featured / OG / article images remain available to SEO and other surfaces;
 * this hero intentionally does not display them. Uses a shared default
 * background photo behind a left-weighted dark scrim so white hero text stays readable.
 */
export const TreatmentHero = memo(function TreatmentHero({
  doc,
}: {
  doc: ExperienceDocument;
}) {
  const { hero } = doc;

  return (
    <header className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={SERVICE_HERO_BACKGROUND_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left-weighted scrim: readable white text; photo clear on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/70 via-[#0A2540]/35 via-45% to-transparent to-75%" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-7 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
        <BlogBreadcrumb items={doc.breadcrumbs} tone="on-dark" />
        <div className="mt-8 max-w-3xl lg:mt-10">
          <h1 className="font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-balance text-white">
            {hero.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/20 pt-5 text-sm text-white/80">
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-white ring-1 ring-white/25">
              Medically guided
            </span>
            {doc.config.hero?.showTrustBadges !== false ? (
              <span className="text-[0.8125rem]">
                Care Well Medical Centre · South Delhi
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem]">
              <span className="size-1.5 rounded-full bg-white/60" aria-hidden />
              {hero.readingTimeMinutes} min read
            </span>
          </div>
          <ContactActions
            className="mt-7"
            bookLabel="Book consultation"
            hierarchy="primary-secondary-tertiary"
            tone="on-dark"
          />
        </div>
      </div>
    </header>
  );
});

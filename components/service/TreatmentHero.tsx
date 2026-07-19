"use client";

import Image from "next/image";
import { memo, type ReactNode } from "react";

import { BlogBreadcrumb } from "@/components/blog/BlogMeta";
import { ContactActions } from "@/components/shared/ContactActions";
import type { ExperienceDocument } from "@/types/experience-document";
import type { ContentNode } from "@/types/content-ast";
import type { ResolvedMedia } from "@/types/presentation-config";

/**
 * TreatmentHero — copy left, image frame right.
 * Image column stretches to match copy height (heading → Call).
 */
export const TreatmentHero = memo(function TreatmentHero({
  doc,
}: {
  doc: ExperienceDocument;
}) {
  const { hero } = doc;
  const image = resolveHeroImage(doc);

  const treatmentLabel =
    doc.leadContext.category ?? doc.leadContext.specialtySlug ?? "Treatment";

  const trust = (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/40 pt-5 text-sm text-muted-foreground">
      <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-success-700 ring-1 ring-success-500/20">
        Medically guided
      </span>
      {doc.config.hero?.showTrustBadges !== false ? (
        <span className="text-[0.8125rem]">
          Care Well Medical Centre · South Delhi
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5 text-[0.8125rem]">
        <span className="size-1.5 rounded-full bg-primary/55" aria-hidden />
        {hero.readingTimeMinutes} min read
      </span>
    </div>
  );

  const copy = (
    <div className="flex min-w-0 max-w-xl flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
          {treatmentLabel}
        </span>
      </div>
      <h1 className="mt-4 font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-balance text-foreground">
        {hero.title}
      </h1>
      {hero.excerpt ? (
        <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {hero.excerpt}
        </p>
      ) : null}
      {trust}
      <ContactActions
        className="mt-7"
        bookLabel="Book consultation"
        hierarchy="primary-secondary-tertiary"
      />
    </div>
  );

  const media = (
    <div
      className="relative flex w-full min-w-0 self-stretch"
      data-hero-region="image"
    >
      <div className="relative min-h-[280px] w-full flex-1 overflow-hidden rounded-[1.25rem] bg-surface-editorial/70 ring-1 ring-border/50 shadow-editorial sm:min-h-[320px] lg:min-h-0">
        {image?.sourceUrl ? (
          <>
            <Image
              src={image.sourceUrl}
              alt={image.altText || hero.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="flex h-full min-h-[280px] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/50 via-surface-cream/40 to-surface-editorial px-6 text-center lg:min-h-full"
            aria-hidden
          >
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
              {treatmentLabel}
            </span>
            <p className="max-w-[14rem] font-heading text-lg font-semibold leading-snug text-foreground/80">
              Clinical care in South Delhi
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const shell = (children: ReactNode) => (
    <header className="relative overflow-hidden border-b border-border/30 bg-gradient-to-b from-surface-cream/50 via-surface-cream/20 to-background">
      {children}
    </header>
  );

  return shell(
    <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-7 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
      <BlogBreadcrumb items={doc.breadcrumbs} />
      <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-stretch lg:gap-12 xl:gap-16">
        {copy}
        {media}
      </div>
    </div>,
  );
});

function resolveHeroImage(doc: ExperienceDocument): ResolvedMedia | null {
  if (doc.hero.featuredImage?.sourceUrl) return doc.hero.featuredImage;
  if (doc.resolved.heroImage?.sourceUrl) return doc.resolved.heroImage;
  if (doc.resolved.ogImage?.sourceUrl) return doc.resolved.ogImage;

  const og = doc.seo.openGraphImage;
  if (og) {
    return {
      databaseId: 0,
      sourceUrl: og,
      altText: doc.hero.title,
      width: null,
      height: null,
    };
  }

  return findFirstArticleImage(doc.article?.content.nodes ?? []);
}

function findFirstArticleImage(nodes: ContentNode[]): ResolvedMedia | null {
  for (const node of nodes) {
    if (
      (node.type === "image" || node.type === "figure") &&
      typeof node.attributes.src === "string" &&
      node.attributes.src
    ) {
      return {
        databaseId: 0,
        sourceUrl: node.attributes.src,
        altText:
          typeof node.attributes.alt === "string" ? node.attributes.alt : null,
        width:
          typeof node.attributes.width === "number"
            ? node.attributes.width
            : null,
        height:
          typeof node.attributes.height === "number"
            ? node.attributes.height
            : null,
      };
    }
    if (node.children?.length) {
      const nested = findFirstArticleImage(node.children);
      if (nested) return nested;
    }
  }
  return null;
}

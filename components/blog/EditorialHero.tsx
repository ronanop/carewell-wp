"use client";

import Link from "next/link";
import { memo, type ReactNode } from "react";

import { HeroMedia } from "@/components/blog/media/HeroMedia";
import {
  BlogBreadcrumb,
  BlogShareBar,
} from "@/components/blog/BlogMeta";
import { ContactActions } from "@/components/shared/ContactActions";
import { getEditorialPreset } from "@/lib/experience/blog/editorial/presets";
import {
  detectSpecialtyFromHaystack,
  getContextAwareCtaCopyForSpecialty,
} from "@/lib/experience/unified/context";
import type { BlogPresentationConfig } from "@/lib/experience/validations/blogPresentationConfig";
import { cn } from "@/lib/utils";
import type { BlogDocument } from "@/types/blog-document";
import type { HeroLayoutVariant, HeroMediaConfig } from "@/types/editorial-layout";
import { DEFAULT_HERO_MEDIA } from "@/types/editorial-layout";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function detectHeroLayout(
  doc: BlogDocument,
  configured?: HeroLayoutVariant | null,
): HeroLayoutVariant {
  if (configured) return configured;
  const composition = doc.layout;
  if (composition?.heroLayout) return composition.heroLayout;

  const img = doc.hero.featuredImage;
  if (img?.width && img?.height) {
    const ratio = img.width / img.height;
    if (ratio < 0.9) return "split-right";
    if (ratio > 1.6) return "magazine";
  }
  return "editorial";
}

/**
 * Premium Hero Composer (Phase 7.1) — editorial layouts, trust cues, CTAs.
 * Hero media never crops by default.
 */
export const EditorialHero = memo(function EditorialHero({
  doc,
}: {
  doc: BlogDocument;
}) {
  const { hero } = doc;
  const image = hero.featuredImage;
  const config = doc.config as BlogPresentationConfig;
  const preset = getEditorialPreset(config.editorialPreset);
  const heroMedia: HeroMediaConfig = {
    ...DEFAULT_HERO_MEDIA,
    ...config.heroMedia,
    fit: config.heroMedia?.fit ?? "original",
    shadow: config.heroMedia?.shadow ?? true,
  };
  const layout = detectHeroLayout(doc, config.heroLayout ?? heroMedia.layoutVariant);
  const specialty =
    hero.categories.find((c) => c.slug !== hero.category?.slug)?.name ??
    hero.category?.name ??
    null;

  const specialtyKey = detectSpecialtyFromHaystack(
    [hero.title, ...hero.categories.map((c) => `${c.slug} ${c.name}`)].join(" "),
  );
  const cta = getContextAwareCtaCopyForSpecialty(specialtyKey);

  const trust = (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/50 pt-5 text-sm text-muted-foreground">
      {hero.author ? (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{hero.author.name}</span>
          <span className="rounded-full bg-success-50 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-success-700 ring-1 ring-success-500/25">
            Medically reviewed
          </span>
        </div>
      ) : null}
      {hero.publishedAt ? (
        <time dateTime={hero.publishedAt}>Published {formatDate(hero.publishedAt)}</time>
      ) : null}
      {hero.modifiedAt && hero.modifiedAt !== hero.publishedAt ? (
        <time dateTime={hero.modifiedAt}>Updated {formatDate(hero.modifiedAt)}</time>
      ) : null}
      <span className="inline-flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary/60" aria-hidden />
        {hero.readingTimeMinutes} min read
      </span>
    </div>
  );

  const actions = (
    <ContactActions
      className="mt-6"
      bookLabel={cta.label}
    />
  );

  const copy = (
    <div className={cn(layout === "center-focus" && "mx-auto max-w-2xl text-center")}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          layout === "center-focus" && "justify-center",
        )}
      >
        {hero.category ? (
          <Link
            href={hero.category.uri}
            className="cw-interactive rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            {hero.category.name}
          </Link>
        ) : null}
        {specialty && specialty !== hero.category?.name ? (
          <span className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {specialty}
          </span>
        ) : null}
      </div>
      <h1
        className={cn(
          "mt-5 font-heading font-semibold tracking-tight text-foreground text-balance",
          layout === "magazine" || layout === "full-bleed" || layout === "luxury"
            ? "text-display-lg"
            : "text-h1",
        )}
      >
        {hero.title}
      </h1>
      {trust}
      {actions}
      <BlogShareBar url={hero.shareUrl} title={hero.title} className="mt-6" />
    </div>
  );

  const media = image?.sourceUrl ? (
    <HeroMedia
      src={image.sourceUrl}
      alt={image.altText || hero.title}
      width={image.width}
      height={image.height}
      config={{
        ...heroMedia,
        layoutVariant: layout,
        fit:
          heroMedia.fit === "original" &&
          image.width &&
          image.height &&
          image.width / image.height < 0.95
            ? "editorial-portrait"
            : heroMedia.fit,
      }}
      priority
      showOriginalBadge={Boolean(config.heroMediaPreviewOriginal)}
      className={cn(
        layout === "floating-card" && "rounded-[var(--radius-3xl)]",
        layout === "luxury" && "shadow-editorial",
      )}
    />
  ) : null;

  const shell = (children: ReactNode) => (
    <header
      className={cn(
        "blog-hero relative overflow-hidden border-b border-border/40",
        `blog-hero--${layout}`,
        `blog-hero-preset--${preset.hero.variant}`,
      )}
    >
      {preset.hero.overlay !== "none" && layout !== "full-bleed" ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            preset.hero.overlay === "gradient" &&
              "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.08] via-background to-background",
            preset.hero.overlay === "soft" &&
              "bg-gradient-to-b from-surface-cream/80 to-background",
          )}
          aria-hidden
        />
      ) : null}
      {children}
      <div
        className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground/70 lg:flex"
        aria-hidden
      >
        <span className="text-[0.625rem] uppercase tracking-[0.18em]">Scroll</span>
        <span className="h-6 w-px bg-gradient-to-b from-border to-transparent" />
      </div>
    </header>
  );

  if (layout === "full-bleed" && media) {
    return shell(
      <div className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <BlogBreadcrumb items={doc.breadcrumbs} />
        </div>
        <div className="mt-6">{media}</div>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">{copy}</div>
      </div>,
    );
  }

  if (layout === "image-focus") {
    return shell(
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <BlogBreadcrumb items={doc.breadcrumbs} />
        <div className="mt-10 space-y-10">
          {media}
          {copy}
        </div>
      </div>,
    );
  }

  if (layout === "center-focus" || layout === "minimal") {
    return shell(
      <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-8 sm:px-6">
        <BlogBreadcrumb items={doc.breadcrumbs} />
        <div className="mt-10 space-y-10">
          {copy}
          {media}
        </div>
      </div>,
    );
  }

  if (layout === "split-left") {
    return shell(
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <BlogBreadcrumb items={doc.breadcrumbs} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {media}
          {copy}
        </div>
      </div>,
    );
  }

  if (layout === "floating-card") {
    return shell(
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <BlogBreadcrumb items={doc.breadcrumbs} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {copy}
          <div className="rounded-[var(--radius-3xl)] bg-surface-glass p-3 shadow-editorial ring-1 ring-border/40">
            {media}
          </div>
        </div>
      </div>,
    );
  }

  if (layout === "luxury" || layout === "medical-journal") {
    return shell(
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <BlogBreadcrumb items={doc.breadcrumbs} />
        <div className="mt-12 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          {copy}
          {media}
        </div>
      </div>,
    );
  }

  /* editorial | magazine | split-right | default */
  return shell(
    <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <BlogBreadcrumb items={doc.breadcrumbs} />
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {copy}
        {media}
      </div>
    </div>,
  );
});

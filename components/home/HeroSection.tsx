"use client";

import { ArrowRight, Lock, MapPin, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HERO_IMAGE_SRC = "/images/hero-model.png";
const DEFAULT_HERO_BACKGROUND_SRC = "/images/hero-background.png";
const DEFAULT_TITLE =
  "Cosmetic Surgery & Hair Transplant Clinic in South Delhi";
const DEFAULT_SUBTITLE =
  "Advanced Hair Restoration, PRP Therapy, Skin, Anti-Aging & Body Contouring by Dr. Sandeep Bhasin.";

/** @deprecated Prefer elementOverrides; kept for ADR-015 propOverrides compat. */
export type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  backgroundSrc?: string;
};

export function HeroSection(legacyProps: HeroSectionProps = {}) {
  const { config } = useStaticEditContext();

  const title = resolveElementText(
    config,
    "home.hero.heading",
    legacyProps.title ?? DEFAULT_TITLE,
  );
  const subtitle = resolveElementText(
    config,
    "home.hero.subtitle",
    legacyProps.subtitle ?? DEFAULT_SUBTITLE,
  );
  const imageSrc = resolveElementField(
    config,
    "home.hero.heroImage",
    "src",
    legacyProps.imageSrc ?? DEFAULT_HERO_IMAGE_SRC,
  );
  const backgroundSrc = resolveElementField(
    config,
    "home.hero.background",
    "src",
    legacyProps.backgroundSrc ?? DEFAULT_HERO_BACKGROUND_SRC,
  );
  const imageAlt = resolveElementField(
    config,
    "home.hero.heroImage",
    "alt",
    "Care Well Medical Centre — patient portrait",
  );
  const objectFit = resolveElementField<"contain" | "cover" | "fill">(
    config,
    "home.hero.heroImage",
    "objectFit",
    "contain",
  );
  const badge = resolveElementText(
    config,
    "home.hero.badge",
    "Chittaranjan Park · South Delhi",
  );
  const rating = resolveElementField(config, "home.hero.rating", "value", "4.3");
  const experience = resolveElementText(
    config,
    "home.hero.experience",
    "20+ Yrs · 10,000+ Procedures",
  );
  const primaryLabel = resolveElementField(
    config,
    "home.hero.primaryButton",
    "label",
    "Book Free Consultation",
  );
  const primaryHref = resolveElementField(
    config,
    "home.hero.primaryButton",
    "href",
    "/contact",
  );
  const secondaryLabel = resolveElementField(
    config,
    "home.hero.secondaryButton",
    "label",
    "Explore Treatments",
  );
  const secondaryHref = resolveElementField(
    config,
    "home.hero.secondaryButton",
    "href",
    "/services",
  );
  const privacyNote = resolveElementText(
    config,
    "home.hero.privacyNote",
    "100% private · Response within 2 hours · No spam",
  );

  const titleIsDefault = title === DEFAULT_TITLE;

  return (
    <section className="hero-compact relative overflow-hidden bg-background">
      <EditableElement
        id="home.hero.background"
        kind="image"
        field="src"
        defaultValue={DEFAULT_HERO_BACKGROUND_SRC}
        className="absolute inset-0"
      >
        {() => (
          <Image
            src={backgroundSrc}
            alt=""
            fill
            priority
            aria-hidden
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
      </EditableElement>

      <div className="container-content relative">
        <div className="grid items-center gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-10 lg:pb-0 lg:pt-12">
          <div className="max-w-[34rem] lg:self-center lg:pb-12">
            <EditableElement
              id="home.hero.badge"
              kind="badge"
              defaultValue="Chittaranjan Park · South Delhi"
              as="div"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5"
            >
              {({ value }) => (
                <>
                  <MapPin
                    className="size-3.5 text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-primary">
                    {value || badge}
                  </span>
                </>
              )}
            </EditableElement>

            <EditableElement
              id="home.hero.heading"
              kind="heading"
              defaultValue={DEFAULT_TITLE}
              as="h1"
              className="mt-5 text-[clamp(2rem,3.2vw+0.75rem,3.125rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#0A2540]"
            >
              {({ value }) =>
                (value || title) === DEFAULT_TITLE || titleIsDefault ? (
                  <>
                    Cosmetic Surgery{" "}
                    <span className="text-primary">&amp; Hair Transplant</span>{" "}
                    Clinic in South Delhi
                  </>
                ) : (
                  value || title
                )
              }
            </EditableElement>

            <EditableElement
              id="home.hero.subtitle"
              kind="paragraph"
              defaultValue={DEFAULT_SUBTITLE}
              as="p"
              className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-[#4B5563] md:text-[1.125rem]"
            >
              {({ value }) => value || subtitle}
            </EditableElement>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <EditableElement
                id="home.hero.rating"
                kind="statistic"
                field="value"
                defaultValue="4.3"
                className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-surface px-3.5 py-2 shadow-xs"
              >
                {({ value }) => (
                  <>
                    <div className="flex items-center gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="size-3.5 fill-[#FABB05] text-[#FABB05]"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <span className="text-[0.875rem] font-semibold text-foreground">
                      {value || rating}
                    </span>
                    <GoogleMark />
                    <span className="sr-only">
                      {value || rating} out of 5 on Google
                    </span>
                  </>
                )}
              </EditableElement>

              <EditableElement
                id="home.hero.experience"
                kind="badge"
                defaultValue="20+ Yrs · 10,000+ Procedures"
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-2 shadow-xs"
              >
                {({ value }) => (
                  <>
                    <span className="flex size-5 items-center justify-center rounded-full bg-success-500">
                      <ShieldCheck
                        className="size-3 text-white"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    </span>
                    <span className="text-[0.875rem] font-medium text-foreground">
                      {value || experience}
                    </span>
                  </>
                )}
              </EditableElement>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <EditableElement
                id="home.hero.primaryButton"
                kind="button"
                field="label"
                defaultValue="Book Free Consultation"
                as="div"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? primaryHref)}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-lg bg-[#2D2926] px-6 text-white hover:bg-[#2D2926]/90 no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? primaryLabel)}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                )}
              </EditableElement>

              <EditableElement
                id="home.hero.secondaryButton"
                kind="button"
                field="label"
                defaultValue="Explore Treatments"
                as="div"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? secondaryHref)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "rounded-lg border-[#2D2926]/25 bg-surface px-6 text-[#2D2926] hover:bg-surface/90 no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? secondaryLabel)}
                  </Link>
                )}
              </EditableElement>
            </div>

            <EditableElement
              id="home.hero.privacyNote"
              kind="caption"
              defaultValue="100% private · Response within 2 hours · No spam"
              as="p"
              className="mt-4 flex items-center gap-1.5 text-[0.8125rem] text-[#9CA3AF]"
            >
              {({ value }) => (
                <>
                  <Lock
                    className="size-3.5 shrink-0 text-[#E07A3D]"
                    aria-hidden
                  />
                  {value || privacyNote}
                </>
              )}
            </EditableElement>
          </div>

          <EditableElement
            id="home.hero.heroImage"
            kind="image"
            field="src"
            defaultValue={DEFAULT_HERO_IMAGE_SRC}
            className="relative mx-auto flex w-full max-w-md items-end self-end lg:mx-0 lg:h-full lg:min-h-[32rem] lg:max-w-none"
          >
            {() => (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent lg:absolute lg:inset-0 lg:aspect-auto">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  priority
                  className={cn(
                    "object-bottom",
                    objectFit === "cover"
                      ? "object-cover"
                      : objectFit === "fill"
                        ? "object-fill"
                        : "object-contain",
                  )}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
            )}
          </EditableElement>
        </div>
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

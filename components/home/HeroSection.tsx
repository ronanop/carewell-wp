"use client";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
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

const TRUST_STRIP = [
  {
    id: "home.hero.trustStrip.surgeons",
    icon: UserRound,
    title: "Expert Surgeons",
    subtitle: "MBBS | MS | MCh",
  },
  {
    id: "home.hero.trustStrip.safe",
    icon: ShieldCheck,
    title: "Safe & Trusted",
    subtitle: "NABH Standards",
  },
  {
    id: "home.hero.trustStrip.appointments",
    icon: CalendarDays,
    title: "Quick Appointments",
    subtitle: "Flexible Timings",
  },
] as const;

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

  const titleIsDefault = title === DEFAULT_TITLE;

  const renderCtaButtons = () => (
    <>
      <EditableElement
        id="home.hero.primaryButton"
        kind="button"
        field="label"
        defaultValue="Book Free Consultation"
        as="div"
        className="w-full sm:w-auto"
      >
        {({ fields }) => (
          <Link
            href={String(fields.href ?? primaryHref)}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 w-full rounded-xl bg-[#18181B] px-6 text-white shadow-md hover:bg-[#18181B]/90 no-underline hover:no-underline sm:h-11 sm:w-auto sm:rounded-lg",
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
        className="w-full sm:w-auto"
      >
        {({ fields }) => (
          <Link
            href={String(fields.href ?? secondaryHref)}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 w-full rounded-xl border-[#0A2540]/15 bg-white px-6 text-[#0A2540] hover:bg-white/90 no-underline hover:no-underline sm:h-11 sm:w-auto sm:rounded-lg sm:border-[#2D2926]/25",
            )}
          >
            {String(fields.label ?? secondaryLabel)}
          </Link>
        )}
      </EditableElement>
    </>
  );

  return (
    <section
      className={cn(
        "hero-compact relative overflow-hidden",
        "bg-[linear-gradient(180deg,#FBF8F4_0%,#F3EEE6_55%,#EDE7DE_100%)]",
      )}
    >
      {/* Soft medical atmosphere — photo bg on desktop, subtle lines on mobile */}
      <EditableElement
        id="home.hero.background"
        kind="image"
        field="src"
        defaultValue={DEFAULT_HERO_BACKGROUND_SRC}
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        {() => (
          <Image
            src={backgroundSrc}
            alt=""
            fill
            priority
            aria-hidden
            className="object-cover object-center opacity-90"
            sizes="100vw"
          />
        )}
      </EditableElement>
      <div
        className="pointer-events-none absolute inset-0 lg:hidden"
        aria-hidden
      >
        <svg
          className="absolute -right-8 bottom-[18%] h-[42%] w-[70%] text-white/50"
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 180C60 140 110 200 160 160C210 120 260 150 320 110"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M0 210C70 170 120 230 170 190C220 150 270 180 320 145"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M40 240C90 200 140 250 190 210C240 170 280 200 320 175"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </svg>
      </div>

      <div className="container-content relative">
        <div className="grid items-center gap-0 pb-0 pt-6 sm:gap-5 sm:pt-10 md:pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-10 lg:pb-0 lg:pt-12">
          {/* Copy column — centered on mobile, left on desktop */}
          <div className="mx-auto w-full max-w-[24.375rem] text-center lg:mx-0 lg:max-w-[34rem] lg:self-center lg:pb-12 lg:text-left">
            <EditableElement
              id="home.hero.badge"
              kind="badge"
              defaultValue="Chittaranjan Park · South Delhi"
              as="div"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0A2540]/06 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-sm"
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
              className="mt-4 text-[2.03rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#0A2540] sm:mt-5 sm:text-[clamp(2.32rem,3.71vw+0.87rem,3.625rem)] sm:leading-[1.12]"
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
              className="mt-3 text-[0.9375rem] leading-relaxed text-[#64748B] sm:mt-5 sm:max-w-xl sm:text-[1.0625rem] md:text-[1.125rem] lg:mx-0"
            >
              {({ value }) => value || subtitle}
            </EditableElement>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-7 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 lg:justify-start">
              <EditableElement
                id="home.hero.rating"
                kind="statistic"
                field="value"
                defaultValue="4.3"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white px-3 py-2.5 shadow-[0_8px_24px_-12px_rgb(10_37_64/0.35)] sm:rounded-full sm:px-3.5 sm:py-2 sm:shadow-xs"
              >
                {({ value }) => (
                  <>
                    <div className="flex items-center gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="size-3 fill-[#FABB05] text-[#FABB05] sm:size-3.5"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <span className="text-[0.875rem] font-semibold text-[#0A2540]">
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white px-3 py-2.5 shadow-[0_8px_24px_-12px_rgb(10_37_64/0.35)] sm:rounded-full sm:px-3.5 sm:py-2 sm:shadow-xs"
              >
                {({ value }) => (
                  <>
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                      <ShieldCheck
                        className="size-3 text-white"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    </span>
                    <span className="text-left text-[0.75rem] font-medium leading-snug text-[#0A2540] sm:text-[0.875rem]">
                      {value || experience}
                    </span>
                  </>
                )}
              </EditableElement>
            </div>

            {/* Desktop CTAs — copy column only */}
            <div className="mt-5 hidden w-full flex-col gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:justify-center lg:flex lg:justify-start">
              {renderCtaButtons()}
            </div>
          </div>

          {/* Portrait — fades into background on mobile */}
          <EditableElement
            id="home.hero.heroImage"
            kind="image"
            field="src"
            defaultValue={DEFAULT_HERO_IMAGE_SRC}
            className="relative mx-auto -mt-14 flex w-full max-w-[22rem] items-end self-end sm:mt-0 sm:max-w-md lg:mx-0 lg:h-full lg:min-h-[32rem] lg:max-w-none"
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
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#EDE7DE] via-[#EDE7DE]/70 to-transparent lg:hidden"
                  aria-hidden
                />
              </div>
            )}
          </EditableElement>
        </div>

        {/* Trust strip — glued to image bottom via negative margin */}
        <div className="relative z-10 -mt-6 px-0 sm:-mt-8 lg:mt-0 lg:pb-10">
          <ul
            className="mx-auto grid max-w-[24.375rem] grid-cols-3 divide-x divide-[#0A2540]/08 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_16px_40px_-20px_rgb(10_37_64/0.35)] sm:max-w-xl lg:max-w-3xl"
            aria-label="Clinic trust signals"
          >
            {TRUST_STRIP.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className="flex flex-col items-center gap-1 px-2 py-3.5 text-center sm:px-4 sm:py-4"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-9">
                    <Icon className="size-4 sm:size-[1.125rem]" aria-hidden />
                  </span>
                  <EditableElement
                    id={`${item.id}.title`}
                    kind="label"
                    defaultValue={item.title}
                    as="p"
                    className="text-[0.6875rem] font-semibold leading-tight text-[#0A2540] sm:text-[0.8125rem]"
                  >
                    {({ value }) => value || item.title}
                  </EditableElement>
                  <EditableElement
                    id={`${item.id}.subtitle`}
                    kind="caption"
                    defaultValue={item.subtitle}
                    as="p"
                    className="text-[0.625rem] leading-snug text-[#64748B] sm:text-[0.75rem]"
                  >
                    {({ value }) => value || item.subtitle}
                  </EditableElement>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile CTAs — below trust strip */}
        <div className="mx-auto mt-4 flex w-full max-w-[24.375rem] flex-col gap-2.5 pb-5 sm:mt-5 sm:max-w-xl sm:flex-row sm:items-center sm:justify-center sm:pb-8 lg:hidden">
          {renderCtaButtons()}
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
      className="size-3.5 shrink-0 sm:size-4"
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

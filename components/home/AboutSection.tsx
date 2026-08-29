"use client";

import {
  ArrowRight,
  Clock,
  Headphones,
  Monitor,
  PersonStanding,
  Scissors,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  HOME_ABOUT_FEATURE_LEFT_DEFAULTS,
  HOME_ABOUT_FEATURE_RIGHT_DEFAULTS,
  HOME_ABOUT_VALUE_DEFAULTS,
} from "@/components/home/homeDoctorsLocation.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HEADING = "Redefining Aesthetic & Cosmetic Care.";
const DEFAULT_BODY =
  "Care Well Medical Centre: We believe in enhancing your natural features safely, responsibly, and ethically.";
const DEFAULT_FEATURES_HEADING = "Our Special Features.";
const DEFAULT_BUTTON_LABEL = "Discover Our Full Story";
const DEFAULT_BUTTON_HREF = "/about";

const GOLD = "text-accent-gold-500";
const NAVY = "text-[#0A2540]";

/** 2×3 grid order: left/right pairs interleaved for CSS grid-cols-2. */
const FEATURE_ITEMS: Array<{
  id: string;
  defaultLabel: string;
  Icon: LucideIcon;
}> = [
  {
    id: "home.about.feature.left.0",
    defaultLabel: HOME_ABOUT_FEATURE_LEFT_DEFAULTS[0],
    Icon: Sparkles,
  },
  {
    id: "home.about.feature.right.0",
    defaultLabel: HOME_ABOUT_FEATURE_RIGHT_DEFAULTS[0],
    Icon: PersonStanding,
  },
  {
    id: "home.about.feature.left.1",
    defaultLabel: HOME_ABOUT_FEATURE_LEFT_DEFAULTS[1],
    Icon: Zap,
  },
  {
    id: "home.about.feature.right.1",
    defaultLabel: HOME_ABOUT_FEATURE_RIGHT_DEFAULTS[1],
    Icon: Scissors,
  },
  {
    id: "home.about.feature.left.2",
    defaultLabel: HOME_ABOUT_FEATURE_LEFT_DEFAULTS[2],
    Icon: ShieldPlus,
  },
  {
    id: "home.about.feature.right.2",
    defaultLabel: HOME_ABOUT_FEATURE_RIGHT_DEFAULTS[2],
    Icon: UserRound,
  },
];

const VALUE_ICONS: LucideIcon[] = [Clock, Headphones, Monitor, ShieldCheck];

function FeatureCard({
  id,
  label,
  Icon,
}: {
  id: string;
  label: string;
  Icon: LucideIcon;
}) {
  return (
    <li
      className={cn(
        "flex min-h-[6.5rem] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/70 px-3 py-4 text-center",
        "shadow-[0_4px_18px_rgb(10_37_64/0.07)] transition-[transform,box-shadow,border-color] duration-200",
        "hover:-translate-y-1 hover:border-accent-gold-300 hover:shadow-[0_10px_24px_rgb(10_37_64/0.1)]",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full bg-accent-gold-50 sm:size-10",
          GOLD,
        )}
      >
        <Icon className="size-4 sm:size-5" strokeWidth={1.5} aria-hidden />
      </span>
      <EditableElement
        id={id}
        kind="list-item"
        defaultValue={label}
        as="span"
        className={cn(
          "mt-2 text-[0.975rem] font-semibold leading-snug sm:text-[1.1rem]",
          NAVY,
        )}
      >
        {({ value }) => value || label}
      </EditableElement>
    </li>
  );
}

function ValueCard({
  index,
  title,
  description,
  imageSrc,
  imageAlt,
  href,
}: {
  index: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}) {
  const Icon = VALUE_ICONS[index % VALUE_ICONS.length] ?? Clock;
  const fallback =
    HOME_ABOUT_VALUE_DEFAULTS[index % HOME_ABOUT_VALUE_DEFAULTS.length];
  const resolvedSrc = imageSrc.trim() || fallback.imageSrc;
  const resolvedAlt = imageAlt.trim() || fallback.imageAlt;

  return (
    <article
      className={cn(
        "group relative flex h-[17.6rem] w-full flex-col overflow-hidden rounded-2xl p-3 sm:h-[22rem] sm:rounded-[1.25rem] sm:p-5",
        "shadow-[0_8px_28px_rgb(10_37_64/0.18)]",
      )}
    >
      {/* Full-bleed photo — always present; Studio can replace via imageSrc */}
      <EditableElement
        id={`home.about.values.item.${index}.imageSrc`}
        kind="image"
        field="src"
        defaultValue={resolvedSrc}
        defaults={{ src: resolvedSrc, alt: resolvedAlt }}
        className="absolute inset-0 z-0"
      >
        {({ value }) => {
          const src = String(value || resolvedSrc).trim() || resolvedSrc;
          return (
            <Image
              src={src}
              alt={resolvedAlt}
              fill
              className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 22vw"
            />
          );
        }}
      </EditableElement>

      {/* Dark overlay keeps white type readable while photo still shows through */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-br from-[#0A2540]/62 via-[#0A2540]/55 to-[#0A2540]/72"
        aria-hidden
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm sm:size-10">
          <Icon
            className={cn("size-3.5 sm:size-5", GOLD)}
            strokeWidth={1.75}
            aria-hidden
          />
        </span>

        <EditableElement
          id={`home.about.values.item.${index}.title`}
          kind="heading"
          defaultValue={title}
          as="h3"
          className="mt-2 line-clamp-2 font-heading text-[0.975rem] font-semibold leading-snug text-white sm:mt-3.5 sm:text-[1.275rem]"
        >
          {({ value }) => value || title}
        </EditableElement>

        <EditableElement
          id={`home.about.values.item.${index}.description`}
          kind="paragraph"
          defaultValue={description}
          as="p"
          className="mt-1 flex-1 text-[0.825rem] leading-snug text-white/90 sm:mt-1.5 sm:text-[1rem] sm:leading-relaxed"
        >
          {({ value }) => value || description}
        </EditableElement>

        <div className="mt-auto flex shrink-0 justify-end pt-2 sm:pt-3">
          <Link
            href={href}
            aria-label={`${title} — learn more`}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full bg-white sm:size-10",
              "text-[#0A2540] shadow-sm transition-transform duration-200",
              "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2540]",
            )}
          >
            <ArrowRight className="size-3.5 sm:size-4" strokeWidth={2.25} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function AboutSection() {
  const { config } = useStaticEditContext();

  const heading = resolveElementText(
    config,
    "home.about.heading",
    DEFAULT_HEADING,
  );
  const body = resolveElementText(config, "home.about.body.1", DEFAULT_BODY);
  const featuresHeading = resolveElementText(
    config,
    "home.about.featuresHeading",
    DEFAULT_FEATURES_HEADING,
  );
  const buttonLabel = resolveElementField(
    config,
    "home.about.button",
    "label",
    DEFAULT_BUTTON_LABEL,
  );
  const buttonHref = resolveElementField(
    config,
    "home.about.button",
    "href",
    DEFAULT_BUTTON_HREF,
  );

  const values = resolveRepeaterItems(
    config,
    "home.about.values",
    HOME_ABOUT_VALUE_DEFAULTS.map((item) => ({ ...item })),
    ["title", "description", "href", "imageSrc", "imageAlt"],
  );

  return (
    <section className="bg-white">
      <div className="container-content section-padding">
        <div className="grid items-start gap-8 lg:-ml-4 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:gap-20 xl:gap-24">
          {/* Left column */}
          <StaggerReveal className="min-w-0 lg:pr-3" stepMs={75}>
            <EditableElement
              id="home.about.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h2"
              className={cn(
                "mt-3 max-w-lg font-heading text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.8rem]",
                NAVY,
              )}
            >
              {({ value }) => value || heading}
            </EditableElement>

            <EditableElement
              id="home.about.body.1"
              kind="paragraph"
              defaultValue={DEFAULT_BODY}
              as="p"
              className="mt-4 max-w-lg text-[1.15rem] font-medium leading-[1.75] text-slate-600 sm:mt-5 sm:text-[1.3rem]"
            >
              {({ value }) => value || body}
            </EditableElement>

            <EditableElement
              id="home.about.featuresHeading"
              kind="heading"
              defaultValue={DEFAULT_FEATURES_HEADING}
              as="h3"
              className={cn(
                "mt-8 font-heading text-[1.4rem] font-semibold tracking-[-0.02em] sm:mt-9 sm:text-[1.8rem]",
                NAVY,
              )}
            >
              {({ value }) => value || featuresHeading}
            </EditableElement>

            <ul className="mt-3.5 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4">
              {FEATURE_ITEMS.map((item) => (
                <FeatureCard
                  key={item.id}
                  id={item.id}
                  label={resolveElementText(
                    config,
                    item.id,
                    item.defaultLabel,
                  )}
                  Icon={item.Icon}
                />
              ))}
            </ul>

            <div className="mt-7 sm:mt-8">
              <EditableElement
                id="home.about.button"
                kind="button"
                field="label"
                defaultValue={DEFAULT_BUTTON_LABEL}
                as="div"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? buttonHref)}
                    className={cn(
                      "group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0A2540] px-6 text-[1.05rem] font-semibold text-white no-underline shadow-[0_8px_18px_rgb(10_37_64/0.16)]",
                      "transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#163A5C] hover:shadow-[0_12px_24px_rgb(10_37_64/0.2)] hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? buttonLabel)}
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  </Link>
                )}
              </EditableElement>
            </div>
          </StaggerReveal>

          {/* Right column — value cards */}
          <StaggerReveal
            as="ul"
            stepMs={80}
            className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-5"
          >              {values.map((item) => {
                const fallback =
                  HOME_ABOUT_VALUE_DEFAULTS[
                    item.__index % HOME_ABOUT_VALUE_DEFAULTS.length
                  ];
                return (
                  <li key={item.__index} className="h-full min-w-0">
                    <ValueCard
                      index={item.__index}
                      title={String(item.title ?? fallback.title)}
                      description={String(
                        item.description ?? fallback.description,
                      )}
                      imageSrc={String(item.imageSrc || fallback.imageSrc)}
                      imageAlt={String(item.imageAlt || fallback.imageAlt)}
                      href={String(item.href || fallback.href)}
                    />
                  </li>
                );
              })}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

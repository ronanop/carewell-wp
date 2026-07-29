"use client";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  ClipboardCheck,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  HOME_DOCTOR_HIGHLIGHT_DEFAULTS,
  HOME_DOCTOR_STAT_DEFAULTS,
} from "@/components/home/homeDoctorsLocation.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_PHOTO_SRC = "/images/dr-sandeep-bhasin-cutout.png";
const DEFAULT_PHOTO_ALT = "Dr. Sandeep Bhasin";
const DEFAULT_LABEL = "Meet Your Surgeon";
const DEFAULT_HEADING = "Meet Your Cosmetic Surgeon";
const DEFAULT_NAME = "Dr. Sandeep Bhasin";
const DEFAULT_DESCRIPTION =
  "Senior cosmetic and hair transplant surgeon with 22+ years of clinical experience, and founder of Care Well Medical Centre. Every consultation is doctor-led — focused on safety, honest guidance, and natural-looking results you can trust.";
const DEFAULT_NOTE =
  "Performed 10,000+ cosmetic and hair procedures for patients across South Delhi and Delhi NCR.";
const DEFAULT_PRIMARY_LABEL = "View Full Doctor Profile";
const DEFAULT_PRIMARY_HREF = "/about/dr-sandeep-bhasin";
const DEFAULT_SECONDARY_LABEL = "Book Consultation";
const DEFAULT_SECONDARY_HREF = "/contact";

const STAT_VISUALS: {
  Icon: LucideIcon;
  iconWrap: string;
  iconColor: string;
}[] = [
  {
    Icon: ShieldCheck,
    iconWrap: "bg-[#F97316]/15",
    iconColor: "text-[#EA580C]",
  },
  {
    Icon: BarChart3,
    iconWrap: "bg-[#22C55E]/15",
    iconColor: "text-[#16A34A]",
  },
  {
    Icon: UserRound,
    iconWrap: "bg-[#3B82F6]/15",
    iconColor: "text-[#2563EB]",
  },
];

const HIGHLIGHT_ICONS: LucideIcon[] = [
  Building2,
  Stethoscope,
  Sparkles,
  HeartHandshake,
  BadgeCheck,
  ClipboardCheck,
  ShieldCheck,
];

function DotCluster({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-14 w-12 opacity-[0.32]",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, #94A3B8 1.1px, transparent 1.2px)",
        backgroundSize: "8px 8px",
      }}
    />
  );
}

export function DoctorsSection() {
  const { config } = useStaticEditContext();

  const photoSrc = resolveElementField(
    config,
    "home.doctors.photo",
    "src",
    DEFAULT_PHOTO_SRC,
  );
  const photoAlt = resolveElementField(
    config,
    "home.doctors.photo",
    "alt",
    DEFAULT_PHOTO_ALT,
  );
  const label = resolveElementText(config, "home.doctors.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.doctors.heading",
    DEFAULT_HEADING,
  );
  const name = resolveElementText(config, "home.doctors.name", DEFAULT_NAME);
  const description = resolveElementText(
    config,
    "home.doctors.description",
    DEFAULT_DESCRIPTION,
  );
  const note = resolveElementText(config, "home.doctors.note", DEFAULT_NOTE);
  const primaryLabel = resolveElementField(
    config,
    "home.doctors.primaryButton",
    "label",
    DEFAULT_PRIMARY_LABEL,
  );
  const primaryHref = resolveElementField(
    config,
    "home.doctors.primaryButton",
    "href",
    DEFAULT_PRIMARY_HREF,
  );
  const secondaryLabel = resolveElementField(
    config,
    "home.doctors.secondaryButton",
    "label",
    DEFAULT_SECONDARY_LABEL,
  );
  const secondaryHref = resolveElementField(
    config,
    "home.doctors.secondaryButton",
    "href",
    DEFAULT_SECONDARY_HREF,
  );

  const stats = resolveRepeaterItems(
    config,
    "home.doctors.stats",
    HOME_DOCTOR_STAT_DEFAULTS.map((item) => ({ ...item })),
    ["value", "label"],
  );
  const highlights = resolveRepeaterItems(
    config,
    "home.doctors.highlights",
    HOME_DOCTOR_HIGHLIGHT_DEFAULTS.map((text) => ({ text })),
    ["text"],
  );

  const primaryStats = stats.slice(0, 3);
  const overflowStats = stats.slice(3);

  return (
    <section className="bg-background">
      <style>{`
        @keyframes doctors-fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .doctors-fade-up {
          animation: doctors-fade-up 0.55s ease-out both;
        }

        .doctors-stat-stagger-0 {
          animation: doctors-fade-up 0.5s ease-out 0ms both;
        }
        .doctors-stat-stagger-1 {
          animation: doctors-fade-up 0.5s ease-out 80ms both;
        }
        .doctors-stat-stagger-2 {
          animation: doctors-fade-up 0.5s ease-out 160ms both;
        }

        .doctors-feature-fade {
          animation: doctors-fade-up 0.5s ease-out 120ms both;
        }

        @media (prefers-reduced-motion: reduce) {
          .doctors-fade-up,
          .doctors-stat-stagger-0,
          .doctors-stat-stagger-1,
          .doctors-stat-stagger-2,
          .doctors-feature-fade {
            animation: none !important;
          }
        }
      `}</style>

      <div className="container-content section-padding">
        <div className="mx-auto max-w-[75rem]">
          {/* Header */}
          <StaggerReveal className="mx-auto flex max-w-[44rem] flex-col items-center text-center" stepMs={70}>
            <div className="flex w-full max-w-[18rem] items-center gap-3 sm:max-w-[22rem] sm:gap-4">
              <span aria-hidden className="h-px flex-1 bg-[#CBD5E1]" />
              <EditableElement
                id="home.doctors.label"
                kind="label"
                defaultValue={DEFAULT_LABEL}
                as="p"
                className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#64748B] sm:text-[0.75rem]"
              >
                {({ value }) => value || label}
              </EditableElement>
              <span aria-hidden className="h-px flex-1 bg-[#CBD5E1]" />
            </div>

            <EditableElement
              id="home.doctors.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h2"
              className="mt-4 font-heading text-[1.625rem] font-bold leading-[1.15] tracking-tight text-[#0A2540] sm:mt-5 sm:text-[2.25rem] lg:text-[3.5rem]"
            >
              {({ value }) => value || heading}
            </EditableElement>

            <EditableElement
              id="home.doctors.name"
              kind="heading"
              defaultValue={DEFAULT_NAME}
              as="h3"
              className="mt-2 font-heading text-[1.25rem] font-bold leading-tight tracking-tight text-[#0A2540] sm:text-[1.75rem] lg:text-[2.125rem]"
            >
              {({ value }) => value || name}
            </EditableElement>

            <EditableElement
              id="home.doctors.description"
              kind="paragraph"
              defaultValue={DEFAULT_DESCRIPTION}
              as="p"
              className="mt-3.5 max-w-[20.5rem] px-1 text-[0.9375rem] leading-[1.7] text-[#64748B] sm:mt-5 sm:max-w-[43.75rem] sm:px-0 sm:text-body-lg sm:leading-[1.7]"
            >
              {({ value }) => value || description}
            </EditableElement>

            <EditableElement
              id="home.doctors.note"
              kind="paragraph"
              defaultValue={DEFAULT_NOTE}
              as="p"
              className="mt-5 max-w-[19rem] px-1 text-center text-[0.875rem] font-medium leading-[1.55] tracking-[0.015em] text-[#475569] sm:mt-6 sm:max-w-[43.75rem] sm:px-0 sm:text-[0.9375rem] sm:font-normal sm:leading-snug sm:tracking-normal sm:text-[#64748B]"
            >
              {({ value }) => value || note}
            </EditableElement>
          </StaggerReveal>

          {/* Main composition: portrait + structured stats */}
          <div
            className={cn(
              "mt-10 overflow-visible rounded-[1.25rem] bg-white sm:mt-12 sm:rounded-[2rem]",
              "shadow-[0_16px_40px_-18px_rgb(10_37_64/0.14)]",
              "ring-1 ring-[#0A2540]/[0.05]",
            )}
          >
            <div className="grid items-stretch overflow-visible lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
              {/* Portrait column — stretch to row height, pin cutout to shared bottom edge with stats */}
              <div className="relative flex items-end justify-center overflow-visible px-4 pb-0 pt-6 sm:px-8 sm:pt-8 lg:px-6 lg:pt-6">
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-[48%] size-[min(88%,16rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_68%)] sm:size-[min(88%,18rem)]"
                />
                <DotCluster className="left-[12%] top-[14%] hidden sm:block" />

                <div
                  className={cn(
                    "doctors-fade-up relative z-[1] w-[58%] max-w-[12rem] sm:w-[70%] sm:max-w-[14rem] lg:w-full lg:max-w-[15.5rem]",
                  )}
                >
                  <EditableElement
                    id="home.doctors.photo"
                    kind="image"
                    field="src"
                    defaultValue={DEFAULT_PHOTO_SRC}
                    className="relative mx-auto aspect-[3/4] w-full overflow-visible"
                  >
                    {() => (
                      <Image
                        src={photoSrc}
                        alt={photoAlt}
                        fill
                        className="origin-bottom scale-[1.2] object-contain object-bottom drop-shadow-[0_18px_28px_rgba(10,37,64,0.22)]"
                        sizes="(max-width: 1024px) 70vw, 15rem"
                        priority={false}
                      />
                    )}
                  </EditableElement>
                </div>
              </div>

              {/* Stats column — no top padding on stacked layout so first card meets portrait cutout */}
              <div className="flex flex-col justify-center gap-3 px-4 pb-4 pt-0 sm:gap-4 sm:px-6 sm:pb-6 sm:pt-0 lg:gap-6 lg:p-8 lg:pl-4">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:gap-6">
                  {primaryStats.map((stat, index) => {
                    const value = String(stat.value ?? "");
                    const statLabel = String(stat.label ?? "");
                    const visual = STAT_VISUALS[index] ?? STAT_VISUALS[0];
                    const Icon = visual.Icon;
                    const isThird = index === 2;
                    const staggerClass =
                      index === 0
                        ? "doctors-stat-stagger-0"
                        : index === 1
                          ? "doctors-stat-stagger-1"
                          : "doctors-stat-stagger-2";

                    return (
                      <li
                        key={stat.__index}
                        className={cn(
                          staggerClass,
                          "flex min-h-[4.75rem] items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3.5 sm:min-h-[5.5rem] sm:gap-3.5 sm:rounded-2xl sm:px-4 sm:py-4",
                          "shadow-[0_4px_14px_-8px_rgb(10_37_64/0.1)]",
                          isThird && "sm:col-span-2",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10",
                            visual.iconWrap,
                          )}
                        >
                          <Icon
                            className={cn("size-[1.125rem]", visual.iconColor)}
                            strokeWidth={2}
                            aria-hidden
                          />
                        </span>
                        <div className="min-w-0 text-left">
                          <EditableElement
                            id={`home.doctors.stats.item.${stat.__index}.value`}
                            kind="statistic"
                            field="value"
                            defaultValue={value}
                            as="p"
                            className="font-heading text-[1.5rem] font-bold leading-none tracking-tight text-[#0A2540] sm:text-[2.25rem]"
                          >
                            {({ value: v }) => String(v || value)}
                          </EditableElement>
                          <EditableElement
                            id={`home.doctors.stats.item.${stat.__index}.label`}
                            kind="label"
                            field="label"
                            defaultValue={statLabel}
                            as="p"
                            className="mt-1 text-[0.8125rem] leading-snug text-[#64748B] sm:mt-1.5 sm:text-[0.875rem]"
                          >
                            {({ value: v }) => String(v || statLabel)}
                          </EditableElement>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {overflowStats.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {overflowStats.map((stat) => {
                      const value = String(stat.value ?? "");
                      const statLabel = String(stat.label ?? "");
                      return (
                        <li
                          key={stat.__index}
                          className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-left shadow-sm"
                        >
                          <EditableElement
                            id={`home.doctors.stats.item.${stat.__index}.value`}
                            kind="statistic"
                            field="value"
                            defaultValue={value}
                            as="p"
                            className="font-heading text-lg font-bold text-[#0A2540]"
                          >
                            {({ value: v }) => String(v || value)}
                          </EditableElement>
                          <EditableElement
                            id={`home.doctors.stats.item.${stat.__index}.label`}
                            kind="label"
                            field="label"
                            defaultValue={statLabel}
                            as="p"
                            className="mt-1 text-small text-muted-foreground"
                          >
                            {({ value: v }) => String(v || statLabel)}
                          </EditableElement>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>

          {/* Feature grid — unified panel */}
          <div
            className={cn(
              "doctors-feature-fade mt-6 rounded-2xl bg-[#F8FAFC] p-4 sm:mt-8 sm:rounded-3xl sm:p-6 lg:p-7",
              "ring-1 ring-[#0A2540]/[0.04]",
            )}
          >
            <ul className="grid grid-cols-2 gap-x-3 gap-y-3.5 sm:gap-x-6 sm:gap-y-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5">
              {highlights.map((item, index) => {
                const text = String(item.text ?? "");
                const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length];
                const isLast = index === highlights.length - 1;
                const centerOnMobile = isLast && highlights.length % 2 === 1;
                const centerOnDesktop = isLast && highlights.length % 3 === 1;

                return (
                  <li
                    key={item.__index}
                    className={cn(
                      "flex items-center gap-2.5 text-left sm:gap-3",
                      centerOnMobile && "col-span-2 justify-center",
                      centerOnDesktop && "lg:col-span-3 lg:justify-center",
                      centerOnMobile &&
                        !centerOnDesktop &&
                        "lg:col-span-1 lg:justify-start",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] sm:size-10">
                      <Icon
                        className="size-[1.05rem] text-[#0A2540]"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </span>
                    <EditableElement
                      id={`home.doctors.highlights.item.${item.__index}.text`}
                      kind="list-item"
                      defaultValue={text}
                      as="span"
                      className="text-[0.8125rem] font-semibold leading-snug text-[#0A2540] sm:text-[0.9375rem]"
                    >
                      {({ value }) => value || text}
                    </EditableElement>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <EditableElement
              id="home.doctors.primaryButton"
              kind="button"
              field="label"
              defaultValue={DEFAULT_PRIMARY_LABEL}
              as="div"
              className="sm:min-w-[14.5rem]"
            >
              {({ fields }) => (
                <Link
                  href={String(fields.href ?? primaryHref)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 w-full cursor-pointer rounded-full bg-[#0A2540] px-7 text-base text-white",
                    "hover:bg-[#0A2540]/90 no-underline hover:no-underline",
                    "motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02]",
                  )}
                >
                  {String(fields.label ?? primaryLabel)}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </EditableElement>
            <EditableElement
              id="home.doctors.secondaryButton"
              kind="button"
              field="label"
              defaultValue={DEFAULT_SECONDARY_LABEL}
              as="div"
              className="sm:min-w-[14.5rem]"
            >
              {({ fields }) => (
                <Link
                  href={String(fields.href ?? secondaryHref)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 w-full cursor-pointer rounded-full border-[#0A2540]/35 bg-white px-7 text-base text-[#0A2540]",
                    "hover:bg-[#0A2540]/5 no-underline hover:no-underline",
                    "motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02]",
                  )}
                >
                  {String(fields.label ?? secondaryLabel)}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </EditableElement>
          </div>
        </div>
      </div>
    </section>
  );
}

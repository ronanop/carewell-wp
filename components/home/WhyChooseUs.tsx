"use client";

import {
  BadgeCheck,
  Clock,
  HeartHandshake,
  Monitor,
  ShieldCheck,
  Stethoscope,
  Users,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

import {
  HOME_WHY_DEFAULTS,
  HOME_WHY_TRUST_DEFAULTS,
} from "@/components/home/homeContent.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/experience/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin-portrait.png";
const DEFAULT_DOCTOR_IMAGE_ALT = "Dr. Sandeep Bhasin";
const DEFAULT_LABEL = "We Stand Out";
const DEFAULT_HEADING = "Why Choose Care Well Medical Centre?";
const DEFAULT_DESCRIPTION =
  "Experience expert care, advanced technology, and a patient-first approach — all under one roof.";
const DEFAULT_DOCTOR_NAME = "Dr. Sandeep Bhasin";
const DEFAULT_DOCTOR_TITLE = "Senior Cosmetic & Aesthetic Surgeon";
const DEFAULT_DOCTOR_LOCATION = "Care Well Medical Centre, Delhi";
const DEFAULT_FOOTER_HEADING =
  "Serving South Delhi & Delhi NCR with Doctor-Led Cosmetic Care";
const DEFAULT_FOOTER_BODY =
  "Care Well Medical Centre is located at House No. 1, NRI Complex, Chittaranjan Park (CR Park), New Delhi 110019, and serves patients from Greater Kailash, Kalkaji, Nehru Place, Alaknanda, Saket, and across Delhi NCR. Under the supervision of Dr. Sandeep Bhasin, senior cosmetic and hair transplant surgeon, we provide advanced cosmetic surgery, hair restoration, and skin treatments in a safe medical setting.";

const NAVY = "text-[#0A2540]";
const CARD_SHADOW = "shadow-[0_10px_40px_-12px_rgba(10,37,64,0.12)]";

const FEATURE_THEMES = [
  {
    iconBg: "bg-[#FFE8D6]",
    iconColor: "text-[#E8945A]",
    accent: "bg-[#F0A574]",
  },
  {
    iconBg: "bg-[#DCECFF]",
    iconColor: "text-[#5B9FE8]",
    accent: "bg-[#6BA8EC]",
  },
  {
    iconBg: "bg-[#DDF5E5]",
    iconColor: "text-[#4CAF7A]",
    accent: "bg-[#6BC48F]",
  },
  {
    iconBg: "bg-[#EDE0FF]",
    iconColor: "text-[#9B7AD8]",
    accent: "bg-[#B08DE8]",
  },
] as const;

const FEATURE_ICONS: LucideIcon[] = [
  Stethoscope,
  HeartHandshake,
  Monitor,
  ClipboardCheck,
];

const TRUST_ICONS: LucideIcon[] = [ShieldCheck, Users, Clock, BadgeCheck];

const STAGGER_CLASS = [
  "lg:translate-x-0",
  "lg:translate-x-5",
  "lg:translate-x-10",
  "lg:translate-x-[3.75rem]",
] as const;

function SectionDivider() {
  return (
    <div
      className="mx-auto mt-5 flex w-full max-w-[11rem] items-center gap-2"
      aria-hidden
    >
      <span className="h-px flex-1 bg-slate-200" />
      <span className="size-1.5 shrink-0 rotate-45 bg-slate-300" />
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function DecorativeDots({ className }: { className?: string }) {
  return (
    <div
      className={cn("grid grid-cols-4 gap-1.5", className)}
      aria-hidden
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="size-1 rounded-full bg-slate-300/80"
        />
      ))}
    </div>
  );
}

function DoctorPortrait({
  imageSrc,
  imageAlt,
  name,
  title,
  location,
}: {
  imageSrc: string;
  imageAlt: string;
  name: string;
  title: string;
  location: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-full w-full max-w-[17rem] flex-col overflow-hidden rounded-[1.5rem] bg-white px-5 pb-6 pt-7 sm:max-w-[20rem] sm:rounded-[1.75rem] sm:px-7 sm:pb-8 sm:pt-9",
        CARD_SHADOW,
        "ring-1 ring-black/[0.03]",
      )}
    >
      <DecorativeDots className="absolute left-5 top-5 z-20" />

      <div className="relative mx-auto flex min-h-0 w-full max-w-[13.5rem] flex-1 flex-col items-center justify-center sm:max-w-[15.5rem]">
        <div className="relative flex aspect-[3/4] w-full min-h-0 flex-1 items-end justify-center lg:aspect-auto lg:max-h-none">
          <span
            className="pointer-events-none absolute left-1/2 top-[48%] size-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,186,140,0.62)_0%,rgba(255,220,190,0.38)_42%,transparent_70%)] lg:size-[min(100%,18rem)]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute left-1/2 top-[48%] size-[11rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,160,0.45)_0%,transparent_68%)] blur-[2px] lg:size-[min(100%,14rem)]"
            aria-hidden
          />

          <EditableElement
            id="home.why.doctorImage"
            kind="image"
            field="src"
            defaultValue={DEFAULT_DOCTOR_IMAGE_SRC}
            className="relative z-10 h-full w-full overflow-hidden rounded-[1.25rem]"
          >
            {() => (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="scale-x-[-1] object-cover object-top"
                sizes="(max-width: 1024px) 15rem, 16rem"
              />
            )}
          </EditableElement>
        </div>
      </div>

      <div className="relative z-10 mt-5 shrink-0 text-center lg:mt-6">
        <EditableElement
          id="home.why.doctorName"
          kind="heading"
          defaultValue={DEFAULT_DOCTOR_NAME}
          as="p"
          className={cn(
            "font-heading text-[1.0625rem] font-bold sm:text-body",
            NAVY,
          )}
        >
          {({ value }) => value || name}
        </EditableElement>
        <EditableElement
          id="home.why.doctorTitle"
          kind="paragraph"
          defaultValue={DEFAULT_DOCTOR_TITLE}
          as="p"
          className="mt-1 text-small text-slate-500"
        >
          {({ value }) => value || title}
        </EditableElement>
        <EditableElement
          id="home.why.doctorLocation"
          kind="paragraph"
          defaultValue={DEFAULT_DOCTOR_LOCATION}
          as="p"
          className="mt-0.5 text-small text-slate-500"
        >
          {({ value }) => value || location}
        </EditableElement>
      </div>
    </div>
  );
}

export function WhyChooseUs() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(config, "home.why.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.why.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.why.description",
    DEFAULT_DESCRIPTION,
  );
  const footerHeading = resolveElementText(
    config,
    "home.why.footerHeading",
    DEFAULT_FOOTER_HEADING,
  );
  const footerBody = resolveElementText(
    config,
    "home.why.footerBody",
    DEFAULT_FOOTER_BODY,
  );
  const doctorImageSrc = resolveElementField(
    config,
    "home.why.doctorImage",
    "src",
    DEFAULT_DOCTOR_IMAGE_SRC,
  );
  const doctorImageAlt = resolveElementField(
    config,
    "home.why.doctorImage",
    "alt",
    DEFAULT_DOCTOR_IMAGE_ALT,
  );
  const doctorName = resolveElementText(
    config,
    "home.why.doctorName",
    DEFAULT_DOCTOR_NAME,
  );
  const doctorTitle = resolveElementText(
    config,
    "home.why.doctorTitle",
    DEFAULT_DOCTOR_TITLE,
  );
  const doctorLocation = resolveElementText(
    config,
    "home.why.doctorLocation",
    DEFAULT_DOCTOR_LOCATION,
  );

  const features = resolveRepeaterItems(
    config,
    "home.why",
    HOME_WHY_DEFAULTS.map((item) => ({ ...item })),
    ["title", "description"],
  );

  const trustItems = resolveRepeaterItems(
    config,
    "home.why.trust",
    HOME_WHY_TRUST_DEFAULTS.map((item) => ({ ...item })),
    ["title"],
  );

  return (
    <section className="bg-white">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <EditableElement
            id="home.why.label"
            kind="label"
            defaultValue={DEFAULT_LABEL}
            as="p"
            className="text-label uppercase tracking-[0.14em] text-[#5BA3E8]"
          >
            {({ value }) => value || label}
          </EditableElement>
          <EditableElement
            id="home.why.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className={cn(
              "mt-3 font-heading text-[1.5rem] font-bold leading-tight tracking-tight sm:text-h2",
              NAVY,
            )}
          >
            {({ value }) => value || heading}
          </EditableElement>
          <SectionDivider />
          <EditableElement
            id="home.why.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mx-auto mt-4 max-w-2xl text-body leading-relaxed text-slate-500 sm:mt-5"
          >
            {({ value }) => value || description}
          </EditableElement>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)] lg:items-stretch lg:gap-24 xl:gap-32">
          <ul className="flex flex-col gap-3.5 sm:gap-5">
            {features.map((feature) => {
              const index = feature.__index;
              const Icon =
                FEATURE_ICONS[index % FEATURE_ICONS.length] ?? Stethoscope;
              const theme =
                FEATURE_THEMES[index % FEATURE_THEMES.length] ??
                FEATURE_THEMES[0];
              const title = String(feature.title ?? "");
              const featureDescription = String(feature.description ?? "");
              const number = String(index + 1).padStart(2, "0");
              const stagger =
                STAGGER_CLASS[Math.min(index, STAGGER_CLASS.length - 1)] ??
                STAGGER_CLASS[0];

              return (
                <li
                  key={feature.__index}
                  className={cn(
                    "relative overflow-hidden rounded-xl bg-white p-4 transition-transform duration-300 ease-out sm:rounded-2xl sm:p-6",
                    CARD_SHADOW,
                    "ring-1 ring-black/[0.03]",
                    "motion-safe:hover:-translate-y-0.5",
                    stagger,
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-y-4 right-0 w-[3px] rounded-l-full",
                      theme.accent,
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 select-none font-heading text-[3.5rem] font-bold leading-none tabular-nums text-slate-100/90 sm:right-9 sm:text-[5.25rem]",
                    )}
                    aria-hidden
                  >
                    {number}
                  </span>

                  <div className="relative z-10 flex items-start gap-3 pr-7 sm:gap-5 sm:pr-12">
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full sm:size-[3.25rem]",
                        theme.iconBg,
                        theme.iconColor,
                      )}
                    >
                      <Icon
                        className="size-5 sm:size-[1.35rem]"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <EditableElement
                        id={`home.why.item.${feature.__index}.title`}
                        kind="heading"
                        defaultValue={title}
                        as="h3"
                        className={cn(
                          "font-heading text-[1rem] font-bold leading-snug sm:text-body",
                          NAVY,
                        )}
                      >
                        {({ value }) => value || title}
                      </EditableElement>
                      <EditableElement
                        id={`home.why.item.${feature.__index}.description`}
                        kind="paragraph"
                        defaultValue={featureDescription}
                        as="p"
                        className="mt-1.5 text-[0.8125rem] leading-relaxed text-slate-500 sm:text-small"
                      >
                        {({ value }) => value || featureDescription}
                      </EditableElement>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center lg:h-full lg:justify-end">
            <DoctorPortrait
              imageSrc={doctorImageSrc}
              imageAlt={doctorImageAlt}
              name={doctorName}
              title={doctorTitle}
              location={doctorLocation}
            />
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon =
              TRUST_ICONS[item.__index % TRUST_ICONS.length] ?? ShieldCheck;
            const title = String(item.title ?? "");

            return (
              <li
                key={item.__index}
                className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 sm:rounded-2xl sm:px-5 sm:py-3.5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center text-[#5BA3E8]">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <EditableElement
                  id={`home.why.trust.item.${item.__index}.title`}
                  kind="heading"
                  defaultValue={title}
                  as="p"
                  className="text-small font-medium leading-snug text-slate-600"
                >
                  {({ value }) => value || title}
                </EditableElement>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 text-center sm:mt-14">
          <EditableElement
            id="home.why.footerHeading"
            kind="heading"
            defaultValue={DEFAULT_FOOTER_HEADING}
            as="h3"
            className={cn(
              "font-heading text-[1.125rem] font-bold leading-snug sm:text-h3",
              NAVY,
            )}
          >
            {({ value }) => value || footerHeading}
          </EditableElement>
          <EditableElement
            id="home.why.footerBody"
            kind="paragraph"
            defaultValue={DEFAULT_FOOTER_BODY}
            as="p"
            className="mx-auto mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-slate-500 sm:mt-4 sm:text-body"
          >
            {({ value }) => value || footerBody}
          </EditableElement>
        </div>
      </div>
    </section>
  );
}

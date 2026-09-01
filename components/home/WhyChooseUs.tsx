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
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin-portrait.png";
const DEFAULT_DOCTOR_IMAGE_ALT = "Dr. Sandeep Bhasin";
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
      className="mx-auto mt-4 flex w-full max-w-[11rem] items-center gap-2 sm:mt-5"
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
        "relative flex w-full flex-col overflow-hidden rounded-[1.25rem] bg-white",
        CARD_SHADOW,
        "ring-1 ring-black/[0.03]",
        // Mobile: edge-to-edge card within container
        "max-lg:pb-4",
        // Desktop: original compact portrait card
        "lg:mx-auto lg:h-full lg:max-w-[20rem] lg:rounded-[1.75rem] lg:px-7 lg:pb-8 lg:pt-9",
      )}
    >
      <DecorativeDots className="absolute left-5 top-5 z-20 max-lg:hidden" />

      <div className="relative w-full max-lg:min-h-[14rem] max-lg:aspect-[5/3] lg:mx-auto lg:flex lg:min-h-0 lg:max-w-[15.5rem] lg:flex-1 lg:flex-col lg:items-center lg:justify-center">
        <div className="relative h-full w-full lg:flex lg:aspect-[3/4] lg:min-h-0 lg:flex-1 lg:items-end lg:justify-center">
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 size-[min(100%,18rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,186,140,0.62)_0%,rgba(255,220,190,0.38)_42%,transparent_70%)] lg:top-[48%] lg:size-[min(100%,18rem)]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 size-[min(85%,15rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,160,0.45)_0%,transparent_68%)] blur-[2px] lg:top-[48%] lg:size-[min(100%,14rem)]"
            aria-hidden
          />

          <EditableElement
            id="home.why.doctorImage"
            kind="image"
            field="src"
            defaultValue={DEFAULT_DOCTOR_IMAGE_SRC}
            className="relative z-10 h-full w-full overflow-hidden max-lg:rounded-t-[1.25rem] lg:rounded-[1.25rem]"
          >
            {() => (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="scale-x-[-1] object-cover object-[center_12%] max-lg:object-[center_15%] lg:object-top"
                sizes="(max-width: 767px) 100vw, (max-width: 1024px) 20rem, 16rem"
              />
            )}
          </EditableElement>
        </div>
      </div>

      <div className="relative z-10 shrink-0 px-4 pt-3 text-center max-lg:px-5 sm:pt-4 lg:mt-6 lg:px-0">
        <EditableElement
          id="home.why.doctorName"
          kind="heading"
          defaultValue={DEFAULT_DOCTOR_NAME}
          as="p"
          className={cn(
            "font-heading text-[1.05rem] font-bold max-lg:text-[1.15rem] sm:text-[1.2rem]",
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
          className="mt-1 text-[0.78rem] font-medium leading-[1.5] text-slate-700 max-lg:text-[0.85rem] sm:text-[1.1rem]"
        >
          {({ value }) => value || title}
        </EditableElement>
        <EditableElement
          id="home.why.doctorLocation"
          kind="paragraph"
          defaultValue={DEFAULT_DOCTOR_LOCATION}
          as="p"
          className="mt-0.5 text-[0.78rem] font-medium leading-[1.5] text-slate-700 max-lg:text-[0.85rem] sm:text-[1.1rem]"
        >
          {({ value }) => value || location}
        </EditableElement>
      </div>
    </div>
  );
}

export function WhyChooseUs() {
  const { config } = useStaticEditContext();

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
      <div className="container-content section-padding lg:pt-8">
        <StaggerReveal className="mx-auto max-w-3xl text-center" stepMs={70}>
          <EditableElement
            id="home.why.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className={cn(
              "mt-3 font-heading text-[1.65rem] font-bold leading-tight tracking-tight sm:text-[2.7rem]",
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
            className="mx-auto mt-4 max-w-2xl text-[0.78rem] font-medium leading-[1.5] text-slate-700 sm:mt-5 sm:text-[1.25rem] sm:leading-[1.7]"
          >
            {({ value }) => value || description}
          </EditableElement>
        </StaggerReveal>

        <div className="mt-8 grid items-start gap-5 sm:mt-10 sm:gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,20rem)] lg:items-stretch lg:gap-24 xl:gap-32">
          <StaggerReveal as="ul" stepMs={85} className="flex flex-col gap-3.5 sm:gap-5">
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
                    "relative overflow-hidden rounded-xl bg-white p-3 transition-transform duration-300 ease-out sm:rounded-2xl sm:p-6",
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

                  <div className="relative z-10 flex items-start gap-2 pr-7 sm:gap-5 sm:pr-12">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full sm:size-[3.25rem]",
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
                          "font-heading text-[0.95rem] font-bold leading-snug sm:text-[1.3rem]",
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
                        className="mt-1.5 text-[0.75rem] font-medium leading-relaxed text-slate-700 sm:text-[1.15rem]"
                      >
                        {({ value }) => value || featureDescription}
                      </EditableElement>
                    </div>
                  </div>
                </li>
              );
            })}
          </StaggerReveal>

          <StaggerReveal className="w-full max-lg:min-w-0 lg:flex lg:h-full lg:justify-end">
            <DoctorPortrait
              imageSrc={doctorImageSrc}
              imageAlt={doctorImageAlt}
              name={doctorName}
              title={doctorTitle}
              location={doctorLocation}
            />
          </StaggerReveal>
        </div>

        <StaggerReveal
          as="ul"
          stepMs={70}
          className="mt-8 grid grid-cols-1 gap-2.5 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        >          {trustItems.map((item) => {
            const Icon =
              TRUST_ICONS[item.__index % TRUST_ICONS.length] ?? ShieldCheck;
            const title = String(item.title ?? "");

            return (
              <li
                key={item.__index}
                className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 sm:rounded-2xl sm:px-5 sm:py-3.5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center text-[#5BA3E8] sm:size-9">
                  <Icon className="size-4 sm:size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <EditableElement
                  id={`home.why.trust.item.${item.__index}.title`}
                  kind="heading"
                  defaultValue={title}
                  as="p"
                  className="text-[0.75rem] font-semibold leading-snug text-slate-700 sm:text-[1.1rem]"
                >
                  {({ value }) => value || title}
                </EditableElement>
              </li>
            );
          })}
        </StaggerReveal>

        <StaggerReveal className="mt-8 text-center sm:mt-14" stepMs={70}>
          <EditableElement
            id="home.why.footerHeading"
            kind="heading"
            defaultValue={DEFAULT_FOOTER_HEADING}
            as="h3"
            className={cn(
              "font-heading text-[1.1rem] font-bold leading-snug sm:text-[2.25rem]",
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
            className="mx-auto mt-3 max-w-3xl text-[0.78rem] font-medium leading-[1.5] text-slate-700 sm:mt-4 sm:text-[1.25rem] sm:leading-[1.7] lg:max-w-[75rem]"
          >
            {({ value }) => value || footerBody}
          </EditableElement>
        </StaggerReveal>
      </div>
    </section>
  );
}

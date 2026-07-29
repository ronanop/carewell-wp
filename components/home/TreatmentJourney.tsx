"use client";

import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  CircleArrowRight,
  Clock,
  Lock,
  ScanFace,
  Search,
  Shield,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { HOME_JOURNEY_DEFAULTS } from "@/components/home/homeContent.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { resolveElementText } from "@/lib/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const STEP_ICONS: LucideIcon[] = [Search, UserRound, Calendar, ScanFace];

const STEP_THEMES = [
  {
    glow: "bg-[radial-gradient(circle,rgba(251,146,60,0.45)_0%,rgba(253,186,116,0.22)_42%,transparent_70%)]",
    badge: "bg-[#F97316]",
    label: "text-[#EA580C]",
  },
  {
    glow: "bg-[radial-gradient(circle,rgba(96,165,250,0.45)_0%,rgba(147,197,253,0.22)_42%,transparent_70%)]",
    badge: "bg-[#3B82F6]",
    label: "text-[#2563EB]",
  },
  {
    glow: "bg-[radial-gradient(circle,rgba(74,222,128,0.42)_0%,rgba(134,239,172,0.2)_42%,transparent_70%)]",
    badge: "bg-[#22C55E]",
    label: "text-[#16A34A]",
  },
  {
    glow: "bg-[radial-gradient(circle,rgba(192,132,252,0.42)_0%,rgba(216,180,254,0.2)_42%,transparent_70%)]",
    badge: "bg-[#A855F7]",
    label: "text-[#9333EA]",
  },
] as const;

const TRUST_ITEMS = [
  {
    icon: Lock,
    label: "100% Private & Confidential",
  },
  {
    icon: Clock,
    label: "Response within 2 Hours",
  },
  {
    icon: CheckCircle2,
    label: "No Spam. Only Genuine Support",
  },
] as const;

const DEFAULT_LABEL = "Fast, Safe & Doctor-Led Solutions";
const DEFAULT_HEADING = "Your Treatment Journey at Care Well Medical Centre";
const DEFAULT_DESCRIPTION =
  "A clear, doctor-led process focused on safety, results, and personalised care.";
const BRAND_NAME = "Care Well Medical Centre";
const NAVY = "text-[#0A2540]";

function highlightBrandName(text: string) {
  const idx = text.indexOf(BRAND_NAME);
  if (idx === -1) {
    const short = "Care Well";
    const shortIdx = text.indexOf(short);
    if (shortIdx === -1) return text;
    return (
      <>
        {text.slice(0, shortIdx)}
        <span className="text-primary">{short}</span>
        {text.slice(shortIdx + short.length)}
      </>
    );
  }

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary">{BRAND_NAME}</span>
      {text.slice(idx + BRAND_NAME.length)}
    </>
  );
}

function parseStepTitle(title: string, index: number) {
  const match = title.match(/^Step\s+(\d+)\s*:\s*(.+)$/i);
  if (match) {
    const n = Number(match[1]);
    return {
      number: String(n).padStart(2, "0"),
      stepLabel: `STEP ${n}`,
      displayTitle: match[2].trim(),
    };
  }

  const n = index + 1;
  return {
    number: String(n).padStart(2, "0"),
    stepLabel: `STEP ${n}`,
    displayTitle: title,
  };
}

export function TreatmentJourney() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(config, "home.journey.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.journey.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.journey.description",
    DEFAULT_DESCRIPTION,
  );

  const steps = resolveRepeaterItems(
    config,
    "home.journey",
    HOME_JOURNEY_DEFAULTS.map((item) => ({ ...item })),
    ["title", "description"],
  );

  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <StaggerReveal className="mx-auto max-w-3xl text-center" stepMs={70}>
          <EditableElement
            id="home.journey.label"
            kind="label"
            defaultValue={DEFAULT_LABEL}
            as="p"
            className="text-label uppercase tracking-[0.12em] text-slate-400"
          >
            {({ value }) => value || label}
          </EditableElement>
          <EditableElement
            id="home.journey.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className={cn(
              "mt-3 font-heading text-[1.5rem] font-bold leading-tight tracking-tight sm:text-h2",
              NAVY,
            )}
          >
            {({ value }) => highlightBrandName(value || heading)}
          </EditableElement>
          <EditableElement
            id="home.journey.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mx-auto mt-3 max-w-2xl text-body leading-relaxed text-slate-500 sm:mt-4 sm:text-body-lg"
          >
            {({ value }) => value || description}
          </EditableElement>
        </StaggerReveal>

        <StaggerReveal
          as="ol"
          stepMs={90}
          className="mt-10 flex flex-col items-center sm:mt-14 lg:mt-16 lg:flex-row lg:items-start lg:justify-center"
        >          {steps.flatMap((step, index) => {
            const Icon = STEP_ICONS[step.__index % STEP_ICONS.length] ?? Search;
            const theme =
              STEP_THEMES[step.__index % STEP_THEMES.length] ?? STEP_THEMES[0];
            const title = String(step.title ?? "");
            const stepDescription = String(step.description ?? "");
            const { number, stepLabel, displayTitle } = parseStepTitle(
              title,
              step.__index,
            );
            const showConnector = index < steps.length - 1;

            const stepItem = (
              <li
                key={`step-${step.__index}`}
                className="flex w-full max-w-[15rem] flex-col items-center text-center sm:max-w-[16.5rem] lg:max-w-none lg:flex-1 lg:px-2 xl:px-3"
              >
                <div className="relative flex size-[7.25rem] items-center justify-center sm:size-[9.25rem]">
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 scale-110 rounded-full blur-2xl",
                      theme.glow,
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-[8%] rounded-full opacity-90 blur-xl",
                      theme.glow,
                    )}
                    aria-hidden
                  />
                  <span className="relative z-10 flex size-[4.25rem] items-center justify-center rounded-full bg-white shadow-[0_10px_28px_-12px_rgba(10,37,64,0.28)] ring-1 ring-black/[0.04] sm:size-[5.25rem]">
                    <Icon
                      className={cn("size-6 sm:size-8", NAVY)}
                      strokeWidth={1.6}
                      aria-hidden
                    />
                  </span>
                  <span
                    className={cn(
                      "absolute right-2.5 top-2.5 z-20 flex size-6 items-center justify-center rounded-full text-[0.625rem] font-semibold tracking-wide text-white shadow-sm sm:right-4 sm:top-4 sm:size-8 sm:text-xs",
                      theme.badge,
                    )}
                  >
                    {number}
                  </span>
                </div>

                <p
                  className={cn(
                    "mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] sm:mt-5",
                    theme.label,
                  )}
                >
                  {stepLabel}
                </p>

                <EditableElement
                  id={`home.journey.item.${step.__index}.title`}
                  kind="heading"
                  defaultValue={title}
                  as="h3"
                  className={cn(
                    "mt-2 text-[1.0625rem] font-bold leading-snug sm:text-[1.125rem]",
                    NAVY,
                  )}
                >
                  {({ value }) => {
                    const resolved = value || title;
                    return (
                      parseStepTitle(resolved, step.__index).displayTitle ||
                      displayTitle
                    );
                  }}
                </EditableElement>
                <EditableElement
                  id={`home.journey.item.${step.__index}.description`}
                  kind="paragraph"
                  defaultValue={stepDescription}
                  as="p"
                  className="mt-2.5 max-w-[15rem] text-[0.875rem] leading-relaxed text-slate-500"
                >
                  {({ value }) => value || stepDescription}
                </EditableElement>
              </li>
            );

            if (!showConnector) return [stepItem];

            return [
              stepItem,
              <li
                key={`connector-${step.__index}`}
                className="flex list-none items-center justify-center py-4 text-slate-300 sm:py-6 lg:mt-[3.75rem] lg:shrink-0 lg:self-start lg:px-1 lg:py-0 xl:mt-16 xl:px-2"
                aria-hidden
              >
                <CircleArrowRight className="size-5 rotate-90 sm:size-6 lg:rotate-0" />
              </li>,
            ];
          })}
        </StaggerReveal>

        <StaggerReveal
          stepMs={80}
          className="mx-auto mt-10 max-w-4xl rounded-2xl bg-[#F4F6F8] px-4 py-4 shadow-[0_8px_30px_-18px_rgba(10,37,64,0.28)] sm:mt-16 sm:px-7 sm:py-6"
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-5 sm:text-left">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB] sm:size-12">
              <Shield className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn("text-[1rem] font-semibold leading-snug sm:text-[1.0625rem]", NAVY)}>
                Not sure which treatment is right for you?
              </p>
              <p className="mt-1 text-body text-slate-500">Talk to our doctor.</p>
            </div>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 w-full shrink-0 rounded-lg bg-[#0A2540] px-5 text-white no-underline shadow-sm transition-colors duration-200 hover:bg-[#0A2540]/90 hover:no-underline sm:w-auto",
              )}
            >
              Book Doctor Consultation
              <span aria-hidden className="ml-1.5">
                →
              </span>
            </Link>
          </div>
        </StaggerReveal>

        <StaggerReveal
          as="ul"
          stepMs={70}
          className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3"
        >
          {TRUST_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-[0.8125rem] text-slate-500"
            >
              <item.icon
                className="size-3.5 shrink-0 text-slate-400"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{item.label}</span>
            </li>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

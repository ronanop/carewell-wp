"use client";

import Link from "next/link";
import { Calendar, Search, Sparkles, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { HOME_JOURNEY_DEFAULTS } from "@/components/home/homeContent.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import { resolveElementText } from "@/lib/experience/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/experience/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const STEP_ICONS: LucideIcon[] = [Search, UserRound, Calendar, Sparkles];

const DEFAULT_LABEL = "Fast, Safe & Doctor-Led Solutions";
const DEFAULT_HEADING = "Your Treatment Journey at Care Well Medical Centre";
const DEFAULT_DESCRIPTION =
  "A clear, doctor-led process focused on safety, results, and personalised care.";

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
        <div className="mx-auto max-w-3xl text-center">
          <EditableElement
            id="home.journey.label"
            kind="label"
            defaultValue={DEFAULT_LABEL}
            as="p"
            className="text-label uppercase text-slate-400"
          >
            {({ value }) => value || label}
          </EditableElement>
          <EditableElement
            id="home.journey.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.journey.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mt-4 text-body-lg text-muted-foreground"
          >
            {({ value }) => value || description}
          </EditableElement>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => {
            const Icon = STEP_ICONS[step.__index % STEP_ICONS.length] ?? Search;
            const title = String(step.title ?? "");
            const stepDescription = String(step.description ?? "");

            return (
              <li
                key={step.__index}
                className="flex flex-col items-center text-center"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-primary-50 text-[#0A2540]">
                  <Icon className="size-6" aria-hidden />
                </span>
                <EditableElement
                  id={`home.journey.item.${step.__index}.title`}
                  kind="heading"
                  defaultValue={title}
                  as="h3"
                  className="mt-5 text-[1.0625rem] font-semibold leading-snug text-[#0A2540]"
                >
                  {({ value }) => value || title}
                </EditableElement>
                <EditableElement
                  id={`home.journey.item.${step.__index}.description`}
                  kind="paragraph"
                  defaultValue={stepDescription}
                  as="p"
                  className="mt-2 text-small text-muted-foreground"
                >
                  {({ value }) => value || stepDescription}
                </EditableElement>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 text-center">
          <p className="text-body text-muted-foreground">
            Not sure which treatment is right for you? Talk to our doctor.
          </p>
          <div className="mt-5">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline",
              )}
            >
              Book Doctor Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

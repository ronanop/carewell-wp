"use client";

import Link from "next/link";

import { AboutReveal } from "@/components/about/AboutReveal";
import { clinicDetails } from "@/components/about/content";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HEADING = "Begin your transformation";
const DEFAULT_BUTTON_LABEL = "Book consultation";
const DEFAULT_BUTTON_HREF = "/contact";

export function AboutVisitCta() {
  const { config } = useStaticEditContext();

  const heading = resolveElementText(
    config,
    "about.cta.heading",
    DEFAULT_HEADING,
  );
  const buttonLabel = resolveElementField(
    config,
    "about.cta.button",
    "label",
    DEFAULT_BUTTON_LABEL,
  );
  const buttonHref = resolveElementField(
    config,
    "about.cta.button",
    "href",
    DEFAULT_BUTTON_HREF,
  );

  return (
    <section
      className="relative overflow-hidden bg-primary-950"
      aria-label={heading}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, color-mix(in oklab, var(--accent-gold-400) 35%, transparent), transparent 55%), radial-gradient(ellipse at 90% 100%, color-mix(in oklab, var(--primary-500) 40%, transparent), transparent 50%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 0.7px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />

      <div className="container-content relative section-padding">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <div
            className="mx-auto mb-6 h-[2px] w-12 bg-accent-gold-400"
            aria-hidden
          />
          <EditableElement
            id="about.cta.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="font-heading text-[clamp(1.85rem,4.2vw,2.85rem)] font-bold tracking-tight text-white"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <p className="mt-5 text-body-lg leading-relaxed text-primary-100/85">
            Looking for trusted cosmetic and aesthetic care in Delhi? From skin
            rejuvenation and hair restoration to body contouring and plastic
            surgery — we are here to guide you.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <EditableElement
              id="about.cta.button"
              kind="button"
              field="label"
              defaultValue={DEFAULT_BUTTON_LABEL}
              as="div"
            >
              {({ fields }) => (
                <Link
                  href={String(fields.href ?? buttonHref)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-lg bg-white px-8 text-primary-900 shadow-md hover:bg-white/93 no-underline hover:no-underline",
                  )}
                >
                  {String(fields.label ?? buttonLabel)}
                </Link>
              )}
            </EditableElement>
            <a
              href={clinicDetails.phoneHref}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 rounded-lg border-white/45 bg-white/5 px-8 text-white backdrop-blur-sm hover:bg-white/12 no-underline hover:no-underline",
              )}
            >
              {clinicDetails.phone}
            </a>
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}

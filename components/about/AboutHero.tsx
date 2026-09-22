"use client";

import Image from "next/image";
import Link from "next/link";

import { AboutBreadcrumb } from "@/components/about/AboutBreadcrumb";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_BRAND = "Care Well Medical Centre";
const DEFAULT_HEADING = "Beauty, restored with clinical care.";
const DEFAULT_BODY =
  "For over twenty years in South Delhi, we have specialized in hair restoration, cosmetic surgery, and anti-aging — natural results, patient-first ethics.";
const DEFAULT_IMAGE_SRC = "/images/service-hero-background.jpg";
const DEFAULT_IMAGE_ALT =
  "Care Well Medical Centre — premium aesthetic care in South Delhi";
const DEFAULT_PRIMARY_LABEL = "Book consultation";
const DEFAULT_PRIMARY_HREF = "/contact";
const DEFAULT_SECONDARY_LABEL = "Meet Dr. Bhasin";
const DEFAULT_SECONDARY_HREF = "/about/dr-sandeep-bhasin";

/**
 * Full-bleed About hero — brand-first editorial plane.
 * Teal depth + gold accent; one headline, one line, CTAs.
 */
export function AboutHero() {
  const { config } = useStaticEditContext();

  const brand = resolveElementText(config, "about.hero.label", DEFAULT_BRAND);
  const heading = resolveElementText(
    config,
    "about.hero.heading",
    DEFAULT_HEADING,
  );
  const body = resolveElementText(config, "about.hero.body.0", DEFAULT_BODY);
  const imageSrc = resolveElementField(
    config,
    "about.hero.image",
    "src",
    DEFAULT_IMAGE_SRC,
  );
  const imageAlt = resolveElementField(
    config,
    "about.hero.image",
    "alt",
    DEFAULT_IMAGE_ALT,
  );
  const primaryLabel = resolveElementField(
    config,
    "about.hero.primaryButton",
    "label",
    DEFAULT_PRIMARY_LABEL,
  );
  const primaryHref = resolveElementField(
    config,
    "about.hero.primaryButton",
    "href",
    DEFAULT_PRIMARY_HREF,
  );
  const secondaryLabel = resolveElementField(
    config,
    "about.hero.secondaryButton",
    "label",
    DEFAULT_SECONDARY_LABEL,
  );
  const secondaryHref = resolveElementField(
    config,
    "about.hero.secondaryButton",
    "href",
    DEFAULT_SECONDARY_HREF,
  );

  return (
    <header className="relative isolate min-h-[min(94vh,54rem)] overflow-hidden">
      <div className="absolute inset-0">
        <EditableElement
          id="about.hero.image"
          kind="image"
          field="src"
          defaultValue={DEFAULT_IMAGE_SRC}
          className="absolute inset-0"
        >
          {() => (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="scale-105 object-cover object-[center_28%] motion-safe:animate-[about-hero-ken_28s_ease-out_forwards]"
            />
          )}
        </EditableElement>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-950/92 via-primary-900/78 to-primary-700/50"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgba(4,31,31,0.55)_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 0.65px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-950/40 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[min(94vh,54rem)] flex-col">
        <div className="container-content pt-6 sm:pt-8">
          <AboutBreadcrumb tone="on-dark" />
        </div>

        <div className="container-content flex flex-1 flex-col justify-center pb-20 pt-12 sm:pb-24 sm:pt-16 lg:pb-28">
          <div className="max-w-3xl">
            <EditableElement
              id="about.hero.label"
              kind="label"
              defaultValue={DEFAULT_BRAND}
              as="p"
              className="font-heading text-[clamp(1.4rem,3.4vw,2.25rem)] font-semibold tracking-tight text-white"
            >
              {({ value }) => value || brand}
            </EditableElement>

            <div
              className="mt-5 h-[2px] w-14 origin-left bg-accent-gold-400 motion-safe:animate-[about-rule-in_0.8s_ease-out_0.2s_both] sm:mt-6 sm:w-16"
              aria-hidden
            />

            <EditableElement
              id="about.hero.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h1"
              className="mt-6 max-w-[17ch] font-heading text-[clamp(2.15rem,5.4vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-balance text-white sm:mt-7"
            >
              {({ value }) => value || heading}
            </EditableElement>

            <EditableElement
              id="about.hero.body.0"
              kind="paragraph"
              defaultValue={DEFAULT_BODY}
              as="p"
              className="mt-6 max-w-xl text-body-lg leading-relaxed text-white/80 sm:mt-7"
            >
              {({ value }) => value || body}
            </EditableElement>

            <EditableElement
              id="about.hero.body.1"
              kind="paragraph"
              defaultValue=""
              as="p"
              className="sr-only"
            >
              {() => null}
            </EditableElement>

            <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <EditableElement
                id="about.hero.primaryButton"
                kind="button"
                field="label"
                defaultValue={DEFAULT_PRIMARY_LABEL}
                as="div"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? primaryHref)}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 rounded-lg bg-white px-8 text-primary-800 shadow-md transition-transform hover:bg-white/93 hover:scale-[1.02] no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? primaryLabel)}
                  </Link>
                )}
              </EditableElement>

              <EditableElement
                id="about.hero.secondaryButton"
                kind="button"
                field="label"
                defaultValue={DEFAULT_SECONDARY_LABEL}
                as="div"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? secondaryHref)}
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "h-12 rounded-lg border-white/50 bg-white/5 px-8 text-white backdrop-blur-sm hover:bg-white/12 no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? secondaryLabel)}
                  </Link>
                )}
              </EditableElement>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-70 sm:flex"
          aria-hidden
        >
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-white/70">
            Scroll
          </span>
          <span className="h-8 w-px bg-gradient-to-b from-accent-gold-400 to-transparent" />
        </div>
      </div>
    </header>
  );
}

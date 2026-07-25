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
} from "@/lib/experience/static-pages/elementOverrides";
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
 * Full-bleed About hero — brand-first, one headline, one line, CTAs.
 * Background image is the dominant visual plane (no inset media card).
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
    <header className="relative isolate min-h-[min(92vh,52rem)] overflow-hidden">
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
              className="object-cover object-[center_30%]"
            />
          )}
        </EditableElement>
        {/* Atmospheric depth — soft teal wash + left-weighted readability scrim */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-950/88 via-primary-900/72 to-primary-800/45"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#041f1f]/75 via-[#0a3f3f]/40 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fff 0.6px, transparent 0.7px)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[min(92vh,52rem)] flex-col">
        <div className="container-content pt-6 sm:pt-8">
          <AboutBreadcrumb tone="on-dark" />
        </div>

        <div className="container-content flex flex-1 flex-col justify-center pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24">
          <div className="max-w-3xl">
            <EditableElement
              id="about.hero.label"
              kind="label"
              defaultValue={DEFAULT_BRAND}
              as="p"
              className="font-heading text-[clamp(1.35rem,3.2vw,2.15rem)] font-semibold tracking-tight text-white"
            >
              {({ value }) => value || brand}
            </EditableElement>

            <div
              className="mt-4 h-px w-16 bg-accent-gold-400/90 sm:mt-5"
              aria-hidden
            />

            <EditableElement
              id="about.hero.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h1"
              className="mt-5 max-w-[18ch] font-heading text-[clamp(2rem,5vw,3.35rem)] font-bold leading-[1.12] tracking-tight text-balance text-white sm:mt-6"
            >
              {({ value }) => value || heading}
            </EditableElement>

            <EditableElement
              id="about.hero.body.0"
              kind="paragraph"
              defaultValue={DEFAULT_BODY}
              as="p"
              className="mt-5 max-w-xl text-body-lg leading-relaxed text-white/82 sm:mt-6"
            >
              {({ value }) => value || body}
            </EditableElement>

            {/* Keep body.1 editable in Studio without crowding the hero */}
            <EditableElement
              id="about.hero.body.1"
              kind="paragraph"
              defaultValue=""
              as="p"
              className="sr-only"
            >
              {() => null}
            </EditableElement>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
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
                      "h-12 rounded-lg bg-white px-7 text-primary-800 shadow-md hover:bg-white/92 no-underline hover:no-underline",
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
                      "h-12 rounded-lg border-white/45 bg-transparent px-7 text-white hover:bg-white/10 no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? secondaryLabel)}
                  </Link>
                )}
              </EditableElement>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

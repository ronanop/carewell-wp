"use client";

import Image from "next/image";

import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "Care Well Medical Centre Clinic";
const DEFAULT_HEADING =
  "About Care Well Medical Centre – Our Vision, Team & Commitment";
const DEFAULT_BODY_0 =
  "Your Trusted Destination for Advanced Cosmetic & Aesthetic Treatments";
const DEFAULT_BODY_1 =
  "Care Well Medical Centre is a trusted hair transplant and aesthetic clinic in South Delhi, led by Dr. Sandeep Bhasin. For over 20 years, we have specialized in advanced hair restoration, cosmetic surgery, and anti-aging treatments, delivering natural results with a patient-first approach.";
const DEFAULT_IMAGE_SRC = "/images/about-consultation.jpg";
const DEFAULT_IMAGE_ALT = "Consultation at Care Well Medical Centre";

export function AboutHero() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(config, "about.hero.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "about.hero.heading",
    DEFAULT_HEADING,
  );
  const body0 = resolveElementText(
    config,
    "about.hero.body.0",
    DEFAULT_BODY_0,
  );
  const body1 = resolveElementText(
    config,
    "about.hero.body.1",
    DEFAULT_BODY_1,
  );
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

  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <EditableElement
              id="about.hero.label"
              kind="label"
              defaultValue={DEFAULT_LABEL}
              as="p"
              className="text-label uppercase text-[#3B82F6]"
            >
              {({ value }) => value || label}
            </EditableElement>
            <EditableElement
              id="about.hero.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h1"
              className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]"
            >
              {({ value }) => value || heading}
            </EditableElement>
            <EditableElement
              id="about.hero.body.0"
              kind="paragraph"
              defaultValue={DEFAULT_BODY_0}
              as="p"
              className="mt-5 max-w-2xl text-body-lg font-medium leading-relaxed text-[#0A2540]/85"
            >
              {({ value }) => value || body0}
            </EditableElement>
            <EditableElement
              id="about.hero.body.1"
              kind="paragraph"
              defaultValue={DEFAULT_BODY_1}
              as="p"
              className="mt-5 max-w-2xl text-body leading-relaxed text-muted-foreground"
            >
              {({ value }) => value || body1}
            </EditableElement>
          </div>

          <EditableElement
            id="about.hero.image"
            kind="image"
            field="src"
            defaultValue={DEFAULT_IMAGE_SRC}
            className="mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none"
          >
            {() => (
              <div
                className={cn(
                  "relative aspect-[4/5] max-h-[28rem] w-full overflow-hidden rounded-2xl",
                  "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]",
                )}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 88vw, 26rem"
                  priority
                />
              </div>
            )}
          </EditableElement>
        </div>
      </div>
    </section>
  );
}

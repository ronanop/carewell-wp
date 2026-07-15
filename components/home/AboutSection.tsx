"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  HOME_ABOUT_FEATURE_LEFT_DEFAULTS,
  HOME_ABOUT_FEATURE_RIGHT_DEFAULTS,
} from "@/components/home/homeDoctorsLocation.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "About Us";
const DEFAULT_HEADING = "Redefining Aesthetic & Cosmetic Care";
const DEFAULT_BODY_1 =
  "At Care Well Medical Centre, we believe aesthetic care should enhance what is already yours — never overpower it. Our approach centres on natural-looking results that feel like you, only refined with care and precision.";
const DEFAULT_BODY_2 =
  "Every treatment plan begins with a doctor-led consultation. We take time to understand your goals, assess your unique needs, and guide you through options that are clinically sound and personally right for you.";
const DEFAULT_BODY_3 =
  "We recommend only what is appropriate — prioritising safety, honesty, and long-term wellbeing over unnecessary procedures. Your trust is the foundation of everything we do.";
const DEFAULT_FEATURES_HEADING = "Our special Features";
const DEFAULT_BUTTON_LABEL = "More About Us";
const DEFAULT_BUTTON_HREF = "/about";
const DEFAULT_IMAGE_SRC = "/images/about-consultation.jpg";
const DEFAULT_IMAGE_ALT = "Doctor consultation at Care Well Medical Centre";

function FeatureItem({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/12">
        <Check
          className="size-3.5 text-[#3B82F6]"
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
      <EditableElement
        id={id}
        kind="list-item"
        defaultValue={label}
        as="span"
        className="text-small leading-snug text-[#0A2540]/90"
      >
        {({ value }) => value || label}
      </EditableElement>
    </li>
  );
}

export function AboutSection() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(config, "home.about.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.about.heading",
    DEFAULT_HEADING,
  );
  const body1 = resolveElementText(config, "home.about.body.1", DEFAULT_BODY_1);
  const body2 = resolveElementText(config, "home.about.body.2", DEFAULT_BODY_2);
  const body3 = resolveElementText(config, "home.about.body.3", DEFAULT_BODY_3);
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
  const imageSrc = resolveElementField(
    config,
    "home.about.image",
    "src",
    DEFAULT_IMAGE_SRC,
  );
  const imageAlt = resolveElementField(
    config,
    "home.about.image",
    "alt",
    DEFAULT_IMAGE_ALT,
  );

  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <EditableElement
              id="home.about.label"
              kind="label"
              defaultValue={DEFAULT_LABEL}
              as="p"
              className="text-label uppercase text-[#3B82F6]"
            >
              {({ value }) => value || label}
            </EditableElement>
            <EditableElement
              id="home.about.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h2"
              className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
            >
              {({ value }) => value || heading}
            </EditableElement>

            <div className="mt-5 max-w-xl space-y-4 text-body leading-relaxed text-muted-foreground">
              <EditableElement
                id="home.about.body.1"
                kind="paragraph"
                defaultValue={DEFAULT_BODY_1}
                as="p"
              >
                {({ value }) => value || body1}
              </EditableElement>
              <EditableElement
                id="home.about.body.2"
                kind="paragraph"
                defaultValue={DEFAULT_BODY_2}
                as="p"
              >
                {({ value }) => value || body2}
              </EditableElement>
              <EditableElement
                id="home.about.body.3"
                kind="paragraph"
                defaultValue={DEFAULT_BODY_3}
                as="p"
              >
                {({ value }) => value || body3}
              </EditableElement>
            </div>

            <EditableElement
              id="home.about.featuresHeading"
              kind="heading"
              defaultValue={DEFAULT_FEATURES_HEADING}
              as="h3"
              className="mt-9 font-heading text-h4 font-semibold text-[#0A2540]"
            >
              {({ value }) => value || featuresHeading}
            </EditableElement>

            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              <ul className="flex flex-col gap-3">
                {HOME_ABOUT_FEATURE_LEFT_DEFAULTS.map((item, index) => (
                  <FeatureItem
                    key={index}
                    id={`home.about.feature.left.${index}`}
                    label={resolveElementText(
                      config,
                      `home.about.feature.left.${index}`,
                      item,
                    )}
                  />
                ))}
              </ul>
              <ul className="flex flex-col gap-3">
                {HOME_ABOUT_FEATURE_RIGHT_DEFAULTS.map((item, index) => (
                  <FeatureItem
                    key={index}
                    id={`home.about.feature.right.${index}`}
                    label={resolveElementText(
                      config,
                      `home.about.feature.right.${index}`,
                      item,
                    )}
                  />
                ))}
              </ul>
            </div>

            <div className="mt-9">
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
                      buttonVariants({ size: "lg" }),
                      "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? buttonLabel)}
                  </Link>
                )}
              </EditableElement>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[28rem] lg:mx-0 lg:max-w-none">
            <EditableElement
              id="home.about.image"
              kind="image"
              field="src"
              defaultValue={DEFAULT_IMAGE_SRC}
              className={cn(
                "relative aspect-[4/5] max-h-[30rem] w-full overflow-hidden rounded-2xl",
                "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]",
              )}
            >
              {() => (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 88vw, 28rem"
                />
              )}
            </EditableElement>
          </div>
        </div>
      </div>
    </section>
  );
}

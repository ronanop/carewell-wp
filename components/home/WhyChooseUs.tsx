"use client";

import {
  MessageCircle,
  Monitor,
  Share2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

import { HOME_WHY_DEFAULTS } from "@/components/home/homeContent.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/experience/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin.jpg";
const DEFAULT_DOCTOR_IMAGE_ALT = "Dr. Sandeep Bhasin";
const DEFAULT_LABEL = "We Stand Out";
const DEFAULT_HEADING = "Why Choose Care Well Medical Centre?";
const DEFAULT_FOOTER_HEADING =
  "Serving South Delhi & Delhi NCR with Doctor-Led Cosmetic Care";
const DEFAULT_FOOTER_BODY =
  "Care Well Medical Centre is located at House No. 1, NRI Complex, Chittaranjan Park (CR Park), New Delhi 110019, and serves patients from Greater Kailash, Kalkaji, Nehru Place, Alaknanda, Saket, and across Delhi NCR. Under the supervision of Dr. Sandeep Bhasin, senior cosmetic and hair transplant surgeon, we provide advanced cosmetic surgery, hair restoration, and skin treatments in a safe medical setting.";

const FEATURE_ICONS: LucideIcon[] = [
  UserRound,
  MessageCircle,
  Monitor,
  Share2,
];

function DoctorPortrait({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[18rem] lg:max-w-[20rem]">
      <EditableElement
        id="home.why.doctorImage"
        kind="image"
        field="src"
        defaultValue={DEFAULT_DOCTOR_IMAGE_SRC}
        className={cn(
          "relative aspect-[3/4] max-h-[26rem] w-full overflow-hidden rounded-2xl",
          "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]",
        )}
      >
        {() => (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 18rem, 20rem"
          />
        )}
      </EditableElement>

      <div className="mt-4 text-center">
        <p className="font-heading text-body font-bold text-[#0A2540]">
          Dr. Sandeep Bhasin
        </p>
        <p className="mt-1 text-small text-muted-foreground">
          Senior Cosmetic &amp; Aesthetic Surgeon
        </p>
        <p className="mt-0.5 text-small text-muted-foreground">
          Care Well Medical Centre, Delhi
        </p>
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

  const features = resolveRepeaterItems(
    config,
    "home.why",
    HOME_WHY_DEFAULTS.map((item) => ({ ...item })),
    ["title", "description"],
  );

  return (
    <section className="bg-muted/20">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <EditableElement
            id="home.why.label"
            kind="label"
            defaultValue={DEFAULT_LABEL}
            as="p"
            className="text-label uppercase text-[#3B82F6]"
          >
            {({ value }) => value || label}
          </EditableElement>
          <EditableElement
            id="home.why.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            {({ value }) => value || heading}
          </EditableElement>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] lg:gap-12 xl:gap-14">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {features.map((feature) => {
              const Icon =
                FEATURE_ICONS[feature.__index % FEATURE_ICONS.length] ??
                UserRound;
              const title = String(feature.title ?? "");
              const description = String(feature.description ?? "");

              return (
                <li
                  key={feature.__index}
                  className={cn(
                    "rounded-2xl border border-border/60 bg-white p-5 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                    "sm:p-6",
                  )}
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <EditableElement
                    id={`home.why.item.${feature.__index}.title`}
                    kind="heading"
                    defaultValue={title}
                    as="h3"
                    className="mt-4 font-heading text-h4 font-semibold text-[#0A2540]"
                  >
                    {({ value }) => value || title}
                  </EditableElement>
                  <EditableElement
                    id={`home.why.item.${feature.__index}.description`}
                    kind="paragraph"
                    defaultValue={description}
                    as="p"
                    className="mt-2 text-small leading-relaxed text-muted-foreground"
                  >
                    {({ value }) => value || description}
                  </EditableElement>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center lg:pt-1">
            <DoctorPortrait
              imageSrc={doctorImageSrc}
              imageAlt={doctorImageAlt}
            />
          </div>
        </div>

        <div className="mt-14 border-t border-border/70 pt-12 text-center">
          <EditableElement
            id="home.why.footerHeading"
            kind="heading"
            defaultValue={DEFAULT_FOOTER_HEADING}
            as="h3"
            className="font-heading text-h3 font-bold text-[#0A2540]"
          >
            {({ value }) => value || footerHeading}
          </EditableElement>
          <EditableElement
            id="home.why.footerBody"
            kind="paragraph"
            defaultValue={DEFAULT_FOOTER_BODY}
            as="p"
            className="mx-auto mt-4 max-w-3xl text-body leading-relaxed text-muted-foreground"
          >
            {({ value }) => value || footerBody}
          </EditableElement>
        </div>
      </div>
    </section>
  );
}

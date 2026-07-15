"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  HOME_DOCTOR_HIGHLIGHT_DEFAULTS,
  HOME_DOCTOR_STAT_DEFAULTS,
} from "@/components/home/homeDoctorsLocation.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/experience/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_PHOTO_SRC = "/images/dr-sandeep-bhasin.jpg";
const DEFAULT_PHOTO_ALT = "Dr. Sandeep Bhasin";
const DEFAULT_LABEL = "Meet Your Surgeon";
const DEFAULT_HEADING = "Meet Your Cosmetic Surgeon";
const DEFAULT_NAME = "Dr. Sandeep Bhasin";
const DEFAULT_DESCRIPTION =
  "Senior cosmetic and hair transplant surgeon with 18+ years of clinical experience, and founder of Care Well Medical Centre. Every consultation is doctor-led — focused on safety, honest guidance, and natural-looking results you can trust.";
const DEFAULT_NOTE =
  "Performed 10,000+ cosmetic and hair procedures with a commitment to careful planning and patient-first care.";
const DEFAULT_PRIMARY_LABEL = "View Full Doctor Profile";
const DEFAULT_PRIMARY_HREF = "/about/dr-sandeep-bhasin";
const DEFAULT_SECONDARY_LABEL = "Book Consultation";
const DEFAULT_SECONDARY_HREF = "/contact";

export function DoctorsSection() {
  const { config } = useStaticEditContext();

  const photoSrc = resolveElementField(
    config,
    "home.doctors.photo",
    "src",
    DEFAULT_PHOTO_SRC,
  );
  const photoAlt = resolveElementField(
    config,
    "home.doctors.photo",
    "alt",
    DEFAULT_PHOTO_ALT,
  );
  const label = resolveElementText(config, "home.doctors.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.doctors.heading",
    DEFAULT_HEADING,
  );
  const name = resolveElementText(config, "home.doctors.name", DEFAULT_NAME);
  const description = resolveElementText(
    config,
    "home.doctors.description",
    DEFAULT_DESCRIPTION,
  );
  const note = resolveElementText(config, "home.doctors.note", DEFAULT_NOTE);
  const primaryLabel = resolveElementField(
    config,
    "home.doctors.primaryButton",
    "label",
    DEFAULT_PRIMARY_LABEL,
  );
  const primaryHref = resolveElementField(
    config,
    "home.doctors.primaryButton",
    "href",
    DEFAULT_PRIMARY_HREF,
  );
  const secondaryLabel = resolveElementField(
    config,
    "home.doctors.secondaryButton",
    "label",
    DEFAULT_SECONDARY_LABEL,
  );
  const secondaryHref = resolveElementField(
    config,
    "home.doctors.secondaryButton",
    "href",
    DEFAULT_SECONDARY_HREF,
  );

  const stats = resolveRepeaterItems(
    config,
    "home.doctors.stats",
    HOME_DOCTOR_STAT_DEFAULTS.map((item) => ({ ...item })),
    ["value", "label"],
  );
  const highlights = resolveRepeaterItems(
    config,
    "home.doctors.highlights",
    HOME_DOCTOR_HIGHLIGHT_DEFAULTS.map((text) => ({ text })),
    ["text"],
  );

  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-14 xl:gap-16">
          <div className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-[24rem]">
            <EditableElement
              id="home.doctors.photo"
              kind="image"
              field="src"
              defaultValue={DEFAULT_PHOTO_SRC}
              className={cn(
                "group relative aspect-[4/5] max-h-[30rem] w-full overflow-hidden rounded-2xl",
                "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]",
                "transition-shadow duration-300 hover:shadow-[0_12px_36px_rgb(10_37_64/0.12)]",
              )}
            >
              {() => (
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  fill
                  className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 88vw, 24rem"
                />
              )}
            </EditableElement>
          </div>

          <div className="min-w-0">
            <EditableElement
              id="home.doctors.label"
              kind="label"
              defaultValue={DEFAULT_LABEL}
              as="p"
              className="text-label uppercase text-[#3B82F6]"
            >
              {({ value }) => value || label}
            </EditableElement>
            <EditableElement
              id="home.doctors.heading"
              kind="heading"
              defaultValue={DEFAULT_HEADING}
              as="h2"
              className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
            >
              {({ value }) => value || heading}
            </EditableElement>
            <EditableElement
              id="home.doctors.name"
              kind="heading"
              defaultValue={DEFAULT_NAME}
              as="h3"
              className="mt-4 font-heading text-h4 font-semibold text-[#0A2540]"
            >
              {({ value }) => value || name}
            </EditableElement>
            <EditableElement
              id="home.doctors.description"
              kind="paragraph"
              defaultValue={DEFAULT_DESCRIPTION}
              as="p"
              className="mt-3 max-w-xl text-body leading-relaxed text-muted-foreground"
            >
              {({ value }) => value || description}
            </EditableElement>
            <EditableElement
              id="home.doctors.note"
              kind="paragraph"
              defaultValue={DEFAULT_NOTE}
              as="p"
              className="mt-3 text-small font-medium text-[#0A2540]/80"
            >
              {({ value }) => value || note}
            </EditableElement>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat) => {
                const value = String(stat.value ?? "");
                const statLabel = String(stat.label ?? "");
                return (
                  <li
                    key={stat.__index}
                    className={cn(
                      "rounded-xl border border-border/80 bg-surface px-4 py-4 text-center shadow-xs",
                      "transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3B82F6]/25 hover:shadow-sm",
                    )}
                  >
                    <EditableElement
                      id={`home.doctors.stats.item.${stat.__index}.value`}
                      kind="statistic"
                      field="value"
                      defaultValue={value}
                      as="p"
                      className="font-heading text-2xl font-bold tracking-tight text-[#3B82F6]"
                    >
                      {({ value: v }) => String(v || value)}
                    </EditableElement>
                    <EditableElement
                      id={`home.doctors.stats.item.${stat.__index}.label`}
                      kind="label"
                      field="label"
                      defaultValue={statLabel}
                      as="p"
                      className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground"
                    >
                      {({ value: v }) => String(v || statLabel)}
                    </EditableElement>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {highlights.map((item) => {
                const text = String(item.text ?? "");
                return (
                  <li key={item.__index} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-50">
                      <Check
                        className="size-3.5 text-success-600"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    </span>
                    <EditableElement
                      id={`home.doctors.highlights.item.${item.__index}.text`}
                      kind="list-item"
                      defaultValue={text}
                      as="span"
                      className="text-small leading-snug text-[#0A2540]/90"
                    >
                      {({ value }) => value || text}
                    </EditableElement>
                  </li>
                );
              })}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <EditableElement
                id="home.doctors.primaryButton"
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
                      "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline",
                    )}
                  >
                    {String(fields.label ?? primaryLabel)}
                  </Link>
                )}
              </EditableElement>
              <EditableElement
                id="home.doctors.secondaryButton"
                kind="button"
                field="label"
                defaultValue={DEFAULT_SECONDARY_LABEL}
                as="div"
              >
                {({ fields }) => (
                  <Link
                    href={String(fields.href ?? secondaryHref)}
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "rounded-lg border-[#0A2540]/25 text-[#0A2540] hover:bg-[#0A2540]/5 no-underline hover:no-underline",
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
    </section>
  );
}

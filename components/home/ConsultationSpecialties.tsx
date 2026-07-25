"use client";

import Image from "next/image";
import Link from "next/link";

import { HOME_SPECIALTY_DEFAULTS } from "@/components/home/homeDoctorsLocation.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { resolveElementText } from "@/lib/experience/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/experience/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "Consultation & Expertise";
const DEFAULT_HEADING = "Our Aesthetic Consultation Specialties";
const DEFAULT_DESCRIPTION =
  "At Care Well Medical Centre, every treatment begins with a personalised, doctor-led consultation. We focus on understanding your concern first, then recommending the safest and most effective option.";

/** Icons keyed by specialty code. */
const SPECIALTY_ICON_BY_CODE: Record<string, string> = {
  HAI: "/images/consultation-specialties/hair-transplant.png",
  LAS: "/images/consultation-specialties/laser-hair-removal.png",
  ACN: "/images/consultation-specialties/acne-treatment.png",
  ANT: "/images/consultation-specialties/aging-treatment.png",
  BOT: "/images/consultation-specialties/botox.png",
  RHI: "/images/consultation-specialties/rhinoplasty.png",
  BEA: "/images/consultation-specialties/beard-transplant.png",
  HYD: "/images/consultation-specialties/hydrafacial.png",
  LIP: "/images/consultation-specialties/liposuction.png",
  BRE: "/images/consultation-specialties/breast-augmentation.png",
  HYM: "/images/consultation-specialties/hymenoplasty.png",
  CRY: "/images/consultation-specialties/cryolipolysis.png",
};

/** Fuzzy name fallback when code is missing or customized. */
const SPECIALTY_ICON_BY_NAME: Record<string, string> = {
  "hair transplant": SPECIALTY_ICON_BY_CODE.HAI,
  "laser hair removal": SPECIALTY_ICON_BY_CODE.LAS,
  "acne & scar treatment": SPECIALTY_ICON_BY_CODE.ACN,
  "acne treatment": SPECIALTY_ICON_BY_CODE.ACN,
  "anti-aging treatments": SPECIALTY_ICON_BY_CODE.ANT,
  "aging treatment": SPECIALTY_ICON_BY_CODE.ANT,
  botox: SPECIALTY_ICON_BY_CODE.BOT,
  rhinoplasty: SPECIALTY_ICON_BY_CODE.RHI,
  "beard transplant": SPECIALTY_ICON_BY_CODE.BEA,
  hydrafacial: SPECIALTY_ICON_BY_CODE.HYD,
  liposuction: SPECIALTY_ICON_BY_CODE.LIP,
  "breast augmentation": SPECIALTY_ICON_BY_CODE.BRE,
  hymenoplasty: SPECIALTY_ICON_BY_CODE.HYM,
  cryolipolysis: SPECIALTY_ICON_BY_CODE.CRY,
  "cryolipolysis (fat freezing)": SPECIALTY_ICON_BY_CODE.CRY,
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function resolveSpecialtyIcon(code: string, name: string): string | null {
  const byCode = SPECIALTY_ICON_BY_CODE[code.trim().toUpperCase()];
  if (byCode) return byCode;
  const byName = SPECIALTY_ICON_BY_NAME[name.trim().toLowerCase()];
  return byName ?? null;
}

export function ConsultationSpecialties() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(
    config,
    "home.specialties.label",
    DEFAULT_LABEL,
  );
  const heading = resolveElementText(
    config,
    "home.specialties.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.specialties.description",
    DEFAULT_DESCRIPTION,
  );

  const specialties = resolveRepeaterItems(
    config,
    "home.specialties",
    HOME_SPECIALTY_DEFAULTS.map((item) => ({ ...item })),
    ["code", "name"],
  );

  return (
    <section className="bg-muted/30">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <EditableElement
            id="home.specialties.label"
            kind="label"
            defaultValue={DEFAULT_LABEL}
            as="p"
            className="text-label uppercase text-[#3B82F6]"
          >
            {({ value }) => value || label}
          </EditableElement>
          <EditableElement
            id="home.specialties.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="mt-3 font-heading text-[1.5rem] font-bold leading-tight text-[#0A2540] sm:text-h2"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.specialties.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mx-auto mt-3 max-w-[42rem] text-body leading-relaxed text-muted-foreground sm:mt-4"
          >
            {({ value }) => value || description}
          </EditableElement>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {specialties.map((specialty) => {
            const code = String(specialty.code ?? "");
            const name = String(specialty.name ?? "");

            return (
              <li key={specialty.__index}>
                <EditableElement
                  id={`home.specialties.item.${specialty.__index}.name`}
                  kind="list-item"
                  field="name"
                  defaultValue={name}
                >
                  {({ fields }) => {
                    const displayName = String(fields.name ?? name);
                    const displayCode = String(fields.code ?? code);
                    const iconSrc = resolveSpecialtyIcon(
                      displayCode,
                      displayName,
                    );

                    return (
                      <Link
                        href={`/services/${slugify(displayName)}`}
                        className={cn(
                          "flex h-full min-h-[6.5rem] flex-col items-center justify-center rounded-xl bg-secondary px-2.5 py-4 text-center no-underline sm:min-h-0 sm:px-3 sm:py-6",
                          "border border-transparent transition-all duration-300",
                          "hover:-translate-y-0.5 hover:border-border hover:shadow-[0_8px_24px_rgb(10_37_64/0.06)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        )}
                      >
                        {iconSrc ? (
                          <span className="relative flex h-9 w-9 items-center justify-center sm:h-12 sm:w-12">
                            <Image
                              src={iconSrc}
                              alt=""
                              width={48}
                              height={48}
                              className="h-full w-full object-contain"
                              aria-hidden
                            />
                          </span>
                        ) : (
                          <span className="text-label font-medium uppercase tracking-[0.12em] text-[#7DC4DC]">
                            {displayCode}
                          </span>
                        )}
                        <span className="mt-1.5 font-heading text-[0.8125rem] font-bold leading-snug text-[#0A2540] sm:mt-2 sm:text-body">
                          {displayName}
                        </span>
                      </Link>
                    );
                  }}
                </EditableElement>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

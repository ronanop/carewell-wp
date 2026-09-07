"use client";

import Image from "next/image";
import Link from "next/link";

import { HOME_SPECIALTY_DEFAULTS } from "@/components/home/homeDoctorsLocation.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { resolveElementText } from "@/lib/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

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
      <div className="container-content section-padding max-[767px]:!pt-4 lg:pb-8 lg:pt-8">
        <StaggerReveal className="mx-auto max-w-3xl text-center lg:max-w-[64rem]" stepMs={70}>
          <EditableElement
            id="home.specialties.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="mt-0 font-heading text-[1.5rem] font-bold leading-tight text-[#0A2540] sm:mt-3 sm:text-[2.7rem] lg:whitespace-nowrap"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.specialties.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mx-auto mt-3 max-w-[42rem] text-[0.78rem] font-medium leading-[1.5] text-muted-foreground sm:mt-4 sm:text-[1.25rem] sm:leading-[1.7] lg:max-w-[64rem]"
          >
            {({ value }) => value || description}
          </EditableElement>
        </StaggerReveal>

        <StaggerReveal
          as="ul"
          stepMs={55}
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 md:grid-cols-3 lg:grid-cols-6 lg:gap-6"
        >          {specialties.map((specialty) => {
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
                          "relative flex h-full min-h-[8rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#DCE8F5] bg-gradient-to-br from-white via-[#F8FBFF] to-[#EEF5FF] px-3 py-5 text-center no-underline sm:min-h-[10rem] sm:px-3 sm:py-6",
                          "shadow-[0_8px_24px_rgb(10_37_64/0.06)] transition-[transform,box-shadow,border-color] duration-300",
                          "before:absolute before:inset-x-6 before:top-0 before:h-1 before:rounded-b-full before:bg-gradient-to-r before:from-[#5BA3E8] before:via-[#B09468] before:to-[#0A2540] before:opacity-80 before:content-['']",
                          "hover:-translate-y-1 hover:border-[#9CC7EE] hover:shadow-[0_14px_30px_rgb(10_37_64/0.12)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        )}
                      >
                        {iconSrc ? (
                          <span className="relative flex h-[3.175rem] w-[3.175rem] items-center justify-center rounded-full bg-white p-2 shadow-sm ring-1 ring-[#DCE8F5] sm:h-[3.8rem] sm:w-[3.8rem]">
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
                          <span className="text-[0.9rem] font-medium uppercase tracking-[0.12em] text-[#7DC4DC]">
                            {displayCode}
                          </span>
                        )}
                        <span className="mt-1.5 font-heading text-[0.975rem] font-bold leading-snug text-[#0A2540] sm:mt-2 sm:text-[1.2rem]">
                          {displayName}
                        </span>
                      </Link>
                    );
                  }}
                </EditableElement>
              </li>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}

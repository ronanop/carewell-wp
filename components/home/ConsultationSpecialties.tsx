"use client";

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

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.specialties.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mx-auto mt-4 max-w-[42rem] text-body leading-relaxed text-muted-foreground"
          >
            {({ value }) => value || description}
          </EditableElement>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
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
                    return (
                      <Link
                        href={`/services/${slugify(displayName)}`}
                        className={cn(
                          "flex h-full flex-col items-center justify-center rounded-xl bg-secondary px-3 py-6 text-center no-underline",
                          "border border-transparent transition-all duration-300",
                          "hover:-translate-y-0.5 hover:border-border hover:shadow-[0_8px_24px_rgb(10_37_64/0.06)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        )}
                      >
                        <span className="text-label font-medium uppercase tracking-[0.12em] text-[#7DC4DC]">
                          {String(fields.code ?? code)}
                        </span>
                        <span className="mt-2 font-heading text-small font-bold leading-snug text-[#0A2540] sm:text-body">
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

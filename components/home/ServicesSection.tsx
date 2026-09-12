"use client";

import { HOME_SERVICES_DEFAULTS } from "@/components/home/homeContent.elements";
import { ServiceCard3D } from "@/components/home/ServiceCard3D";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { resolveElementText } from "@/lib/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/static-pages/repeaterOverrides";

const DEFAULT_LABEL = "Our services";
const DEFAULT_HEADING =
  "Comprehensive Hair Transplant, Skin & Cosmetic Surgery Services";
const DEFAULT_DESCRIPTION =
  "At Care Well Medical Centre, we provide doctor-led treatments across hair, skin, cosmetic, and surgical care, focused on safety, natural results, and personalised treatment planning.";

export function ServicesSection() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(config, "home.services.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.services.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.services.description",
    DEFAULT_DESCRIPTION,
  );

  const items = resolveRepeaterItems(
    config,
    "home.services",
    HOME_SERVICES_DEFAULTS.map((item) => ({ ...item })),
    ["title", "description", "href", "imageSrc", "imageAlt", "objectPosition"],
  );

  return (
    <section className="overflow-x-clip bg-background section-padding max-[767px]:!pb-2 max-[767px]:!pt-5 lg:pb-2 lg:pt-6">
      <ServicesCarousel
        label={
          <EditableElement
            id="home.services.label"
            kind="label"
            defaultValue={DEFAULT_LABEL}
            as="p"
            className="text-center text-[0.8125rem] font-semibold tracking-[0.14em] text-primary uppercase sm:text-left sm:text-[0.875rem]"
          >
            {({ value }) => value || label}
          </EditableElement>
        }
        title={
          <EditableElement
            id="home.services.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="mt-2 text-center font-heading text-[1.55rem] font-bold leading-tight tracking-tight text-[#0A2540] sm:mt-3 sm:text-left sm:text-[2.35rem]"
          >
            {({ value }) => value || heading}
          </EditableElement>
        }
        description={
          <EditableElement
            id="home.services.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mt-3 text-center text-[0.9375rem] font-medium leading-relaxed text-slate-600 sm:mt-4 sm:text-left sm:text-lg sm:leading-relaxed"
          >
            {({ value }) => value || description}
          </EditableElement>
        }
      >
        {items.map((item) => (
          <EditableElement
            key={item.__index}
            id={`home.services.item.${item.__index}.title`}
            kind="card"
            defaultValue={String(item.title ?? "")}
          >
            {() => (
              <ServiceCard3D
                title={String(item.title ?? "")}
                description={String(item.description ?? "")}
                href={String(item.href ?? "#")}
                imageSrc={String(item.imageSrc ?? "")}
                imageAlt={String(item.imageAlt ?? "")}
                objectPosition={String(item.objectPosition ?? "center")}
              />
            )}
          </EditableElement>
        ))}
      </ServicesCarousel>
    </section>
  );
}

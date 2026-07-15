/**
 * Default PresentationConfig for catalog static pages — seeded from descriptors.
 */

import { createDefaultPresentationConfig } from "@/lib/experience/validations/presentationConfig";
import { getStaticPageDescriptor } from "@/lib/experience/static-pages/registry";
import type { PresentationConfig, SectionConfig } from "@/types/presentation-config";
import type { StaticPageSlug } from "@/types/static-page";

/**
 * Builds default PresentationConfig + section ids from the static page descriptor.
 */
export function createStaticPageDefaultConfig(
  slug: StaticPageSlug,
): PresentationConfig {
  const descriptor = getStaticPageDescriptor(slug);
  const base = createDefaultPresentationConfig(
    descriptor?.templateSlug ?? "generic",
  );

  if (!descriptor) return base;

  const sections: SectionConfig[] = descriptor.sections.map((section) => ({
    id: section.id,
    type: section.type,
    enabled: true,
    variant: section.defaultVariant ?? "default",
    spacing: "default",
    background: "none",
    animation: "inherit",
    visibility: "always",
    settings: {
      doctorPhoto: null,
      gallery: [],
      heading: section.displayName,
      supportingText: null,
    },
  }));

  return {
    ...base,
    templateSlug: descriptor.templateSlug,
    sections,
    propOverrides: {},
    pageTypeOverride:
      slug === "home"
        ? "HOME"
        : slug === "about"
          ? "ABOUT"
          : slug === "contact"
            ? "CONTACT"
            : slug === "privacy-policy" ||
                slug === "disclaimer" ||
                slug === "terms"
              ? "LEGAL"
              : null,
  };
}

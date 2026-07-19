/**
 * Editorial presentation presets — switchable per article in Experience Studio.
 * Presentation only; never changes WordPress content.
 */

import type { EditorialPreset, EditorialPresetId } from "@/types/semantic-article";

export const EDITORIAL_PRESETS: Record<EditorialPresetId, EditorialPreset> = {
  editorial: {
    id: "editorial",
    label: "Editorial",
    description: "Premium medical editorial — default CareWell reading experience.",
    className: "preset-editorial",
    typography: {
      readingWidth: "article",
      headingScale: "editorial",
      paragraphSpacing: "default",
    },
    hero: { variant: "editorial", overlay: "gradient" },
    density: "balanced",
  },
  "medical-journal": {
    id: "medical-journal",
    label: "Medical Journal",
    description: "Clinical, dense typography with restrained ornament.",
    className: "preset-medical-journal",
    typography: {
      readingWidth: "narrow",
      headingScale: "quiet",
      paragraphSpacing: "compact",
    },
    hero: { variant: "minimal", overlay: "soft" },
    density: "compact",
  },
  magazine: {
    id: "magazine",
    label: "Magazine",
    description: "Larger headlines, generous imagery, feature-story rhythm.",
    className: "preset-magazine",
    typography: {
      readingWidth: "wide",
      headingScale: "display",
      paragraphSpacing: "spacious",
    },
    hero: { variant: "magazine", overlay: "gradient" },
    density: "airy",
  },
  luxury: {
    id: "luxury",
    label: "Luxury",
    description: "Soft spacing, refined accents, clinic-brand atmosphere.",
    className: "preset-luxury",
    typography: {
      readingWidth: "article",
      headingScale: "editorial",
      paragraphSpacing: "spacious",
    },
    hero: { variant: "luxury", overlay: "gradient" },
    density: "airy",
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description: "Quiet, content-first layout with minimal chrome.",
    className: "preset-minimal",
    typography: {
      readingWidth: "narrow",
      headingScale: "quiet",
      paragraphSpacing: "default",
    },
    hero: { variant: "minimal", overlay: "none" },
    density: "balanced",
  },
};

export function getEditorialPreset(
  id: EditorialPresetId | string | null | undefined,
): EditorialPreset {
  if (id && id in EDITORIAL_PRESETS) {
    return EDITORIAL_PRESETS[id as EditorialPresetId];
  }
  return EDITORIAL_PRESETS.editorial;
}

export function listEditorialPresets(): EditorialPreset[] {
  return Object.values(EDITORIAL_PRESETS);
}

import { TechnologySection } from "./TechnologySection";
import type { SectionBaseProps, TechniqueCard } from "./types";

export type TreatmentOptionsSectionProps = SectionBaseProps & {
  /** CMS: treatmentOptions.eyebrow */
  eyebrow?: string;
  /** CMS: treatmentOptions.heading */
  title?: string;
  /** CMS: treatmentOptions.options */
  options?: TechniqueCard[];
};

/**
 * Treatment-type / options card grid (`id="options"`).
 * Entry point for options layouts — reuses TechnologySection shell with CMS copy.
 * Sanity field `treatmentOptions` is separate from `technology` so both can coexist.
 */
export function TreatmentOptionsSection({
  id = "options",
  eyebrow,
  title,
  options = [],
  className,
}: TreatmentOptionsSectionProps) {
  return (
    <TechnologySection
      id={id}
      eyebrow={eyebrow}
      title={title}
      techniques={options}
      className={className}
    />
  );
}

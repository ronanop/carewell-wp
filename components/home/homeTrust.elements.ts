/**
 * Home Trust element descriptors (ADR-016) — repeater stats.
 */

import type { ElementDescriptor } from "@/types/element-descriptor";

const LABELS = [
  "Years Experience",
  "Procedures",
  "Patient Rating",
  "Positive Google Reviews",
  "Equipment",
  "Trusted Clinic",
] as const;

const VALUES = ["20+", "10,000+", "4.3★", "605+", "Advanced", "Delhi NCR"] as const;

export const HOME_TRUST_ELEMENTS: ElementDescriptor[] = DEFAULT_TRUST_ELEMENTS();

function DEFAULT_TRUST_ELEMENTS(): ElementDescriptor[] {
  const elements: ElementDescriptor[] = [];
  for (let index = 0; index < 6; index += 1) {
    elements.push({
      id: `home.trust.stat.${index}.value`,
      displayName: `Stat ${index + 1} value`,
      kind: "statistic",
      sectionId: "home.trust",
      inlineField: "text",
      fields: [
        { key: "text", label: "Value", type: "text", group: "Content" },
      ],
      supports: { inlineEdit: true },
      defaultValues: { text: VALUES[index] },
    });
    elements.push({
      id: `home.trust.stat.${index}.label`,
      displayName: `Stat ${index + 1} label`,
      kind: "label",
      sectionId: "home.trust",
      inlineField: "text",
      fields: [
        { key: "text", label: "Label", type: "text", group: "Content" },
      ],
      supports: { inlineEdit: true },
      defaultValues: { text: LABELS[index] },
    });
  }
  return elements;
}

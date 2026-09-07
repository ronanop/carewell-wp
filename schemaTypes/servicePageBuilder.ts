import { defineArrayMember, defineField } from "sanity";

import {
  DEFAULT_SERVICE_SECTION_ORDER,
  SERVICE_SECTION_LABELS,
  SERVICE_SECTION_LIST_OPTIONS,
  type ServiceSectionKey,
} from "../lib/service/pageBuilder";

/**
 * Reorderable page builder for service pages.
 * Each item picks a section type; content is edited in the matching document fields.
 */
export const servicePageBuilderField = defineField({
  name: "pageBuilder",
  title: "Page builder (sections & order)",
  type: "array",
  group: "builder",
  description:
    "Add, remove, and drag sections to control what appears on this service page and in which order. Fill the matching content fields in the other tabs (Overview, Comparison, FAQ, …). Leave this empty to use the default layout (all sections in the standard order — empty content still hides automatically).",
  of: [
    defineArrayMember({
      type: "object",
      name: "sectionSlot",
      title: "Section",
      fields: [
        defineField({
          name: "section",
          title: "Section type",
          type: "string",
          options: {
            list: SERVICE_SECTION_LIST_OPTIONS,
            layout: "dropdown",
          },
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { section: "section" },
        prepare({ section }: { section?: string }) {
          const key = section as ServiceSectionKey | undefined;
          const title =
            (key && SERVICE_SECTION_LABELS[key]) || section || "Section";
          return {
            title,
            subtitle: "Drag to reorder · edit content in other tabs",
          };
        },
      },
    }),
  ],
  initialValue: DEFAULT_SERVICE_SECTION_ORDER.map((section) => ({
    _type: "sectionSlot",
    section,
  })),
  validation: (rule) =>
    rule.custom((items: { section?: string }[] | undefined) => {
      if (!items?.length) return true;
      const keys = items.map((item) => item?.section).filter(Boolean);
      if (new Set(keys).size !== keys.length) {
        return "Each section type can only be added once. Remove the duplicate.";
      }
      return true;
    }),
});

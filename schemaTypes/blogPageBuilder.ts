import { defineArrayMember, defineField } from "sanity";

import {
  BLOG_SECTION_LABELS,
  BLOG_SECTION_LIST_OPTIONS,
  DEFAULT_BLOG_SECTION_ORDER,
  type BlogSectionKey,
} from "../lib/blog/pageBuilder";

/**
 * Reorderable page builder for blog posts.
 * Content is edited in the matching document fields (Body, Mid-article CTA, …).
 */
export const blogPageBuilderField = defineField({
  name: "pageBuilder",
  title: "Page builder (sections & order)",
  type: "array",
  group: "builder",
  description:
    "Add, remove, and drag sections to control what appears on this blog post and in which order. Edit body copy and CTA text in the Content tab. Leave unset to use the default layout. Sidebar, breadcrumb, and chrome stay fixed.",
  of: [
    defineArrayMember({
      type: "object",
      name: "blogSectionSlot",
      title: "Section",
      fields: [
        defineField({
          name: "section",
          title: "Section type",
          type: "string",
          options: {
            list: BLOG_SECTION_LIST_OPTIONS,
            layout: "dropdown",
          },
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { section: "section" },
        prepare({ section }: { section?: string }) {
          const key = section as BlogSectionKey | undefined;
          const title =
            (key && BLOG_SECTION_LABELS[key]) || section || "Section";
          return {
            title,
            subtitle: "Drag to reorder · edit content in other tabs",
          };
        },
      },
    }),
  ],
  initialValue: DEFAULT_BLOG_SECTION_ORDER.map((section) => ({
    _type: "blogSectionSlot",
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

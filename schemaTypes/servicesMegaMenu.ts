import { defineArrayMember, defineField, defineType } from "sanity";

import { imageWithAlt } from "./shared";

/**
 * Panel size matches the live Services mega menu side card:
 * ~248×310 CSS px (4:5); Studio uploads should be 496×620 for retina.
 */
const PANEL_IMAGE_DESCRIPTION =
  "Exact size: 496×620px (4:5). Shown in the navbar Services mega menu side panel (~248×310px on screen). Crop/hotspot recommended.";

const CATEGORY_OPTIONS = [
  { title: "Hair Treatments", value: "hair" },
  { title: "Skin & Aesthetic", value: "skin" },
  { title: "Surgical Procedures", value: "surgical" },
  { title: "Wellness", value: "wellness" },
] as const;

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((option) => [option.value, option.title]),
);

/**
 * Singleton: category panel photos for the Services mega menu.
 * Desk opens fixed documentId "servicesMegaMenu".
 */
export const servicesMegaMenu = defineType({
  name: "servicesMegaMenu",
  title: "Services mega menu",
  type: "document",
  description:
    "Upload the side-panel photo for each Services mega menu category. Empty image = site default.",
  fields: [
    defineField({
      name: "categories",
      title: "Category panel images",
      type: "array",
      description: PANEL_IMAGE_DESCRIPTION,
      of: [
        defineArrayMember({
          type: "object",
          name: "megaMenuCategory",
          title: "Category",
          fields: [
            defineField({
              name: "categoryId",
              title: "Category",
              type: "string",
              options: {
                list: [...CATEGORY_OPTIONS],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            imageWithAlt("panelImage", "Panel image", {
              description: PANEL_IMAGE_DESCRIPTION,
            }),
          ],
          preview: {
            select: {
              categoryId: "categoryId",
              media: "panelImage",
              alt: "panelImage.alt",
            },
            prepare({ categoryId, media, alt }) {
              const title =
                (categoryId && CATEGORY_LABELS[categoryId]) ||
                categoryId ||
                "Category";
              return {
                title,
                subtitle: alt || "No alt text yet",
                media,
              };
            },
          },
        }),
      ],
      initialValue: CATEGORY_OPTIONS.map((option) => ({
        _type: "megaMenuCategory",
        categoryId: option.value,
      })),
      validation: (rule) =>
        rule.custom((items) => {
          if (!items?.length) return true;
          const ids = items
            .map((item) =>
              item && typeof item === "object" && "categoryId" in item
                ? String((item as { categoryId?: string }).categoryId || "")
                : "",
            )
            .filter(Boolean);
          if (new Set(ids).size !== ids.length) {
            return "Each category can only appear once.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Services mega menu" }),
  },
});

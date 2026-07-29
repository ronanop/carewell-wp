import { defineField } from "sanity";

/** Image field with required alt text (SEO / accessibility). */
export function imageWithAlt(
  name: string,
  title: string,
  options?: { required?: boolean },
) {
  const requireImage = options?.required ?? false;
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt text",
        description: "Required for SEO and accessibility.",
        validation: (rule) =>
          rule.required().error("Alt text is required before publishing."),
      }),
    ],
    validation: requireImage
      ? (rule) => rule.required().error(`${title} is required.`)
      : undefined,
  });
}

export const portableBodyOf = [
  {
    type: "block" as const,
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            { name: "href", type: "url", title: "URL" },
            {
              name: "openInNewTab",
              type: "boolean",
              title: "Open in new tab",
            },
          ],
        },
      ],
    },
  },
  { type: "bodyImage" as const },
  { type: "youtube" as const },
  { type: "embed" as const },
  { type: "htmlTable" as const },
];

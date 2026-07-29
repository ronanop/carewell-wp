import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", title: "SEO Title", type: "string" }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Keep under ~155–160 characters for SERPs."),
    }),
    defineField({ name: "focusKeyword", title: "Focus Keyword", type: "string" }),
    defineField({ name: "canonical", title: "Canonical URL", type: "url" }),
    defineField({
      name: "breadcrumbsTitle",
      title: "Breadcrumbs Title",
      type: "string",
    }),
    defineField({ name: "ogTitle", title: "Open Graph Title", type: "string" }),
    defineField({
      name: "ogDescription",
      title: "Open Graph Description",
      type: "text",
      rows: 3,
    }),
    imageWithAlt("ogImage", "Open Graph Image"),
    defineField({ name: "twitterTitle", title: "Twitter Title", type: "string" }),
    defineField({
      name: "twitterDescription",
      title: "Twitter Description",
      type: "text",
      rows: 3,
    }),
    imageWithAlt("twitterImage", "Twitter Image"),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "noFollow",
      title: "No Follow",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const youtube = defineType({
  name: "youtube",
  title: "YouTube Embed",
  type: "object",
  fields: [
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({ name: "youtubeId", title: "YouTube ID", type: "string" }),
  ],
  preview: {
    select: { title: "youtubeId", subtitle: "url" },
  },
});

export const embed = defineType({
  name: "embed",
  title: "Embed",
  type: "object",
  fields: [
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({ name: "html", title: "Raw HTML", type: "text" }),
  ],
});

export const htmlTable = defineType({
  name: "htmlTable",
  title: "Table",
  type: "object",
  fields: [defineField({ name: "html", title: "Table HTML", type: "text" })],
});

export const bodyImage = defineType({
  name: "bodyImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Alt text",
      validation: (rule) =>
        rule.required().error("Alt text is required for body images."),
    }),
    defineField({ name: "caption", type: "string", title: "Caption" }),
  ],
});

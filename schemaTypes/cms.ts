import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  description:
    "Reusable patient quote. Reference from a service’s Testimonials section (items), or reuse across pages.",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "patientName", title: "Patient name", type: "string" }),
    defineField({ name: "treatment", title: "Treatment", type: "string" }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
      initialValue: 5,
    }),
    imageWithAlt("photo", "Photo"),
    defineField({
      name: "youtubeId",
      title: "Video testimonial (YouTube ID)",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "patientName", subtitle: "treatment" },
  },
});

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hair", value: "hair" },
          { title: "Face", value: "face" },
          { title: "Body", value: "body" },
          { title: "Skin", value: "skin" },
          { title: "Vitiligo", value: "vitiligo" },
        ],
      },
    }),
    imageWithAlt("before", "Before", { required: true }),
    imageWithAlt("after", "After", { required: true }),
    defineField({ name: "treatment", title: "Treatment", type: "string" }),
    defineField({
      name: "patientInitials",
      title: "Patient initials",
      type: "string",
    }),
    defineField({
      name: "monthsPost",
      title: "Months post-procedure",
      type: "number",
    }),
    defineField({
      name: "consentNoted",
      title: "Patient consent on file",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "after" },
  },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Menu title",
      type: "string",
      validation: (rule) => rule.required(),
      initialValue: "Main navigation",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "href", type: "string", title: "Href" }),
            defineField({
              name: "children",
              title: "Children",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", type: "string", title: "Label" }),
                    defineField({ name: "href", type: "string", title: "Href" }),
                  ],
                  preview: { select: { title: "label", subtitle: "href" } },
                }),
              ],
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
  ],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      initialValue: "Care Well Medical Centre",
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
    defineField({
      name: "helloBarText",
      title: "Hello bar text",
      type: "string",
      initialValue: "Free consultation — Limited slots.",
    }),
    defineField({
      name: "clinicHours",
      title: "Clinic hours",
      type: "string",
    }),
    defineField({
      name: "mbbsRegNo",
      title: "MBBS registration no.",
      type: "string",
    }),
    imageWithAlt("defaultOgImage", "Default OG image"),
  ],
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "from",
      title: "From path",
      type: "string",
      description: "Must start with / e.g. /old-url/",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return "Required";
          if (!value.startsWith("/")) return "Must start with /";
          return true;
        }),
    }),
    defineField({
      name: "to",
      title: "To path or URL",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "permanent",
      title: "Permanent (301)",
      type: "boolean",
      initialValue: true,
      description: "Off = temporary 302",
    }),
    defineField({
      name: "isEnabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "from", subtitle: "to" },
  },
});

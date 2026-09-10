import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

function ctaObject(
  name: string,
  title: string,
  defaults: { label: string; href: string },
) {
  return defineField({
    name,
    title,
    type: "object",
    group: "buttons",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: "label",
        title: "Button label",
        type: "string",
        initialValue: defaults.label,
      }),
      defineField({
        name: "href",
        title: "Link",
        type: "string",
        description:
          "Path (/contact), full URL, tel:+91…, or https://wa.me/…",
        initialValue: defaults.href,
      }),
    ],
  });
}

function footerLinkMember() {
  return defineArrayMember({
    type: "object",
    fields: [
      defineField({
        name: "label",
        title: "Label",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "href",
        title: "Link",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
    preview: { select: { title: "label", subtitle: "href" } },
  });
}

function groupedImage(
  name: string,
  title: string,
  group: string,
  description?: string,
) {
  return {
    ...imageWithAlt(name, title, { description }),
    group,
  };
}

/**
 * Singleton: homepage images, CTA links, service card links, and footer links.
 * Desk opens fixed documentId "homepage".
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  description:
    "Customise homepage images, button links, service card links, and footer links. Empty fields keep the site defaults.",
  groups: [
    { name: "images", title: "Images", default: true },
    { name: "buttons", title: "Buttons & links" },
    { name: "services", title: "Service cards" },
    { name: "footer", title: "Footer links" },
  ],
  fields: [
    groupedImage(
      "heroImage",
      "Hero portrait",
      "images",
      "Main portrait on the homepage hero.",
    ),
    defineField({
      name: "heroBackground",
      title: "Hero background",
      type: "image",
      description: "Full-bleed background behind the hero.",
      options: { hotspot: true },
      group: "images",
    }),
    groupedImage(
      "doctorPhoto",
      "Doctor photo (Meet Your Surgeon)",
      "images",
      "Cutout / portrait in the doctors section.",
    ),
    groupedImage(
      "whyDoctorImage",
      "Why Choose Us — doctor image",
      "images",
      "Portrait beside the Why Choose Care Well block.",
    ),

    ctaObject("heroPrimary", "Hero — primary button", {
      label: "Book Free Consultation",
      href: "/contact",
    }),
    ctaObject("heroSecondary", "Hero — secondary button", {
      label: "Explore Treatments",
      href: "/services",
    }),
    ctaObject("doctorsPrimary", "Doctors — primary button", {
      label: "View Full Doctor Profile",
      href: "/about/dr-sandeep-bhasin",
    }),
    ctaObject("doctorsSecondary", "Doctors — secondary button", {
      label: "Book Consultation",
      href: "/contact",
    }),
    ctaObject("aboutButton", "About section — button", {
      label: "Discover Our Full Story",
      href: "/about",
    }),
    ctaObject("aiButton", "AI Skin Analysis — button", {
      label: "Scan My Skin →",
      href: "/contact",
    }),
    ctaObject("ctaBook", "Bottom CTA — book button", {
      label: "Book Free Consultation",
      href: "/contact",
    }),
    ctaObject("ctaCall", "Bottom CTA — call button", {
      label: "Call Now",
      href: "tel:+919667977499",
    }),
    ctaObject("ctaWhatsapp", "Bottom CTA — WhatsApp", {
      label: "WhatsApp",
      href: "https://wa.me/919667977499",
    }),
    ctaObject("reviewsCta", "Google reviews — see all link", {
      label: "See all reviews on Google",
      href: "https://www.google.com/maps/search/?api=1&query=Care+Well+Medical+Centre+Chittaranjan+Park+New+Delhi",
    }),

    defineField({
      name: "serviceCards",
      title: "Homepage service cards",
      type: "array",
      group: "services",
      description:
        "Optional. Leave empty to keep built-in cards. When set, replaces the homepage services carousel (image + link per card).",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            imageWithAlt("image", "Card image"),
            defineField({
              name: "objectPosition",
              title: "Image focus",
              type: "string",
              initialValue: "center center",
              description: 'CSS object-position, e.g. "center top"',
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "href", media: "image" },
          },
        }),
      ],
    }),

    defineField({
      name: "footerQuickLinks",
      title: "Footer — Quick links",
      type: "array",
      group: "footer",
      description: "Leave empty to keep site defaults.",
      of: [footerLinkMember()],
      initialValue: [
        { label: "Contact Us", href: "/contact" },
        { label: "Blog", href: "/blogs" },
        { label: "FAQs", href: "/faq" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    }),
    defineField({
      name: "footerServiceLinks",
      title: "Footer — Service links",
      type: "array",
      group: "footer",
      description: "Leave empty to keep site defaults.",
      of: [footerLinkMember()],
      initialValue: [
        {
          label: "Cosmetic Treatments",
          href: "/services/cosmetic-treatments",
        },
        { label: "Plastic Surgery", href: "/services/plastic-surgery" },
        { label: "Hair Transplant", href: "/services/hair-transplant" },
        { label: "Skin Treatments", href: "/services/skin-treatments" },
        { label: "Intimate Surgery", href: "/services/intimate-surgery" },
        { label: "Body Contouring", href: "/services/body-contouring" },
        { label: "Urology", href: "/services/urology" },
      ],
    }),
    defineField({
      name: "footerSocialLinks",
      title: "Footer — Social links",
      type: "array",
      group: "footer",
      description:
        "Use labels Facebook, LinkedIn, Instagram, or YouTube so icons match. Leave empty for defaults.",
      of: [footerLinkMember()],
      initialValue: [
        {
          label: "Facebook",
          href: "https://www.facebook.com/carewellmedicalcentre/",
        },
        {
          label: "LinkedIn",
          href: "https://in.linkedin.com/company/care-well-medical-centre",
        },
        {
          label: "Instagram",
          href: "https://www.instagram.com/carewellmedicalcentre/",
        },
        {
          label: "YouTube",
          href: "https://www.youtube.com/@CareWellMedicalCentre",
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});

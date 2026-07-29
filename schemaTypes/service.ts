import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, portableBodyOf } from "./shared";

const SERVICE_CATEGORIES = [
  { title: "Hair", value: "hair" },
  { title: "Skin & Vitiligo", value: "skin" },
  { title: "Face", value: "face" },
  { title: "Body", value: "body" },
  { title: "Therapies", value: "therapies" },
  { title: "Anti-Aging", value: "anti-aging" },
  { title: "Other", value: "other" },
];

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "content", title: "Content" },
    { name: "social", title: "Results & Proof" },
    { name: "convert", title: "Pricing & FAQ" },
    { name: "seo", title: "SEO" },
    { name: "legacy", title: "Legacy" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title (H1)",
      type: "string",
      group: "hero",
      description:
        "WordPress / CMS page title — rendered as the hero H1 on the service page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "hero",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "uri",
      title: "URI Path",
      type: "string",
      group: "hero",
      description: "Public path, e.g. /plastic-surgery-in-delhi/gynecomastia/",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "hero",
      options: { list: SERVICE_CATEGORIES, layout: "radio" },
    }),
    defineField({
      name: "legacyId",
      title: "WordPress Page ID",
      type: "number",
      group: "legacy",
      readOnly: true,
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "hero",
    }),

    // —— Hero ——
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "heading",
          title: "H1 override (optional)",
          type: "string",
          description:
            "Leave blank to use Page title. Prefer editing Page title — that is the live H1.",
          hidden: true,
        }),
        defineField({
          name: "tagline",
          title: "Tagline",
          type: "text",
          rows: 2,
          description:
            "Optional subtitle under the H1. Leave blank to hide — does not fall back to excerpt.",
        }),
        imageWithAlt("image", "Hero image"),
        defineField({
          name: "primaryCtaLabel",
          title: "Primary CTA label",
          type: "string",
          initialValue: "Book Free Consultation",
        }),
        defineField({
          name: "secondaryCtaLabel",
          title: "Secondary CTA label",
          type: "string",
          initialValue: "WhatsApp",
        }),
        defineField({
          name: "quickFactsNote",
          type: "string",
          title: "Quick facts note",
          description: "Optional disclaimer under At a glance (from CMS).",
        }),
        defineField({
          name: "quickFacts",
          title: "Quick facts",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", title: "Label" }),
                defineField({ name: "value", type: "string", title: "Value" }),
              ],
              preview: {
                select: { title: "label", subtitle: "value" },
              },
            }),
          ],
        }),
      ],
    }),

    // —— Overview ——
    defineField({
      name: "overview",
      title: "What is this service",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Overview",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({
          name: "body",
          title: "Body",
          type: "array",
          of: portableBodyOf,
        }),
        imageWithAlt("illustration", "Illustration"),
        defineField({
          name: "insightsEyebrow",
          type: "string",
          title: "Insights eyebrow",
          initialValue: "Good to know",
          description: "Small label above insights. Leave blank to hide.",
        }),
        defineField({
          name: "insightsTitle",
          type: "string",
          title: "Insights heading",
          initialValue: "Key insights",
          description: "Heading for the insight list. Leave blank to hide the label.",
        }),
        defineField({
          name: "insights",
          title: "Insight callouts",
          type: "array",
          of: [{ type: "string" }],
          validation: (rule) => rule.max(5),
        }),
      ],
    }),

    // —— How it works ——
    defineField({
      name: "howItWorks",
      title: "How it works",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Process",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({
          name: "stepLabel",
          type: "string",
          title: "Step label prefix",
          initialValue: "Step",
          description: 'Shown as "Step 1", "Step 2", …',
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({
                  name: "description",
                  type: "text",
                  title: "Description",
                  rows: 3,
                }),
              ],
              preview: { select: { title: "title" } },
            }),
          ],
        }),
        defineField({
          name: "youtubeId",
          title: "YouTube video ID",
          type: "string",
        }),
        defineField({
          name: "youtubeEyebrow",
          type: "string",
          title: "Video eyebrow",
          description:
            "Optional label when YoutubeEmbedSection is shown as its own section (not nested). Leave blank to hide.",
        }),
        defineField({
          name: "youtubeTitle",
          type: "string",
          title: "Video title",
          description:
            "Section heading (standalone) and accessible iframe title. Leave blank to hide the heading.",
        }),
      ],
    }),

    // —— Before & after ——
    defineField({
      name: "beforeAfter",
      title: "Before & after",
      type: "object",
      group: "social",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Results",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({
          name: "pairs",
          title: "Pairs",
          type: "array",
          validation: (rule) => rule.max(12),
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                imageWithAlt("before", "Before", { required: true }),
                imageWithAlt("after", "After", { required: true }),
                defineField({
                  name: "patientInitials",
                  type: "string",
                  title: "Patient initials",
                }),
                defineField({ name: "age", type: "number", title: "Age" }),
                defineField({
                  name: "gender",
                  type: "string",
                  title: "Gender",
                }),
                defineField({
                  name: "monthsPost",
                  type: "number",
                  title: "Months post-procedure",
                }),
                defineField({
                  name: "subtype",
                  type: "string",
                  title: "Filter / subtype",
                }),
              ],
              preview: {
                select: {
                  title: "patientInitials",
                  subtitle: "subtype",
                  media: "after",
                },
              },
            }),
          ],
        }),
        defineField({
          name: "consentNotice",
          type: "text",
          title: "Consent notice",
          rows: 2,
          initialValue:
            "Images shared with patient consent. Individual results vary.",
        }),
      ],
    }),

    // —— Candidacy ——
    defineField({
      name: "candidacy",
      title: "Am I a candidate?",
      type: "object",
      group: "content",
      description:
        "Eligibility columns. UI chrome is fixed in React — all labels and list copy come from here. Leave both lists empty to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Eligibility",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({
          name: "goodFitLabel",
          type: "string",
          title: "Good-fit column label",
          initialValue: "Good fit",
          description: "Heading for the positive criteria column. Leave blank to hide.",
        }),
        defineField({
          name: "goodFit",
          title: "Good candidate",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "notIdealLabel",
          type: "string",
          title: "Not-ideal column label",
          initialValue: "Not ideal",
          description: "Heading for the caution column. Leave blank to hide.",
        }),
        defineField({
          name: "notIdeal",
          title: "Not ideal",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "quizCtaLabel",
          type: "string",
          title: "Quiz CTA label",
          initialValue: "Take the quick self-check",
          description: "Leave blank to hide the quiz button.",
        }),
        defineField({
          name: "quizCtaHref",
          type: "string",
          title: "Quiz CTA link",
          description: 'e.g. "#quiz" or a full URL. Defaults to "#quiz" when the label is set.',
        }),
      ],
    }),

    // —— Symptoms (Wave 2) ——
    defineField({
      name: "symptoms",
      title: "Symptoms",
      type: "object",
      group: "content",
      description:
        "Common signs / warning signs. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Symptoms",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Common symptoms",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Symptom items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short symptom lines shown as numbered cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Causes & risk factors (Wave 2) ——
    defineField({
      name: "causes",
      title: "Causes & risk factors",
      type: "object",
      group: "content",
      description:
        "Causes / risk-factor list. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Causes",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Causes & risk factors",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Cause / risk-factor items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short cause lines shown as check cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Diagnosis / evaluation (Wave 2) ——
    defineField({
      name: "diagnosis",
      title: "Diagnosis & evaluation",
      type: "object",
      group: "content",
      description:
        "How we evaluate / diagnose. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Diagnosis",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "How we evaluate",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Evaluation steps",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short evaluation lines shown as numbered cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Benefits (Wave 2) ——
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "object",
      group: "content",
      description:
        "What patients gain. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Benefits",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "What patients typically gain",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Benefit items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short benefit lines shown as sparkle cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Preparation (Wave 2) ——
    defineField({
      name: "preparation",
      title: "Preparation",
      type: "object",
      group: "content",
      description:
        "Pre-treatment prep checklist. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Preparation",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "How to prepare",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Prep checklist items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short prep steps shown as check cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— When doctors recommend (Wave 2) ——
    defineField({
      name: "whenRecommended",
      title: "When doctors recommend",
      type: "object",
      group: "content",
      description:
        "Clinical criteria for when treatment is typically recommended. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Clinical guidance",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "When doctors recommend this",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Recommendation criteria",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short clinical criteria shown as checklist cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Risks & side effects (Wave 2) ——
    defineField({
      name: "risks",
      title: "Risks & side effects",
      type: "object",
      group: "content",
      description:
        "Transparent risks / side effects. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Safety",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Risks & side effects",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Risk / side-effect items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short risk lines shown as calm info cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— What if left untreated (Wave 2) ——
    defineField({
      name: "untreatedRisks",
      title: "What if left untreated",
      type: "object",
      group: "content",
      description:
        "Awareness points if the condition is left untreated. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Awareness",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "What if left untreated",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Awareness items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short, clear awareness lines (not alarmist). Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Results & expectations (Wave 2) ——
    defineField({
      name: "expectations",
      title: "Results & expectations",
      type: "object",
      group: "content",
      description:
        "Realistic outcomes and timeline expectations. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Outcomes",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Results & expectations",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Expectation items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short outcome / timeline lines shown as target cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Medical evidence / research (Wave 2) ——
    defineField({
      name: "evidence",
      title: "Medical evidence",
      type: "object",
      group: "content",
      description:
        "Research / clinical evidence talking points. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Research",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Medical evidence",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Evidence points",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short research / clinical finding lines shown as journal cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Mistakes to avoid (Wave 2) ——
    defineField({
      name: "mistakesToAvoid",
      title: "Mistakes to avoid",
      type: "object",
      group: "content",
      description:
        "Coaching guidance on common pitfalls. UI chrome is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Guidance",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Mistakes to avoid",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Mistake / coaching items",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short coaching lines shown as numbered guidance cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Myths vs facts (Wave 2) ——
    defineField({
      name: "myths",
      title: "Myth vs fact",
      type: "object",
      group: "content",
      description:
        "Clarifying myth/fact pairs. UI chrome is fixed in React — all copy comes from here. Leave pairs empty to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Clarity",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Myth vs fact",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "mythLabel",
          type: "string",
          title: "Myth label",
          initialValue: "Myth",
          description:
            "Label on each myth panel. Leave blank to use the default “Myth”.",
        }),
        defineField({
          name: "factLabel",
          type: "string",
          title: "Fact label",
          initialValue: "Fact",
          description:
            "Label on each fact panel. Leave blank to use the default “Fact”.",
        }),
        defineField({
          name: "pairs",
          title: "Pairs",
          type: "array",
          description:
            "Unlimited myth/fact pairs. Empty list hides the section. Layout stays in React.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "myth",
                  type: "text",
                  title: "Myth",
                  rows: 2,
                }),
                defineField({
                  name: "fact",
                  type: "text",
                  title: "Fact",
                  rows: 3,
                }),
              ],
              preview: {
                select: { title: "myth", subtitle: "fact" },
              },
            }),
          ],
        }),
      ],
    }),

    // —— Comparison (Wave 2) ——
    defineField({
      name: "comparison",
      title: "Comparison",
      type: "object",
      group: "content",
      description:
        "Side-by-side option columns and/or an HTML table. UI chrome is fixed in React. Leave columns empty and tableHtml blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Compare",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "How options compare",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "columns",
          title: "Comparison columns",
          type: "array",
          description:
            "Card columns (2–N). Empty titles with no items are skipped. Empty list with no table HTML hides the section.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  title: "Column title",
                }),
                defineField({
                  name: "items",
                  title: "Bullet points",
                  type: "array",
                  of: [{ type: "string" }],
                }),
              ],
              preview: {
                select: { title: "title", items: "items" },
                prepare({ title, items }) {
                  const count = Array.isArray(items) ? items.length : 0;
                  return {
                    title: title || "Untitled column",
                    subtitle: count
                      ? `${count} point${count === 1 ? "" : "s"}`
                      : undefined,
                  };
                },
              },
            }),
          ],
        }),
        defineField({
          name: "tableHtml",
          type: "text",
          title: "Table HTML (optional)",
          rows: 6,
          description:
            "Optional raw HTML table shown below columns. Prefer columns when possible. Alone (with no columns) still shows the section.",
        }),
      ],
    }),

    // —— Techniques & technology (Wave 2) ——
    defineField({
      name: "technology",
      title: "Techniques & technology",
      type: "object",
      group: "content",
      description:
        "Technique / technology cards. UI chrome is fixed in React — all copy comes from here. Leave techniques empty to hide the section. Separate from treatmentOptions (options layouts use their own field).",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Technology",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Techniques & technology",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "techniques",
          title: "Techniques",
          type: "array",
          description:
            "1–N technique cards. Empty list hides the section. Cards without a title are skipped.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({
                  name: "description",
                  type: "text",
                  title: "Description",
                  rows: 3,
                }),
                defineField({
                  name: "bullets",
                  title: "Bullets",
                  type: "array",
                  of: [{ type: "string" }],
                  description: "Optional highlight points under the description.",
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "description" },
              },
            }),
          ],
        }),
      ],
    }),

    // —— Treatment options (Wave 2; separate from technology) ——
    defineField({
      name: "treatmentOptions",
      title: "Treatment options",
      type: "object",
      group: "content",
      description:
        "Treatment-type / options cards (TreatmentOptionsSection, id=options). Separate from technology so both sections can show different copy. Empty options hides the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Options",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Treatment options",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "options",
          title: "Options",
          type: "array",
          description:
            "One card per treatment option / approach. Empty list hides the section.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  title: "Title",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "description",
                  type: "text",
                  title: "Description",
                  rows: 3,
                }),
                defineField({
                  name: "bullets",
                  title: "Bullets",
                  type: "array",
                  of: [{ type: "string" }],
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "description" },
              },
            }),
          ],
        }),
      ],
    }),

    // —— Recovery & aftercare (Wave 2) ——
    defineField({
      name: "recovery",
      title: "Recovery & aftercare",
      type: "object",
      group: "content",
      description:
        "Recovery milestones / aftercare. UI chrome is a timeline in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Recovery",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Recovery & aftercare",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Recovery milestones",
          type: "array",
          of: [{ type: "string" }],
          description:
            'Milestone lines shown on a timeline. Prefer "Phase: detail" (e.g. "Day 1–3: rest, garment"). Empty with no intro hides the section.',
        }),
      ],
    }),

    // —— Why choose us (Wave 2) ——
    defineField({
      name: "whyChooseUs",
      title: "Why choose us",
      type: "object",
      group: "content",
      description:
        "Trust / authority reasons. UI chrome (numbers, icons, wash) is fixed in React — all copy comes from here. Leave items empty and intro blank to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Why Care Well",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Why choose Care Well",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "intro",
          type: "text",
          title: "Intro",
          rows: 3,
          description:
            "Optional lead paragraph under the heading. Alone (with no items) still shows the section.",
        }),
        defineField({
          name: "items",
          title: "Reasons",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Short trust reasons shown as numbered icon cards. Empty with no intro hides the section.",
        }),
      ],
    }),

    // —— Pricing ——
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      group: "convert",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Investment",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({
          name: "startingFromLabel",
          type: "string",
          title: "Starting-from label",
          initialValue: "Starting from",
          description: "Label above the price. Leave blank to show price only.",
        }),
        defineField({
          name: "startingFrom",
          type: "string",
          title: "Starting from (display)",
          description: 'e.g. "₹45,000*" — never publish as a fixed final price.',
        }),
        defineField({
          name: "factorsHeading",
          type: "string",
          title: "Cost factors heading",
          initialValue: "What affects cost",
          description: "Heading above the factors list. Leave blank to hide.",
        }),
        defineField({
          name: "factors",
          title: "Cost factors",
          type: "array",
          of: [{ type: "string" }],
          validation: (rule) => rule.max(5),
        }),
        defineField({
          name: "includedHeading",
          type: "string",
          title: "What's included heading",
          initialValue: "What's included",
          description: "Heading above the included list. Leave blank to hide.",
        }),
        defineField({
          name: "whatsIncluded",
          title: "What's included",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "emiNote",
          type: "text",
          title: "EMI note",
          rows: 2,
        }),
        defineField({
          name: "ctaLabel",
          type: "string",
          title: "CTA label",
          initialValue: "Get Personalized Quote",
          description: "Leave blank to hide the CTA.",
        }),
        defineField({
          name: "ctaHref",
          type: "string",
          title: "CTA link",
          initialValue: "#book",
          description: "Anchor or URL for the pricing CTA.",
        }),
      ],
    }),

    // —— Cost snapshot (Wave 2) ——
    defineField({
      name: "costSnapshot",
      title: "Cost snapshot",
      type: "object",
      group: "convert",
      description:
        "At-a-glance cost metric cards (starting from, EMI, consult, etc.). Leave cards empty to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Cost",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Cost at a glance",
          description: "Section title. Leave blank to hide.",
        }),
        defineField({
          name: "cards",
          title: "Metric cards",
          type: "array",
          description:
            "2–N cards. Cards with no label and no value are skipped. Empty list hides the section.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  type: "string",
                  title: "Label",
                  description: 'e.g. "Starting from"',
                }),
                defineField({
                  name: "value",
                  type: "string",
                  title: "Value",
                  description: 'e.g. "₹45k*"',
                }),
                defineField({
                  name: "sublabel",
                  type: "string",
                  title: "Sublabel",
                  description: "Optional note under the value.",
                }),
              ],
              preview: {
                select: { title: "label", subtitle: "value" },
                prepare({ title, subtitle }) {
                  return {
                    title: title || "Untitled metric",
                    subtitle: subtitle || undefined,
                  };
                },
              },
            }),
          ],
        }),
      ],
    }),

    // —— EMI calculator ——
    defineField({
      name: "emi",
      title: "EMI calculator",
      type: "object",
      group: "convert",
      description:
        "Copy for the EMI estimator widget. Layout and math stay in React — all labels/CTA come from here.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Financing",
        }),
        defineField({
          name: "title",
          type: "string",
          title: "Heading",
          initialValue: "EMI calculator",
          description: "Leave blank to hide the section on the page.",
        }),
        defineField({
          name: "amountLabel",
          type: "string",
          title: "Amount label",
          initialValue: "Treatment amount",
        }),
        defineField({
          name: "tenureLabel",
          type: "string",
          title: "Tenure label",
          initialValue: "Tenure (months)",
        }),
        defineField({
          name: "resultLabel",
          type: "string",
          title: "Result label",
          initialValue: "Estimated monthly EMI",
        }),
        defineField({
          name: "disclaimer",
          type: "text",
          title: "Rate disclaimer",
          rows: 2,
          initialValue:
            "Indicative only at the listed annual rate. Final EMI depends on partner approval and your credit profile.",
        }),
        defineField({
          name: "ctaLabel",
          type: "string",
          title: "CTA label",
          initialValue: "Discuss EMI options with Carewell team",
        }),
        defineField({
          name: "ctaHref",
          type: "string",
          title: "CTA link",
          initialValue: "#book",
          description: "Usually #book or #treatment-hero-booking.",
        }),
        defineField({
          name: "defaultAmount",
          type: "number",
          title: "Default amount (₹)",
          initialValue: 80000,
        }),
        defineField({
          name: "defaultMonths",
          type: "number",
          title: "Default tenure (months)",
          initialValue: 12,
        }),
        defineField({
          name: "annualRatePct",
          type: "number",
          title: "Annual rate (%)",
          initialValue: 12,
          description: "Used for the indicative EMI formula only.",
        }),
      ],
    }),

    // —— Doctor / surgeon profile ——
    defineField({
      name: "doctor",
      title: "Doctor profile",
      type: "object",
      group: "social",
      description:
        "Surgeon profile band. UI chrome is fixed in React — all copy comes from here. Leave name and bio empty to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Surgeon",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Meet your surgeon",
          description: "Section heading. Leave blank to hide.",
        }),
        defineField({
          name: "name",
          type: "string",
          title: "Doctor name",
          description: "Required with bio (or alone) to show the section.",
        }),
        defineField({
          name: "role",
          type: "string",
          title: "Role / specialty",
          description: "e.g. Cosmetic & Plastic Surgeon. Leave blank to hide.",
        }),
        imageWithAlt("photo", "Photo"),
        defineField({
          name: "bio",
          title: "Bio paragraphs",
          type: "array",
          of: [{ type: "text" }],
          description:
            "One entry per paragraph. Leave empty with no name to hide the section.",
        }),
        defineField({
          name: "credentials",
          title: "Credentials",
          type: "array",
          of: [{ type: "string" }],
          description: "Short chips, e.g. MBBS, Cosmetic Surgery.",
        }),
        defineField({
          name: "ctaLabel",
          type: "string",
          title: "CTA label",
          initialValue: "Book consultation",
          description: "Leave blank to hide the CTA.",
        }),
        defineField({
          name: "ctaHref",
          type: "string",
          title: "CTA link",
          initialValue: "#book",
          description: "Anchor or URL for the doctor CTA.",
        }),
      ],
    }),

    // —— Testimonials (quotes + optional video strip) ——
    defineField({
      name: "testimonialsSection",
      title: "Testimonials",
      type: "object",
      group: "social",
      description:
        "Quote cards and optional YouTube video strip. Leave quotes empty and videos off/empty to hide. Reusable Testimonial documents can be referenced in items.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Patient stories",
          description: "Small label above the quote heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "What patients say",
          description: "Quote section title. Leave blank to hide.",
        }),
        defineField({
          name: "items",
          title: "Quote testimonials",
          type: "array",
          description:
            "Patient quotes shown as cards. Prefer references to Testimonial documents, or add inline quotes. Empty list hides the quote block.",
          of: [
            defineArrayMember({
              type: "reference",
              to: [{ type: "testimonial" }],
            }),
            defineArrayMember({
              name: "inlineTestimonial",
              type: "object",
              title: "Inline quote",
              fields: [
                defineField({
                  name: "quote",
                  type: "text",
                  title: "Quote",
                  rows: 3,
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "patientName",
                  type: "string",
                  title: "Patient name",
                }),
                defineField({
                  name: "treatment",
                  type: "string",
                  title: "Treatment",
                }),
                defineField({
                  name: "rating",
                  type: "number",
                  title: "Rating (1–5)",
                  validation: (rule) => rule.min(1).max(5),
                  initialValue: 5,
                }),
                imageWithAlt("photo", "Photo"),
              ],
              preview: {
                select: { title: "patientName", subtitle: "treatment" },
              },
            }),
          ],
        }),
        defineField({
          name: "videoEnabled",
          type: "boolean",
          title: "Show video testimonials strip",
          initialValue: false,
          description:
            "When on, the YouTube card strip below quotes is shown (if videos are configured).",
        }),
        defineField({
          name: "videoEyebrow",
          type: "string",
          title: "Video eyebrow",
          initialValue: "Watch",
          description: "Small label above the video strip heading. Leave blank to hide.",
          hidden: ({ parent }) => !parent?.videoEnabled,
        }),
        defineField({
          name: "videoHeading",
          type: "string",
          title: "Video heading",
          initialValue: "Patient video stories",
          description: "Heading for the video strip. Leave blank to hide.",
          hidden: ({ parent }) => !parent?.videoEnabled,
        }),
        defineField({
          name: "videos",
          title: "Video testimonials",
          type: "array",
          description:
            "YouTube cards for the auto-moving strip. Needs videoEnabled on. Provide youtubeId and/or url.",
          hidden: ({ parent }) => !parent?.videoEnabled,
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  title: "Title",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "youtubeId",
                  type: "string",
                  title: "YouTube ID",
                  description: "e.g. dQw4w9WgXcQ — preferred over full URL.",
                }),
                defineField({
                  name: "url",
                  type: "url",
                  title: "YouTube URL",
                  description: "Used when YouTube ID is empty.",
                }),
                imageWithAlt("thumbnail", "Thumbnail override"),
              ],
              preview: {
                select: { title: "title", subtitle: "youtubeId" },
              },
            }),
          ],
        }),
      ],
    }),

    // —— FAQs ——
    defineField({
      name: "faqEyebrow",
      type: "string",
      title: "FAQ eyebrow",
      group: "convert",
      initialValue: "Questions",
      description: "Small label above the FAQ heading. Leave blank to hide.",
    }),
    defineField({
      name: "faqHeading",
      type: "string",
      title: "FAQ heading",
      group: "convert",
      initialValue: "Frequently asked questions",
      description: "Section title. Leave blank to hide.",
    }),
    defineField({
      name: "faqEmitJsonLd",
      type: "boolean",
      title: "Emit FAQPage JSON-LD",
      group: "convert",
      initialValue: true,
      description:
        "When on, the public page includes FAQPage structured data for search engines.",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "convert",
      description:
        "Q&A pairs for the accordion. Empty list hides the section. Layout stays in React.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              type: "string",
              title: "Question",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              type: "text",
              title: "Answer",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),

    // —— Related ——
    defineField({
      name: "related",
      title: "Related services",
      type: "object",
      group: "convert",
      description:
        "Card grid of related treatments. UI chrome is fixed in React — eyebrow, heading, and linked services come from here. Leave services empty to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Explore",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Related services",
        }),
        defineField({
          name: "services",
          title: "Services",
          type: "array",
          description: "References to other service pages. Grid auto-fits any count.",
          of: [
            defineArrayMember({
              type: "reference",
              to: [{ type: "service" }],
            }),
          ],
          validation: (rule) => rule.max(8),
        }),
      ],
    }),

    // —— Booking / consultation form ——
    defineField({
      name: "booking",
      title: "Booking form",
      type: "object",
      group: "convert",
      description:
        "Copy for the consultation lead form. UI chrome is fixed in React — all text comes from here.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Card eyebrow",
          initialValue: "Free consult",
        }),
        defineField({
          name: "title",
          type: "string",
          title: "Card title",
          initialValue: "Book FREE consultation",
        }),
        defineField({
          name: "subtitle",
          type: "text",
          rows: 2,
          title: "Card subtitle",
          description:
            "Shown under the title. Treatment name is injected separately from Page title.",
        }),
        defineField({
          name: "submitLabel",
          type: "string",
          title: "Submit button",
          initialValue: "Book Free Consultation",
        }),
        defineField({
          name: "nameLabel",
          type: "string",
          title: "Name field label",
          initialValue: "Patient name",
        }),
        defineField({
          name: "namePlaceholder",
          type: "string",
          title: "Name placeholder",
          initialValue: "Full name",
        }),
        defineField({
          name: "phoneLabel",
          type: "string",
          title: "Phone field label",
          initialValue: "Mobile number",
        }),
        defineField({
          name: "phonePlaceholder",
          type: "string",
          title: "Phone placeholder",
          initialValue: "10-digit mobile",
        }),
        defineField({
          name: "trustItems",
          type: "array",
          title: "Trust items",
          of: [defineArrayMember({ type: "string" })],
          description: "Up to 3 short trust lines under the form.",
          validation: (rule) => rule.max(3),
        }),
        defineField({
          name: "successTitle",
          type: "string",
          title: "Success title",
          initialValue: "Request received",
        }),
        defineField({
          name: "successBody",
          type: "text",
          rows: 2,
          title: "Success message",
          initialValue: "We’ll call you shortly on the number you shared.",
        }),
        defineField({
          name: "bandEyebrow",
          type: "string",
          title: "Band eyebrow (full-width layout)",
          initialValue: "Next step",
        }),
        defineField({
          name: "bandHeadline",
          type: "string",
          title: "Band headline",
        }),
        defineField({
          name: "bandBody",
          type: "text",
          rows: 3,
          title: "Band body",
        }),
      ],
    }),

    // —— Location ——
    defineField({
      name: "location",
      title: "Clinic location",
      type: "object",
      group: "convert",
      description:
        "Visit-the-clinic band with optional Google Map embed. Leave address, hours, phone, and map fields empty to hide the section.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          initialValue: "Location",
          description: "Small label above the heading. Leave blank to hide.",
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
          initialValue: "Visit the clinic",
        }),
        defineField({
          name: "address",
          type: "text",
          rows: 3,
          title: "Address",
        }),
        defineField({
          name: "hours",
          type: "string",
          title: "Hours",
          description: 'e.g. "Mon–Sat · by appointment"',
        }),
        defineField({
          name: "phone",
          type: "string",
          title: "Phone",
        }),
        defineField({
          name: "mapHref",
          type: "url",
          title: "Open in Maps URL",
          description:
            "Link for the “Open in Maps” button. Used as a fallback preview when embed URL is empty.",
        }),
        defineField({
          name: "mapEmbedUrl",
          type: "url",
          title: "Map embed URL",
          description:
            "Google Maps iframe `src` (Share → Embed a map). Preferred over mapHref for the preview panel.",
        }),
      ],
    }),

    // —— Contact card (sidebar) ——
    defineField({
      name: "contactCard",
      title: "Contact card",
      type: "object",
      group: "convert",
      description:
        "Compact sidebar Call / WhatsApp card. Per-service override of clinic contact. Leave phone, WhatsApp, and address empty to hide.",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Title",
          description: "Card heading. Leave blank to hide.",
        }),
        defineField({
          name: "address",
          type: "text",
          rows: 2,
          title: "Address",
          description: "Clinic address line(s).",
        }),
        defineField({
          name: "hours",
          type: "string",
          title: "Hours",
          description: 'e.g. "Mon–Sat · by appointment"',
        }),
        defineField({
          name: "phone",
          type: "string",
          title: "Phone",
          description: "Display number and tel: link target.",
        }),
        defineField({
          name: "whatsapp",
          type: "string",
          title: "WhatsApp number",
          description: "Digits for wa.me (country code included).",
        }),
        defineField({
          name: "callLabel",
          type: "string",
          title: "Call button label",
          initialValue: "Call",
          description: "Leave blank to hide the Call button.",
        }),
        defineField({
          name: "whatsappLabel",
          type: "string",
          title: "WhatsApp button label",
          initialValue: "WhatsApp",
          description: "Leave blank to hide the WhatsApp button.",
        }),
      ],
    }),

    defineField({
      name: "finalCta",
      title: "Final CTA strip",
      type: "object",
      group: "convert",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          description: "Optional small label above the headline.",
        }),
        defineField({
          name: "headline",
          type: "string",
          title: "Headline",
          description:
            "Leave blank (with no button labels) to hide the entire strip.",
        }),
        defineField({
          name: "primaryLabel",
          type: "string",
          title: "Primary button",
          initialValue: "Book Free Consultation",
          description: "Leave blank to hide the primary button.",
        }),
        defineField({
          name: "primaryHref",
          type: "string",
          title: "Primary button link",
          initialValue: "#book",
          description: 'e.g. "#book" or a full URL.',
        }),
        defineField({
          name: "secondaryLabel",
          type: "string",
          title: "Secondary button",
          initialValue: "Call Now",
          description: "Leave blank to hide the secondary button.",
        }),
        defineField({
          name: "secondaryHref",
          type: "string",
          title: "Secondary button link",
          initialValue: "tel:+919810153580",
          description: 'e.g. "tel:+919810153580" or a full URL.',
        }),
      ],
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),

    defineField({
      name: "body",
      title: "Legacy body (fallback)",
      type: "array",
      group: "legacy",
      of: portableBodyOf,
      description: "Imported WordPress content. Prefer structured sections above.",
    }),
    defineField({
      name: "rawHtml",
      title: "Raw HTML (fallback)",
      type: "text",
      group: "legacy",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "hero.image",
    },
  },
});

/**
 * Editorial presentation tokens for WordPress content pages.
 * Presentation only — never used for data fetching or routing.
 */

export const CONTENT_THEME = {
  /** Optimal prose measure (680px). */
  readingWidth: "42.5rem",
  /** Max article container (~760px). */
  articleMaxWidth: "47.5rem",
  /** Chapter reveal (H2 sections). */
  chapterReveal: {
    durationMs: 550,
    translateY: 20,
    ease: "var(--motion-ease-out)",
  },
  /** Image hover / reveal. */
  image: {
    hoverScale: 1.02,
    revealScaleFrom: 0.98,
  },
  /** Button micro-interaction. */
  button: {
    liftPx: 2,
    durationMs: 150,
  },
  clinic: {
    name: "Care Well Medical Centre",
    phone: "+91-9667977499",
    phoneHref: "tel:+919667977499",
    whatsappHref: "https://wa.me/919667977499",
    bookHref: "/contact",
    experienceLabel: "20+ years experience",
    responseLabel: "Same-day response",
  },
} as const;

export type ContentTheme = typeof CONTENT_THEME;

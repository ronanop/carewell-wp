/**
 * Care Well Medical Centre — typography scale reference.
 * Site-wide font: Plus Jakarta Sans (--font-jakarta).
 * Apply via Tailwind utilities defined in app/globals.css.
 */

export const fontFamily = {
  /** DM Sans — body, UI, navigation, forms, buttons */
  primary: "font-body",
  /** Plus Jakarta Sans — headings, display type */
  secondary: "font-heading",
  /** Geist Mono — code blocks in Gutenberg content only */
  mono: "font-mono",
} as const;

/** Maximum comfortable reading width (matches --reading-width) */
export const readingWidth = "max-w-reading" as const;

/**
 * Typography utility class map — mobile-first responsive classes
 * are baked into each token utility in globals.css.
 */
export const typeScale = {
  displayXl: "text-display-xl font-heading font-light tracking-tight",
  displayLg: "text-display-lg font-heading font-light tracking-tight",
  h1: "text-h1 font-heading tracking-tight",
  h2: "text-h2 font-heading tracking-tight",
  h3: "text-h3 font-heading font-medium",
  h4: "text-h4 font-heading font-medium",
  h5: "text-h5 font-heading font-medium",
  bodyLg: "text-body-lg font-body leading-relaxed",
  body: "text-body font-body leading-relaxed",
  small: "text-small font-body",
  caption: "text-caption font-body text-muted-foreground",
  label: "text-label font-body font-medium uppercase tracking-widest text-muted-foreground",
  button: "text-button font-body font-medium tracking-wide",
} as const;

/** Prose / article body wrapper */
export const proseContent = "wp-content max-w-reading font-body text-body leading-relaxed" as const;

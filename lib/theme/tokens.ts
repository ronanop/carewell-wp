/**
 * Care Well Medical Centre — semantic design token names.
 * Values live in app/globals.css. Components must use Tailwind utilities
 * mapped to these tokens — never hardcode hex/rgb in components.
 */

/** Semantic color roles (Tailwind: bg-*, text-*, border-*) */
export const colorTokens = {
  background: "background",
  foreground: "foreground",
  surface: "surface",
  card: "card",
  popover: "popover",
  primary: "primary",
  secondary: "secondary",
  accent: "accent",
  muted: "muted",
  border: "border",
  input: "input",
  ring: "ring",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
  destructive: "destructive",
} as const;

/** Palette scale suffixes for extended utilities (bg-primary-700, etc.) */
export const paletteScales = {
  primary: "primary",
  accent: "accent-gold",
  neutral: "neutral",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
} as const;

/** Container width utilities (see globals.css @utility) */
export const containerTokens = {
  content: "container-content",
  article: "container-article",
  narrow: "container-narrow",
  wide: "container-wide",
  full: "container-full",
} as const;

/** Typography scale utilities */
export const typographyTokens = {
  displayXl: "text-display-xl",
  displayLg: "text-display-lg",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  bodyLg: "text-body-lg",
  body: "text-body",
  small: "text-small",
  caption: "text-caption",
  label: "text-label",
  button: "text-button",
} as const;

/** Motion CSS variable names (for inline styles / Framer Motion) */
export const motionVars = {
  durationInstant: "var(--motion-duration-instant)",
  durationFast: "var(--motion-duration-fast)",
  durationNormal: "var(--motion-duration-normal)",
  durationModerate: "var(--motion-duration-moderate)",
  durationSlow: "var(--motion-duration-slow)",
  easeOut: "var(--motion-ease-out)",
  easeIn: "var(--motion-ease-in)",
  easeInOut: "var(--motion-ease-in-out)",
  distanceSm: "var(--motion-distance-sm)",
  distanceMd: "var(--motion-distance-md)",
  distanceLg: "var(--motion-distance-lg)",
} as const;

/** Z-index CSS variables */
export const zIndexVars = {
  background: "var(--z-background)",
  content: "var(--z-content)",
  sticky: "var(--z-sticky)",
  dropdown: "var(--z-dropdown)",
  modal: "var(--z-modal)",
  toast: "var(--z-toast)",
  tooltip: "var(--z-tooltip)",
} as const;

/** Breakpoints (Tailwind defaults) — for JS hooks / matchMedia */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type ColorToken = (typeof colorTokens)[keyof typeof colorTokens];

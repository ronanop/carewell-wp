/**
 * Design Token Engine — theme tokens consumed by all blocks.
 */

import type { DesignTokens } from "@/types/studio-platform";
import { emitStudioEvent } from "@/lib/experience/platform/events";

const TOKEN_PRESETS: Record<string, DesignTokens> = {
  medical: {
    id: "medical",
    name: "Medical",
    colors: {
      primary: "#0d4f4f",
      secondary: "#1a6666",
      accent: "#2d7a7a",
      background: "#ffffff",
      surface: "#ffffff",
      foreground: "#171717",
      muted: "#f5f5f5",
      border: "#e5e5e5",
    },
    radius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
    },
    shadow: {
      sm: "0 1px 2px rgb(0 0 0 / 0.05)",
      md: "0 4px 12px rgb(0 0 0 / 0.08)",
      lg: "0 12px 32px rgb(0 0 0 / 0.12)",
    },
    typography: {
      fontHeading: "var(--font-heading)",
      fontBody: "var(--font-body)",
      scale: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
    },
    animation: {
      durationFast: "150ms",
      durationBase: "250ms",
      durationSlow: "400ms",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#171717",
      secondary: "#404040",
      accent: "#525252",
      background: "#ffffff",
      surface: "#fafafa",
      foreground: "#171717",
      muted: "#f5f5f5",
      border: "#e5e5e5",
    },
    radius: {
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
    },
    shadow: {
      sm: "none",
      md: "0 1px 2px rgb(0 0 0 / 0.04)",
      lg: "0 4px 16px rgb(0 0 0 / 0.06)",
    },
    typography: {
      fontHeading: "var(--font-heading)",
      fontBody: "var(--font-body)",
      scale: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
    },
    animation: {
      durationFast: "120ms",
      durationBase: "200ms",
      durationSlow: "320ms",
      easing: "ease-out",
    },
  },
  luxury: {
    id: "luxury",
    name: "Luxury",
    colors: {
      primary: "#1c1917",
      secondary: "#44403c",
      accent: "#a8a29e",
      background: "#fafaf9",
      surface: "#ffffff",
      foreground: "#1c1917",
      muted: "#f5f5f4",
      border: "#e7e5e4",
    },
    radius: {
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.75rem",
      md: "1.25rem",
      lg: "2rem",
      xl: "3rem",
      "2xl": "4rem",
    },
    shadow: {
      sm: "0 1px 2px rgb(28 25 23 / 0.06)",
      md: "0 8px 24px rgb(28 25 23 / 0.08)",
      lg: "0 20px 48px rgb(28 25 23 / 0.12)",
    },
    typography: {
      fontHeading: "var(--font-heading)",
      fontBody: "var(--font-body)",
      scale: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1.0625rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "1.875rem",
        "3xl": "2.25rem",
      },
    },
    animation: {
      durationFast: "180ms",
      durationBase: "320ms",
      durationSlow: "520ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
};

let activeThemeId = "medical";

export function listThemes(): DesignTokens[] {
  return Object.values(TOKEN_PRESETS);
}

export function getThemeTokens(themeId?: string): DesignTokens {
  const id = themeId ?? activeThemeId;
  return TOKEN_PRESETS[id] ?? TOKEN_PRESETS.medical;
}

export function setActiveTheme(themeId: string): DesignTokens {
  const tokens = getThemeTokens(themeId);
  activeThemeId = tokens.id;
  emitStudioEvent("ThemeChanged", { themeId: tokens.id });
  return tokens;
}

/**
 * CSS variable map for applying tokens to a subtree.
 */
export function tokensToCssVars(tokens: DesignTokens): Record<string, string> {
  return {
    "--studio-color-primary": tokens.colors.primary,
    "--studio-color-secondary": tokens.colors.secondary,
    "--studio-color-accent": tokens.colors.accent,
    "--studio-color-background": tokens.colors.background,
    "--studio-color-surface": tokens.colors.surface,
    "--studio-color-foreground": tokens.colors.foreground,
    "--studio-color-muted": tokens.colors.muted,
    "--studio-color-border": tokens.colors.border,
    "--studio-radius-sm": tokens.radius.sm,
    "--studio-radius-md": tokens.radius.md,
    "--studio-radius-lg": tokens.radius.lg,
    "--studio-radius-xl": tokens.radius.xl,
    "--studio-space-xs": tokens.spacing.xs,
    "--studio-space-sm": tokens.spacing.sm,
    "--studio-space-md": tokens.spacing.md,
    "--studio-space-lg": tokens.spacing.lg,
    "--studio-space-xl": tokens.spacing.xl,
    "--studio-space-2xl": tokens.spacing["2xl"],
    "--studio-shadow-sm": tokens.shadow.sm,
    "--studio-shadow-md": tokens.shadow.md,
    "--studio-shadow-lg": tokens.shadow.lg,
    "--studio-font-heading": tokens.typography.fontHeading,
    "--studio-font-body": tokens.typography.fontBody,
    "--studio-anim-fast": tokens.animation.durationFast,
    "--studio-anim-base": tokens.animation.durationBase,
    "--studio-anim-slow": tokens.animation.durationSlow,
    "--studio-anim-easing": tokens.animation.easing,
  };
}

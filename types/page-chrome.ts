/**
 * Global Page Chrome + Widget contracts (Phase 4.6A).
 * These are renderer-level UI — not PresentationConfig content sections.
 */

import type { PageType } from "@/lib/experience/engine/pageClassification";

export type GlobalWidgetId =
  | "consultation-sidebar"
  | "whatsapp-button"
  | "sticky-call-button"
  | "callback-widget"
  | "newsletter"
  | "cookie-banner"
  | "exit-intent"
  | "live-chat";

export type ConsultationVisibilityMode = "inherit" | "show" | "hide";

/** Per-page chrome override stored on PresentationConfig (not a section). */
export type ConsultationChromeOverride = {
  visibility: ConsultationVisibilityMode;
  stickyOffsetPx?: number | null;
  desktopWidthPx?: number | null;
  variant?: string | null;
  theme?: string | null;
  animation?: string | null;
};

export type PageChromeConfig = {
  consultationSidebar: ConsultationChromeOverride;
};

export type ConsultationSidebarGlobalSettings = {
  enabled: boolean;
  desktopWidthPx: number;
  stickyOffsetPx: number;
  minWidthPx: number;
  maxWidthPx: number;
  variant: string;
  theme: string;
  heading: string;
  subtitle: string;
  ctaLabel: string;
  badgeLabel: string;
  phoneNumber: string;
  whatsappNumber: string;
  emergencyNumber: string;
  successMessage: string;
  animation: string;
  showTrustBadges: boolean;
  googleRatingLabel: string;
  patientsLabel: string;
  responseBadge: string;
  doctorAvailabilityLabel: string;
  /** pageType → default enabled */
  visibilityByPageType: Partial<Record<PageType, boolean>>;
  /** Absolute URI exclusions */
  excludedUris: string[];
};

export const DEFAULT_CONSULTATION_SETTINGS: ConsultationSidebarGlobalSettings = {
  enabled: true,
  desktopWidthPx: 340,
  stickyOffsetPx: 120,
  minWidthPx: 320,
  maxWidthPx: 360,
  variant: "premium",
  theme: "medical-white",
  heading: "Book Your Consultation",
  subtitle:
    "Speak directly with our specialists. Quick response within 30 minutes.",
  ctaLabel: "Book Consultation",
  badgeLabel: "FREE CONSULTATION",
  phoneNumber: "+91 9667-977-499",
  whatsappNumber: "919667977499",
  emergencyNumber: "+91 9667-977-499",
  successMessage: "Thank you — we will contact you shortly.",
  animation: "premium",
  showTrustBadges: true,
  googleRatingLabel: "★★★★★ Google Rating",
  patientsLabel: "1000+ Happy Patients",
  responseBadge: "Quick response within 30 minutes",
  doctorAvailabilityLabel: "Specialists available today",
  visibilityByPageType: {
    HOME: false,
    SERVICE: true,
    DOCTOR: false,
    BLOG: false,
    LANDING: false,
    LEGAL: false,
    CONTACT: false,
    ABOUT: false,
    GALLERY: false,
    GENERIC: false,
  },
  excludedUris: [],
};

/** Resolved chrome payload attached to PresentationPage for the renderer. */
export type ResolvedConsultationChrome = {
  widgetId: "consultation-sidebar";
  enabled: true;
  stickyOffsetPx: number;
  desktopWidthPx: number;
  minWidthPx: number;
  maxWidthPx: number;
  variant: string;
  theme: string;
  animation: string;
  heading: string;
  subtitle: string;
  ctaLabel: string;
  badgeLabel: string;
  phoneNumber: string;
  whatsappNumber: string;
  emergencyNumber: string;
  successMessage: string;
  showTrustBadges: boolean;
  googleRatingLabel: string;
  patientsLabel: string;
  responseBadge: string;
  doctorAvailabilityLabel: string;
  /** Auto-filled treatment / attribution */
  treatment: string;
  pageTitle: string;
  pageSlug: string;
  pageUri: string;
};

export type ResolvedPageChrome = {
  consultation: ResolvedConsultationChrome | null;
};

export type ResolvedGlobalWidget = {
  id: GlobalWidgetId;
  enabled: boolean;
};

export const DEFAULT_PAGE_CHROME_CONFIG: PageChromeConfig = {
  consultationSidebar: {
    visibility: "inherit",
    stickyOffsetPx: null,
    desktopWidthPx: null,
    variant: null,
    theme: null,
    animation: null,
  },
};

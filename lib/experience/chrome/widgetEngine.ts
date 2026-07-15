/**
 * Global Widget Engine — resolves which renderer-level widgets appear.
 * Future widgets (WhatsApp, cookie banner, exit intent) plug in here.
 */

import {
  classifyPage,
  defaultConsultationVisibility,
  type PageClassificationInput,
  type PageType,
} from "@/lib/experience/engine/pageClassification";
import type {
  ConsultationSidebarGlobalSettings,
  PageChromeConfig,
  ResolvedConsultationChrome,
  ResolvedGlobalWidget,
  ResolvedPageChrome,
} from "@/types/page-chrome";
import { DEFAULT_CONSULTATION_SETTINGS } from "@/types/page-chrome";

export type ResolveChromeInput = PageClassificationInput & {
  settings?: ConsultationSidebarGlobalSettings | null;
  pageChrome?: PageChromeConfig | null;
};

function normalizeUri(uri: string): string {
  const trimmed = uri.trim().toLowerCase();
  if (!trimmed || trimmed === "/") return "/";
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function isEnabledForPageType(
  settings: ConsultationSidebarGlobalSettings,
  pageType: PageType,
): boolean {
  const map = settings.visibilityByPageType;
  if (pageType in map && typeof map[pageType] === "boolean") {
    return Boolean(map[pageType]);
  }
  return defaultConsultationVisibility(pageType);
}

function deriveTreatment(title: string, slug?: string | null): string {
  const cleaned = title
    .replace(/\s*[|\-–—]\s*Care\s*Well.*$/i, "")
    .replace(/\s+in\s+Delhi.*$/i, "")
    .trim();
  if (cleaned.length >= 3) return cleaned;
  if (slug) {
    return slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  return "General Enquiry";
}

/**
 * Resolves whether the consultation sidebar widget should render.
 */
export function resolveConsultationChrome(
  input: ResolveChromeInput,
): ResolvedConsultationChrome | null {
  const settings = input.settings ?? DEFAULT_CONSULTATION_SETTINGS;
  const pageType = classifyPage(input);
  const uri = normalizeUri(input.uri);
  const override = input.pageChrome?.consultationSidebar;

  if (!settings.enabled) return null;

  if (settings.excludedUris.some((item) => normalizeUri(item) === uri)) {
    return null;
  }

  let visible = isEnabledForPageType(settings, pageType);
  if (override?.visibility === "show") visible = true;
  if (override?.visibility === "hide") visible = false;
  if (!visible) return null;

  const stickyOffsetPx =
    override?.stickyOffsetPx ?? settings.stickyOffsetPx ?? 120;
  const desktopWidthPx = Math.min(
    settings.maxWidthPx,
    Math.max(
      settings.minWidthPx,
      override?.desktopWidthPx ?? settings.desktopWidthPx,
    ),
  );

  const slug =
    input.slug ??
    uri.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).pop() ??
    "";

  return {
    widgetId: "consultation-sidebar",
    enabled: true,
    stickyOffsetPx,
    desktopWidthPx,
    minWidthPx: settings.minWidthPx,
    maxWidthPx: settings.maxWidthPx,
    variant: override?.variant ?? settings.variant,
    theme: override?.theme ?? settings.theme,
    animation: override?.animation ?? settings.animation,
    heading: settings.heading,
    subtitle: settings.subtitle,
    ctaLabel: settings.ctaLabel,
    badgeLabel: settings.badgeLabel,
    phoneNumber: settings.phoneNumber,
    whatsappNumber: settings.whatsappNumber,
    emergencyNumber: settings.emergencyNumber,
    successMessage: settings.successMessage,
    showTrustBadges: settings.showTrustBadges,
    googleRatingLabel: settings.googleRatingLabel,
    patientsLabel: settings.patientsLabel,
    responseBadge: settings.responseBadge,
    doctorAvailabilityLabel: settings.doctorAvailabilityLabel,
    treatment: deriveTreatment(input.title ?? "", slug),
    pageTitle: input.title ?? "",
    pageSlug: slug,
    pageUri: uri,
  };
}

export function resolvePageChrome(input: ResolveChromeInput): ResolvedPageChrome {
  return {
    consultation: resolveConsultationChrome(input),
  };
}

export function listResolvedWidgets(
  chrome: ResolvedPageChrome,
): ResolvedGlobalWidget[] {
  return [
    {
      id: "consultation-sidebar",
      enabled: Boolean(chrome.consultation),
    },
  ];
}

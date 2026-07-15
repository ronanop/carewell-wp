import "server-only";

import { getPrisma } from "@/lib/experience/db";
import {
  DEFAULT_CONSULTATION_SETTINGS,
  type ConsultationSidebarGlobalSettings,
} from "@/types/page-chrome";
import type { PageType } from "@/lib/experience/engine/pageClassification";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asVisibilityMap(
  value: unknown,
): Partial<Record<PageType, boolean>> {
  if (!value || typeof value !== "object") return {};
  const out: Partial<Record<PageType, boolean>> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "boolean") {
      out[key as PageType] = raw;
    }
  }
  return out;
}

function mapRow(row: {
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
  visibilityByPageType: unknown;
  excludedUris: unknown;
}): ConsultationSidebarGlobalSettings {
  return {
    enabled: row.enabled,
    desktopWidthPx: row.desktopWidthPx,
    stickyOffsetPx: row.stickyOffsetPx,
    minWidthPx: row.minWidthPx,
    maxWidthPx: row.maxWidthPx,
    variant: row.variant,
    theme: row.theme,
    heading: row.heading,
    subtitle: row.subtitle,
    ctaLabel: row.ctaLabel,
    badgeLabel: row.badgeLabel,
    phoneNumber: row.phoneNumber,
    whatsappNumber: row.whatsappNumber,
    emergencyNumber: row.emergencyNumber,
    successMessage: row.successMessage,
    animation: row.animation,
    showTrustBadges: row.showTrustBadges,
    googleRatingLabel: row.googleRatingLabel,
    patientsLabel: row.patientsLabel,
    responseBadge: row.responseBadge,
    doctorAvailabilityLabel: row.doctorAvailabilityLabel,
    visibilityByPageType: {
      ...DEFAULT_CONSULTATION_SETTINGS.visibilityByPageType,
      ...asVisibilityMap(row.visibilityByPageType),
    },
    excludedUris: asStringArray(row.excludedUris),
  };
}

export function createConsultationSettingsRepository(client = getPrisma()) {
  return {
    async getOrCreateDefault(): Promise<ConsultationSidebarGlobalSettings> {
      const existing = await client.consultationSidebarSettings.findUnique({
        where: { key: "default" },
      });
      if (existing) return mapRow(existing);

      try {
        const created = await client.consultationSidebarSettings.create({
          data: {
            key: "default",
            visibilityByPageType:
              DEFAULT_CONSULTATION_SETTINGS.visibilityByPageType,
            excludedUris: [],
          },
        });
        return mapRow(created);
      } catch {
        const raced = await client.consultationSidebarSettings.findUnique({
          where: { key: "default" },
        });
        if (raced) return mapRow(raced);
        throw new Error("Failed to load consultation sidebar settings");
      }
    },

    async update(
      patch: Partial<ConsultationSidebarGlobalSettings>,
    ): Promise<ConsultationSidebarGlobalSettings> {
      const current = await this.getOrCreateDefault();
      const next = { ...current, ...patch };
      const row = await client.consultationSidebarSettings.update({
        where: { key: "default" },
        data: {
          enabled: next.enabled,
          desktopWidthPx: next.desktopWidthPx,
          stickyOffsetPx: next.stickyOffsetPx,
          minWidthPx: next.minWidthPx,
          maxWidthPx: next.maxWidthPx,
          variant: next.variant,
          theme: next.theme,
          heading: next.heading,
          subtitle: next.subtitle,
          ctaLabel: next.ctaLabel,
          badgeLabel: next.badgeLabel,
          phoneNumber: next.phoneNumber,
          whatsappNumber: next.whatsappNumber,
          emergencyNumber: next.emergencyNumber,
          successMessage: next.successMessage,
          animation: next.animation,
          showTrustBadges: next.showTrustBadges,
          googleRatingLabel: next.googleRatingLabel,
          patientsLabel: next.patientsLabel,
          responseBadge: next.responseBadge,
          doctorAvailabilityLabel: next.doctorAvailabilityLabel,
          visibilityByPageType: next.visibilityByPageType,
          excludedUris: next.excludedUris,
        },
      });
      return mapRow(row);
    },
  };
}

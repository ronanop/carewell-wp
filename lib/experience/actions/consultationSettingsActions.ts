"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { createConsultationSettingsRepository } from "@/lib/experience/repositories/consultationSettingsRepository";
import type { ConsultationSidebarGlobalSettings } from "@/types/page-chrome";

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string };

const settingsSchema = z.object({
  enabled: z.boolean(),
  desktopWidthPx: z.number().int().min(280).max(420),
  stickyOffsetPx: z.number().int().min(0).max(240),
  minWidthPx: z.number().int().min(280).max(360),
  maxWidthPx: z.number().int().min(300).max(420),
  variant: z.string().min(1).max(40),
  theme: z.string().min(1).max(40),
  heading: z.string().min(1).max(120),
  subtitle: z.string().min(1).max(400),
  ctaLabel: z.string().min(1).max(80),
  badgeLabel: z.string().min(1).max(80),
  phoneNumber: z.string().max(40),
  whatsappNumber: z.string().max(40),
  emergencyNumber: z.string().max(40),
  successMessage: z.string().min(1).max(300),
  animation: z.string().min(1).max(40),
  showTrustBadges: z.boolean(),
  googleRatingLabel: z.string().max(80),
  patientsLabel: z.string().max(80),
  responseBadge: z.string().max(120),
  doctorAvailabilityLabel: z.string().max(120),
  visibilityByPageType: z.record(z.string(), z.boolean()),
  excludedUris: z.array(z.string().max(300)).max(200),
});

export async function getConsultationSettingsAction(): Promise<
  ActionResult<ConsultationSidebarGlobalSettings>
> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    const settings =
      await createConsultationSettingsRepository().getOrCreateDefault();
    return { ok: true, data: settings, message: "OK" };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to load settings",
    };
  }
}

export async function saveConsultationSettingsAction(
  raw: unknown,
): Promise<ActionResult<ConsultationSidebarGlobalSettings>> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Unauthorized" };
  }

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid settings",
    };
  }

  try {
    const settings = await createConsultationSettingsRepository().update(
      parsed.data as ConsultationSidebarGlobalSettings,
    );
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { ok: true, data: settings, message: "Consultation settings saved" };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to save settings",
    };
  }
}

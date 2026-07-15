"use client";

import { useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { saveConsultationSettingsAction } from "@/lib/experience/actions/consultationSettingsActions";
import type { ConsultationSidebarGlobalSettings } from "@/types/page-chrome";
import type { PageType } from "@/lib/experience/engine/pageClassification";
import { cn } from "@/lib/utils";

const PAGE_TYPES: PageType[] = [
  "HOME",
  "SERVICE",
  "DOCTOR",
  "BLOG",
  "LANDING",
  "LEGAL",
  "CONTACT",
  "ABOUT",
  "GALLERY",
  "GENERIC",
];

const fieldClassName = cn(
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-small",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

export function ConsultationSettingsForm({
  initial,
}: {
  initial: ConsultationSidebarGlobalSettings;
}) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function patch<K extends keyof ConsultationSidebarGlobalSettings>(
    key: K,
    value: ConsultationSidebarGlobalSettings[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section className="max-w-3xl rounded-xl border border-border bg-surface p-6">
      <h2 className="font-heading text-h3 font-semibold text-foreground">
        Consultation Sidebar
      </h2>
      <p className="mt-2 text-small text-muted-foreground">
        Global page chrome defaults. Service pages show the sticky sidebar
        automatically unless a page override hides it.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-small sm:col-span-2">
          <input
            type="checkbox"
            checked={values.enabled}
            onChange={(event) => patch("enabled", event.target.checked)}
          />
          Enabled globally
        </label>

        <Field label="Heading">
          <input
            className={fieldClassName}
            value={values.heading}
            onChange={(event) => patch("heading", event.target.value)}
          />
        </Field>
        <Field label="Badge">
          <input
            className={fieldClassName}
            value={values.badgeLabel}
            onChange={(event) => patch("badgeLabel", event.target.value)}
          />
        </Field>
        <Field label="Subtitle" className="sm:col-span-2">
          <textarea
            className={fieldClassName}
            rows={2}
            value={values.subtitle}
            onChange={(event) => patch("subtitle", event.target.value)}
          />
        </Field>
        <Field label="CTA label">
          <input
            className={fieldClassName}
            value={values.ctaLabel}
            onChange={(event) => patch("ctaLabel", event.target.value)}
          />
        </Field>
        <Field label="Success message">
          <input
            className={fieldClassName}
            value={values.successMessage}
            onChange={(event) => patch("successMessage", event.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            className={fieldClassName}
            value={values.phoneNumber}
            onChange={(event) => patch("phoneNumber", event.target.value)}
          />
        </Field>
        <Field label="WhatsApp (digits)">
          <input
            className={fieldClassName}
            value={values.whatsappNumber}
            onChange={(event) => patch("whatsappNumber", event.target.value)}
          />
        </Field>
        <Field label="Emergency">
          <input
            className={fieldClassName}
            value={values.emergencyNumber}
            onChange={(event) => patch("emergencyNumber", event.target.value)}
          />
        </Field>
        <Field label="Sticky offset (px)">
          <input
            type="number"
            className={fieldClassName}
            value={values.stickyOffsetPx}
            onChange={(event) =>
              patch("stickyOffsetPx", Number(event.target.value))
            }
          />
        </Field>
        <Field label="Desktop width (px)">
          <input
            type="number"
            className={fieldClassName}
            value={values.desktopWidthPx}
            onChange={(event) =>
              patch("desktopWidthPx", Number(event.target.value))
            }
          />
        </Field>
        <Field label="Variant">
          <input
            className={fieldClassName}
            value={values.variant}
            onChange={(event) => patch("variant", event.target.value)}
          />
        </Field>
        <Field label="Theme">
          <input
            className={fieldClassName}
            value={values.theme}
            onChange={(event) => patch("theme", event.target.value)}
          />
        </Field>
        <Field label="Animation">
          <input
            className={fieldClassName}
            value={values.animation}
            onChange={(event) => patch("animation", event.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-small sm:col-span-2">
          <input
            type="checkbox"
            checked={values.showTrustBadges}
            onChange={(event) => patch("showTrustBadges", event.target.checked)}
          />
          Show trust badges
        </label>
      </div>

      <div className="mt-8">
        <h3 className="font-heading text-small font-semibold text-foreground">
          Visibility by page type
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PAGE_TYPES.map((pageType) => (
            <li key={pageType}>
              <label className="flex items-center gap-2 text-small">
                <input
                  type="checkbox"
                  checked={Boolean(values.visibilityByPageType[pageType])}
                  onChange={(event) =>
                    patch("visibilityByPageType", {
                      ...values.visibilityByPageType,
                      [pageType]: event.target.checked,
                    })
                  }
                />
                {pageType}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Field label="Excluded URIs (one per line)" className="mt-8">
        <textarea
          className={fieldClassName}
          rows={4}
          value={values.excludedUris.join("\n")}
          onChange={(event) =>
            patch(
              "excludedUris",
              event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
        />
      </Field>

      <div className="mt-6 flex items-center gap-3">
        <Button
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveConsultationSettingsAction(values);
              setMessage(result.message);
            });
          }}
        >
          {pending ? "Saving…" : "Save consultation settings"}
        </Button>
        {message ? (
          <p className="text-small text-muted-foreground" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-small", className)}>
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

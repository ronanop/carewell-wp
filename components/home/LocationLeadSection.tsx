"use client";

import { Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { Button } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const TREATMENT_OPTIONS = [
  "General consultation",
  "Hair Transplant",
  "Cosmetic Treatments",
  "Plastic Surgery",
  "Skin Treatments",
  "Body Contouring",
  "Other",
] as const;

const fieldClassName = cn(
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5",
  "text-body text-foreground placeholder:text-muted-foreground",
  "transition-colors focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
);

const DEFAULT_HEADING = "Conveniently Located in South Delhi";
const DEFAULT_ADDRESS =
  "Chittaranjan Park, near market area. Mon–Sun 10:00 AM to 7:00 PM.";
const DEFAULT_MAP_QUERY = "Chittaranjan Park, New Delhi, Delhi";
const DEFAULT_MAP_ZOOM = 15;
const DEFAULT_NAME_LABEL = "Name";
const DEFAULT_NAME_PLACEHOLDER = "Your full name";
const DEFAULT_MOBILE_LABEL = "Mobile";
const DEFAULT_MOBILE_PLACEHOLDER = "10-digit mobile number";
const DEFAULT_TREATMENT_LABEL = "Treatment interest";
const DEFAULT_BUTTON = "Claim My Free Slot";
const DEFAULT_SUCCESS = "Thank you — we'll be in touch shortly.";
const DEFAULT_PRIVACY = "100% Private | Response within 2 hours | No spam";

function buildMapEmbedUrl(query: string, zoom: number | string) {
  const q = encodeURIComponent(query);
  const z = Number(zoom) || DEFAULT_MAP_ZOOM;
  return `https://maps.google.com/maps?q=${q}&z=${z}&output=embed`;
}

/**
 * Location + lead capture section.
 * Form is UI-only for now — WordPress / forms plugin wiring comes later.
 * Map embed uses a place-name query; replace with exact lat/lng when available.
 */
export function LocationLeadSection() {
  const { config } = useStaticEditContext();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [treatment, setTreatment] =
    useState<(typeof TREATMENT_OPTIONS)[number]>("General consultation");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const heading = resolveElementText(
    config,
    "home.location.heading",
    DEFAULT_HEADING,
  );
  const address = resolveElementText(
    config,
    "home.location.address",
    DEFAULT_ADDRESS,
  );
  const mapQuery = resolveElementField(
    config,
    "home.location.map",
    "query",
    DEFAULT_MAP_QUERY,
  );
  const mapZoom = resolveElementField(
    config,
    "home.location.map",
    "zoom",
    DEFAULT_MAP_ZOOM,
  );
  const mapSrc = buildMapEmbedUrl(String(mapQuery), mapZoom as number | string);

  const nameLabel = resolveElementField(
    config,
    "home.location.form.nameLabel",
    "text",
    DEFAULT_NAME_LABEL,
  );
  const namePlaceholder = resolveElementField(
    config,
    "home.location.form.nameLabel",
    "placeholder",
    DEFAULT_NAME_PLACEHOLDER,
  );
  const mobileLabel = resolveElementField(
    config,
    "home.location.form.mobileLabel",
    "text",
    DEFAULT_MOBILE_LABEL,
  );
  const mobilePlaceholder = resolveElementField(
    config,
    "home.location.form.mobileLabel",
    "placeholder",
    DEFAULT_MOBILE_PLACEHOLDER,
  );
  const treatmentLabel = resolveElementText(
    config,
    "home.location.form.treatmentLabel",
    DEFAULT_TREATMENT_LABEL,
  );
  const buttonLabel = resolveElementField(
    config,
    "home.location.form.button",
    "label",
    DEFAULT_BUTTON,
  );
  const successMessage = resolveElementText(
    config,
    "home.location.form.success",
    DEFAULT_SUCCESS,
  );
  const privacy = resolveElementText(
    config,
    "home.location.form.privacy",
    DEFAULT_PRIVACY,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);

    const trimmedName = name.trim();
    const digits = mobile.replace(/\D/g, "");

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(digits)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    setSuccess(true);
    // TODO: Submit to WordPress / forms endpoint when wired.
  }

  return (
    <section className="bg-[#F5F6F8]" aria-labelledby="location-lead-heading">
      <div className="container-content section-padding">
        <div
          className={cn(
            "rounded-2xl border border-border/60 bg-white/70 p-6 shadow-[0_8px_30px_rgb(10_37_64/0.06)]",
            "sm:p-8 lg:p-10",
          )}
        >
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <EditableElement
                id="home.location.heading"
                kind="heading"
                defaultValue={DEFAULT_HEADING}
                as="h2"
                className="font-heading text-h2 text-[#0A2540]"
              >
                {({ value }) => (
                  <span id="location-lead-heading">{value || heading}</span>
                )}
              </EditableElement>
              <EditableElement
                id="home.location.address"
                kind="paragraph"
                defaultValue={DEFAULT_ADDRESS}
                as="p"
                className="mt-3 text-body text-muted-foreground"
              >
                {({ value }) => value || address}
              </EditableElement>

              <EditableElement
                id="home.location.map"
                kind="map"
                field="query"
                defaultValue={DEFAULT_MAP_QUERY}
                className="mt-6 min-h-[280px] overflow-hidden rounded-2xl border border-border/60 bg-[#E8EEF2] sm:min-h-[320px] aspect-[16/10]"
              >
                {({ fields }) => {
                  const query = String(fields.query ?? mapQuery);
                  const zoom = fields.zoom ?? mapZoom;
                  const src = buildMapEmbedUrl(query, zoom as number | string);
                  return (
                    <iframe
                      title="Care Well Medical Centre — Chittaranjan Park, New Delhi"
                      src={src || mapSrc}
                      className="h-full min-h-[280px] w-full border-0 sm:min-h-[320px]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  );
                }}
              </EditableElement>
            </div>

            <div
              className={cn(
                "rounded-2xl border border-border/60 bg-white p-6",
                "shadow-[0_8px_30px_rgb(10_37_64/0.08)] sm:p-8",
              )}
            >
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <EditableElement
                    id="home.location.form.nameLabel"
                    kind="form-field"
                    defaultValue={DEFAULT_NAME_LABEL}
                    as="div"
                  >
                    {({ fields }) => (
                      <>
                        <label
                          htmlFor="lead-name"
                          className="block text-small font-medium text-[#0A2540]"
                        >
                          {String(fields.text ?? nameLabel)}
                        </label>
                        <input
                          id="lead-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder={String(
                            fields.placeholder ?? namePlaceholder,
                          )}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setSuccess(false);
                          }}
                          className={fieldClassName}
                          aria-invalid={Boolean(error && !name.trim())}
                          aria-describedby={
                            error ? "lead-form-error" : undefined
                          }
                        />
                      </>
                    )}
                  </EditableElement>
                </div>

                <div>
                  <EditableElement
                    id="home.location.form.mobileLabel"
                    kind="form-field"
                    defaultValue={DEFAULT_MOBILE_LABEL}
                    as="div"
                  >
                    {({ fields }) => (
                      <>
                        <label
                          htmlFor="lead-mobile"
                          className="block text-small font-medium text-[#0A2540]"
                        >
                          {String(fields.text ?? mobileLabel)}
                        </label>
                        <input
                          id="lead-mobile"
                          name="mobile"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder={String(
                            fields.placeholder ?? mobilePlaceholder,
                          )}
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            setSuccess(false);
                          }}
                          className={fieldClassName}
                          aria-invalid={Boolean(
                            error &&
                              !/^\d{10}$/.test(mobile.replace(/\D/g, "")),
                          )}
                          aria-describedby={
                            error ? "lead-form-error" : undefined
                          }
                        />
                      </>
                    )}
                  </EditableElement>
                </div>

                <div>
                  <EditableElement
                    id="home.location.form.treatmentLabel"
                    kind="form-field"
                    defaultValue={DEFAULT_TREATMENT_LABEL}
                    as="div"
                  >
                    {({ value }) => (
                      <>
                        <label
                          htmlFor="lead-treatment"
                          className="block text-small font-medium text-[#0A2540]"
                        >
                          {value || treatmentLabel}
                        </label>
                        <select
                          id="lead-treatment"
                          name="treatment"
                          value={treatment}
                          onChange={(e) => {
                            setTreatment(
                              e.target.value as (typeof TREATMENT_OPTIONS)[number],
                            );
                            setSuccess(false);
                          }}
                          className={fieldClassName}
                        >
                          {TREATMENT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </EditableElement>
                </div>

                {error ? (
                  <p
                    id="lead-form-error"
                    role="alert"
                    className="text-small text-destructive"
                  >
                    {error}
                  </p>
                ) : null}

                {success ? (
                  <EditableElement
                    id="home.location.form.success"
                    kind="paragraph"
                    defaultValue={DEFAULT_SUCCESS}
                    as="p"
                    className="text-small text-success-600"
                  >
                    {({ value }) => (
                      <span role="status">{value || successMessage}</span>
                    )}
                  </EditableElement>
                ) : null}

                <EditableElement
                  id="home.location.form.button"
                  kind="button"
                  field="label"
                  defaultValue={DEFAULT_BUTTON}
                  as="div"
                >
                  {({ fields }) => (
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90"
                    >
                      {String(fields.label ?? buttonLabel)}
                    </Button>
                  )}
                </EditableElement>

                <EditableElement
                  id="home.location.form.privacy"
                  kind="caption"
                  defaultValue={DEFAULT_PRIVACY}
                  as="p"
                  className="flex items-start justify-center gap-2 text-center text-small text-muted-foreground"
                >
                  {({ value }) => (
                    <>
                      <Lock
                        className="mt-0.5 size-3.5 shrink-0 text-[#0A2540]"
                        aria-hidden
                      />
                      <span>{value || privacy}</span>
                    </>
                  )}
                </EditableElement>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

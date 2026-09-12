"use client";

import { Lock, Loader2 } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";

import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { Button } from "@/components/ui/button";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { submitConsultationLeadAction } from "@/lib/leads/actions/leadActions";
import { collectLeadAttribution } from "@/lib/leads/client/attribution";
import { trackGaLeadSubmit } from "@/lib/analytics/ga";
import { LazyMapEmbed } from "@/components/maps/LazyMapEmbed";
import { CLINIC_GOOGLE_MAPS_EMBED_URL } from "@/lib/maps/googleMapsEmbed";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/static-pages/elementOverrides";
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
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5",
  "text-[0.75rem] text-foreground placeholder:text-muted-foreground sm:text-body",
  "transition-colors focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
  "min-h-10 sm:min-h-11 sm:py-2.5",
);

const DEFAULT_HEADING = "Conveniently Located in South Delhi";
const DEFAULT_ADDRESS =
  "Chittaranjan Park, near market area. Mon–Sun 10:00 AM to 7:00 PM.";
const DEFAULT_MAP_QUERY = "Care Well Medical Centre, Chittaranjan Park, New Delhi";
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
  const q = query.trim();
  // Default / legacy area queries → official clinic place pin
  if (
    !q ||
    q === DEFAULT_MAP_QUERY ||
    q === "Chittaranjan Park, New Delhi, Delhi"
  ) {
    return CLINIC_GOOGLE_MAPS_EMBED_URL;
  }
  const z = Number(zoom) || DEFAULT_MAP_ZOOM;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&output=embed`;
}

/**
 * Location + lead capture section — submits via Lead Engine.
 */
export function LocationLeadSection() {
  const { config } = useStaticEditContext();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [treatment, setTreatment] =
    useState<(typeof TREATMENT_OPTIONS)[number]>("General consultation");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

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
  const nameLabel = resolveElementText(
    config,
    "home.location.form.nameLabel",
    DEFAULT_NAME_LABEL,
  );
  const namePlaceholder = resolveElementField(
    config,
    "home.location.form.nameLabel",
    "placeholder",
    DEFAULT_NAME_PLACEHOLDER,
  );
  const mobileLabel = resolveElementText(
    config,
    "home.location.form.mobileLabel",
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

    if (!consent) {
      setError("Please confirm consent to be contacted.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const attribution = collectLeadAttribution({
        pageTitle: "Home",
        pageSlug: "home",
        pageUri: "/",
        treatment,
      });

      const result = await submitConsultationLeadAction({
        name: trimmedName,
        phone: digits,
        preferredContactMethod: "PHONE",
        treatment,
        consent,
        website,
        ...attribution,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      trackGaLeadSubmit({ form: "home_location_lead", treatment });
      setSuccess(true);
      setName("");
      setMobile("");
      setConsent(false);
      setWebsite("");
    });
  }

  return (
    <section
      className="overflow-x-hidden bg-[#F5F6F8]"
      aria-labelledby="location-lead-heading"
    >
      <div className="container-content section-padding min-w-0 max-[767px]:!py-6 lg:pb-10 lg:pt-6">
        <StaggerReveal
          stepMs={80}
          className={cn(
            "min-w-0 max-w-full overflow-hidden rounded-2xl border border-border/60 bg-white/70 p-3 shadow-[0_8px_30px_rgb(10_37_64/0.06)]",
            "sm:p-8 lg:p-10",
          )}
        >
          <div className="grid min-w-0 items-start gap-4 sm:gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0 max-w-full">
              <EditableElement
                id="home.location.heading"
                kind="heading"
                defaultValue={DEFAULT_HEADING}
                as="h2"
                className="font-heading text-[1.25rem] font-bold leading-tight text-[#0A2540] sm:text-h2"
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
                className="mt-2 text-[0.75rem] text-muted-foreground sm:mt-3 sm:text-body"
              >
                {({ value }) => value || address}
              </EditableElement>

              <EditableElement
                id="home.location.map"
                kind="map"
                field="query"
                defaultValue={DEFAULT_MAP_QUERY}
                className={cn(
                  "relative mt-4 aspect-[16/10] w-full min-w-0 max-w-full max-h-[180px]",
                  "overflow-hidden rounded-xl border border-border/60 bg-[#E8EEF2]",
                  "sm:mt-6 sm:max-h-none sm:min-h-[320px] sm:rounded-2xl",
                )}
              >
                {({ fields }) => {
                  const query = String(fields.query ?? mapQuery);
                  const zoom = fields.zoom ?? mapZoom;
                  const src = buildMapEmbedUrl(query, zoom as number | string);
                  return (
                    <LazyMapEmbed
                      title="Care Well Medical Centre — Chittaranjan Park, New Delhi"
                      src={src || mapSrc}
                    />
                  );
                }}
              </EditableElement>
            </div>

            <div
              className={cn(
                "min-w-0 max-w-full rounded-xl border border-border/60 bg-white p-3",
                "shadow-[0_8px_30px_rgb(10_37_64/0.08)] sm:rounded-2xl sm:p-8",
              )}
            >
              <form
                onSubmit={handleSubmit}
                noValidate
                className="relative space-y-3 sm:space-y-5"
              >
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  aria-hidden
                />

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
                          className="block text-[0.75rem] font-medium text-[#0A2540] sm:text-small"
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
                          disabled={pending}
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
                          className="block text-[0.75rem] font-medium text-[#0A2540] sm:text-small"
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
                          disabled={pending}
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
                          className="block text-[0.75rem] font-medium text-[#0A2540] sm:text-small"
                        >
                          {value || treatmentLabel}
                        </label>
                        <select
                          id="lead-treatment"
                          name="treatment"
                          value={treatment}
                          onChange={(e) => {
                            setTreatment(
                              e.target
                                .value as (typeof TREATMENT_OPTIONS)[number],
                            );
                            setSuccess(false);
                          }}
                          className={fieldClassName}
                          disabled={pending}
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

                <label className="flex items-start gap-2 text-[0.7rem] text-muted-foreground sm:text-small">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setSuccess(false);
                    }}
                    className="mt-0.5 size-4 shrink-0 rounded border-border"
                    disabled={pending}
                  />
                  <span>
                    I consent to Care Well Medical Centre contacting me about
                    this enquiry.
                  </span>
                </label>

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
                      disabled={pending}
                      className="h-10 w-full rounded-lg bg-[#0A2540] text-[0.75rem] text-white hover:bg-[#0A2540]/90 sm:h-11 sm:text-base"
                    >
                      {pending ? (
                        <>
                          <Loader2
                            className="size-4 animate-spin"
                            aria-hidden
                          />
                          Submitting…
                        </>
                      ) : (
                        String(fields.label ?? buttonLabel)
                      )}
                    </Button>
                  )}
                </EditableElement>

                <EditableElement
                  id="home.location.form.privacy"
                  kind="caption"
                  defaultValue={DEFAULT_PRIVACY}
                  as="p"
                  className="flex items-start justify-center gap-2 text-center text-[0.7rem] text-muted-foreground sm:text-small"
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
        </StaggerReveal>
      </div>
    </section>
  );
}

"use client";

import { Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
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
  "focus-visible:ring-ring focus-visible:ring-offset-2"
);

/**
 * Location + lead capture section.
 * Form is UI-only for now — WordPress / forms plugin wiring comes later.
 * Map embed uses a place-name query; replace with exact lat/lng when available.
 */
export function LocationLeadSection() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [treatment, setTreatment] =
    useState<(typeof TREATMENT_OPTIONS)[number]>("General consultation");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
            "sm:p-8 lg:p-10"
          )}
        >
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Left — Location */}
            <div>
              <h2
                id="location-lead-heading"
                className="font-heading text-h2 text-[#0A2540]"
              >
                Conveniently Located in South Delhi
              </h2>
              <p className="mt-3 text-body text-muted-foreground">
                Chittaranjan Park, near market area. Mon–Sun 10:00 AM to 7:00
                PM.
              </p>

              {/*
                Placeholder Google Maps embed (no API key).
                Update q= / lat,lng when exact clinic coordinates are provided.
              */}
              <div className="mt-6 min-h-[280px] overflow-hidden rounded-2xl border border-border/60 bg-[#E8EEF2] sm:min-h-[320px] aspect-[16/10]">
                <iframe
                  title="Care Well Medical Centre — Chittaranjan Park, New Delhi"
                  src="https://maps.google.com/maps?q=Chittaranjan+Park,+New+Delhi,+Delhi&z=15&output=embed"
                  className="h-full min-h-[280px] w-full border-0 sm:min-h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right — Lead form */}
            <div
              className={cn(
                "rounded-2xl border border-border/60 bg-white p-6",
                "shadow-[0_8px_30px_rgb(10_37_64/0.08)] sm:p-8"
              )}
            >
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-small font-medium text-[#0A2540]"
                  >
                    Name
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSuccess(false);
                    }}
                    className={fieldClassName}
                    aria-invalid={Boolean(error && !name.trim())}
                    aria-describedby={error ? "lead-form-error" : undefined}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-mobile"
                    className="block text-small font-medium text-[#0A2540]"
                  >
                    Mobile
                  </label>
                  <input
                    id="lead-mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      setSuccess(false);
                    }}
                    className={fieldClassName}
                    aria-invalid={Boolean(
                      error && !/^\d{10}$/.test(mobile.replace(/\D/g, ""))
                    )}
                    aria-describedby={error ? "lead-form-error" : undefined}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-treatment"
                    className="block text-small font-medium text-[#0A2540]"
                  >
                    Treatment interest
                  </label>
                  <select
                    id="lead-treatment"
                    name="treatment"
                    value={treatment}
                    onChange={(e) => {
                      setTreatment(
                        e.target.value as (typeof TREATMENT_OPTIONS)[number]
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
                  <p role="status" className="text-small text-success-600">
                    Thank you — we&apos;ll be in touch shortly.
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90"
                >
                  Claim My Free Slot
                </Button>

                <p className="flex items-start justify-center gap-2 text-center text-small text-muted-foreground">
                  <Lock
                    className="mt-0.5 size-3.5 shrink-0 text-[#0A2540]"
                    aria-hidden
                  />
                  <span>100% Private | Response within 2 hours | No spam</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

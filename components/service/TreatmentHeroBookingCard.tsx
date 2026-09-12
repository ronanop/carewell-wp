"use client";

import {
  CheckCircle2,
  Clock3,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { submitConsultationLeadAction } from "@/lib/leads/actions/leadActions";
import { collectLeadAttribution } from "@/lib/leads/client/attribution";
import { trackGaLeadSubmit } from "@/lib/analytics/ga";
import { cn } from "@/lib/utils";
import type { ResolvedConsultationChrome } from "@/types/page-chrome";

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Enter a valid 10–15 digit mobile number"),
  consent: z.boolean().refine((v) => v, "Consent is required"),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClassName = cn(
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5",
  "text-[0.9375rem] text-[#101828] placeholder:text-[#98A2B3]",
  "transition-[border-color,box-shadow] duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/25",
  "focus-visible:border-[#1557A0]/45",
);

const TRUST_ITEMS = [
  { label: "100% private", Icon: Lock },
  { label: "Reply in ~2 hrs", Icon: Clock3 },
  { label: "No spam", Icon: ShieldCheck },
] as const;

function highlightFree(text: string) {
  return text.split(/(FREE)/i).map((part, i) =>
    /^FREE$/i.test(part) ? (
      <span key={i} className="text-[#1557A0]">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/**
 * Hero booking card — visual chrome mirrors BookingFormSection card layout.
 */
export function TreatmentHeroBookingCard({
  chrome,
  className,
}: {
  chrome: ResolvedConsultationChrome;
  className?: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: "",
      phone: "",
      consent: false,
      website: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const title = chrome.heading || "Book FREE Doctor Appointment";
  const subtitle =
    chrome.subtitle?.trim() ||
    (chrome.treatment
      ? `Speak with Care Well about ${chrome.treatment.toLowerCase()}.`
      : null);
  const cta = chrome.ctaLabel || "Book Free Consultation";

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const attribution = collectLeadAttribution({
        pageTitle: chrome.pageTitle,
        pageSlug: chrome.pageSlug,
        pageUri: chrome.pageUri,
        treatment: chrome.treatment,
      });

      const result = await submitConsultationLeadAction({
        name: values.name,
        phone: values.phone,
        preferredContactMethod: "PHONE",
        consent: values.consent,
        website: values.website ?? "",
        treatment: chrome.treatment,
        ...attribution,
      });

      if (!result.ok) {
        setServerError(result.message);
        return;
      }

      trackGaLeadSubmit({
        form: "treatment_hero_booking",
        treatment: chrome.treatment,
      });
      setSuccess(true);
      reset(defaultValues);
    });
  }

  return (
    <div
      id="treatment-hero-booking"
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
        "shadow-[0_12px_40px_-16px_rgba(10,46,82,0.28)]",
        className,
      )}
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-[#F3F7FC] to-white px-5 py-4 sm:px-6">
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
          {chrome.badgeLabel?.trim() || "Free consult"}
        </p>
        <h2 className="mt-1 w-full max-w-none font-heading text-lg font-semibold tracking-tight text-[#0A2E52] [text-wrap:wrap] sm:text-xl">
          {highlightFree(title)}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 text-sm leading-snug text-slate-600">{subtitle}</p>
        ) : null}
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {success ? (
          <div
            className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-5 text-center"
            role="status"
          >
            <CheckCircle2
              className="mx-auto size-9 text-emerald-600"
              aria-hidden
            />
            <p className="mt-2 text-sm font-semibold text-[#0A2E52]">
              Request received
            </p>
            <p className="mt-1 text-sm text-slate-600">{chrome.successMessage}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSuccess(false)}
            >
              Submit another request
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-3.5"
            aria-label={title}
          >
            <div
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              aria-hidden
            >
              <label htmlFor="cw-hero-website">Website</label>
              <input
                id="cw-hero-website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div>
              <label
                htmlFor="cw-hero-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Patient name
              </label>
              <input
                id="cw-hero-name"
                className={fieldClassName}
                autoComplete="name"
                placeholder="Full name"
                {...register("name")}
              />
              {errors.name?.message ? (
                <p className="mt-1 text-[0.75rem] text-destructive" role="alert">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="cw-hero-phone"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Mobile number
              </label>
              <input
                id="cw-hero-phone"
                type="tel"
                inputMode="tel"
                className={fieldClassName}
                autoComplete="tel"
                placeholder="10-digit mobile"
                {...register("phone")}
              />
              {errors.phone?.message ? (
                <p className="mt-1 text-[0.75rem] text-destructive" role="alert">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-[0.6875rem] leading-snug text-slate-600">
              <input
                type="checkbox"
                className="mt-0.5 size-3.5 shrink-0 rounded border-slate-300"
                {...register("consent")}
              />
              <span>
                I consent to Care Well Medical Centre contacting me about this
                request.
              </span>
            </label>
            {errors.consent?.message ? (
              <p className="text-[0.75rem] text-destructive" role="alert">
                {errors.consent.message}
              </p>
            ) : null}

            {serverError ? (
              <p
                className="rounded-md bg-destructive/10 px-3 py-2 text-[0.75rem] text-destructive"
                role="alert"
              >
                {serverError}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={pending}
              className={cn(
                "mt-1 h-11 w-full rounded-lg bg-[#1557A0] text-[0.9375rem] font-semibold",
                "text-white shadow-none hover:bg-[#124a8a]",
                "focus-visible:ring-2 focus-visible:ring-[#1557A0]/35",
              )}
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Booking…
                </>
              ) : (
                cta
              )}
            </Button>
          </form>
        )}

        {chrome.showTrustBadges ? (
          <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
            {TRUST_ITEMS.map(({ label, Icon }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-[#1557A0]/8 text-[#1557A0]">
                  <Icon className="size-3.5" strokeWidth={2} aria-hidden />
                </span>
                <span className="text-[0.6875rem] font-medium leading-tight text-slate-600">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

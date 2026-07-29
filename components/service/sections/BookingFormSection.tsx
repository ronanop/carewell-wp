"use client";

import { CheckCircle2, Clock3, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { submitConsultationLeadAction } from "@/lib/leads/actions/leadActions";
import { collectLeadAttribution } from "@/lib/leads/client/attribution";
import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type BookingFormSectionProps = SectionBaseProps & {
  /** CMS: booking.eyebrow */
  eyebrow?: string;
  /** CMS: booking.title — required to show the form */
  title?: string;
  /** CMS: booking.subtitle */
  subtitle?: string;
  /** CMS: service title (attribution + optional chip) */
  treatmentLabel?: string;
  /** CMS: booking.submitLabel */
  submitLabel?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  /** CMS: booking.trustItems (max 3) */
  trustItems?: string[];
  successTitle?: string;
  successBody?: string;
  successResetLabel?: string;
  /** CMS: booking.band* — used when layout="band" */
  bandEyebrow?: string;
  bandHeadline?: string;
  bandBody?: string;
  sticky?: boolean;
  layout?: "card" | "band";
  pageUri?: string;
  pageSlug?: string;
};

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

const TRUST_ICONS = [Lock, Clock3, ShieldCheck] as const;

/**
 * Consultation lead form shell.
 * Layout/chrome is React; all marketing copy must be passed from CMS.
 * Renders nothing when `title` is empty.
 */
export function BookingFormSection({
  id = "book",
  eyebrow,
  title,
  subtitle,
  treatmentLabel,
  submitLabel,
  nameLabel = "Patient name",
  namePlaceholder = "Full name",
  phoneLabel = "Mobile number",
  phonePlaceholder = "10-digit mobile",
  trustItems,
  successTitle = "Request received",
  successBody = "We’ll call you shortly on the number you shared.",
  successResetLabel = "Submit another request",
  bandEyebrow,
  bandHeadline,
  bandBody,
  sticky = false,
  layout = "card",
  pageUri,
  pageSlug,
  className,
}: BookingFormSectionProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const defaultValues = useMemo<FormValues>(
    () => ({ name: "", phone: "", website: "" }),
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

  if (!title?.trim()) return null;

  const treatment = treatmentLabel?.trim() || "Treatment";
  const cta = submitLabel?.trim() || "Book Free Consultation";
  const trusts = (trustItems ?? []).map((label) => label.trim()).filter(Boolean).slice(0, 3);

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const attribution = collectLeadAttribution({
        pageTitle: treatment,
        pageSlug:
          pageSlug || treatment.toLowerCase().replace(/\s+/g, "-"),
        pageUri:
          pageUri ||
          (typeof window !== "undefined" ? window.location.pathname : undefined),
        treatment,
      });

      const result = await submitConsultationLeadAction({
        name: values.name,
        phone: values.phone,
        preferredContactMethod: "PHONE",
        consent: true,
        website: values.website ?? "",
        treatment,
        ...attribution,
      });

      if (!result.ok) {
        setServerError(result.message);
        return;
      }

      setSuccess(true);
      reset(defaultValues);
    });
  }

  const card = (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
        "shadow-[0_12px_40px_-16px_rgba(10,46,82,0.28)]",
      )}
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-[#F3F7FC] to-white px-5 py-4 sm:px-6">
        {eyebrow ? (
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-heading text-lg font-semibold tracking-tight text-[#0A2E52] sm:text-xl",
            eyebrow ? "mt-1" : undefined,
          )}
        >
          {title.split(/(FREE)/i).map((part, i) =>
            /^FREE$/i.test(part) ? (
              <span key={i} className="text-[#1557A0]">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-slate-600">{subtitle}</p>
        ) : treatmentLabel ? (
          <p className="mt-1.5 text-sm text-slate-600">
            <span className="font-medium text-slate-800">{treatmentLabel}</span>
          </p>
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
              {successTitle}
            </p>
            {successBody ? (
              <p className="mt-1 text-sm text-slate-600">{successBody}</p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSuccess(false)}
            >
              {successResetLabel}
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-3.5"
            aria-label={title}
          >
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor={`${id}-website`}>Website</label>
              <input
                id={`${id}-website`}
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div>
              <label
                htmlFor={`${id}-name`}
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {nameLabel}
              </label>
              <input
                id={`${id}-name`}
                className={fieldClassName}
                autoComplete="name"
                placeholder={namePlaceholder}
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
                htmlFor={`${id}-phone`}
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {phoneLabel}
              </label>
              <input
                id={`${id}-phone`}
                type="tel"
                inputMode="tel"
                className={fieldClassName}
                autoComplete="tel"
                placeholder={phonePlaceholder}
                {...register("phone")}
              />
              {errors.phone?.message ? (
                <p className="mt-1 text-[0.75rem] text-destructive" role="alert">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>

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

        {trusts.length ? (
          <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
            {trusts.map((label, i) => {
              const Icon = TRUST_ICONS[i] ?? ShieldCheck;
              return (
                <li
                  key={label}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#1557A0]/8 text-[#1557A0]">
                    <Icon className="size-3.5" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="text-[0.6875rem] leading-tight font-medium text-slate-600">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );

  if (layout === "band") {
    return (
      <section
        id={id}
        className={cn(
          "relative border-y border-slate-200/80 bg-[#F6F8FC]",
          className,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_160px_at_80%_0%,rgba(21,87,160,0.07),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-center lg:gap-12 lg:px-8 lg:py-12">
          {bandHeadline || bandBody || bandEyebrow ? (
            <div className="min-w-0">
              {bandEyebrow ? (
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                  {bandEyebrow}
                </p>
              ) : null}
              {bandHeadline ? (
                <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl">
                  {bandHeadline}
                </h2>
              ) : null}
              {bandBody ? (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                  {bandBody}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="hidden lg:block" />
          )}
          <div className={sticky ? "lg:sticky lg:top-6" : undefined}>{card}</div>
        </div>
      </section>
    );
  }

  return (
    <div id={id} className={className}>
      <div className={sticky ? "lg:sticky lg:top-6" : undefined}>{card}</div>
    </div>
  );
}

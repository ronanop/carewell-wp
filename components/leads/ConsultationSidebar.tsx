"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Lock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { submitConsultationLeadAction } from "@/lib/leads/actions/leadActions";
import { collectLeadAttribution } from "@/lib/leads/client/attribution";
import { cn } from "@/lib/utils";
import type { ResolvedConsultationChrome } from "@/types/page-chrome";

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Enter a valid email",
    ),
  message: z.string().max(2000).optional(),
  preferredContactMethod: z.enum(["PHONE", "WHATSAPP", "EMAIL"]),
  consent: z.boolean().refine((v) => v, "Consent is required"),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClassName = cn(
  "mt-1.5 w-full rounded-xl border border-[#0A2540]/12 bg-white/90 px-3.5 py-2.5",
  "text-body text-[#0A2540] placeholder:text-[#0A2540]/45",
  "transition-[border-color,box-shadow] duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2540]/25",
  "focus-visible:border-[#0A2540]/35",
);

export type ConsultationSidebarCardProps = {
  chrome: ResolvedConsultationChrome;
  className?: string;
  isEditor?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onSuccess?: () => void;
};

export function ConsultationSidebarCard({
  chrome,
  className,
  isEditor,
  selected,
  onSelect,
  onSuccess,
}: ConsultationSidebarCardProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: "",
      phone: "",
      email: "",
      message: "",
      preferredContactMethod: "PHONE",
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
        ...values,
        email: values.email || undefined,
        message: values.message || undefined,
        treatment: chrome.treatment,
        preferredTime: undefined,
        website: values.website ?? "",
        consent: values.consent,
        ...attribution,
      });

      if (!result.ok) {
        setServerError(result.message);
        return;
      }

      setSuccess(true);
      reset(defaultValues);
      onSuccess?.();
    });
  }

  const phoneHref = `tel:${chrome.phoneNumber.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/${chrome.whatsappNumber.replace(/\D/g, "")}`;
  const emergencyHref = `tel:${chrome.emergencyNumber.replace(/\s/g, "")}`;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/70",
        "bg-gradient-to-b from-white/95 via-white/90 to-[#F7FAFC]/95",
        "shadow-[0_18px_50px_-24px_rgb(10_37_64/0.45)] backdrop-blur-xl",
        "transition-transform duration-300 hover:-translate-y-0.5",
        selected && "ring-2 ring-sky-500 ring-offset-2",
        isEditor && "cursor-pointer",
        className,
      )}
      data-chrome-widget="consultation-sidebar"
      data-system-chrome="true"
      onClick={
        isEditor
          ? (event) => {
              event.stopPropagation();
              onSelect?.();
            }
          : undefined
      }
    >
      {isEditor ? (
        <span className="absolute right-3 top-3 z-10 rounded-md bg-sky-600 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-white">
          System · not removable
        </span>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgb(14_165_233/0.1),transparent_70%)]" />

      <div className="relative p-5 sm:p-6">
        <div className="inline-flex items-center rounded-full border border-[#0A2540]/10 bg-[#0A2540]/[0.04] px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-[#0A2540]">
          {chrome.badgeLabel}
        </div>

        <h2
          id="consultation-sidebar-heading"
          className="mt-3 font-heading text-[1.35rem] font-semibold leading-tight text-[#0A2540]"
        >
          {chrome.heading}
        </h2>
        <p className="mt-2 text-small leading-relaxed text-[#0A2540]/70">
          {chrome.subtitle}
        </p>

        {chrome.showTrustBadges ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Trust signals">
            <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 text-[0.6875rem] text-[#0A2540]/80 shadow-sm">
              <Star className="size-3.5 text-amber-500" aria-hidden />
              {chrome.googleRatingLabel}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 text-[0.6875rem] text-[#0A2540]/80 shadow-sm">
              <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden />
              {chrome.patientsLabel}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 text-[0.6875rem] text-[#0A2540]/80 shadow-sm">
              {chrome.responseBadge}
            </li>
          </ul>
        ) : null}

        {success ? (
          <div
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto size-10 text-emerald-600" aria-hidden />
            <p className="mt-3 font-heading text-small font-semibold text-[#0A2540]">
              {chrome.successMessage}
            </p>
            <Button
              type="button"
              variant="outline"
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
            className="mt-5 space-y-3.5"
            aria-labelledby="consultation-sidebar-heading"
            onClick={(event) => isEditor && event.stopPropagation()}
          >
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor="cw-sidebar-website">Website</label>
              <input
                id="cw-sidebar-website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <Field label="Name" htmlFor="cw-sidebar-name" required error={errors.name?.message}>
              <input id="cw-sidebar-name" className={fieldClassName} autoComplete="name" {...register("name")} />
            </Field>

            <Field label="Phone" htmlFor="cw-sidebar-phone" required error={errors.phone?.message}>
              <input
                id="cw-sidebar-phone"
                type="tel"
                inputMode="tel"
                className={fieldClassName}
                autoComplete="tel"
                {...register("phone")}
              />
            </Field>

            <Field label="Email" htmlFor="cw-sidebar-email" error={errors.email?.message}>
              <input
                id="cw-sidebar-email"
                type="email"
                className={fieldClassName}
                autoComplete="email"
                {...register("email")}
              />
            </Field>

            <Field label="Treatment" htmlFor="cw-sidebar-treatment">
              <input
                id="cw-sidebar-treatment"
                className={cn(fieldClassName, "bg-[#0A2540]/[0.03]")}
                value={chrome.treatment}
                readOnly
              />
            </Field>

            <Field label="Preferred contact" htmlFor="cw-sidebar-contact">
              <select
                id="cw-sidebar-contact"
                className={fieldClassName}
                {...register("preferredContactMethod")}
              >
                <option value="PHONE">Phone</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
              </select>
            </Field>

            <Field label="Message" htmlFor="cw-sidebar-message">
              <textarea
                id="cw-sidebar-message"
                rows={3}
                className={fieldClassName}
                placeholder="Tell us briefly what you need"
                {...register("message")}
              />
            </Field>

            <label className="flex items-start gap-2.5 text-[0.75rem] text-[#0A2540]/70">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-[#0A2540]/25"
                {...register("consent")}
              />
              <span>
                I consent to Care Well Medical Centre contacting me about this
                enquiry. <span className="text-destructive">*</span>
              </span>
            </label>
            {errors.consent ? (
              <p className="text-[0.75rem] text-destructive">{errors.consent.message}</p>
            ) : null}

            {serverError ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[0.75rem] text-destructive" role="alert">
                {serverError}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-[#0A2540] text-white shadow-lg shadow-[#0A2540]/20 transition hover:bg-[#0A2540]/90"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Booking…
                </>
              ) : (
                chrome.ctaLabel
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-[#0A2540]/55">
              <ShieldCheck className="size-3.5" aria-hidden />
              Secure enquiry · {chrome.doctorAvailabilityLabel}
            </p>
            <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-[#0A2540]/45">
              <Lock className="size-3" aria-hidden />
              Your details are used only to respond to this request.
            </p>
          </form>
        )}

        <div className="mt-5 grid gap-2 border-t border-[#0A2540]/10 pt-4">
          <a
            href={phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0A2540]/12 bg-white/80 px-3 py-2.5 text-small font-medium text-[#0A2540] no-underline transition hover:bg-white"
          >
            <Phone className="size-4" aria-hidden />
            Call {chrome.phoneNumber}
          </a>
          <a
            href={waHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-small font-medium text-white no-underline transition hover:bg-emerald-700"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </a>
          <a
            href={emergencyHref}
            className="text-center text-[0.75rem] text-[#0A2540]/60 no-underline hover:underline"
          >
            Emergency: {chrome.emergencyNumber}
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-small font-medium text-[#0A2540]">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-[0.75rem] text-destructive">{error}</p> : null}
    </div>
  );
}

export function ConsultationMobileSheet({
  chrome,
  isEditor,
  selected,
  onSelect,
}: ConsultationSidebarCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isEditor) {
    return (
      <div className="border-t border-dashed border-sky-300 bg-sky-50/50 p-4 md:hidden">
        <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-wide text-sky-700">
          Mobile consultation CTA (preview)
        </p>
        <ConsultationSidebarCard
          chrome={chrome}
          isEditor={isEditor}
          selected={selected}
          onSelect={onSelect}
        />
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0A2540]/10 bg-white/95 p-3 backdrop-blur">
        <Button
          type="button"
          className="w-full gap-2 rounded-xl bg-[#0A2540] text-white"
          onClick={() => setSheetOpen(true)}
        >
          <MessageCircle className="size-4" aria-hidden />
          {chrome.ctaLabel}
        </Button>
      </div>

      <AnimatePresence>
        {sheetOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close consultation form"
              className="fixed inset-0 z-50 bg-[#0A2540]/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="consultation-sidebar-heading"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <div className="sticky top-0 z-10 flex justify-end px-3 pt-3">
                <button
                  type="button"
                  className="rounded-full bg-white p-2 text-[#0A2540] shadow-lg"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="px-3 pb-6">
                <ConsultationSidebarCard
                  chrome={chrome}
                  className="shadow-2xl"
                  onSuccess={() => setSheetOpen(false)}
                />
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

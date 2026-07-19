"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
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

/** Same brand mark as navbar (`NavbarPlaceholder`). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const fieldClassName = cn(
  "w-full rounded-xl border border-[#0A2540]/12 bg-white/90 px-3.5 py-2.5",
  "text-body text-[#0A2540] placeholder:text-[#0A2540]/45",
  "transition-[border-color,box-shadow] duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2540]/25",
  "focus-visible:border-[#0A2540]/35",
);

const floatingFieldClassName = cn(
  fieldClassName,
  "peer pt-5 pb-2 placeholder:text-transparent",
);

export type ConsultationSidebarCardProps = {
  chrome: ResolvedConsultationChrome;
  className?: string;
  /** Tighter top padding — used by service consultation-only sticky sidebar. */
  compactTop?: boolean;
  isEditor?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onSuccess?: () => void;
};

export function ConsultationSidebarCard({
  chrome,
  className,
  compactTop = false,
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
      consent: true,
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

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/70",
        "bg-gradient-to-b from-white/95 via-white/90 to-[#F7FAFC]/95",
        "shadow-[0_18px_50px_-24px_rgb(10_37_64/0.45)] backdrop-blur-xl",
        "transition-shadow duration-300",
        selected && "ring-2 ring-sky-500 ring-offset-2",
        isEditor && "cursor-pointer",
        className,
      )}
      data-chrome-widget="consultation-sidebar"
      data-system-chrome="true"
      data-compact="false"
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

      <div
        className={cn(
          "relative px-5 pb-5 sm:px-6 sm:pb-6",
          compactTop ? "pt-3.5 sm:pt-4" : "pt-5 sm:pt-6",
        )}
      >
        <h2
          id="consultation-sidebar-heading"
          className="font-heading text-[1.25rem] font-semibold leading-snug tracking-tight text-[#0A2540] sm:text-[1.35rem]"
        >
          Book Your Free Consultation
        </h2>
        <p
          className={cn(
            "text-[0.75rem] text-[#0A2540]/55",
            compactTop ? "mt-1" : "mt-2",
          )}
        >
          Typical reply within a few hours
        </p>

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

            <FloatingField
              label="Name"
              htmlFor="cw-sidebar-name"
              required
              error={errors.name?.message}
            >
              <input
                id="cw-sidebar-name"
                className={floatingFieldClassName}
                autoComplete="name"
                placeholder="Name"
                {...register("name")}
              />
            </FloatingField>

            <FloatingField
              label="Phone"
              htmlFor="cw-sidebar-phone"
              required
              error={errors.phone?.message}
            >
              <input
                id="cw-sidebar-phone"
                type="tel"
                inputMode="tel"
                className={floatingFieldClassName}
                autoComplete="tel"
                placeholder="Phone"
                {...register("phone")}
              />
            </FloatingField>

            <FloatingField
              label="Email"
              htmlFor="cw-sidebar-email"
              error={errors.email?.message}
            >
              <input
                id="cw-sidebar-email"
                type="email"
                className={floatingFieldClassName}
                autoComplete="email"
                placeholder="Email"
                {...register("email")}
              />
            </FloatingField>

            <Field label="Message" htmlFor="cw-sidebar-message">
              <textarea
                id="cw-sidebar-message"
                rows={3}
                className={cn(fieldClassName, "mt-1.5")}
                placeholder="Tell us briefly what you need"
                {...register("message")}
              />
            </Field>

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

            <div className="flex items-center justify-center gap-3 border-t border-[#0A2540]/10 pt-4">
              <a
                href={phoneHref}
                aria-label="Call clinic"
                className="inline-flex size-10 items-center justify-center rounded-full border border-[#0A2540]/15 bg-white/80 text-[#0A2540] no-underline transition hover:border-[#0A2540]/30 hover:bg-white"
              >
                <Phone className="size-4" aria-hidden />
              </a>
              <a
                href={waHref}
                aria-label="WhatsApp"
                className="inline-flex size-10 items-center justify-center rounded-full border border-emerald-600/20 bg-emerald-50/80 text-emerald-700 no-underline transition hover:border-emerald-600/40 hover:bg-emerald-100"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>

            <p className="text-center text-[0.625rem] leading-snug text-[#0A2540]/55">
              By filling this form you consent to care well medical centre to
              contact using this information
            </p>
          </form>
        )}
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

function FloatingField({
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
      <div className="relative">
        {children}
        <label
          htmlFor={htmlFor}
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 origin-left -translate-y-1/2",
            "text-small text-[#0A2540]/55 transition-all duration-200",
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[0.6875rem] peer-focus:text-[#0A2540]/70",
            "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0",
            "peer-[:not(:placeholder-shown)]:text-[0.6875rem] peer-[:not(:placeholder-shown)]:text-[#0A2540]/70",
          )}
        >
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </label>
      </div>
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

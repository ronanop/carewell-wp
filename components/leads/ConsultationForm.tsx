"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { submitConsultationLeadAction } from "@/lib/leads/actions/leadActions";
import {
  collectLeadAttribution,
  type PageAttributionInput,
} from "@/lib/leads/client/attribution";
import { cn } from "@/lib/utils";

const TREATMENTS = [
  "Hair Transplant",
  "Laser Hair Reduction",
  "Acne / Skin Treatment",
  "Anti-Ageing / Botox",
  "Dental Consultation",
  "General Enquiry",
] as const;

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
  treatment: z.string().optional(),
  preferredContactMethod: z.enum(["PHONE", "WHATSAPP", "EMAIL"]),
  preferredTime: z
    .union([
      z.enum(["MORNING", "AFTERNOON", "EVENING"]),
      z.literal(""),
    ])
    .optional(),
  message: z.string().max(2000).optional(),
  consent: z.boolean().refine((v) => v, "Consent is required"),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClassName = cn(
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5",
  "text-body text-foreground placeholder:text-muted-foreground",
  "transition-colors focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
);

export type ConsultationFormProps = {
  page?: PageAttributionInput;
  defaultTreatment?: string;
  className?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function ConsultationForm({
  page,
  defaultTreatment,
  className,
  compact = false,
  onSuccess,
}: ConsultationFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: "",
      phone: "",
      email: "",
      treatment: defaultTreatment ?? page?.treatment ?? "",
      preferredContactMethod: "PHONE",
      preferredTime: undefined,
      message: "",
      consent: false,
      website: "",
    }),
    [defaultTreatment, page?.treatment],
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
        ...page,
        treatment: values.treatment || page?.treatment,
        pageTitle:
          page?.pageTitle ??
          (typeof document !== "undefined" ? document.title : undefined),
        pageSlug:
          page?.pageSlug ??
          (typeof window !== "undefined"
            ? window.location.pathname.replace(/^\//, "") || "home"
            : undefined),
        pageUri:
          page?.pageUri ??
          (typeof window !== "undefined" ? window.location.pathname : undefined),
      });

      const result = await submitConsultationLeadAction({
        ...values,
        email: values.email || undefined,
        message: values.message || undefined,
        treatment: values.treatment || undefined,
        preferredTime: values.preferredTime || undefined,
        website: values.website ?? "",
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

  if (success) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border/60 bg-white p-6 text-center sm:p-8",
          className,
        )}
        role="status"
      >
        <CheckCircle2
          className="mx-auto size-12 text-primary"
          aria-hidden
        />
        <h3 className="mt-4 font-heading text-h3 font-semibold text-[#0A2540]">
          Request received
        </h3>
        <p className="mt-2 text-body text-muted-foreground">
          Our care team will contact you shortly on your preferred channel.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-white p-6",
        "shadow-[0_8px_30px_rgb(10_37_64/0.08)] sm:p-8",
        className,
      )}
    >
      <h2
        id="consultation-form-heading"
        className="font-heading text-h3 font-semibold text-[#0A2540]"
      >
        Book Your Consultation
      </h2>
      <p className="mt-2 text-body text-muted-foreground">
        Share a few details and we will help you take the next step.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={cn("mt-6 space-y-4", compact && "space-y-3")}
        aria-labelledby="consultation-form-heading"
      >
        {/* Honeypot */}
        <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div>
          <label htmlFor="lead-name" className="text-small font-medium text-foreground">
            Full name <span className="text-destructive">*</span>
          </label>
          <input
            id="lead-name"
            className={fieldClassName}
            autoComplete="name"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-small text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-phone" className="text-small font-medium text-foreground">
            Phone <span className="text-destructive">*</span>
          </label>
          <input
            id="lead-phone"
            type="tel"
            inputMode="tel"
            className={fieldClassName}
            autoComplete="tel"
            placeholder="10-digit mobile number"
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="mt-1 text-small text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-email" className="text-small font-medium text-foreground">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            className={fieldClassName}
            autoComplete="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-small text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-treatment" className="text-small font-medium text-foreground">
            Treatment interest
          </label>
          <select id="lead-treatment" className={fieldClassName} {...register("treatment")}>
            <option value="">Select a treatment</option>
            {TREATMENTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="lead-contact-method"
              className="text-small font-medium text-foreground"
            >
              Preferred contact
            </label>
            <select
              id="lead-contact-method"
              className={fieldClassName}
              {...register("preferredContactMethod")}
            >
              <option value="PHONE">Phone</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">Email</option>
            </select>
          </div>
          <div>
            <label htmlFor="lead-time" className="text-small font-medium text-foreground">
              Preferred time
            </label>
            <select id="lead-time" className={fieldClassName} {...register("preferredTime")}>
              <option value="">Anytime</option>
              <option value="MORNING">Morning</option>
              <option value="AFTERNOON">Afternoon</option>
              <option value="EVENING">Evening</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="lead-message" className="text-small font-medium text-foreground">
            Message
          </label>
          <textarea
            id="lead-message"
            rows={compact ? 3 : 4}
            className={fieldClassName}
            placeholder="Tell us briefly what you need help with"
            {...register("message")}
          />
        </div>

        <label className="flex items-start gap-2.5 text-small text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-border"
            {...register("consent")}
          />
          <span>
            I consent to Care Well Medical Centre contacting me about this
            enquiry. <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.consent ? (
          <p className="text-small text-destructive">{errors.consent.message}</p>
        ) : null}

        {serverError ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-small text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : (
            "Request consultation"
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-[0.75rem] text-muted-foreground">
          <Lock className="size-3.5" aria-hidden />
          Your details are used only to respond to this enquiry.
        </p>
      </form>
    </div>
  );
}

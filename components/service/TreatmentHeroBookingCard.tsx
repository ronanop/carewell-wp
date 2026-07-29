"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
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
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClassName = cn(
  "w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5",
  "text-[0.9375rem] text-[#101828] placeholder:text-[#98A2B3]",
  "transition-[border-color,box-shadow] duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
  "focus-visible:border-primary/40",
);

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
        name: values.name,
        phone: values.phone,
        preferredContactMethod: "PHONE",
        consent: true,
        website: values.website ?? "",
        treatment: chrome.treatment,
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

  return (
    <div
      id="treatment-hero-booking"
      className={cn(
        "rounded-xl bg-white p-5 shadow-[0_12px_40px_-12px_rgba(10,37,64,0.35)] sm:p-5",
        className,
      )}
    >
      <h2 className="text-center font-heading text-[1.0625rem] font-semibold leading-snug tracking-tight text-[#101828] sm:text-[1.125rem]">
        Book{" "}
        <span className="text-primary">FREE</span> Doctor Appointment
      </h2>

      {success ? (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/90 p-4 text-center" role="status">
          <CheckCircle2 className="mx-auto size-9 text-emerald-600" aria-hidden />
          <p className="mt-2 text-sm font-medium text-[#101828]">
            {chrome.successMessage}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setSuccess(false)}
          >
            Submit another request
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 space-y-3"
          aria-label="Book free doctor appointment"
        >
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
            <label htmlFor="cw-hero-website">Website</label>
            <input
              id="cw-hero-website"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          <div>
            <label htmlFor="cw-hero-name" className="sr-only">
              Patient Name
            </label>
            <input
              id="cw-hero-name"
              className={fieldClassName}
              autoComplete="name"
              placeholder="Patient Name"
              {...register("name")}
            />
            {errors.name?.message ? (
              <p className="mt-1 text-[0.75rem] text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="cw-hero-phone" className="sr-only">
              Mobile Number
            </label>
            <input
              id="cw-hero-phone"
              type="tel"
              inputMode="tel"
              className={fieldClassName}
              autoComplete="tel"
              placeholder="Mobile Number"
              {...register("phone")}
            />
            {errors.phone?.message ? (
              <p className="mt-1 text-[0.75rem] text-destructive">{errors.phone.message}</p>
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
            className="mt-1 w-full rounded-md bg-primary text-primary-foreground shadow-none hover:bg-primary/90"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Booking…
              </>
            ) : (
              "Book Free Appointment"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

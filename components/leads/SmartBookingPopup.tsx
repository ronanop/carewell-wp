"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Headphones,
  Loader2,
  Phone,
  Stethoscope,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { trackGaLeadSubmit } from "@/lib/analytics/ga";
import { submitConsultationLeadAction } from "@/lib/leads/actions/leadActions";
import { collectLeadAttribution } from "@/lib/leads/client/attribution";
import { cn } from "@/lib/utils";

/** ~3–4 lines of reading scroll on typical viewports */
const SCROLL_TRIGGER_PX = 160;
const SUCCESS_MESSAGE = "Thank you — we will contact you shortly.";

const TREATMENT_OPTIONS = [
  "Hair Transplant",
  "Laser Hair Reduction",
  "Acne / Skin Treatment",
  "Anti-Ageing / Botox",
  "Cosmetic Surgery",
  "Body Contouring",
  "General Enquiry",
] as const;

const NEXT_STEPS = [
  {
    icon: Phone,
    text: "Once you share your details, our care coordinator will get in touch with you.",
  },
  {
    icon: Headphones,
    text: "The coordinator will understand your symptoms and health condition in detail.",
  },
  {
    icon: Stethoscope,
    text: "Your consultation will be scheduled at the earliest.",
  },
] as const;

const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "10k+", label: "Procedures" },
  { value: "4.3★", label: "Patient Rating" },
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
  treatment: z
    .string()
    .trim()
    .min(2, "Please select a treatment")
    .max(200),
  consent: z.boolean().refine((v) => v, "Consent is required"),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClassName = cn(
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2 sm:py-2.5",
  "text-[0.875rem] text-[#101828] placeholder:text-[#98A2B3] sm:text-[0.9375rem]",
  "transition-[border-color,box-shadow] duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
  "focus-visible:border-primary/40",
);

const selectClassName = cn(fieldClassName, "appearance-none pr-10");

function heroBookingInView(): boolean {
  const el = document.getElementById("treatment-hero-booking");
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  return rect.bottom > 80 && rect.top < vh - 40;
}

/**
 * Site-wide lead popup — opens after a short scroll on public pages.
 * Dismissible for the current view only; every full reload can show it again.
 */
export function SmartBookingPopup() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  /** In-memory only — reload / new visit can show the popup again */
  const [dismissedThisView, setDismissedThisView] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const skipRoute =
    !pathname ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api");

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: "",
      phone: "",
      treatment: "",
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
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const dismiss = useCallback(() => {
    setDismissedThisView(true);
    setOpen(false);
  }, []);

  // Defer listeners so LCP stays clear (same idea as FloatingWhatsApp).
  useEffect(() => {
    if (skipRoute) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const arm = () => {
      if (!cancelled) setArmed(true);
    };

    const isNarrow =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    const idleTimeout = isNarrow ? 3500 : 2200;
    const fallbackMs = isNarrow ? 2800 : 1600;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(arm, { timeout: idleTimeout });
    } else {
      timeoutId = setTimeout(arm, fallbackMs);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [skipRoute, pathname]);

  // Scroll trigger — every full page load can show again (no sessionStorage)
  useEffect(() => {
    if (!armed || skipRoute || open || dismissedThisView) return;

    const tryOpen = () => {
      if (dismissedThisView) return;
      if (window.scrollY < SCROLL_TRIGGER_PX) return;
      // Don't stack on top of the in-hero booking card while it's visible.
      if (heroBookingInView()) return;
      setOpen(true);
    };

    tryOpen();
    window.addEventListener("scroll", tryOpen, { passive: true });
    return () => window.removeEventListener("scroll", tryOpen);
  }, [armed, skipRoute, open, dismissedThisView, pathname]);

  // Escape + body scroll lock
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dismiss]);

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const pageTitle =
        typeof document !== "undefined" ? document.title : "Care Well";
      const pageUri = pathname || "/";
      const pageSlug = pageUri.replace(/^\/+|\/+$/g, "") || "home";

      const attribution = collectLeadAttribution({
        pageTitle,
        pageSlug,
        pageUri,
        treatment: values.treatment,
      });

      const result = await submitConsultationLeadAction({
        name: values.name,
        phone: values.phone,
        treatment: values.treatment,
        preferredContactMethod: "PHONE",
        consent: values.consent,
        website: values.website ?? "",
        message: "Submitted via smart booking popup",
        ...attribution,
      });

      if (!result.ok) {
        setServerError(result.message);
        return;
      }

      trackGaLeadSubmit({
        form: "smart_booking_popup",
        treatment: values.treatment,
      });
      setSuccess(true);
      reset(defaultValues);
      setDismissedThisView(true);
      window.setTimeout(() => setOpen(false), 2200);
    });
  }

  if (skipRoute || !armed) return null;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close booking form"
            className="fixed inset-0 z-modal bg-[#0A2540]/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={dismiss}
          />
          <div className="pointer-events-none fixed inset-0 z-modal flex items-center justify-center p-3 sm:p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={cn(
                "pointer-events-auto relative flex w-full max-w-[22.5rem] flex-col overflow-hidden md:max-w-[52rem]",
                "max-h-[min(100dvh-1.5rem,40rem)] rounded-xl",
                "bg-white shadow-[0_20px_50px_-12px_rgba(10,37,64,0.45)]",
              )}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24, scale: 0.97 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 16, scale: 0.98 }
              }
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : { type: "spring", damping: 26, stiffness: 320 }
              }
            >
              {/* Header */}
              <div className="relative shrink-0 bg-primary px-10 py-2.5 text-center sm:py-4">
                <h2
                  id={titleId}
                  className="font-heading text-[0.875rem] font-semibold leading-snug tracking-tight text-white sm:text-[1.125rem]"
                >
                  Avail{" "}
                  <span className="text-accent-gold-300">FREE</span> Doctor
                  Consultation
                </h2>
                <button
                  type="button"
                  onClick={dismiss}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:right-3"
                  aria-label="Close"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              {success ? (
                <div
                  className="m-4 rounded-lg border border-emerald-200 bg-emerald-50/90 p-5 text-center sm:m-8 sm:p-6"
                  role="status"
                >
                  <CheckCircle2
                    className="mx-auto size-10 text-emerald-600"
                    aria-hidden
                  />
                  <p className="mt-3 text-sm font-medium text-[#101828] sm:text-base">
                    {SUCCESS_MESSAGE}
                  </p>
                </div>
              ) : (
                <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-2">
                  {/* Left — desktop only */}
                  <div className="hidden flex-col border-r border-dashed border-[#D0D5DD] md:flex md:overflow-y-auto">
                    <div className="flex flex-1 flex-col px-6 py-6">
                      <h3 className="font-heading text-[1.25rem] font-bold leading-snug tracking-tight text-[#101828]">
                        Simplifying Your Care Experience
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#667085]">
                        Consult with our expert surgeon for cosmetic, hair &amp;
                        skin treatments
                      </p>

                      <p className="mt-6 text-[0.8125rem] font-semibold text-[#101828]">
                        Next Steps
                      </p>
                      <ol className="relative mt-3 space-y-4">
                        <span
                          className="absolute left-[0.6875rem] top-2 bottom-2 w-px border-l border-dashed border-[#98A2B3]/80"
                          aria-hidden
                        />
                        {NEXT_STEPS.map((step, index) => {
                          const Icon = step.icon;
                          return (
                            <li
                              key={index}
                              className="relative flex gap-3 pl-0"
                            >
                              <span className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                                <Icon
                                  className="size-4"
                                  strokeWidth={1.75}
                                  aria-hidden
                                />
                              </span>
                              <p className="pt-0.5 text-[0.8125rem] leading-snug text-[#475467]">
                                {step.text}
                              </p>
                            </li>
                          );
                        })}
                      </ol>
                    </div>

                    <div className="mt-auto grid grid-cols-3 gap-2 bg-primary-50 px-6 py-4">
                      {STATS.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className="font-heading text-lg font-bold text-primary">
                            {stat.value}
                          </p>
                          <p className="mt-0.5 text-[0.6875rem] leading-tight text-[#475467]">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — form (+ compact stats on mobile) */}
                  <div className="flex min-h-0 flex-col overflow-hidden">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      className="flex flex-1 flex-col gap-2.5 px-4 py-3.5 sm:gap-3.5 sm:px-6 sm:py-6"
                      aria-label="Book free doctor consultation"
                    >
                      <div
                        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                        aria-hidden
                      >
                        <label htmlFor="cw-smart-website">Website</label>
                        <input
                          id="cw-smart-website"
                          tabIndex={-1}
                          autoComplete="off"
                          {...register("website")}
                        />
                      </div>

                      <div>
                        <label htmlFor="cw-smart-name" className="sr-only">
                          Patient Name
                        </label>
                        <input
                          id="cw-smart-name"
                          className={fieldClassName}
                          autoComplete="name"
                          placeholder="Patient Name"
                          {...register("name")}
                        />
                        {errors.name?.message ? (
                          <p className="mt-1 text-[0.75rem] text-destructive">
                            {errors.name.message}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label htmlFor="cw-smart-phone" className="sr-only">
                          Mobile Number
                        </label>
                        <input
                          id="cw-smart-phone"
                          type="tel"
                          inputMode="tel"
                          className={fieldClassName}
                          autoComplete="tel"
                          placeholder="Enter 10 Digit mobile number"
                          {...register("phone")}
                        />
                        {errors.phone?.message ? (
                          <p className="mt-1 text-[0.75rem] text-destructive">
                            {errors.phone.message}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          htmlFor="cw-smart-treatment"
                          className="mb-1 block text-[0.6875rem] font-medium text-primary sm:mb-1.5"
                        >
                          Select Treatment
                        </label>
                        <div className="relative">
                          <select
                            id="cw-smart-treatment"
                            className={cn(
                              selectClassName,
                              !watch("treatment") && "text-[#98A2B3]",
                            )}
                            {...register("treatment")}
                          >
                            <option value="">Select Treatment</option>
                            {TREATMENT_OPTIONS.map((treatment) => (
                              <option key={treatment} value={treatment}>
                                {treatment}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-accent-gold-500"
                            aria-hidden
                          />
                        </div>
                        {errors.treatment?.message ? (
                          <p className="mt-1 text-[0.75rem] text-destructive">
                            {errors.treatment.message}
                          </p>
                        ) : null}
                      </div>

                      <label className="flex cursor-pointer items-start gap-2 text-[0.625rem] leading-snug text-[#667085] sm:gap-2.5 sm:text-[0.6875rem]">
                        <input
                          type="checkbox"
                          className="mt-0.5 size-3.5 shrink-0 rounded border-[#D0D5DD]"
                          {...register("consent")}
                        />
                        <span>
                          I consent to Care Well Medical Centre contacting me
                          about this request.
                        </span>
                      </label>
                      {errors.consent?.message ? (
                        <p
                          className="text-[0.75rem] text-destructive"
                          role="alert"
                        >
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

                      <div className="pt-0.5 sm:mt-auto sm:pt-1">
                        <Button
                          type="submit"
                          disabled={pending}
                          className="h-10 w-full rounded-lg bg-primary text-[0.875rem] font-semibold text-primary-foreground shadow-none hover:bg-primary/90 sm:h-11 sm:py-3 sm:text-[0.9375rem]"
                        >
                          {pending ? (
                            <>
                              <Loader2
                                className="size-4 animate-spin"
                                aria-hidden
                              />
                              Booking…
                            </>
                          ) : (
                            "Book Free Appointment"
                          )}
                        </Button>
                      </div>
                    </form>

                    {/* Compact trust strip — mobile only */}
                    <div className="grid shrink-0 grid-cols-3 gap-1 border-t border-primary-100 bg-primary-50 px-3 py-2.5 md:hidden">
                      {STATS.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className="font-heading text-sm font-bold text-primary">
                            {stat.value}
                          </p>
                          <p className="text-[0.5625rem] leading-tight text-[#475467]">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

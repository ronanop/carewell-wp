"use client";

import { Check, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

import { HOME_GOOGLE_REVIEWS_DEFAULTS } from "@/components/home/homeReviews.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { resolveRepeaterItems } from "@/lib/experience/static-pages/repeaterOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "Consulting";
const DEFAULT_HEADING = "What Our Patients Say";
const DEFAULT_DESCRIPTION =
  "Verified patient feedback from Google—focused on care quality, clear communication, and natural results at our South Delhi clinic.";
const DEFAULT_RATING = "4.3";
const DEFAULT_RATING_LABEL = "VERY GOOD";
const DEFAULT_COUNT = "Based on 605+ verified Google reviews";
const DEFAULT_BADGE = "Care Well Medical Centre, Delhi";
const DEFAULT_CTA_LABEL = "See all reviews on Google";
const DEFAULT_CTA_HREF =
  "https://www.google.com/maps/search/?api=1&query=Care+Well+Medical+Centre+Chittaranjan+Park+New+Delhi";
const DEFAULT_DISCLAIMER =
  "Reviews shown as posted on Google • Updated periodically";

const NAVY = "text-[#0A2540]";
const PANEL_SHADOW = "shadow-[0_18px_50px_-28px_rgb(10_37_64/0.28)]";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function StarRow({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const starClass = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(rating);
        return (
          <Star
            key={index}
            className={cn(
              starClass,
              filled
                ? "fill-[#FABB05] text-[#FABB05]"
                : "fill-transparent text-slate-300",
            )}
            strokeWidth={filled ? 0 : 1.5}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function ReviewCard({
  name,
  initial,
  rating,
  text,
}: {
  name: string;
  initial: string;
  rating: number;
  text: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5",
        "shadow-[0_4px_18px_-10px_rgb(10_37_64/0.12)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.8125rem] font-semibold text-white"
            aria-hidden
          >
            {(initial || name).charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className={cn("truncate text-small font-semibold", NAVY)}>
              {name}
            </p>
            <p className="text-[0.75rem] text-slate-500">Google review</p>
          </div>
        </div>
        <GoogleMark className="size-4 shrink-0" />
      </div>

      <div className="mt-3">
        <StarRow rating={rating} size="sm" />
      </div>

      <div className="relative mt-3 flex-1">
        <span
          className="pointer-events-none absolute -left-0.5 -top-1 font-heading text-3xl leading-none text-slate-200"
          aria-hidden
        >
          “
        </span>
        <p className="pl-4 text-[0.875rem] leading-relaxed text-slate-600 sm:text-[0.9375rem]">
          {text}
        </p>
      </div>

      <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-emerald-700 ring-1 ring-emerald-100">
        <Check className="size-3" strokeWidth={2.5} aria-hidden />
        Verified review
      </span>
    </article>
  );
}

/**
 * Google Business Profile reviews highlights — social-proof panel
 * (aggregate score + carousel), placed before the location lead form.
 */
export function GoogleReviewsSection() {
  const { config } = useStaticEditContext();
  const headingId = useId();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(2);

  const label = resolveElementText(config, "home.reviews.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "home.reviews.heading",
    DEFAULT_HEADING,
  );
  const description = resolveElementText(
    config,
    "home.reviews.description",
    DEFAULT_DESCRIPTION,
  );
  const ratingValue = resolveElementField(
    config,
    "home.reviews.rating",
    "value",
    DEFAULT_RATING,
  );
  const ratingLabel = resolveElementText(
    config,
    "home.reviews.ratingLabel",
    DEFAULT_RATING_LABEL,
  );
  const countLine = resolveElementText(
    config,
    "home.reviews.count",
    DEFAULT_COUNT,
  );
  const clinicBadge = resolveElementText(
    config,
    "home.reviews.clinicBadge",
    DEFAULT_BADGE,
  );
  const ctaLabel = resolveElementField(
    config,
    "home.reviews.cta",
    "label",
    DEFAULT_CTA_LABEL,
  );
  const ctaHref = resolveElementField(
    config,
    "home.reviews.cta",
    "href",
    DEFAULT_CTA_HREF,
  );
  const disclaimer = resolveElementText(
    config,
    "home.reviews.disclaimer",
    DEFAULT_DISCLAIMER,
  );

  const reviews = resolveRepeaterItems(
    config,
    "home.reviews",
    HOME_GOOGLE_REVIEWS_DEFAULTS.map((item) => ({ ...item })),
    ["name", "initial", "rating", "text"],
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setPerPage(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pageCount = Math.max(1, Math.ceil(reviews.length / perPage));

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const goPrev = useCallback(() => {
    setPage((current) => (current - 1 + pageCount) % pageCount);
  }, [pageCount]);

  const goNext = useCallback(() => {
    setPage((current) => (current + 1) % pageCount);
  }, [pageCount]);

  const visible = reviews.slice(page * perPage, page * perPage + perPage);
  const ratingNumber = Number.parseFloat(String(ratingValue)) || 4.3;

  return (
    <section
      className="overflow-x-hidden bg-[#F5F6F8]"
      aria-labelledby={headingId}
    >
      <div className="container-content section-padding">
        <StaggerReveal className="mx-auto max-w-3xl text-center" stepMs={70}>
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden
              className="hidden h-px w-10 bg-slate-300 sm:block"
            />
            <span aria-hidden className="size-1.5 rotate-45 bg-slate-300" />
            <EditableElement
              id="home.reviews.label"
              kind="label"
              defaultValue={DEFAULT_LABEL}
              as="p"
              className="text-label uppercase tracking-[0.18em] text-slate-500"
            >
              {({ value }) => value || label}
            </EditableElement>
            <span aria-hidden className="size-1.5 rotate-45 bg-slate-300" />
            <span
              aria-hidden
              className="hidden h-px w-10 bg-slate-300 sm:block"
            />
          </div>

          <EditableElement
            id="home.reviews.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className={cn(
              "mt-3 font-heading text-[1.5rem] font-bold leading-tight tracking-tight sm:text-h2",
              NAVY,
            )}
          >
            {({ value }) => (
              <span id={headingId}>{value || heading}</span>
            )}
          </EditableElement>

          <EditableElement
            id="home.reviews.description"
            kind="paragraph"
            defaultValue={DEFAULT_DESCRIPTION}
            as="p"
            className="mx-auto mt-3 max-w-2xl text-body leading-relaxed text-slate-500 sm:mt-4"
          >
            {({ value }) => value || description}
          </EditableElement>
        </StaggerReveal>

        <StaggerReveal
          stepMs={90}
          className={cn(
            "relative mx-auto mt-10 overflow-hidden rounded-[1.5rem] border border-white bg-white sm:mt-12",
            PANEL_SHADOW,
          )}
        >
          {/* Soft geometric texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 20%, rgb(226 232 240 / 0.9) 0.8px, transparent 1px), radial-gradient(circle at 88% 70%, rgb(226 232 240 / 0.8) 0.8px, transparent 1px)",
              backgroundSize: "22px 22px, 28px 28px",
            }}
          />

          <div className="relative grid lg:grid-cols-[minmax(14rem,0.34fr)_minmax(0,0.66fr)]">
            {/* Aggregate score */}
            <div className="flex flex-col items-center border-b border-slate-100 px-6 py-8 text-center sm:px-8 sm:py-10 lg:items-start lg:border-b-0 lg:border-r lg:text-left">
              <GoogleMark className="size-8" />
              <EditableElement
                id="home.reviews.rating"
                kind="statistic"
                field="value"
                defaultValue={DEFAULT_RATING}
                as="p"
                className={cn(
                  "mt-4 font-heading text-[2.5rem] font-bold leading-none tracking-tight sm:text-[2.75rem]",
                  NAVY,
                )}
              >
                {({ value }) => (
                  <>
                    {value || ratingValue}
                    <span className="text-[1.25rem] font-semibold text-slate-400">
                      {" "}
                      / 5
                    </span>
                  </>
                )}
              </EditableElement>
              <EditableElement
                id="home.reviews.ratingLabel"
                kind="label"
                defaultValue={DEFAULT_RATING_LABEL}
                as="p"
                className={cn(
                  "mt-2 text-[0.75rem] font-bold uppercase tracking-[0.14em]",
                  NAVY,
                )}
              >
                {({ value }) => value || ratingLabel}
              </EditableElement>
              <div className="mt-3">
                <StarRow rating={ratingNumber} />
              </div>
              <EditableElement
                id="home.reviews.count"
                kind="paragraph"
                defaultValue={DEFAULT_COUNT}
                as="p"
                className="mt-4 max-w-[14rem] text-[0.8125rem] leading-snug text-slate-500"
              >
                {({ value }) => {
                  const line = String(value || countLine);
                  const match = line.match(
                    /^(Based on\s+)(.+?)(\s+verified Google reviews)$/i,
                  );
                  if (!match) return line;
                  return (
                    <>
                      {match[1]}
                      <span className="font-semibold text-[#0A2540]">
                        {match[2]}
                      </span>
                      {match[3]}
                    </>
                  );
                }}
              </EditableElement>
              <EditableElement
                id="home.reviews.clinicBadge"
                kind="badge"
                defaultValue={DEFAULT_BADGE}
                as="p"
                className="mt-6 inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[0.75rem] font-medium text-slate-600"
              >
                {({ value }) => (
                  <>
                    <MapPin
                      className="size-3.5 shrink-0 text-primary"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="truncate">{value || clinicBadge}</span>
                  </>
                )}
              </EditableElement>
            </div>

            {/* Review carousel */}
            <div className="relative flex min-w-0 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <div className="grid min-h-[14rem] flex-1 gap-3 sm:gap-4 md:grid-cols-2">
                {visible.map((item) => {
                  const name = String(item.name ?? "Patient");
                  const initial = String(item.initial ?? name.charAt(0));
                  const rating = Number.parseFloat(String(item.rating ?? "5")) || 5;
                  const text = String(item.text ?? "");
                  return (
                    <ReviewCard
                      key={item.__index}
                      name={name}
                      initial={initial}
                      rating={rating}
                      text={text}
                    />
                  );
                })}
              </div>

              {pageCount > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous reviews"
                    className={cn(
                      "absolute left-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full",
                      "border border-slate-200/80 bg-white/95 text-[#0A2540] shadow-sm",
                      "transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-2 sm:size-10",
                    )}
                  >
                    <ChevronLeft className="size-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next reviews"
                    className={cn(
                      "absolute right-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full",
                      "border border-slate-200/80 bg-white/95 text-[#0A2540] shadow-sm",
                      "transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-2 sm:size-10",
                    )}
                  >
                    <ChevronRight className="size-5" aria-hidden />
                  </button>
                </>
              ) : null}

              {pageCount > 1 ? (
                <div
                  className="mt-5 flex items-center justify-center gap-1.5"
                  role="tablist"
                  aria-label="Review pages"
                >
                  {Array.from({ length: pageCount }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={index === page}
                      aria-label={`Show reviews page ${index + 1}`}
                      onClick={() => setPage(index)}
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        index === page ? "bg-[#0A2540]" : "bg-slate-300",
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </StaggerReveal>

        <StaggerReveal
          stepMs={80}
          className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-5"
        >
          <EditableElement
            id="home.reviews.cta"
            kind="button"
            field="label"
            defaultValue={DEFAULT_CTA_LABEL}
            as="div"
          >
            {({ fields }) => (
              <a
                href={String(fields.href ?? ctaHref)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#0A2540] px-6 text-[0.9375rem] font-semibold text-white",
                  "no-underline shadow-[0_10px_28px_-12px_rgb(10_37_64/0.55)] transition-transform duration-200",
                  "hover:-translate-y-0.5 hover:bg-[#0A2540]/92 hover:no-underline",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                <GoogleMark className="size-4" />
                <span>{String(fields.label ?? ctaLabel)}</span>
                <span aria-hidden className="text-white/80">
                  ↗
                </span>
              </a>
            )}
          </EditableElement>

          <EditableElement
            id="home.reviews.disclaimer"
            kind="caption"
            defaultValue={DEFAULT_DISCLAIMER}
            as="p"
            className="max-w-xs text-center text-[0.75rem] leading-snug text-slate-500 sm:text-left"
          >
            {({ value }) => value || disclaimer}
          </EditableElement>
        </StaggerReveal>
      </div>
    </section>
  );
}

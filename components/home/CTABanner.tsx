"use client";

import {
  ArrowRight,
  Award,
  CalendarDays,
  Heart,
  Phone,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { HOME_CTA_VALUE_DEFAULTS } from "@/components/home/homeCta.elements";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HEADING = "Ready to Begin Your Transformation?";
const DEFAULT_SUBTITLE =
  "Book a free consultation with Dr. Bhasin. No obligations.";
const DEFAULT_BOOK_LABEL = "Book Free Consultation";
const DEFAULT_BOOK_HREF = "/contact";
const DEFAULT_CALL_LABEL = "Call Now";
const DEFAULT_CALL_HREF = "tel:+919667977499";
const DEFAULT_WHATSAPP_LABEL = "WhatsApp";
const DEFAULT_WHATSAPP_HREF = "https://wa.me/919667977499";

const VALUE_ICONS: LucideIcon[] = [Shield, User, Award, Heart];

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

function CornerDots({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute grid grid-cols-6 gap-2", className)}
      aria-hidden
    >
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="size-[3px] rounded-full bg-sky-200/25"
        />
      ))}
    </div>
  );
}

function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Central soft glow */}
      <div
        className="absolute left-1/2 top-[42%] h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(96,165,250,0.28) 0%, rgba(56,189,248,0.10) 35%, transparent 70%)",
        }}
      />

      {/* Concentric ellipses */}
      <svg
        className="absolute left-1/2 top-[38%] h-[140%] w-[160%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[180, 260, 340, 420, 500].map((ry, i) => (
          <ellipse
            key={ry}
            cx="600"
            cy="400"
            rx={ry * 1.55}
            ry={ry}
            stroke={`rgba(147,197,253,${0.22 - i * 0.03})`}
            strokeWidth="1.25"
          />
        ))}
        {/* Wispy light streaks */}
        <path
          d="M80 360C220 300 380 420 560 340C740 260 900 380 1120 300"
          stroke="url(#home-cta-streak)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M60 440C240 380 400 500 620 410C840 320 980 460 1140 390"
          stroke="url(#home-cta-streak)"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M140 280C300 220 460 310 680 250C860 200 980 280 1100 230"
          stroke="url(#home-cta-streak)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.28"
        />
        <defs>
          <linearGradient id="home-cta-streak" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(186,230,253,0)" />
            <stop offset="40%" stopColor="rgba(186,230,253,0.9)" />
            <stop offset="70%" stopColor="rgba(125,211,252,0.7)" />
            <stop offset="100%" stopColor="rgba(186,230,253,0)" />
          </linearGradient>
        </defs>
      </svg>

      <CornerDots className="left-6 top-6 sm:left-10 sm:top-8" />
      <CornerDots className="right-6 top-6 sm:right-10 sm:top-8" />
    </div>
  );
}

export function CTABanner() {
  const { config } = useStaticEditContext();
  const heading = resolveElementText(
    config,
    "home.cta.heading",
    DEFAULT_HEADING,
  );
  const subtitle = resolveElementText(
    config,
    "home.cta.subtitle",
    DEFAULT_SUBTITLE,
  );
  const bookLabel = resolveElementField(
    config,
    "home.cta.button",
    "label",
    DEFAULT_BOOK_LABEL,
  );
  const bookHref = resolveElementField(
    config,
    "home.cta.button",
    "href",
    DEFAULT_BOOK_HREF,
  );
  const callLabel = resolveElementField(
    config,
    "home.cta.callButton",
    "label",
    DEFAULT_CALL_LABEL,
  );
  const callHref = resolveElementField(
    config,
    "home.cta.callButton",
    "href",
    DEFAULT_CALL_HREF,
  );
  const whatsappLabel = resolveElementField(
    config,
    "home.cta.whatsapp",
    "label",
    DEFAULT_WHATSAPP_LABEL,
  );
  const whatsappHref = resolveElementField(
    config,
    "home.cta.whatsapp",
    "href",
    DEFAULT_WHATSAPP_HREF,
  );

  return (
    <section
      className="relative overflow-hidden bg-[#0A2540]"
      aria-labelledby="home-cta-heading"
    >
      <Atmosphere />

      <div className="container-content relative section-padding">
        <StaggerReveal
          stepMs={80}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <EditableElement
            id="home.cta.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="font-heading text-[1.5rem] font-bold leading-tight tracking-tight text-white sm:text-[2.125rem] lg:text-[2.5rem]"
          >
            {({ value }) => (
              <span id="home-cta-heading">{value || heading}</span>
            )}
          </EditableElement>

          <EditableElement
            id="home.cta.subtitle"
            kind="paragraph"
            defaultValue={DEFAULT_SUBTITLE}
            as="p"
            className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-sky-100/70 sm:mt-4 sm:text-base"
          >
            {({ value }) => value || subtitle}
          </EditableElement>

          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5">
            <EditableElement
              id="home.cta.button"
              kind="button"
              field="label"
              defaultValue={DEFAULT_BOOK_LABEL}
              defaults={{ label: DEFAULT_BOOK_LABEL, href: DEFAULT_BOOK_HREF }}
              as="div"
              className="w-full sm:w-auto"
            >
              {({ fields }) => (
                <Link
                  href={String(fields.href ?? bookHref)}
                  className={cn(
                    "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-white px-6 text-[0.9375rem] font-semibold text-[#0A2540]",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_28px_-6px_rgba(125,211,252,0.55)]",
                    "no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/95 hover:no-underline sm:w-auto",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2540]",
                  )}
                >
                  <CalendarDays
                    className="size-4 shrink-0 text-sky-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>{String(fields.label ?? bookLabel)}</span>
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              )}
            </EditableElement>

            <EditableElement
              id="home.cta.callButton"
              kind="button"
              field="label"
              defaultValue={DEFAULT_CALL_LABEL}
              defaults={{ label: DEFAULT_CALL_LABEL, href: DEFAULT_CALL_HREF }}
              as="div"
              className="w-full sm:w-auto"
            >
              {({ fields }) => (
                <a
                  href={String(fields.href ?? callHref)}
                  className={cn(
                    "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-sky-200/35 bg-transparent px-6 text-[0.9375rem] font-semibold text-white",
                    "no-underline transition-colors duration-200 hover:bg-white/5 hover:no-underline sm:w-auto",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2540]",
                  )}
                >
                  <Phone
                    className="size-4 shrink-0 text-sky-200/90"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>{String(fields.label ?? callLabel)}</span>
                  <ArrowRight className="size-4 shrink-0 opacity-80" aria-hidden />
                </a>
              )}
            </EditableElement>
          </div>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.875rem] text-sky-100/65 sm:mt-7">
            <span>Or</span>
            <EditableElement
              id="home.cta.whatsapp"
              kind="link"
              field="label"
              defaultValue={DEFAULT_WHATSAPP_LABEL}
              defaults={{
                label: DEFAULT_WHATSAPP_LABEL,
                href: DEFAULT_WHATSAPP_HREF,
              }}
              as="span"
              className="inline"
            >
              {({ fields }) => (
                <a
                  href={String(fields.href ?? whatsappHref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-sky-100/80 underline decoration-sky-200/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white/70"
                >
                  <WhatsAppIcon className="size-4 shrink-0 text-[#25D366]" />
                  {String(fields.label ?? whatsappLabel)}
                </a>
              )}
            </EditableElement>
            <span>us for priority callback</span>
          </p>

          <ul
            className={cn(
              "mt-8 grid w-full max-w-3xl list-none grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-[#06182c]/55 backdrop-blur-[2px] sm:mt-12 sm:rounded-2xl",
              "sm:grid-cols-2 lg:grid-cols-4",
            )}
          >
            {HOME_CTA_VALUE_DEFAULTS.map((item, index) => {
              const Icon = VALUE_ICONS[index] ?? Shield;
              const titleId = `home.cta.value.${index}.title`;
              const subtitleId = `home.cta.value.${index}.subtitle`;
              const title = resolveElementText(config, titleId, item.title);
              const valueSubtitle = resolveElementText(
                config,
                subtitleId,
                item.subtitle,
              );

              return (
                <li
                  key={titleId}
                  className={cn(
                    "flex min-h-11 items-center gap-3 px-3.5 py-3.5 text-left sm:flex-col sm:items-center sm:gap-2.5 sm:px-3 sm:py-5 sm:text-center lg:px-4",
                    "border-white/10",
                    index > 0 && "border-t sm:border-t-0",
                    index % 2 === 1 && "sm:border-l",
                    index >= 2 && "sm:border-t lg:border-t-0",
                    index > 0 && "lg:border-l",
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-sky-200/20 bg-sky-400/10 text-sky-200">
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <EditableElement
                      id={titleId}
                      kind="label"
                      defaultValue={item.title}
                      as="p"
                      className="text-[0.875rem] font-semibold leading-snug text-white"
                    >
                      {({ value }) => value || title}
                    </EditableElement>
                    <EditableElement
                      id={subtitleId}
                      kind="caption"
                      defaultValue={item.subtitle}
                      as="p"
                      className="mt-0.5 text-[0.8125rem] leading-snug text-sky-100/55"
                    >
                      {({ value }) => value || valueSubtitle}
                    </EditableElement>
                  </div>
                </li>
              );
            })}
          </ul>
        </StaggerReveal>
      </div>
    </section>
  );
}

import { Clock, ExternalLink, MapPin, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionBaseProps } from "./types";

export type LocationSectionProps = SectionBaseProps & {
  /** CMS: location.eyebrow */
  eyebrow?: string;
  /** CMS: location.heading */
  heading?: string;
  /** @deprecated Prefer `heading` — kept for gallery / older call sites */
  title?: string;
  /** CMS: location.address */
  address?: string;
  /** CMS: location.hours */
  hours?: string;
  /** CMS: location.phone */
  phone?: string;
  /** CMS: location.mapHref — “Open in Maps” link when embed is absent */
  mapHref?: string;
  /** CMS: location.mapEmbedUrl — Google Maps iframe `src` (preferred) */
  mapEmbedUrl?: string;
};

/**
 * Clinic visit band — details + optional Google Map embed.
 * React owns layout; CMS owns copy and map URLs.
 * Empty when no address/hours/phone and no map → null.
 */
export function LocationSection({
  id = "location",
  eyebrow,
  heading,
  title,
  address,
  hours,
  phone,
  mapHref,
  mapEmbedUrl,
  className,
}: LocationSectionProps) {
  const resolvedEyebrow = eyebrow?.trim() || "";
  const resolvedHeading = (heading ?? title)?.trim() || "";
  const resolvedAddress = address?.trim() || "";
  const resolvedHours = hours?.trim() || "";
  const resolvedPhone = phone?.trim() || "";
  const embedSrc = mapEmbedUrl?.trim() || "";
  const mapsLink = mapHref?.trim() || "";

  const hasDetails = Boolean(
    resolvedAddress || resolvedHours || resolvedPhone,
  );
  const hasMap = Boolean(embedSrc || mapsLink);

  if (!hasDetails && !hasMap) return null;

  const telHref = resolvedPhone
    ? `tel:${resolvedPhone.replace(/[^\d+]/g, "")}`
    : undefined;

  return (
    <section
      id={id}
      aria-labelledby={resolvedHeading ? `${id}-heading` : undefined}
      className={cn(
        "relative border-y border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_200px_at_10%_0%,rgba(21,87,160,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(resolvedEyebrow || resolvedHeading) && (
          <header className="mb-8 max-w-2xl sm:mb-10">
            {resolvedEyebrow ? (
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                {resolvedEyebrow}
              </p>
            ) : null}
            {resolvedHeading ? (
              <h2
                id={`${id}-heading`}
                className={cn(
                  "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
                  resolvedEyebrow ? "mt-2" : undefined,
                )}
              >
                {resolvedHeading}
              </h2>
            ) : null}
          </header>
        )}

        <div
          className={cn(
            "grid overflow-hidden rounded-2xl border border-slate-200/90 bg-white",
            "shadow-[0_16px_40px_-28px_rgba(10,46,82,0.35)]",
            hasMap && "lg:grid-cols-2",
          )}
        >
          {/* Details — left on desktop, first on mobile */}
          {hasDetails ? (
            <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10">
              <ul className="m-0 flex list-none flex-col gap-5 p-0">
                {resolvedAddress ? (
                  <li className="flex gap-3.5">
                    <span
                      className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1557A0]/10 text-[#1557A0]"
                      aria-hidden
                    >
                      <MapPin className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                        Address
                      </p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#0A2E52]">
                        {resolvedAddress}
                      </p>
                    </div>
                  </li>
                ) : null}

                {resolvedHours ? (
                  <li className="flex gap-3.5">
                    <span
                      className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1557A0]/10 text-[#1557A0]"
                      aria-hidden
                    >
                      <Clock className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                        Hours
                      </p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-[#0A2E52]">
                        {resolvedHours}
                      </p>
                    </div>
                  </li>
                ) : null}

                {resolvedPhone ? (
                  <li className="flex gap-3.5">
                    <span
                      className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1557A0]/10 text-[#1557A0]"
                      aria-hidden
                    >
                      <Phone className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                        Phone
                      </p>
                      <a
                        href={telHref}
                        className={cn(
                          "mt-1 inline-block text-[0.9375rem] font-semibold text-[#1557A0]",
                          "transition-colors hover:text-[#0A2E52]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
                        )}
                      >
                        {resolvedPhone}
                      </a>
                    </div>
                  </li>
                ) : null}
              </ul>

              {mapsLink ? (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg",
                    "bg-[#1557A0] px-5 text-sm font-semibold text-white",
                    "shadow-[0_8px_20px_-12px_rgba(21,87,160,0.55)]",
                    "transition-[background-color,transform,box-shadow] duration-200",
                    "hover:bg-[#0A2E52] hover:shadow-[0_10px_24px_-12px_rgba(10,46,82,0.5)]",
                    "active:translate-y-px",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/40 focus-visible:ring-offset-2",
                  )}
                >
                  Open in Maps
                  <ExternalLink className="size-4 shrink-0" aria-hidden />
                </a>
              ) : null}
            </div>
          ) : null}

          {/* Map — right on desktop, below details on mobile */}
          {hasMap ? (
            <div
              className={cn(
                "relative min-h-[220px] bg-[#E8EEF6]",
                "sm:min-h-[280px]",
                hasDetails
                  ? "border-t border-slate-200/90 lg:min-h-full lg:border-t-0 lg:border-l"
                  : "min-h-[280px]",
              )}
            >
              {embedSrc ? (
                <iframe
                  title={
                    resolvedAddress
                      ? `Map — ${resolvedAddress}`
                      : "Clinic location map"
                  }
                  src={embedSrc}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center",
                    "bg-gradient-to-br from-[#E8EEF6] to-[#F6F8FC]",
                    "transition-colors hover:from-[#DDE6F2] hover:to-[#EEF2F8]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1557A0]/40",
                  )}
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#1557A0] shadow-sm ring-1 ring-[#1557A0]/12">
                    <MapPin className="size-7" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-[#0A2E52]">
                    View clinic on Google Maps
                  </span>
                  <span className="text-xs text-slate-500">Opens in a new tab</span>
                </a>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

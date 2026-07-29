import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { sectionImageUrl } from "./image";
import type { DoctorProfile, SectionBaseProps } from "./types";

export type DoctorProfileSectionProps = SectionBaseProps & {
  /** CMS: doctor.eyebrow — omit to hide */
  eyebrow?: string;
  /** CMS: doctor.heading — omit to hide */
  title?: string;
  /** CMS: doctor.* profile fields */
  doctor?: DoctorProfile;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

/**
 * Surgeon / doctor profile band.
 * React owns layout; CMS owns all copy. Empty name AND bio → null.
 */
export function DoctorProfileSection({
  id = "doctor",
  eyebrow,
  title,
  doctor,
  className,
}: DoctorProfileSectionProps) {
  const name = doctor?.name?.trim() || "";
  const bio = (doctor?.bio ?? []).map((p) => p.trim()).filter(Boolean);
  if (!name && !bio.length) return null;

  const resolvedEyebrow = (eyebrow ?? doctor?.eyebrow)?.trim() || "";
  const resolvedTitle = (title ?? doctor?.heading)?.trim() || "";
  const role = doctor?.role?.trim() || "";
  const credentials = (doctor?.credentials ?? [])
    .map((c) => c.trim())
    .filter(Boolean);
  const ctaLabel = doctor?.ctaLabel?.trim() || "";
  const ctaHref = doctor?.ctaHref?.trim() || "#book";
  const src = sectionImageUrl(doctor?.photo, 640);
  const photoAlt =
    doctor?.photo?.alt?.trim() || name || resolvedTitle || "Doctor";
  const initials = name ? initialsFromName(name) : "";

  return (
    <section
      id={id}
      aria-labelledby={resolvedTitle || name ? `${id}-heading` : undefined}
      className={cn(
        "relative border-y border-slate-200/80 bg-[#F6F8FC]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_180px_at_12%_0%,rgba(21,87,160,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {(resolvedEyebrow || resolvedTitle) && (
          <header className="mb-8 max-w-2xl sm:mb-10">
            {resolvedEyebrow ? (
              <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[#1557A0] uppercase">
                {resolvedEyebrow}
              </p>
            ) : null}
            {resolvedTitle ? (
              <h2
                id={`${id}-heading`}
                className={cn(
                  "font-heading text-2xl font-semibold tracking-tight text-[#0A2E52] text-balance sm:text-3xl",
                  resolvedEyebrow ? "mt-2" : undefined,
                )}
              >
                {resolvedTitle}
              </h2>
            ) : null}
          </header>
        )}

        <div
          className={cn(
            "grid items-start gap-8 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(10,46,82,0.35)]",
            "sm:gap-10 sm:p-7",
            "lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-12 lg:p-8",
          )}
        >
          <div className="mx-auto w-full max-w-[240px] lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-[#E8EEF6] to-[#F6F8FC] ring-1 ring-[#1557A0]/10">
              {src ? (
                <Image
                  src={src}
                  alt={photoAlt}
                  fill
                  sizes="(max-width: 1024px) 240px, 240px"
                  className="object-cover object-top"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  aria-hidden={!initials}
                  aria-label={initials ? undefined : photoAlt}
                >
                  {initials ? (
                    <span className="font-heading text-4xl font-semibold tracking-tight text-[#1557A0]/70">
                      {initials}
                    </span>
                  ) : (
                    <span className="h-16 w-16 rounded-full bg-[#1557A0]/10" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            {name ? (
              <h3
                id={resolvedTitle ? undefined : `${id}-heading`}
                className="font-heading text-xl font-semibold tracking-tight text-[#0A2E52] sm:text-2xl"
              >
                {name}
              </h3>
            ) : null}

            {role ? (
              <p
                className={cn(
                  "text-sm font-medium text-[#1557A0] sm:text-[0.9375rem]",
                  name ? "mt-1" : undefined,
                )}
              >
                {role}
              </p>
            ) : null}

            {credentials.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {credentials.map((credential) => (
                  <li
                    key={credential}
                    className="rounded-md border border-[#1557A0]/15 bg-[#F6F8FC] px-2.5 py-1 text-xs font-medium text-[#0A2E52]"
                  >
                    {credential}
                  </li>
                ))}
              </ul>
            ) : null}

            {bio.length ? (
              <div
                className={cn(
                  "space-y-3 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem] sm:leading-relaxed",
                  name || role || credentials.length ? "mt-5" : undefined,
                )}
              >
                {bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {ctaLabel ? (
              <a
                href={ctaHref}
                className={cn(
                  "mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1557A0] px-5 py-2.5",
                  "text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(21,87,160,0.65)]",
                  "transition-[background-color,box-shadow,transform] duration-150",
                  "hover:bg-[#0A2E52] hover:shadow-[0_10px_28px_-12px_rgba(10,46,82,0.55)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1557A0]/35 focus-visible:ring-offset-2",
                  "active:scale-[0.98]",
                )}
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

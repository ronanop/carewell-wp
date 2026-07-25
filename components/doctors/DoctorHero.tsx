import { Check, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { DoctorBreadcrumb } from "@/components/doctors/DoctorBreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DoctorProfile } from "@/types/doctor";

interface DoctorHeroProps {
  doctor: Pick<
    DoctorProfile,
    | "name"
    | "slug"
    | "title"
    | "experienceLabel"
    | "specialties"
    | "trustBadges"
    | "heroSummary"
    | "portrait"
    | "floatingAchievement"
    | "clinic"
  >;
}

function resolvePortraitSrc(src: string) {
  if (!src.startsWith("/")) return src;
  const relative = src.replace(/^\//, "");
  if (existsSync(path.join(process.cwd(), "public", relative))) return src;
  const portraitPng = "/images/dr-sandeep-bhasin-portrait.png";
  if (existsSync(path.join(process.cwd(), "public", "images", "dr-sandeep-bhasin-portrait.png"))) {
    return portraitPng;
  }
  return null;
}

export function DoctorHero({ doctor }: DoctorHeroProps) {
  const portraitSrc =
    doctor.portrait !== null
      ? resolvePortraitSrc(doctor.portrait.sourceUrl)
      : null;

  return (
    <header className="relative isolate overflow-hidden bg-primary-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 size-[28rem] rounded-full bg-primary-600/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 size-64 rounded-full bg-accent-gold-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10">
        <div className="container-content pt-6 sm:pt-8">
          <DoctorBreadcrumb doctor={doctor} tone="on-dark" />
        </div>

        <div className="container-content pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="min-w-0">
              <p className="text-label uppercase tracking-[0.18em] text-accent-gold-300">
                Meet Your Surgeon
              </p>
              <h1
                id="doctor-hero-heading"
                className="mt-4 font-heading text-[clamp(2rem,4.5vw,3.25rem)] font-bold tracking-tight text-white"
              >
                {doctor.name}
              </h1>
              <p className="mt-3 text-body-lg font-medium text-white/88">
                {doctor.title}
              </p>
              <p className="mt-2 text-small font-semibold tracking-wide text-accent-gold-300">
                {doctor.experienceLabel}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {doctor.specialties.map((specialty) => (
                  <li
                    key={specialty}
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-[0.8125rem] font-medium text-white/90"
                  >
                    {specialty}
                  </li>
                ))}
              </ul>

              <p className="mt-6 max-w-xl text-body leading-relaxed text-white/75">
                {doctor.heroSummary}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-lg bg-white px-7 text-primary-900 hover:bg-white/92 no-underline hover:no-underline",
                  )}
                >
                  Book Consultation
                </Link>
                <a
                  href={doctor.clinic.phoneHref}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 rounded-lg border-white/40 bg-transparent px-7 text-white hover:bg-white/10 no-underline hover:no-underline",
                  )}
                >
                  <Phone className="size-4" aria-hidden />
                  Call Clinic
                </a>
              </div>

              <ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {doctor.trustBadges.map((badge) => (
                  <li key={badge} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-gold-400/20 text-accent-gold-300">
                      <Check
                        className="size-3.5"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    </span>
                    <span className="text-small leading-snug text-white/85">
                      {badge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-md">
              <div
                className="absolute -inset-3 rounded-[1.75rem] border border-accent-gold-400/35"
                aria-hidden
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary-800">
                {portraitSrc && doctor.portrait ? (
                  <Image
                    src={portraitSrc}
                    alt={doctor.portrait.altText}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 88vw, 24rem"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 p-6 text-center"
                    role="img"
                    aria-label={doctor.name}
                  >
                    <div className="relative mb-auto mt-10 flex size-28 items-center justify-center rounded-full border border-white/25 bg-white/10">
                      <span className="font-heading text-3xl font-semibold tracking-tight text-white">
                        SB
                      </span>
                    </div>
                    <p className="relative font-heading text-lg font-semibold text-white">
                      {doctor.name}
                    </p>
                    <p className="relative mt-1 text-sm text-white/75">
                      {doctor.title}
                    </p>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-950/50 to-transparent"
                  aria-hidden
                />
              </div>

              <div className="relative mt-5 flex items-baseline justify-between gap-4 border-t border-white/15 pt-4">
                <div>
                  <p className="font-heading text-2xl font-bold tracking-tight text-white">
                    {doctor.floatingAchievement.value}
                  </p>
                  <p className="mt-0.5 text-small text-white/65">
                    {doctor.floatingAchievement.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

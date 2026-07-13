import { Check, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DoctorProfile } from "@/types/doctor";

interface DoctorHeroProps {
  doctor: Pick<
    DoctorProfile,
    | "name"
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

function hasPortraitFile(src: string) {
  if (!src.startsWith("/")) return true;
  const relative = src.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", relative));
}

export function DoctorHero({ doctor }: DoctorHeroProps) {
  const showImage =
    doctor.portrait !== null && hasPortraitFile(doctor.portrait.sourceUrl);

  return (
    <section className="bg-background" aria-labelledby="doctor-hero-heading">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <p className="text-label uppercase text-[#3B82F6]">
              Meet Your Surgeon
            </p>
            <h1
              id="doctor-hero-heading"
              className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]"
            >
              {doctor.name}
            </h1>
            <p className="mt-3 text-body-lg font-medium text-[#0A2540]/85">
              {doctor.title}
            </p>
            <p className="mt-2 text-small font-semibold text-[#3B82F6]">
              {doctor.experienceLabel}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {doctor.specialties.map((specialty) => (
                <li
                  key={specialty}
                  className="rounded-full border border-border/80 bg-surface px-3.5 py-1.5 text-[0.8125rem] font-medium text-[#0A2540]"
                >
                  {specialty}
                </li>
              ))}
            </ul>

            <p className="mt-5 max-w-xl text-body leading-relaxed text-muted-foreground">
              {doctor.heroSummary}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline"
                )}
              >
                Book Consultation
              </Link>
              <a
                href={doctor.clinic.phoneHref}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "rounded-lg border-[#0A2540]/25 text-[#0A2540] hover:bg-[#0A2540]/5 no-underline hover:no-underline"
                )}
              >
                <Phone className="size-4" aria-hidden />
                Call Clinic
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {doctor.trustBadges.map((badge) => (
                <li key={badge} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-50">
                    <Check
                      className="size-3.5 text-success-600"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </span>
                  <span className="text-small leading-snug text-[#0A2540]/90">
                    {badge}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-[24rem]">
            <div
              className={cn(
                "relative aspect-[4/5] max-h-[32rem] w-full overflow-hidden rounded-2xl",
                "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
              )}
            >
              {showImage && doctor.portrait ? (
                <Image
                  src={doctor.portrait.sourceUrl}
                  alt={doctor.portrait.altText}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 88vw, 24rem"
                />
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-br from-[#0A2540] via-[#123A5C] to-[#1B6B8A] p-6 text-center"
                  role="img"
                  aria-label={doctor.name}
                >
                  <div className="relative mb-auto mt-10 flex size-28 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
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
            </div>

            <div
              className={cn(
                "absolute -bottom-4 left-4 right-4 sm:-left-4 sm:right-auto sm:w-56",
                "rounded-2xl border border-border/60 bg-white p-4 shadow-[0_8px_30px_rgb(10_37_64/0.12)]"
              )}
            >
              <p className="font-heading text-2xl font-bold tracking-tight text-[#3B82F6]">
                {doctor.floatingAchievement.value}
              </p>
              <p className="mt-1 text-small text-muted-foreground">
                {doctor.floatingAchievement.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin.jpg";

const stats = [
  { value: "18+", label: "Years of Clinical Experience" },
  { value: "10,000+", label: "Procedures Performed" },
  { value: "1", label: "Founder-Led Care" },
] as const;

const highlights = [
  "Founder, Care Well Medical Centre",
  "18+ years clinical experience",
  "Hair transplant & cosmetic surgery specialist",
  "Doctor-led consultations (no sales team)",
  "Focus on natural, safe results",
  "South Delhi practice",
] as const;

function hasDoctorPortrait() {
  return existsSync(
    path.join(process.cwd(), "public", "images", "dr-sandeep-bhasin.jpg")
  );
}

function DoctorPortrait() {
  const showImage = hasDoctorPortrait();

  return (
    <div className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-[24rem]">
      <div
        className={cn(
          "group relative aspect-[4/5] max-h-[30rem] w-full overflow-hidden rounded-2xl",
          "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]",
          "transition-shadow duration-300 hover:shadow-[0_12px_36px_rgb(10_37_64/0.12)]"
        )}
      >
        {showImage ? (
          <Image
            src={DOCTOR_IMAGE_SRC}
            alt="Dr. Sandeep Bhasin"
            fill
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 88vw, 24rem"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-br from-[#0A2540] via-[#123A5C] to-[#1B6B8A] p-6 text-center"
            role="img"
            aria-label="Dr. Sandeep Bhasin"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 30% 20%, rgb(125 196 220 / 0.45), transparent 55%), radial-gradient(ellipse at 80% 70%, rgb(10 37 64 / 0.5), transparent 50%)",
              }}
            />
            <div className="relative mb-auto mt-10 flex size-28 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.03]">
              <span className="font-heading text-3xl font-semibold tracking-tight text-white">
                SB
              </span>
            </div>
            <p className="relative font-heading text-lg font-semibold text-white">
              Dr. Sandeep Bhasin
            </p>
            <p className="relative mt-1 text-sm text-white/75">
              Cosmetic &amp; Hair Transplant Surgeon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function DoctorsSection() {
  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-14 xl:gap-16">
          <DoctorPortrait />

          <div className="min-w-0">
            <p className="text-label uppercase text-[#3B82F6]">
              Meet Your Surgeon
            </p>
            <h2 className="mt-3 font-heading text-h2 font-bold text-[#0A2540]">
              Meet Your Cosmetic Surgeon
            </h2>
            <h3 className="mt-4 font-heading text-h4 font-semibold text-[#0A2540]">
              Dr. Sandeep Bhasin
            </h3>
            <p className="mt-3 max-w-xl text-body leading-relaxed text-muted-foreground">
              Senior cosmetic and hair transplant surgeon with 18+ years of
              clinical experience, and founder of Care Well Medical Centre. Every
              consultation is doctor-led — focused on safety, honest guidance,
              and natural-looking results you can trust.
            </p>
            <p className="mt-3 text-small font-medium text-[#0A2540]/80">
              Performed 10,000+ cosmetic and hair procedures with a commitment to
              careful planning and patient-first care.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <li
                  key={stat.label}
                  className={cn(
                    "rounded-xl border border-border/80 bg-surface px-4 py-4 text-center shadow-xs",
                    "transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3B82F6]/25 hover:shadow-sm"
                  )}
                >
                  <p className="font-heading text-2xl font-bold tracking-tight text-[#3B82F6]">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>

            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-50">
                    <Check
                      className="size-3.5 text-success-600"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </span>
                  <span className="text-small leading-snug text-[#0A2540]/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/about/dr-sandeep-bhasin"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline"
                )}
              >
                View Full Doctor Profile
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "rounded-lg border-[#0A2540]/25 text-[#0A2540] hover:bg-[#0A2540]/5 no-underline hover:no-underline"
                )}
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

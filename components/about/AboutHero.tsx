import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";

import { cn } from "@/lib/utils";

const CONSULTATION_IMAGE_SRC = "/images/about-consultation.jpg";

function hasConsultationImage() {
  return existsSync(
    path.join(process.cwd(), "public", "images", "about-consultation.jpg")
  );
}

function HeroImage() {
  const showImage = hasConsultationImage();

  return (
    <div className="mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none">
      <div
        className={cn(
          "relative aspect-[4/5] max-h-[28rem] w-full overflow-hidden rounded-2xl",
          "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
        )}
      >
        {showImage ? (
          <Image
            src={CONSULTATION_IMAGE_SRC}
            alt="Consultation at Care Well Medical Centre"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 88vw, 26rem"
            priority
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-br from-[#0A2540] via-[#123A5C] to-[#1B6B8A] p-8 text-center"
            role="img"
            aria-label="Care Well Medical Centre clinic"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 30% 20%, rgb(125 196 220 / 0.45), transparent 55%), radial-gradient(ellipse at 80% 70%, rgb(10 37 64 / 0.5), transparent 50%)",
              }}
            />
            <div className="relative mb-auto mt-12 flex size-24 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
              <span className="font-heading text-2xl font-semibold tracking-tight text-white">
                CW
              </span>
            </div>
            <p className="relative font-heading text-lg font-semibold text-white">
              Care Well Medical Centre
            </p>
            <p className="relative mt-1.5 max-w-xs text-sm text-white/75">
              Advanced cosmetic &amp; aesthetic care in South Delhi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AboutHero() {
  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <p className="text-label uppercase text-[#3B82F6]">
              Care Well Medical Centre Clinic
            </p>
            <h1 className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]">
              About Care Well Medical Centre – Our Vision, Team &amp; Commitment
            </h1>
            <p className="mt-5 max-w-2xl text-body-lg font-medium leading-relaxed text-[#0A2540]/85">
              Your Trusted Destination for Advanced Cosmetic &amp; Aesthetic
              Treatments
            </p>
            <p className="mt-5 max-w-2xl text-body leading-relaxed text-muted-foreground">
              Care Well Medical Centre is a trusted hair transplant and aesthetic
              clinic in South Delhi, led by Dr. Sandeep Bhasin. For over 20 years,
              we have specialized in advanced hair restoration, cosmetic surgery,
              and anti-aging treatments, delivering natural results with a
              patient-first approach.
            </p>
          </div>

          <HeroImage />
        </div>
      </div>
    </section>
  );
}

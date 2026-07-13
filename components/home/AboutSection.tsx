import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CONSULTATION_IMAGE_SRC = "/images/about-consultation.jpg";

const featuresLeft = [
  "Advanced Skin & Anti-Aging Treatments",
  "Hair Restoration & Transplant",
  "Laser & Non-Surgical Procedures",
] as const;

const featuresRight = [
  "Body Contouring & Fat Reduction",
  "Scar & Acne Treatment",
  "Cosmetic Surgeries",
] as const;

function hasConsultationImage() {
  return existsSync(
    path.join(process.cwd(), "public", "images", "about-consultation.jpg")
  );
}

function ConsultationImage() {
  const showImage = hasConsultationImage();

  return (
    <div className="mx-auto w-full max-w-[28rem] lg:mx-0 lg:max-w-none">
      <div
        className={cn(
          "relative aspect-[4/5] max-h-[30rem] w-full overflow-hidden rounded-2xl",
          "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
        )}
      >
        {showImage ? (
          <Image
            src={CONSULTATION_IMAGE_SRC}
            alt="Doctor consultation at Care Well Medical Centre"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 88vw, 28rem"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-br from-[#0A2540] via-[#123A5C] to-[#1B6B8A] p-8 text-center"
            role="img"
            aria-label="Care Well Medical Centre consultation"
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
              Thoughtful, doctor-led care
            </p>
            <p className="relative mt-1.5 max-w-xs text-sm text-white/75">
              Consultations focused on natural results and your long-term
              wellbeing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/12">
        <Check
          className="size-3.5 text-[#3B82F6]"
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
      <span className="text-small leading-snug text-[#0A2540]/90">{label}</span>
    </li>
  );
}

export function AboutSection() {
  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <p className="text-label uppercase text-[#3B82F6]">About Us</p>
            <h2 className="mt-3 font-heading text-h2 font-bold text-[#0A2540]">
              Redefining Aesthetic &amp; Cosmetic Care
            </h2>

            <div className="mt-5 max-w-xl space-y-4 text-body leading-relaxed text-muted-foreground">
              <p>
                At Care Well Medical Centre, we believe aesthetic care should
                enhance what is already yours — never overpower it. Our approach
                centres on natural-looking results that feel like you, only
                refined with care and precision.
              </p>
              <p>
                Every treatment plan begins with a doctor-led consultation. We
                take time to understand your goals, assess your unique needs, and
                guide you through options that are clinically sound and
                personally right for you.
              </p>
              <p>
                We recommend only what is appropriate — prioritising safety,
                honesty, and long-term wellbeing over unnecessary procedures.
                Your trust is the foundation of everything we do.
              </p>
            </div>

            <h3 className="mt-9 font-heading text-h4 font-semibold text-[#0A2540]">
              Our special Features
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              <ul className="flex flex-col gap-3">
                {featuresLeft.map((item) => (
                  <FeatureItem key={item} label={item} />
                ))}
              </ul>
              <ul className="flex flex-col gap-3">
                {featuresRight.map((item) => (
                  <FeatureItem key={item} label={item} />
                ))}
              </ul>
            </div>

            <div className="mt-9">
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline"
                )}
              >
                More About Us
              </Link>
            </div>
          </div>

          <ConsultationImage />
        </div>
      </div>
    </section>
  );
}

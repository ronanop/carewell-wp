import { ArrowRight, Lock, MapPin, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_IMAGE_SRC = "/images/hero-model.png";
const HERO_BACKGROUND_SRC = "/images/hero-background.png";

function LocationBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
      <MapPin className="size-3.5 text-primary" strokeWidth={2} aria-hidden />
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-primary">
        Chittaranjan Park · South Delhi
      </span>
    </div>
  );
}

function GoogleRatingBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-surface px-3.5 py-2 shadow-xs">
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className="size-3.5 fill-[#FABB05] text-[#FABB05]"
            strokeWidth={0}
          />
        ))}
      </div>
      <span className="text-[0.875rem] font-semibold text-foreground">4.3</span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4 shrink-0"
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
      <span className="sr-only">4.3 out of 5 on Google</span>
    </div>
  );
}

function ExperienceBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-2 shadow-xs">
      <span className="flex size-5 items-center justify-center rounded-full bg-success-500">
        <ShieldCheck
          className="size-3 text-white"
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
      <span className="text-[0.875rem] font-medium text-foreground">
        20+ Yrs · 10,000+ Procedures
      </span>
    </div>
  );
}

function HeroImagePanel() {
  return (
    <div className="relative mx-auto flex w-full max-w-md items-end self-end lg:mx-0 lg:h-full lg:min-h-[32rem] lg:max-w-none">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={HERO_IMAGE_SRC}
          alt="Care Well Medical Centre — patient portrait"
          fill
          priority
          className="object-contain object-bottom"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero-compact relative overflow-hidden bg-background">
      <Image
        src={HERO_BACKGROUND_SRC}
        alt=""
        fill
        priority
        aria-hidden
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Same container as navbar — keeps logo and hero text on one left edge */}
      <div className="container-content relative">
        <div className="grid items-center gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-10 lg:pb-0 lg:pt-12">
          <div className="max-w-[34rem] lg:self-center lg:pb-12">
            <LocationBadge />

            <h1 className="mt-5 text-[clamp(2rem,3.2vw+0.75rem,3.125rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#0A2540]">
              Cosmetic Surgery{" "}
              <span className="text-primary">&amp; Hair Transplant</span> Clinic
              in South Delhi
            </h1>

            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-[#4B5563] md:text-[1.125rem]">
              Advanced Hair Restoration, PRP Therapy, Skin, Anti-Aging &amp;
              Body Contouring by Dr. Sandeep Bhasin.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <GoogleRatingBadge />
              <ExperienceBadge />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-[#2D2926] px-6 text-white hover:bg-[#2D2926]/90 no-underline hover:no-underline"
                )}
              >
                Book Free Consultation
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-lg border-[#2D2926]/25 bg-surface px-6 text-[#2D2926] hover:bg-surface/90 no-underline hover:no-underline"
                )}
              >
                Explore Treatments
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-[0.8125rem] text-[#9CA3AF]">
              <Lock className="size-3.5 shrink-0 text-[#E07A3D]" aria-hidden />
              100% private · Response within 2 hours · No spam
            </p>
          </div>

          <HeroImagePanel />
        </div>
      </div>
    </section>
  );
}

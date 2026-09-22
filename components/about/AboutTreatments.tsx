import {
  Droplets,
  Scissors,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

import { AboutReveal } from "@/components/about/AboutReveal";
import { treatmentSpecialties } from "@/components/about/content";

const SPECIALTY_ICONS: LucideIcon[] = [UserRound, Scissors, Sparkles, Droplets];

/**
 * Origin story + specialty focus — editorial split with portrait.
 */
export function AboutTreatments() {
  return (
    <section className="relative bg-background" aria-labelledby="about-story-heading">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-gradient-to-l from-primary-50/80 to-transparent lg:block"
        aria-hidden
      />

      <div className="container-content section-padding">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <AboutReveal from="left" className="min-w-0">
            <p className="text-label uppercase tracking-[0.18em] text-accent-gold-600">
              Our story
            </p>
            <h2
              id="about-story-heading"
              className="mt-4 max-w-[15ch] font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
            >
              Two decades of careful craft.
            </h2>
            <div
              className="mt-5 h-[2px] w-12 bg-primary-600"
              aria-hidden
            />
            <div className="mt-7 max-w-xl space-y-4 text-body leading-relaxed text-muted-foreground">
              <p>
                Founded in 2000 by Dr. Sandeep Bhasin, Care Well Medical Centre
                has grown into a trusted destination for hair restoration, body
                contouring, and aesthetic surgery in South Delhi.
              </p>
              <p>
                Dr. Bhasin is an award-winning specialist — a graduate of
                Jawaharlal Nehru Medical College, Belgaum, and Aligarh Muslim
                University — and among the few board-certified laparoscopic
                &amp; cosmetic surgeons in India.
              </p>
              <p>
                We prioritize comfort, clarity, and holistic well-being. Our
                trained support team ensures every visit feels personal, never
                rushed.
              </p>
            </div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {treatmentSpecialties.map((item, index) => {
                const Icon = SPECIALTY_ICONS[index] ?? Sparkles;
                return (
                  <li key={item.title} className="group flex gap-4">
                    <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-100/80 transition-colors group-hover:bg-primary-100 group-hover:text-primary-800">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0 border-b border-border/50 pb-5">
                      <h3 className="font-heading text-body font-semibold text-[#0A2540]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-small leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </AboutReveal>

          <AboutReveal from="right" delay={0.08} className="min-w-0">
            <div className="relative mx-auto max-w-md lg:ml-auto lg:max-w-none">
              <div
                className="absolute -left-4 top-8 hidden h-[calc(100%-4rem)] w-1 rounded-full bg-accent-gold-400/70 lg:block"
                aria-hidden
              />
              <div
                className="absolute -inset-x-5 -bottom-5 top-16 -z-0 rounded-[2rem] bg-gradient-to-br from-primary-100 via-surface-cream to-accent-gold-100/70"
                aria-hidden
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-28px_rgba(7,47,47,0.45)]">
                <Image
                  src="/images/hero-portrait.png"
                  alt="Patient care at Care Well Medical Centre"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 24rem, 30rem"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary-950/35 via-transparent to-transparent"
                  aria-hidden
                />
                <p className="absolute bottom-5 left-5 right-5 font-heading text-small font-medium text-white/95">
                  Natural results. Clinical standards. South Delhi.
                </p>
              </div>
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  );
}

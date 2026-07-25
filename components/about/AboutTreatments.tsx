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
 * Origin story + specialty focus — one job: who we are & what we practice.
 */
export function AboutTreatments() {
  return (
    <section
      className="bg-background"
      aria-labelledby="about-story-heading"
    >
      <div className="container-content section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 xl:gap-20">
          <AboutReveal from="left" className="min-w-0">
            <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
              Our story
            </p>
            <h2
              id="about-story-heading"
              className="mt-3 max-w-[16ch] font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
            >
              Two decades of careful craft.
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-body leading-relaxed text-muted-foreground">
              <p>
                Founded in 2000 by Dr. Sandeep Bhasin, Care Well Medical Centre
                has grown into a trusted destination for hair restoration,
                body contouring, and aesthetic surgery in South Delhi.
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

            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {treatmentSpecialties.map((item, index) => {
                const Icon = SPECIALTY_ICONS[index] ?? Sparkles;
                return (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-heading text-body font-semibold text-[#0A2540]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-small leading-relaxed text-muted-foreground">
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
                className="absolute -inset-x-6 -bottom-6 top-12 rounded-[2rem] bg-gradient-to-br from-primary-100/80 via-surface-cream to-accent-gold-100/60"
                aria-hidden
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/images/hero-portrait.png"
                  alt="Patient care at Care Well Medical Centre"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 24rem, 28rem"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary-950/25 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <p className="relative mt-5 text-center text-small text-muted-foreground lg:text-left">
                Natural results. Clinical standards. South Delhi.
              </p>
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  );
}

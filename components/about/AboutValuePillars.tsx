import {
  HeartHandshake,
  Sparkles,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { AboutReveal } from "@/components/about/AboutReveal";
import { valuePillars } from "@/components/about/content";

const ICONS: LucideIcon[] = [Stethoscope, HeartHandshake, UserRound, Sparkles];

export function AboutValuePillars() {
  return (
    <section className="bg-background" aria-labelledby="values-heading">
      <div className="container-content section-padding">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.18em] text-accent-gold-600">
            Our values
          </p>
          <h2
            id="values-heading"
            className="mt-4 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            What sets our care apart
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Great practice means great healthcare — personalized plans, clinical
            discipline, and results that respect who you are.
          </p>
        </AboutReveal>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-x-12 gap-y-12 sm:grid-cols-2">
          {valuePillars.map((pillar, index) => {
            const Icon = ICONS[index] ?? Sparkles;
            return (
              <AboutReveal key={pillar.title} delay={index * 0.05}>
                <li className="relative flex gap-5 border-b border-border/50 pb-10">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-900 text-accent-gold-300">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-h4 font-semibold text-[#0A2540]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-body leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </li>
              </AboutReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

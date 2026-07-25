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
    <section
      className="bg-muted/30"
      aria-labelledby="values-heading"
    >
      <div className="container-content section-padding">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Our values
          </p>
          <h2
            id="values-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            What sets our care apart
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Great practice means great healthcare — personalized plans, clinical
            discipline, and results that respect who you are.
          </p>
        </AboutReveal>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-x-10 gap-y-10 sm:grid-cols-2">
          {valuePillars.map((pillar, index) => {
            const Icon = ICONS[index] ?? Sparkles;
            return (
              <AboutReveal key={pillar.title} delay={index * 0.05}>
                <li className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-h4 font-semibold text-[#0A2540]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-body leading-relaxed text-muted-foreground">
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

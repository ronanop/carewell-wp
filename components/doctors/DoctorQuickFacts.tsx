import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import type { DoctorProfile } from "@/types/doctor";

interface DoctorQuickFactsProps {
  facts: DoctorProfile["quickFacts"];
}

export function DoctorQuickFacts({ facts }: DoctorQuickFactsProps) {
  return (
    <section
      className="border-b border-border/50 bg-surface-cream"
      aria-labelledby="quick-facts-heading"
    >
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            At a Glance
          </p>
          <h2
            id="quick-facts-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Quick Facts
          </h2>
        </DoctorReveal>

        <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {facts.map((fact, index) => (
            <DoctorReveal key={fact.label} delay={index * 0.03}>
              <li className="min-w-0 border-l-2 border-accent-gold-400/80 pl-4">
                <p className="text-label uppercase tracking-[0.12em] text-primary-600">
                  {fact.label}
                </p>
                <p className="mt-2 font-heading text-body font-semibold leading-snug text-[#0A2540]">
                  {fact.value}
                </p>
              </li>
            </DoctorReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

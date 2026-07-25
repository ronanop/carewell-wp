import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import type { DoctorProfile } from "@/types/doctor";

interface TreatmentPhilosophyProps {
  philosophy: DoctorProfile["philosophy"];
}

export function TreatmentPhilosophy({ philosophy }: TreatmentPhilosophyProps) {
  return (
    <section className="bg-background" aria-labelledby="philosophy-heading">
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            {philosophy.overline}
          </p>
          <h2
            id="philosophy-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            {philosophy.title}
          </h2>
          <p className="mt-5 text-body-lg leading-relaxed text-muted-foreground">
            {philosophy.lead}
          </p>
        </DoctorReveal>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {philosophy.pillars.map((pillar, index) => (
            <DoctorReveal key={pillar.title} delay={index * 0.04}>
              <li className="relative pt-1">
                <span
                  className="font-heading text-sm font-semibold tabular-nums tracking-[0.14em] text-accent-gold-600"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-3 h-px w-10 bg-primary-300" aria-hidden />
                <h3 className="mt-4 font-heading text-h4 font-semibold text-[#0A2540]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </li>
            </DoctorReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

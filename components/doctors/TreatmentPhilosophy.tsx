import type { DoctorProfile } from "@/types/doctor";
import { cn } from "@/lib/utils";

interface TreatmentPhilosophyProps {
  philosophy: DoctorProfile["philosophy"];
}

export function TreatmentPhilosophy({ philosophy }: TreatmentPhilosophyProps) {
  return (
    <section className="bg-background" aria-labelledby="philosophy-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">
            {philosophy.overline}
          </p>
          <h2
            id="philosophy-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            {philosophy.title}
          </h2>
          <p className="mt-5 text-body-lg leading-relaxed text-muted-foreground">
            {philosophy.lead}
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {philosophy.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className={cn(
                "rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                "sm:p-7",
                "lg:last:col-span-1 lg:[&:nth-child(4)]:col-span-1 lg:[&:nth-child(5)]:col-span-1"
              )}
            >
              <h3 className="font-heading text-h4 font-semibold text-[#0A2540]">
                {pillar.title}
              </h3>
              <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

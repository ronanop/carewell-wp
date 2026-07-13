import type { DoctorProfile } from "@/types/doctor";
import { cn } from "@/lib/utils";

interface DoctorQuickFactsProps {
  facts: DoctorProfile["quickFacts"];
}

export function DoctorQuickFacts({ facts }: DoctorQuickFactsProps) {
  return (
    <section className="bg-muted/20" aria-labelledby="quick-facts-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">At a Glance</p>
          <h2
            id="quick-facts-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Quick Facts
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {facts.map((fact) => (
            <li
              key={fact.label}
              className={cn(
                "rounded-2xl border border-border/60 bg-white p-5 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                "sm:p-6"
              )}
            >
              <p className="text-label uppercase text-[#3B82F6]">{fact.label}</p>
              <p className="mt-2 font-heading text-body font-semibold leading-snug text-[#0A2540]">
                {fact.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

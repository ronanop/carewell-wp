import Link from "next/link";

import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DoctorRelatedTreatment } from "@/types/doctor";

interface RelatedTreatmentsProps {
  treatments: DoctorRelatedTreatment[];
}

export function RelatedTreatments({ treatments }: RelatedTreatmentsProps) {
  return (
    <section className="bg-background" aria-labelledby="related-heading">
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Explore
          </p>
          <h2
            id="related-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Related Treatments
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Continue exploring the treatments most often discussed during
            consultations with Dr. Bhasin.
          </p>
        </DoctorReveal>

        <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment, index) => (
            <DoctorReveal key={treatment.title} delay={index * 0.04}>
              <li className="flex h-full flex-col border-t border-border/70 pt-6">
                <h3 className="font-heading text-h4 font-semibold text-[#0A2540]">
                  {treatment.title}
                </h3>
                <p className="mt-2 flex-1 text-small leading-relaxed text-muted-foreground">
                  {treatment.description}
                </p>
                <div className="mt-5">
                  <Link
                    href={treatment.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-lg border-primary/25 text-primary-800 hover:bg-primary-50 no-underline hover:no-underline",
                    )}
                  >
                    Learn More
                  </Link>
                </div>
              </li>
            </DoctorReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

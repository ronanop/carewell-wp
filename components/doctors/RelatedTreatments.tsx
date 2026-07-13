import Link from "next/link";

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
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Explore</p>
          <h2
            id="related-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Related Treatments
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Continue exploring the treatments most often discussed during
            consultations with Dr. Bhasin.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment) => (
            <li
              key={treatment.title}
              className={cn(
                "flex flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                "sm:p-7"
              )}
            >
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
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "rounded-lg border-[#0A2540]/20 text-[#0A2540] no-underline hover:no-underline"
                  )}
                >
                  Learn More
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

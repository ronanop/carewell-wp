import { Check } from "lucide-react";

import { treatmentSpecialties } from "@/components/about/content";

function SpecialtyItem({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/12">
        <Check
          className="size-3.5 text-[#3B82F6]"
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
      <span className="text-body leading-snug text-[#0A2540]/90">{label}</span>
    </li>
  );
}

export function AboutTreatments() {
  return (
    <section className="bg-muted/20">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Our Specialties</p>
          <h2 className="mt-3 font-heading text-h2 font-bold text-[#0A2540]">
            Wide Range of Cosmetic Treatments
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            At Care Well Medical Centre, we are committed to holistic wellness
            and advanced cosmetic surgery, offering the best treatments for men
            and women.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <p className="text-body leading-relaxed text-muted-foreground">
            Our clinic specializes in hair transplants, body contouring, and
            cosmetic &amp; plastic surgery, including:
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-1">
            {treatmentSpecialties.map((item) => (
              <SpecialtyItem key={item} label={item} />
            ))}
          </ul>

          <div className="mt-10 space-y-4 border-t border-border/70 pt-10 text-body leading-relaxed text-muted-foreground">
            <p>
              Founded in 2000 by Dr. Sandeep Bhasin, a renowned laparoscopic and
              cosmetic surgeon, Care Well Medical Centre has built a reputation
              for excellence in cosmetic and reconstructive procedures.
            </p>
            <p>
              Dr. Sandeep Bhasin is an award-winning specialist with over two
              decades of experience in cosmetic surgery. A graduate of Jawaharlal
              Nehru Medical College, Belgaum, and Aligarh Muslim University, Dr.
              Bhasin has undergone extensive training, making him one of the few
              board-certified laparoscopic &amp; cosmetic surgeons in India.
            </p>
            <p>
              At Care Well Medical Centre, we prioritize patient care, comfort,
              and holistic well-being. Our highly trained support staff ensures a
              personalized and compassionate experience for every patient.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

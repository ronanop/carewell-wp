import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import type { DoctorProfile } from "@/types/doctor";

interface DoctorBiographyProps {
  biography: DoctorProfile["biography"];
}

export function DoctorBiography({ biography }: DoctorBiographyProps) {
  return (
    <section className="bg-background" aria-labelledby="biography-heading">
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-3xl">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            {biography.overline}
          </p>
          <h2
            id="biography-heading"
            className="mt-3 max-w-[22ch] font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            {biography.title}
          </h2>

          <div className="mt-10 space-y-5 text-body leading-relaxed text-muted-foreground">
            {biography.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </DoctorReveal>
      </div>
    </section>
  );
}

import type { DoctorProfile } from "@/types/doctor";

interface DoctorBiographyProps {
  biography: DoctorProfile["biography"];
}

export function DoctorBiography({ biography }: DoctorBiographyProps) {
  return (
    <section className="bg-background" aria-labelledby="biography-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="text-label uppercase text-[#3B82F6]">
            {biography.overline}
          </p>
          <h2
            id="biography-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            {biography.title}
          </h2>

          <div className="mt-8 space-y-5 text-body leading-relaxed text-muted-foreground">
            {biography.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

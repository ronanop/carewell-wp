import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import type { DoctorTimelineItem } from "@/types/doctor";

interface QualificationTimelineProps {
  items: DoctorTimelineItem[];
}

export function QualificationTimeline({ items }: QualificationTimelineProps) {
  return (
    <section className="bg-background" aria-labelledby="qualifications-heading">
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Credentials
          </p>
          <h2
            id="qualifications-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Qualifications
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Education, training, and professional development that underpin
            safe, evidence-based cosmetic care.
          </p>
        </DoctorReveal>

        <ol className="relative mx-auto mt-14 max-w-3xl">
          {items.map((item, index) => (
            <DoctorReveal key={item.title} delay={index * 0.04}>
              <li className="relative flex gap-5 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex size-3 shrink-0 rounded-full bg-primary-600 ring-4 ring-primary-100" />
                  {index < items.length - 1 ? (
                    <span
                      className="mt-1 w-px flex-1 bg-border"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className="mb-1 min-w-0 flex-1 pb-1">
                  <p className="text-label uppercase tracking-[0.12em] text-accent-gold-600">
                    {item.year}
                  </p>
                  <h3 className="mt-2 font-heading text-h4 font-semibold text-[#0A2540]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            </DoctorReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

import type { DoctorTimelineItem } from "@/types/doctor";
import { cn } from "@/lib/utils";

interface ExperienceTimelineProps {
  items: DoctorTimelineItem[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <section className="bg-muted/20" aria-labelledby="experience-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Career</p>
          <h2
            id="experience-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Professional Experience
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Leadership roles, clinical practice, and a founder-led standard of
            care at Care Well Medical Centre.
          </p>
        </div>

        <ol className="relative mx-auto mt-12 max-w-3xl">
          {items.map((item, index) => (
            <li key={item.title} className="relative flex gap-5 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex size-3 shrink-0 rounded-full bg-[#0A2540] ring-4 ring-[#0A2540]/10" />
                {index < items.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                ) : null}
              </div>
              <div
                className={cn(
                  "mb-1 flex-1 rounded-2xl border border-border/60 bg-white p-5 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                  "sm:p-6"
                )}
              >
                <p className="text-label uppercase text-[#3B82F6]">{item.year}</p>
                <h3 className="mt-2 font-heading text-h4 font-semibold text-[#0A2540]">
                  {item.title}
                </h3>
                <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

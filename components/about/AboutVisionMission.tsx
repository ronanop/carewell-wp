import { AboutReveal } from "@/components/about/AboutReveal";
import { visionPoints } from "@/components/about/content";

export function AboutVisionMission() {
  return (
    <section
      className="relative overflow-hidden bg-primary-50/40"
      aria-labelledby="vision-heading"
    >
      <div className="container-content section-padding !pt-8 md:!pt-10">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.18em] text-accent-gold-600">
            Purpose
          </p>
          <h2
            id="vision-heading"
            className="mt-4 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Vision &amp; mission
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Enhance beauty, deepen confidence, and support well-being through
            advanced cosmetic care — always ethical, always clear.
          </p>
        </AboutReveal>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-5">
          {visionPoints.map((point, index) => (
            <AboutReveal key={point.title} delay={index * 0.06}>
              <li className="relative flex h-full flex-col rounded-[1.25rem] bg-background px-6 py-8 ring-1 ring-primary-100/80">
                <span
                  className="font-heading text-sm font-semibold tabular-nums tracking-[0.16em] text-accent-gold-600"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-4 h-[2px] w-9 bg-primary-600" aria-hidden />
                <h3 className="mt-5 font-heading text-h4 font-semibold text-[#0A2540]">
                  {point.title}
                </h3>
                <p className="mt-3 flex-1 text-body leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </li>
            </AboutReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

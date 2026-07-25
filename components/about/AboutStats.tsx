import { aboutStats } from "@/components/about/content";
import { AboutReveal } from "@/components/about/AboutReveal";

/** Trust strip — sits below the fold after the full-bleed hero. */
export function AboutStats() {
  return (
    <section
      className="relative border-b border-border/50 bg-surface-cream"
      aria-label="Care Well at a glance"
    >
      <div className="container-content py-10 md:py-12">
        <AboutReveal>
          <ul className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 lg:gap-10">
            {aboutStats.map((stat) => (
              <li key={stat.label} className="min-w-0 text-center md:text-left">
                <p className="font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-primary-800">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-small leading-snug text-muted-foreground">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </AboutReveal>
      </div>
    </section>
  );
}

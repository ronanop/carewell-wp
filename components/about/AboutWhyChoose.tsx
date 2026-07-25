import { AboutReveal } from "@/components/about/AboutReveal";
import { whyChoosePillars } from "@/components/about/content";
import { cn } from "@/lib/utils";

export function AboutWhyChoose() {
  return (
    <section className="bg-background" aria-labelledby="why-choose-heading">
      <div className="container-content section-padding">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Why Care Well
          </p>
          <h2
            id="why-choose-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Chosen for craft, kept for care.
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Five reasons patients trust Care Well Medical Centre for cosmetic
            and aesthetic treatment in Delhi.
          </p>
        </AboutReveal>

        <ol className="mx-auto mt-14 max-w-4xl space-y-0">
          {whyChoosePillars.map((pillar, index) => (
            <AboutReveal key={pillar.title} delay={index * 0.04}>
              <li
                className={cn(
                  "grid gap-4 border-t border-border/70 py-8 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-8 sm:py-10",
                  index === whyChoosePillars.length - 1 && "border-b",
                )}
              >
                <span
                  className="font-heading text-3xl font-bold tabular-nums text-primary-300 sm:pt-1"
                  aria-hidden
                >
                  {pillar.number}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-h3 font-semibold text-[#0A2540]">
                    <span className="sr-only">{pillar.number}. </span>
                    {pillar.title}
                  </h3>

                  <div className="mt-3 space-y-3 text-body leading-relaxed text-muted-foreground">
                    {pillar.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {"categories" in pillar && pillar.categories ? (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {pillar.categories.map((category) => (
                        <li
                          key={category.title}
                          className="border-l-2 border-accent-gold-400/80 bg-surface-editorial pl-4 pr-3 py-3"
                        >
                          <p className="font-heading text-small font-semibold text-[#0A2540]">
                            {category.title}
                          </p>
                          <p className="mt-1 text-small leading-relaxed text-muted-foreground">
                            {category.items}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            </AboutReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

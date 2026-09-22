import { AboutReveal } from "@/components/about/AboutReveal";
import { whyChoosePillars } from "@/components/about/content";
import { cn } from "@/lib/utils";

export function AboutWhyChoose() {
  return (
    <section className="bg-background" aria-labelledby="why-choose-heading">
      <div className="container-content section-padding !pb-8 md:!pb-10">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.18em] text-accent-gold-600">
            Why Care Well
          </p>
          <h2
            id="why-choose-heading"
            className="mt-4 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Chosen for craft, kept for care.
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Five reasons patients trust Care Well Medical Centre for cosmetic
            and aesthetic treatment in Delhi.
          </p>
        </AboutReveal>

        <ol className="mx-auto mt-16 max-w-4xl">
          {whyChoosePillars.map((pillar, index) => (
            <AboutReveal key={pillar.title} delay={index * 0.04}>
              <li
                className={cn(
                  "group grid gap-5 border-t border-border/60 py-9 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-10 sm:py-11",
                  index === whyChoosePillars.length - 1 &&
                    "border-b border-border/60",
                )}
              >
                <span
                  className="font-heading text-4xl font-bold tabular-nums text-primary-200 transition-colors group-hover:text-primary-400 sm:pt-1"
                  aria-hidden
                >
                  {pillar.number}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-h3 font-semibold text-[#0A2540]">
                    <span className="sr-only">{pillar.number}. </span>
                    {pillar.title}
                  </h3>
                  <div
                    className="mt-3 h-[2px] w-8 bg-accent-gold-400/80 transition-all group-hover:w-14"
                    aria-hidden
                  />

                  <div className="mt-4 space-y-3 text-body leading-relaxed text-muted-foreground">
                    {pillar.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {"categories" in pillar && pillar.categories ? (
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {pillar.categories.map((category) => (
                        <li
                          key={category.title}
                          className="border-l-2 border-accent-gold-400 bg-gradient-to-r from-primary-50/80 to-transparent py-3 pl-4 pr-2"
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

import { whyChoosePillars } from "@/components/about/content";
import { cn } from "@/lib/utils";

export function AboutWhyChoose() {
  return (
    <section className="bg-background" aria-labelledby="why-choose-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Why Us</p>
          <h2
            id="why-choose-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Why Choose Care Well Medical Centre?
          </h2>
        </div>

        <ol className="mx-auto mt-12 max-w-4xl space-y-6">
          {whyChoosePillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className={cn(
                "rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                "sm:p-8",
                index % 2 === 1 && "bg-muted/30"
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <span
                  className="font-heading text-3xl font-bold tabular-nums text-[#3B82F6]/35 sm:pt-0.5"
                  aria-hidden
                >
                  {pillar.number}
                </span>
                <div className="min-w-0 flex-1">
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
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {pillar.categories.map((category) => (
                        <li
                          key={category.title}
                          className="rounded-xl border border-border/50 bg-background/80 px-4 py-3.5"
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
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

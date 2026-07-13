import { valuePillars } from "@/components/about/content";
import { cn } from "@/lib/utils";

export function AboutValuePillars() {
  return (
    <section className="bg-muted/20" aria-labelledby="values-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Our Values</p>
          <h2
            id="values-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            What Sets Our Care Apart
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Great Practice Means Great Health Care — experience top-notch
            cosmetic treatment with our personalized treatment plans. Your
            well-being is our commitment.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2">
          {valuePillars.map((pillar) => (
            <li
              key={pillar.title}
              className={cn(
                "rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                "sm:p-7"
              )}
            >
              <h3 className="font-heading text-h4 font-semibold text-[#0A2540]">
                {pillar.title}
              </h3>
              <p className="mt-2 text-body leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

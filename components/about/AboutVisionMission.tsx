import { visionPoints } from "@/components/about/content";
import { cn } from "@/lib/utils";

export function AboutVisionMission() {
  return (
    <section className="bg-background" aria-labelledby="vision-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Purpose</p>
          <h2
            id="vision-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Our Vision &amp; Mission
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            At Care Well Medical Centre, our mission is to enhance beauty, boost
            confidence, and promote well-being through advanced cosmetic
            procedures. We strive to provide:
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {visionPoints.map((point, index) => (
            <li
              key={point.title}
              className={cn(
                "rounded-2xl border border-border/60 bg-white p-6 text-center shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                "sm:p-7"
              )}
            >
              <span
                className="font-heading text-2xl font-bold text-[#3B82F6]/40"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-heading text-h4 font-semibold text-[#0A2540]">
                {point.title}
              </h3>
              <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

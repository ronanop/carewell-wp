import { aboutStats } from "@/components/about/content";
import { AboutReveal } from "@/components/about/AboutReveal";

/** Trust strip — deep teal band with gold dividers under the hero. */
export function AboutStats() {
  return (
    <section
      className="relative overflow-hidden bg-primary-900"
      aria-label="Care Well at a glance"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 50%, var(--accent-gold-500), transparent 45%), radial-gradient(ellipse at 90% 20%, var(--primary-500), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="container-content relative py-12 md:py-14">
        <AboutReveal>
          <ul className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-0">
            {aboutStats.map((stat, index) => (
              <li
                key={stat.label}
                className="relative min-w-0 px-2 text-center md:px-6 md:text-left"
              >
                {index > 0 ? (
                  <span
                    className="absolute left-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-accent-gold-400/35 md:block"
                    aria-hidden
                  />
                ) : null}
                <p className="font-heading text-[clamp(1.65rem,3.2vw,2.25rem)] font-bold tracking-tight text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-small leading-snug text-primary-100/75">
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

import { AboutReveal } from "@/components/about/AboutReveal";

export function AboutBeliefBand() {
  return (
    <section
      className="relative overflow-hidden bg-primary-900"
      aria-labelledby="belief-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-1/2 size-[28rem] -translate-y-1/2 rounded-full bg-primary-600/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 size-64 rounded-full bg-accent-gold-500/15 blur-3xl"
        aria-hidden
      />

      <div className="container-content relative py-16 md:py-20 lg:py-24">
        <AboutReveal className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase tracking-[0.2em] text-accent-gold-300">
            Our promise
          </p>
          <h2
            id="belief-heading"
            className="mt-4 font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-white"
          >
            Our best, every day.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-primary-100/90">
            Advanced techniques, expert judgment, and a patient-first ethic —
            so every result feels natural, and every visit feels considered.
          </p>
        </AboutReveal>
      </div>
    </section>
  );
}

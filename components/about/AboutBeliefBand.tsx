import { AboutReveal } from "@/components/about/AboutReveal";

export function AboutBeliefBand() {
  return (
    <section
      className="relative overflow-hidden bg-primary-950"
      aria-labelledby="belief-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 top-1/2 size-[32rem] -translate-y-1/2 rounded-full bg-primary-600/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-accent-gold-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 0.7px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />

      <div className="container-content relative py-20 md:py-24 lg:py-28">
        <AboutReveal className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase tracking-[0.22em] text-accent-gold-300">
            Our promise
          </p>
          <div
            className="mx-auto mt-5 h-[2px] w-10 bg-accent-gold-400/80"
            aria-hidden
          />
          <h2
            id="belief-heading"
            className="mt-6 font-heading text-[clamp(1.85rem,4.2vw,3rem)] font-bold tracking-tight text-white"
          >
            Our best, every day.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-primary-100/85">
            Advanced techniques, expert judgment, and a patient-first ethic —
            so every result feels natural, and every visit feels considered.
          </p>
        </AboutReveal>
      </div>
    </section>
  );
}

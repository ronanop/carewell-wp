import { AnimatedStat } from "@/components/home/AnimatedStat";
import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import type { DoctorAchievement } from "@/types/doctor";

interface DoctorStatsProps {
  achievements: DoctorAchievement[];
}

export function DoctorStats({ achievements }: DoctorStatsProps) {
  return (
    <section
      className="relative overflow-hidden bg-primary-900"
      aria-labelledby="achievements-heading"
    >
      <div
        className="pointer-events-none absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-primary-600/25 blur-3xl"
        aria-hidden
      />
      <div className="container-content relative section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-300">
            Impact
          </p>
          <h2
            id="achievements-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-white"
          >
            Achievements
          </h2>
        </DoctorReveal>

        <ul className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
          {achievements.map((item, index) => (
            <DoctorReveal key={item.label} delay={index * 0.05}>
              <li className="text-center">
                <p className="font-heading text-[1.75rem] font-bold tracking-tight text-white md:text-[2.15rem]">
                  <AnimatedStat value={item.value} />
                </p>
                <p className="mt-2 text-small text-primary-100/75">
                  {item.label}
                </p>
              </li>
            </DoctorReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

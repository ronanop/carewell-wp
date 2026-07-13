import { AnimatedStat } from "@/components/home/AnimatedStat";
import type { DoctorAchievement } from "@/types/doctor";

interface DoctorStatsProps {
  achievements: DoctorAchievement[];
}

export function DoctorStats({ achievements }: DoctorStatsProps) {
  return (
    <section
      className="border-y border-border bg-muted/40"
      aria-labelledby="achievements-heading"
    >
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Impact</p>
          <h2
            id="achievements-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Achievements
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {achievements.map((item) => (
            <li key={item.label} className="text-center">
              <p className="font-heading text-[1.75rem] font-bold tracking-tight text-[#0A2540] md:text-[2rem]">
                <AnimatedStat value={item.value} />
              </p>
              <p className="mt-2 text-small text-muted-foreground">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

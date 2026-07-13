import {
  HeartHandshake,
  MessageCircle,
  Monitor,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type { DoctorWhyChooseItem } from "@/types/doctor";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  UserRound,
  Monitor,
  MessageCircle,
  ShieldCheck,
  HeartHandshake,
};

interface WhyPatientsChooseProps {
  items: DoctorWhyChooseItem[];
  doctorName: string;
}

export function WhyPatientsChoose({
  items,
  doctorName,
}: WhyPatientsChooseProps) {
  return (
    <section className="bg-muted/20" aria-labelledby="why-choose-doctor-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Trust</p>
          <h2
            id="why-choose-doctor-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Why Patients Choose {doctorName}
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <li
                key={item.title}
                className={cn(
                  "rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                  "sm:p-7"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 font-heading text-h4 font-semibold text-[#0A2540]">
                  {item.title}
                </h3>
                <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

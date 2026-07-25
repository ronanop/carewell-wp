import {
  HeartHandshake,
  MessageCircle,
  Monitor,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import type { DoctorWhyChooseItem } from "@/types/doctor";

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
    <section
      className="bg-muted/30"
      aria-labelledby="why-choose-doctor-heading"
    >
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Trust
          </p>
          <h2
            id="why-choose-doctor-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Why Patients Choose {doctorName}
          </h2>
        </DoctorReveal>

        <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <DoctorReveal key={item.title} delay={index * 0.04}>
                <li className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-h4 font-semibold text-[#0A2540]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              </DoctorReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import {
  Activity,
  Clock,
  Droplets,
  Heart,
  Layers,
  Monitor,
  PenTool,
  ScanFace,
  Scissors,
  Shield,
  Sparkles,
  Sun,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DoctorExpertiseItem } from "@/types/doctor";

const iconMap: Record<string, LucideIcon> = {
  Scissors,
  Droplets,
  User,
  PenTool,
  Sparkles,
  Heart,
  ScanFace,
  Activity,
  Shield,
  Sun,
  Layers,
  Clock,
  Monitor,
};

interface ExpertiseGridProps {
  items: DoctorExpertiseItem[];
}

export function ExpertiseGrid({ items }: ExpertiseGridProps) {
  return (
    <section className="bg-muted/30" aria-labelledby="expertise-heading">
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Clinical Focus
          </p>
          <h2
            id="expertise-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Areas of Expertise
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            A broad cosmetic and aesthetic practice — from hair restoration to
            facial rejuvenation and body contouring — delivered with careful
            planning.
          </p>
        </DoctorReveal>

        <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <DoctorReveal key={item.slug} delay={index * 0.04}>
                <li className="flex h-full flex-col">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-heading text-h4 font-semibold text-[#0A2540]">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-small leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-lg border-primary/25 text-primary-800 hover:bg-primary-50 no-underline hover:no-underline",
                      )}
                    >
                      Learn More
                    </Link>
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

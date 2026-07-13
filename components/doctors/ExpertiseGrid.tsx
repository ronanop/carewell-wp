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
    <section className="bg-muted/20" aria-labelledby="expertise-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Clinical Focus</p>
          <h2
            id="expertise-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Areas of Expertise
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            A broad cosmetic and aesthetic practice — from hair restoration to
            facial rejuvenation and body contouring — delivered with careful
            planning.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <li
                key={item.slug}
                className={cn(
                  "flex flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                  "sm:p-7"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
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
                      buttonVariants({ variant: "secondary", size: "sm" }),
                      "rounded-lg border-[#0A2540]/20 text-[#0A2540] no-underline hover:no-underline"
                    )}
                  >
                    Learn More
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

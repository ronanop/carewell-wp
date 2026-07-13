import Link from "next/link";
import { Calendar, Search, Sparkles, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Search,
    title: "Step 1: Doctor Consultation",
    description:
      "Personal evaluation to understand your concern and goals. No sales team. Direct doctor interaction.",
  },
  {
    icon: UserRound,
    title: "Step 2: Medical Assessment",
    description:
      "Detailed scalp, skin, or body analysis using medical protocols and experience.",
  },
  {
    icon: Calendar,
    title: "Step 3: Personalised Treatment Plan",
    description:
      "Only treatments you medically need. Clear explanation of procedure, recovery, and cost.",
  },
  {
    icon: Sparkles,
    title: "Step 4: Safe Procedure & Follow-up",
    description:
      "Advanced technology, strict hygiene, and proper post-treatment care.",
  },
];

export function TreatmentJourney() {
  return (
    <section className="bg-background">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-slate-400">
            Fast, Safe &amp; Doctor-Led Solutions
          </p>
          <h2 className="mt-3 font-heading text-h2 font-bold text-[#0A2540]">
            Your Treatment Journey at Care Well Medical Centre
          </h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            A clear, doctor-led process focused on safety, results, and
            personalised care.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary-50 text-[#0A2540]">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-[1.0625rem] font-semibold leading-snug text-[#0A2540]">
                  {step.title}
                </h3>
                <p className="mt-2 text-small text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 text-center">
          <p className="text-body text-muted-foreground">
            Not sure which treatment is right for you? Talk to our doctor.
          </p>
          <div className="mt-5">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline"
              )}
            >
              Book Doctor Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

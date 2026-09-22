import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AboutReveal } from "@/components/about/AboutReveal";
import { doctorSpecialties } from "@/components/about/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin-portrait.png";

export function AboutDoctor() {
  return (
    <section
      className="relative overflow-hidden bg-surface-cream"
      aria-labelledby="doctor-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 85% 30%, var(--primary-100), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="container-content section-padding">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-20">
          <AboutReveal from="left">
            <div className="relative mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-none">
              <div
                className="absolute -inset-4 rounded-[2rem] border border-accent-gold-300/60"
                aria-hidden
              />
              <div
                className="absolute -bottom-3 -right-3 size-24 rounded-full bg-primary-200/40 blur-2xl"
                aria-hidden
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-primary-100 shadow-[0_28px_50px_-30px_rgba(7,47,47,0.5)]">
                <Image
                  src={DOCTOR_IMAGE_SRC}
                  alt="Dr. Sandeep Bhasin, Medical Director at Care Well Medical Centre"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 22rem, 28rem"
                />
              </div>
              <div className="mt-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-8 bg-accent-gold-400" aria-hidden />
                <p className="text-small text-muted-foreground">
                  Medical Director · Cosmetic &amp; Aesthetic Surgery
                </p>
              </div>
            </div>
          </AboutReveal>

          <AboutReveal from="right" delay={0.06} className="min-w-0">
            <p className="text-label uppercase tracking-[0.18em] text-accent-gold-600">
              Medical Director
            </p>
            <h2
              id="doctor-heading"
              className="mt-4 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
            >
              Meet Dr. Sandeep Bhasin
            </h2>
            <p className="mt-3 text-body font-medium text-primary-800">
              Senior cosmetic and aesthetic surgeon at Care Well Medical Centre,
              Delhi
            </p>

            <p className="mt-7 max-w-xl text-body leading-relaxed text-muted-foreground">
              With over two decades in aesthetic medicine and reconstructive
              surgery, Dr. Bhasin is known for minimally invasive techniques and
              natural-looking outcomes — guiding thousands of patients with
              clarity and care.
            </p>

            <ul className="mt-8 space-y-4">
              {doctorSpecialties.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-700 text-white">
                    <Check
                      className="size-3.5"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </span>
                  <span className="text-body leading-snug text-[#0A2540]/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                href="/about/dr-sandeep-bhasin"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-primary text-primary-foreground hover:bg-primary-800 no-underline hover:no-underline",
                )}
              >
                View full profile
              </Link>
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  );
}

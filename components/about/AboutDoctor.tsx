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
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-primary-100/40 to-transparent lg:block"
        aria-hidden
      />

      <div className="container-content section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-16">
          <AboutReveal from="left">
            <div className="relative mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-none">
              <div className="absolute -inset-3 rounded-[1.75rem] border border-accent-gold-300/50" aria-hidden />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-primary-100">
                <Image
                  src={DOCTOR_IMAGE_SRC}
                  alt="Dr. Sandeep Bhasin, Medical Director at Care Well Medical Centre"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 22rem, 28rem"
                />
              </div>
              <p className="mt-4 text-center text-small text-muted-foreground lg:text-left">
                Medical Director · Cosmetic &amp; Aesthetic Surgery
              </p>
            </div>
          </AboutReveal>

          <AboutReveal from="right" delay={0.06} className="min-w-0">
            <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
              Medical Director
            </p>
            <h2
              id="doctor-heading"
              className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
            >
              Meet Dr. Sandeep Bhasin
            </h2>
            <p className="mt-2 text-body font-medium text-[#0A2540]/80">
              Senior cosmetic and aesthetic surgeon at Care Well Medical Centre,
              Delhi
            </p>

            <p className="mt-6 max-w-xl text-body leading-relaxed text-muted-foreground">
              With over two decades in aesthetic medicine and reconstructive
              surgery, Dr. Bhasin is known for minimally invasive techniques and
              natural-looking outcomes — guiding thousands of patients with
              clarity and care.
            </p>

            <ul className="mt-7 space-y-3.5">
              {doctorSpecialties.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
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

            <div className="mt-9">
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

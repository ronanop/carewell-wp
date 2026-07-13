import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { doctorSpecialties } from "@/components/about/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin.jpg";

function hasDoctorPortrait() {
  return existsSync(
    path.join(process.cwd(), "public", "images", "dr-sandeep-bhasin.jpg")
  );
}

function DoctorPortrait() {
  const showImage = hasDoctorPortrait();

  return (
    <div className="mx-auto w-full max-w-[18rem] lg:mx-0 lg:max-w-[20rem]">
      <div
        className={cn(
          "relative aspect-[3/4] max-h-[26rem] w-full overflow-hidden rounded-2xl",
          "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
        )}
      >
        {showImage ? (
          <Image
            src={DOCTOR_IMAGE_SRC}
            alt="Dr. Sandeep Bhasin, Medical Director at Care Well Medical Centre"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 18rem, 20rem"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-br from-[#0A2540] via-[#123A5C] to-[#1B6B8A] p-6 text-center"
            role="img"
            aria-label="Dr. Sandeep Bhasin"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 30% 20%, rgb(125 196 220 / 0.45), transparent 55%), radial-gradient(ellipse at 80% 70%, rgb(10 37 64 / 0.5), transparent 50%)",
              }}
            />
            <div className="relative mb-auto mt-8 flex size-24 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
              <span className="font-heading text-2xl font-semibold tracking-tight text-white">
                SB
              </span>
            </div>
            <p className="relative font-heading text-base font-semibold text-white">
              Dr. Sandeep Bhasin
            </p>
            <p className="relative mt-1 text-sm text-white/75">
              Medical Director
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AboutDoctor() {
  return (
    <section className="bg-muted/20" aria-labelledby="doctor-heading">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-14">
          <DoctorPortrait />

          <div className="min-w-0">
            <p className="text-label uppercase text-[#3B82F6]">
              Medical Director
            </p>
            <h2
              id="doctor-heading"
              className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
            >
              Meet Dr. Sandeep Bhasin
            </h2>
            <p className="mt-2 text-small font-medium text-[#0A2540]/75">
              Senior cosmetic and aesthetic surgeon at Care Well Medical Centre
              in Delhi
            </p>

            <p className="mt-5 max-w-xl text-body leading-relaxed text-muted-foreground">
              Dr. Sandeep Bhasin is a renowned cosmetic and plastic surgeon with
              over two decades of experience in aesthetic medicine and
              reconstructive surgery. His expertise in minimally invasive and
              advanced cosmetic procedures has transformed the lives of thousands
              of patients.
            </p>

            <ul className="mt-6 space-y-3">
              {doctorSpecialties.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/12">
                    <Check
                      className="size-3.5 text-[#3B82F6]"
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

            <div className="mt-8">
              <Link
                href="/about/dr-sandeep-bhasin"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline"
                )}
              >
                Check Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

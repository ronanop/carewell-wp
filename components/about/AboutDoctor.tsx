import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { doctorSpecialties } from "@/components/about/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin.jpg";

function DoctorPortrait() {
  return (
    <div className="mx-auto w-full max-w-[18rem] lg:mx-0 lg:max-w-[20rem]">
      <div
        className={cn(
          "relative aspect-[3/4] max-h-[26rem] w-full overflow-hidden rounded-2xl",
          "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
        )}
      >
        <Image
          src={DOCTOR_IMAGE_SRC}
          alt="Dr. Sandeep Bhasin, Medical Director at Care Well Medical Centre"
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 18rem, 20rem"
        />
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

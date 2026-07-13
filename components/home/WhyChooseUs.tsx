import {
  MessageCircle,
  Monitor,
  Share2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";

import { cn } from "@/lib/utils";

const DOCTOR_IMAGE_SRC = "/images/dr-sandeep-bhasin.jpg";

const features: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Expert Care",
    description:
      "All major treatments personally supervised by Dr. Sandeep Bhasin, senior cosmetic surgeon in Delhi.",
    icon: UserRound,
  },
  {
    title: "Patient-Focused Approach",
    description:
      "Seamless care with customized treatment plans and dedicated support at every step.",
    icon: MessageCircle,
  },
  {
    title: "Latest Technology",
    description:
      "Advanced FUE systems, medical-grade lasers, and modern surgical infrastructure in South Delhi.",
    icon: Monitor,
  },
  {
    title: "Efficient & Professional",
    description:
      "Smooth appointment scheduling, timely follow-ups, and a stress-free experience.",
    icon: Share2,
  },
];

function hasDoctorPortrait() {
  return existsSync(
    path.join(process.cwd(), "public", "images", "dr-sandeep-bhasin.jpg")
  );
}

function DoctorPortrait() {
  const showImage = hasDoctorPortrait();

  return (
    <div className="mx-auto w-full max-w-[18rem] lg:max-w-[20rem]">
      <div
        className={cn(
          "relative aspect-[3/4] max-h-[26rem] w-full overflow-hidden rounded-2xl",
          "border border-border/60 bg-surface shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
        )}
      >
        {showImage ? (
          <Image
            src={DOCTOR_IMAGE_SRC}
            alt="Dr. Sandeep Bhasin"
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
              Cosmetic &amp; Aesthetic Surgeon
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="font-heading text-body font-bold text-[#0A2540]">
          Dr. Sandeep Bhasin
        </p>
        <p className="mt-1 text-small text-muted-foreground">
          Senior Cosmetic &amp; Aesthetic Surgeon
        </p>
        <p className="mt-0.5 text-small text-muted-foreground">
          Care Well Medical Centre, Delhi
        </p>
      </div>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="bg-muted/20">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">We Stand Out</p>
          <h2 className="mt-3 font-heading text-h2 font-bold text-[#0A2540]">
            Why Choose Care Well Medical Centre?
          </h2>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] lg:gap-12 xl:gap-14">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.title}
                  className={cn(
                    "rounded-2xl border border-border/60 bg-white p-5 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
                    "sm:p-6"
                  )}
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-heading text-h4 font-semibold text-[#0A2540]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-small leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center lg:pt-1">
            <DoctorPortrait />
          </div>
        </div>

        <div className="mt-14 border-t border-border/70 pt-12 text-center">
          <h3 className="font-heading text-h3 font-bold text-[#0A2540]">
            Serving South Delhi &amp; Delhi NCR with Doctor-Led Cosmetic Care
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-body leading-relaxed text-muted-foreground">
            Care Well Medical Centre is located at House No. 1, NRI Complex,
            Chittaranjan Park (CR Park), New Delhi 110019, and serves patients
            from Greater Kailash, Kalkaji, Nehru Place, Alaknanda, Saket, and
            across Delhi NCR. Under the supervision of Dr. Sandeep Bhasin,
            senior cosmetic and hair transplant surgeon, we provide advanced
            cosmetic surgery, hair restoration, and skin treatments in a safe
            medical setting.
          </p>
        </div>
      </div>
    </section>
  );
}

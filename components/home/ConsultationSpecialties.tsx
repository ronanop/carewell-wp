import Link from "next/link";

import { cn } from "@/lib/utils";

const specialties = [
  { code: "HAI", name: "Hair Transplant" },
  { code: "LAS", name: "Laser Hair Removal" },
  { code: "ACN", name: "Acne & Scar Treatment" },
  { code: "CRY", name: "Cryolipolysis (Fat Freezing)" },
  { code: "ANT", name: "Anti-Aging Treatments" },
  { code: "BOT", name: "Botox" },
  { code: "RHI", name: "Rhinoplasty" },
  { code: "BEA", name: "Beard Transplant" },
  { code: "HYD", name: "Hydrafacial" },
  { code: "LIP", name: "Liposuction" },
  { code: "BRE", name: "Breast Augmentation" },
  { code: "HYM", name: "Hymenoplasty" },
] as const;

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ConsultationSpecialties() {
  return (
    <section className="bg-muted/30">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">
            Consultation &amp; Expertise
          </p>
          <h2 className="mt-3 font-heading text-h2 font-bold text-[#0A2540]">
            Our Aesthetic Consultation Specialties
          </h2>
          <p className="mx-auto mt-4 max-w-[42rem] text-body leading-relaxed text-muted-foreground">
            At Care Well Medical Centre, every treatment begins with a
            personalised, doctor-led consultation. We focus on understanding
            your concern first, then recommending the safest and most effective
            option.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {specialties.map((specialty) => (
            <li key={specialty.code}>
              <Link
                href={`/services/${slugify(specialty.name)}`}
                className={cn(
                  "flex h-full flex-col items-center justify-center rounded-xl bg-secondary px-3 py-6 text-center no-underline",
                  "border border-transparent transition-all duration-300",
                  "hover:-translate-y-0.5 hover:border-border hover:shadow-[0_8px_24px_rgb(10_37_64/0.06)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <span className="text-label font-medium uppercase tracking-[0.12em] text-[#7DC4DC]">
                  {specialty.code}
                </span>
                <span className="mt-2 font-heading text-small font-bold leading-snug text-[#0A2540] sm:text-body">
                  {specialty.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

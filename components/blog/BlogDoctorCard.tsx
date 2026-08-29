import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { drSandeepBhasin } from "@/components/doctors/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PHOTO_CANDIDATES = [
  "/images/dr-sandeep-bhasin-portrait.png",
  "/images/dr-sandeep-bhasin-cutout.png",
  "/images/dr-sandeep-bhasin.jpg",
];

/**
 * Compact surgeon card shown at the end of every blog article.
 */
export function BlogDoctorCard({
  className,
  authorName,
  authorRole,
}: {
  className?: string;
  authorName?: string | null;
  authorRole?: string | null;
}) {
  const doctor = drSandeepBhasin;
  const name = authorName?.trim() || doctor.name;
  const role =
    authorRole?.trim() || doctor.title || "Senior Cosmetic Surgeon";
  const photoSrc = PHOTO_CANDIDATES[0];
  const badges = doctor.trustBadges.slice(0, 3);
  const bio =
    doctor.heroSummary ||
    "Doctor-led cosmetic and hair restoration care in South Delhi — focused on natural results and honest guidance.";

  return (
    <aside
      aria-labelledby="blog-doctor-heading"
      className={cn(
        "mt-12 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-surface via-surface to-surface-editorial",
        className,
      )}
    >
      <div className="grid gap-0 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
        <div className="relative min-h-[220px] bg-gradient-to-br from-secondary to-muted sm:min-h-full">
          <Image
            src={photoSrc}
            alt={
              doctor.portrait?.altText ||
              `${name}, Founder and Senior Cosmetic Surgeon at Care Well Medical Centre`
            }
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 200px"
          />
        </div>

        <div className="flex flex-col justify-center p-5 sm:p-7">
          <p className="text-label uppercase text-accent">Written & reviewed by</p>
          <h2
            id="blog-doctor-heading"
            className="mt-2 font-heading text-xl font-semibold tracking-tight text-[#0A2540] sm:text-2xl"
          >
            {name}
          </h2>
          <p className="mt-1 text-small font-medium text-primary">{role}</p>

          <p className="mt-4 text-[1rem] font-medium leading-relaxed text-slate-700 sm:text-[1.125rem]">
            {bio}
          </p>

          {badges.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-[#0A2540]"
                >
                  <BadgeCheck className="size-3.5 text-primary" aria-hidden />
                  {badge}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about/dr-sandeep-bhasin/"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-10 gap-2 no-underline hover:no-underline",
              )}
            >
              View doctor profile
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/contact/"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 no-underline hover:no-underline",
              )}
            >
              Book consultation
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

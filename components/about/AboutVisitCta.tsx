import Link from "next/link";

import { clinicDetails } from "@/components/about/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AboutVisitCta() {
  return (
    <section className="bg-primary" aria-labelledby="visit-cta-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="visit-cta-heading"
            className="font-heading text-h2 text-primary-foreground"
          >
            Visit Us &amp; Begin Your Transformation
          </h2>
          <p className="mt-4 text-body-lg leading-relaxed text-primary-foreground/80">
            If you are looking for the best cosmetic and aesthetic treatments in
            Delhi, Care Well Medical Centre is your trusted partner in
            transformation. Whether you need skin rejuvenation, hair restoration,
            body contouring, or plastic surgery, we are here to help.
          </p>
          <p className="mt-4 text-body text-primary-foreground/75">
            Let our experts guide you on your journey to a more confident and
            beautiful you.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-surface text-primary hover:bg-surface/90 no-underline hover:no-underline"
              )}
            >
              Book Consultation
            </Link>
            <a
              href={clinicDetails.phoneHref}
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 no-underline hover:no-underline"
              )}
            >
              {clinicDetails.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

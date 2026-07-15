/**
 * Thank-you page view — post-lead confirmation (ADR-015).
 */

import Link from "next/link";

import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { buttonVariants } from "@/components/ui/button";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import { cn } from "@/lib/utils";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

export function ThankYouPageView({ mode, config = null }: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <section
          className="bg-background"
          aria-labelledby="thank-you-heading"
        >
          <div className="container-content section-padding">
            {enabled("thank-you.message") ? (
              <StaticSectionFrame
                id="thank-you.message"
                type="hero"
                mode={mode}
              >
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-label uppercase text-primary">
                    Request received
                  </p>
                  <h1
                    id="thank-you-heading"
                    className="mt-4 font-heading text-h1 font-bold tracking-tight text-[#0A2540]"
                  >
                    Thank you
                  </h1>
                  <p className="mt-5 text-body-lg leading-relaxed text-muted-foreground">
                    We have received your consultation request. Our team will
                    respond within two hours during clinic hours.
                  </p>
                </div>
              </StaticSectionFrame>
            ) : null}

            {enabled("thank-you.cta") ? (
              <StaticSectionFrame id="thank-you.cta" type="cta" mode={mode}>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline",
                    )}
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "rounded-lg border-[#0A2540]/25 text-[#0A2540] hover:bg-[#0A2540]/5 no-underline hover:no-underline",
                    )}
                  >
                    Contact Clinic
                  </Link>
                </div>
              </StaticSectionFrame>
            ) : null}
          </div>
        </section>
      </main>
      <FooterPlaceholder />
    </>
  );
}

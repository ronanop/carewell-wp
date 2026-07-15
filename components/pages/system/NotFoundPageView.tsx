/**
 * 404 page view — shared by app/not-found and Static Studio (ADR-015).
 */

import Link from "next/link";

import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { buttonVariants } from "@/components/ui/button";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import { cn } from "@/lib/utils";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

const helpfulLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Meet Dr. Bhasin", href: "/about/dr-sandeep-bhasin" },
] as const;

export function NotFoundPageView({ mode, config = null }: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);

  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        <section className="bg-background" aria-labelledby="not-found-heading">
          <div className="container-content section-padding">
            {enabled("not-found.message") ? (
              <StaticSectionFrame
                id="not-found.message"
                type="hero"
                mode={mode}
              >
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-label uppercase text-[#3B82F6]">Error 404</p>
                  <p
                    className="mt-4 font-heading text-[4.5rem] font-bold leading-none tracking-tight text-[#0A2540]/15 md:text-[6rem]"
                    aria-hidden
                  >
                    404
                  </p>
                  <h1
                    id="not-found-heading"
                    className="mt-4 font-heading text-h1 font-bold tracking-tight text-[#0A2540]"
                  >
                    Page not found
                  </h1>
                  <p className="mt-5 text-body-lg leading-relaxed text-muted-foreground">
                    The page or link you followed does not exist on Care Well
                    Medical Centre. It may have been moved, renamed, or never
                    published.
                  </p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                </div>
              </StaticSectionFrame>
            ) : null}

            {enabled("not-found.links") ? (
              <StaticSectionFrame id="not-found.links" type="cta" mode={mode}>
                <nav
                  aria-label="Helpful links"
                  className="mx-auto mt-14 max-w-2xl border-t border-border/60 pt-10"
                >
                  <p className="text-center text-small font-medium text-[#0A2540]">
                    Or try one of these pages
                  </p>
                  <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    {helpfulLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-body text-primary no-underline transition-colors hover:text-primary/80 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </StaticSectionFrame>
            ) : null}
          </div>
        </section>
      </main>
      <FooterPlaceholder />
    </>
  );
}

/**
 * Terms of use view — shared public + Studio (ADR-015).
 */

import Link from "next/link";

import { FooterPlaceholder } from "@/components/layout/FooterPlaceholder";
import { NavbarPlaceholder } from "@/components/layout/NavbarPlaceholder";
import { StaticSectionFrame } from "@/components/pages/StaticSectionFrame";
import { isSectionEnabled } from "@/lib/experience/static-pages/applyOverrides";
import { buildUriBreadcrumbs } from "@/lib/wordpress/routeUtils";
import type { StaticPageViewProps } from "@/types/static-page-descriptor";

export function TermsPageView({ mode, config = null }: StaticPageViewProps) {
  const enabled = (sectionId: string, fallback = true) =>
    isSectionEnabled(config, sectionId, fallback);
  const breadcrumbs = buildUriBreadcrumbs("/terms/");

  return (
    <>
      <NavbarPlaceholder />
      <main className="flex-1">
        {enabled("terms.content") ? (
          <StaticSectionFrame id="terms.content" type="content" mode={mode}>
            <section
              className="bg-background"
              aria-labelledby="terms-heading"
            >
              <div className="container-content section-padding">
                <nav
                  aria-label="Breadcrumb"
                  className="text-small text-muted-foreground"
                >
                  <ol className="flex flex-wrap items-center gap-2">
                    {breadcrumbs.map((item, index) => (
                      <li key={item.href} className="flex items-center gap-2">
                        {index > 0 ? <span aria-hidden>/</span> : null}
                        {item.current ? (
                          <span className="text-foreground">{item.label}</span>
                        ) : (
                          <Link
                            href={item.href}
                            className="hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
                <h1
                  id="terms-heading"
                  className="mt-6 font-heading text-h1 font-bold tracking-tight text-[#0A2540]"
                >
                  Terms of Use
                </h1>
                <div className="prose prose-neutral mt-8 max-w-3xl text-body leading-relaxed text-muted-foreground">
                  <p>
                    By using the Care Well Medical Centre website you agree to
                    these terms. Content is provided for general information and
                    does not create a doctor–patient relationship.
                  </p>
                  <p>
                    You must not misuse this site, attempt unauthorized access,
                    or use content for commercial redistribution without written
                    permission.
                  </p>
                  <p>
                    For questions about these terms,{" "}
                    <Link href="/contact" className="text-primary">
                      contact the clinic
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </section>
          </StaticSectionFrame>
        ) : null}
      </main>
      <FooterPlaceholder />
    </>
  );
}

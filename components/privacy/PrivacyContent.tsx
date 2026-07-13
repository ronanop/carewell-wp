import {
  privacyContact,
  privacyDisclaimer,
  privacyIntro,
  privacyLastUpdated,
  privacySections,
} from "@/components/privacy/content";

export function PrivacyContent() {
  return (
    <article className="bg-background">
      <div className="container-content section-padding">
        <header className="mx-auto max-w-3xl">
          <p className="text-label uppercase text-[#3B82F6]">Legal</p>
          <h1 className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]">
            Privacy Policy
          </h1>
          <p className="mt-5 text-body leading-relaxed text-muted-foreground">
            {privacyIntro}
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl space-y-10">
          {privacySections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2
                id={`${section.id}-heading`}
                className="font-heading text-h3 font-semibold text-[#0A2540]"
              >
                <span className="text-[#3B82F6]">{section.number}. </span>
                {section.title}
              </h2>

              <div className="mt-4 space-y-4 text-body leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}

                {"bullets" in section && section.bullets ? (
                  <ul className="space-y-3 pl-1">
                    {section.bullets.map((bullet) => (
                      <li key={bullet.title} className="flex gap-3">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#3B82F6]"
                          aria-hidden
                        />
                        <span>
                          <strong className="font-semibold text-[#0A2540]">
                            {bullet.title}:
                          </strong>{" "}
                          {bullet.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {"closing" in section && section.closing ? (
                  <p>{section.closing}</p>
                ) : null}
              </div>
            </section>
          ))}

          <section id="contact-us" aria-labelledby="contact-us-heading">
            <h2
              id="contact-us-heading"
              className="font-heading text-h3 font-semibold text-[#0A2540]"
            >
              <span className="text-[#3B82F6]">11. </span>
              Contact Us
            </h2>
            <div className="mt-4 space-y-3 text-body leading-relaxed text-muted-foreground">
              <p>
                If you have any questions about this Privacy Policy, the
                practices of this Website, or your dealings with this Website,
                please contact us at:
              </p>
              <address className="not-italic rounded-2xl border border-border/60 bg-muted/30 p-5 sm:p-6">
                <p className="font-heading text-body font-semibold text-[#0A2540]">
                  {privacyContact.name}
                </p>
                <p className="mt-2">{privacyContact.address}</p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href={privacyContact.emailHref}
                    className="text-primary no-underline transition-colors hover:underline"
                  >
                    {privacyContact.email}
                  </a>
                </p>
              </address>
            </div>
          </section>

          <footer className="space-y-4 border-t border-border/60 pt-8">
            <p className="text-small text-muted-foreground">
              This Privacy Policy was last updated on{" "}
              <time dateTime="2025-03-01">{privacyLastUpdated}</time>.
            </p>
            <p className="text-small leading-relaxed text-muted-foreground">
              <span className="font-medium text-[#0A2540]">Note: </span>
              {privacyDisclaimer}
            </p>
          </footer>
        </div>
      </div>
    </article>
  );
}

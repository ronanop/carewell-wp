import { Clock, MapPin, Phone } from "lucide-react";

import { AboutReveal } from "@/components/about/AboutReveal";
import { clinicDetails } from "@/components/about/content";
import { CLINIC_GOOGLE_MAPS_EMBED_URL } from "@/lib/maps/googleMapsEmbed";

export function AboutClinic() {
  return (
    <section
      className="relative overflow-hidden bg-surface-cream"
      aria-labelledby="clinic-heading"
    >
      <div className="container-content section-padding">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.18em] text-accent-gold-600">
            Location
          </p>
          <h2
            id="clinic-heading"
            className="mt-4 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Visit our clinic
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            In the heart of South Delhi — Chittaranjan Park — easily reached by
            major routes across the city.
          </p>
        </AboutReveal>

        <div className="mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-[1.5rem] ring-1 ring-border/60 lg:grid-cols-2">
          <AboutReveal from="left">
            <div className="flex h-full flex-col justify-center space-y-8 bg-primary-900 p-8 text-white sm:p-10">
              <div>
                <p className="text-label uppercase tracking-[0.16em] text-accent-gold-300">
                  Care Well
                </p>
                <h3 className="mt-3 font-heading text-h3 font-semibold text-white">
                  {clinicDetails.name}
                </h3>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-gold-300">
                  <MapPin className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-small font-medium text-white">Address</p>
                  <p className="mt-1 text-body leading-relaxed text-primary-100/80">
                    {clinicDetails.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-gold-300">
                  <Phone className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-small font-medium text-white">Phone</p>
                  <a
                    href={clinicDetails.phoneHref}
                    className="mt-1 inline-block text-body text-accent-gold-200 no-underline transition-colors hover:text-accent-gold-100 hover:no-underline"
                  >
                    {clinicDetails.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-gold-300">
                  <Clock className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-small font-medium text-white">Timings</p>
                  <p className="mt-1 text-body leading-relaxed text-primary-100/80">
                    {clinicDetails.timings}
                  </p>
                </div>
              </div>
            </div>
          </AboutReveal>

          <AboutReveal from="right" delay={0.06}>
            <div className="min-h-[300px] bg-muted sm:min-h-[340px] aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-full">
              <iframe
                title="Care Well Medical Centre — Chittaranjan Park, New Delhi"
                src={CLINIC_GOOGLE_MAPS_EMBED_URL}
                className="h-full min-h-[300px] w-full border-0 sm:min-h-[340px]"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  );
}

import { Clock, MapPin, Phone } from "lucide-react";

import { AboutReveal } from "@/components/about/AboutReveal";
import { clinicDetails } from "@/components/about/content";

export function AboutClinic() {
  return (
    <section className="bg-background" aria-labelledby="clinic-heading">
      <div className="container-content section-padding">
        <AboutReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Location
          </p>
          <h2
            id="clinic-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Visit our clinic
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            In the heart of South Delhi — Chittaranjan Park — easily reached by
            major routes across the city.
          </p>
        </AboutReveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-10">
          <AboutReveal from="left">
            <div className="flex h-full flex-col justify-center space-y-7 rounded-2xl border border-border/60 bg-surface-cream p-7 sm:p-9">
              <h3 className="font-heading text-h3 font-semibold text-[#0A2540]">
                {clinicDetails.name}
              </h3>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <MapPin className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-small font-medium text-[#0A2540]">Address</p>
                  <p className="mt-1 text-body leading-relaxed text-muted-foreground">
                    {clinicDetails.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Phone className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-small font-medium text-[#0A2540]">Phone</p>
                  <a
                    href={clinicDetails.phoneHref}
                    className="mt-1 inline-block text-body text-primary-800 no-underline transition-colors hover:text-primary hover:no-underline"
                  >
                    {clinicDetails.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Clock className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-small font-medium text-[#0A2540]">Timings</p>
                  <p className="mt-1 text-body leading-relaxed text-muted-foreground">
                    {clinicDetails.timings}
                  </p>
                </div>
              </div>
            </div>
          </AboutReveal>

          <AboutReveal from="right" delay={0.06}>
            <div className="min-h-[280px] overflow-hidden rounded-2xl border border-border/60 bg-muted sm:min-h-[320px] aspect-[16/10] lg:aspect-auto lg:min-h-full">
              <iframe
                title="Care Well Medical Centre — Chittaranjan Park, New Delhi"
                src="https://maps.google.com/maps?q=House+No.+1,+NRI+Complex,+Chittaranjan+Park,+New+Delhi+110019&z=15&output=embed"
                className="h-full min-h-[280px] w-full border-0 sm:min-h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </AboutReveal>
        </div>
      </div>
    </section>
  );
}

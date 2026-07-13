import { Clock, MapPin, Phone } from "lucide-react";

import { clinicDetails } from "@/components/about/content";

export function AboutClinic() {
  return (
    <section className="bg-background" aria-labelledby="clinic-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Location</p>
          <h2
            id="clinic-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Visit Our Clinic
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Care Well Medical Centre is located in the heart of South Delhi. We
            are easily accessible and well-connected by all major transport
            routes.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-5 rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)] sm:p-8">
            <h3 className="font-heading text-h4 font-semibold text-[#0A2540]">
              {clinicDetails.name}
            </h3>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                <MapPin className="size-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-small font-medium text-[#0A2540]">Address</p>
                <p className="mt-1 text-body leading-relaxed text-muted-foreground">
                  {clinicDetails.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                <Phone className="size-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-small font-medium text-[#0A2540]">Phone</p>
                <a
                  href={clinicDetails.phoneHref}
                  className="mt-1 inline-block text-body text-[#0A2540] no-underline transition-colors hover:text-primary hover:no-underline"
                >
                  {clinicDetails.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
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

          {/*
            Placeholder Google Maps embed (no API key).
            Update q= / lat,lng when exact clinic coordinates are provided.
          */}
          <div className="min-h-[280px] overflow-hidden rounded-2xl border border-border/60 bg-[#E8EEF2] sm:min-h-[320px] aspect-[16/10] lg:aspect-auto lg:min-h-full">
            <iframe
              title="Care Well Medical Centre — Chittaranjan Park, New Delhi"
              src="https://maps.google.com/maps?q=House+No.+1,+NRI+Complex,+Chittaranjan+Park,+New+Delhi+110019&z=15&output=embed"
              className="h-full min-h-[280px] w-full border-0 sm:min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

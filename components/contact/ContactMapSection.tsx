/**
 * Map section with Google Maps embed placeholder (no API key).
 * Update q= / lat,lng when exact clinic coordinates are provided.
 */
export function ContactMapSection() {
  return (
    <section className="bg-background" aria-labelledby="find-us-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-primary">Location</p>
          <h2
            id="find-us-heading"
            className="mt-3 font-heading text-h2 font-semibold text-[#0A2540]"
          >
            Find Us on Google Maps
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Locate Care Well Medical Centre Clinic easily in Chittaranjan Park
            (C.R. Park), South Delhi. Use the map below for directions to our
            clinic.
          </p>
        </div>

        {/*
          Placeholder Google Maps embed (no API key).
          Update q= / lat,lng when exact clinic coordinates are provided.
        */}
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-border/60 bg-[#E8EEF2] shadow-[0_8px_30px_rgb(10_37_64/0.06)] aspect-[16/9] min-h-[280px] sm:min-h-[360px]">
          <iframe
            title="Care Well Medical Centre Clinic — Chittaranjan Park, New Delhi"
            src="https://maps.google.com/maps?q=Chittaranjan+Park,+New+Delhi,+Delhi&z=15&output=embed"
            className="h-full min-h-[280px] w-full border-0 sm:min-h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <p className="mt-5 text-center text-small font-medium text-[#0A2540]">
          Care Well Medical Centre Clinic
        </p>
      </div>
    </section>
  );
}

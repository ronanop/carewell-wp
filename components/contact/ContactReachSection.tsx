"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ConsultationLeadCapture } from "@/components/leads/ConsultationLeadCapture";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { resolveElementText } from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HEADING = "Reach Us";
const DEFAULT_BODY =
  "If you have any general or medical inquiries, feel free to contact us. Our doctors will respond as soon as possible.";

const CONTACT = {
  address:
    "House No. 1, NRI Complex, Chittaranjan Park (C.R.Park), NRI Colony, Mandakini Enclave Colony, Alaknanda, New Delhi, Delhi 110019",
  phoneDisplay: "+91 9667-977-499",
  phoneHref: "tel:+919667977499",
  email: "queries@carewellmedicalcentre.in",
  emailHref: "mailto:queries@carewellmedicalcentre.in",
  timings: "Monday – Saturday: 10:00 AM – 7:00 PM",
} as const;

const detailItemClass =
  "flex gap-3.5 rounded-xl border border-border/50 bg-white/80 p-4";

export function ContactReachSection() {
  const { config } = useStaticEditContext();

  const heading = resolveElementText(
    config,
    "contact.reach.heading",
    DEFAULT_HEADING,
  );
  const body = resolveElementText(config, "contact.reach.body", DEFAULT_BODY);

  return (
    <section className="bg-[#F5F6F8]" aria-label={heading}>
      <div className="container-content section-padding">
        <div
          className={cn(
            "rounded-2xl border border-border/60 bg-white/70 p-6 shadow-[0_8px_30px_rgb(10_37_64/0.06)]",
            "sm:p-8 lg:p-10",
          )}
        >
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Left — Reach us */}
            <div>
              <EditableElement
                id="contact.reach.heading"
                kind="heading"
                defaultValue={DEFAULT_HEADING}
                as="h2"
                className="font-heading text-h2 font-semibold text-[#0A2540]"
              >
                {({ value }) => value || heading}
              </EditableElement>
              <EditableElement
                id="contact.reach.body"
                kind="paragraph"
                defaultValue={DEFAULT_BODY}
                as="p"
                className="mt-3 text-body leading-relaxed text-muted-foreground"
              >
                {({ value }) => value || body}
              </EditableElement>

              <ul className="mt-8 space-y-4">
                <li className={detailItemClass}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-[#0A2540]">
                      Address
                    </p>
                    <p className="mt-1 text-body leading-relaxed text-muted-foreground">
                      {CONTACT.address}
                    </p>
                  </div>
                </li>

                <li className={detailItemClass}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-[#0A2540]">
                      Phone
                    </p>
                    <a
                      href={CONTACT.phoneHref}
                      className="mt-1 inline-block text-body text-primary no-underline transition-colors hover:text-primary/80 hover:underline"
                    >
                      {CONTACT.phoneDisplay}
                    </a>
                  </div>
                </li>

                <li className={detailItemClass}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-[#0A2540]">
                      Email
                    </p>
                    <a
                      href={CONTACT.emailHref}
                      className="mt-1 inline-block break-all text-body text-primary no-underline transition-colors hover:text-primary/80 hover:underline"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </li>

                <li className={detailItemClass}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-[#0A2540]">
                      Clinic Timings
                    </p>
                    <p className="mt-1 text-body text-muted-foreground">
                      {CONTACT.timings}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right — Lead capture */}
            <ConsultationLeadCapture
              variant="inline"
              page={{
                pageTitle: "Contact Care Well Medical Centre",
                pageSlug: "contact",
                pageUri: "/contact",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

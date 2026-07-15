"use client";

import Link from "next/link";

import { clinicDetails } from "@/components/about/content";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HEADING = "Visit Us & Begin Your Transformation";
const DEFAULT_BUTTON_LABEL = "Book Consultation";
const DEFAULT_BUTTON_HREF = "/contact";

export function AboutVisitCta() {
  const { config } = useStaticEditContext();

  const heading = resolveElementText(
    config,
    "about.cta.heading",
    DEFAULT_HEADING,
  );
  const buttonLabel = resolveElementField(
    config,
    "about.cta.button",
    "label",
    DEFAULT_BUTTON_LABEL,
  );
  const buttonHref = resolveElementField(
    config,
    "about.cta.button",
    "href",
    DEFAULT_BUTTON_HREF,
  );

  return (
    <section className="bg-primary" aria-label={heading}>
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <EditableElement
            id="about.cta.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="font-heading text-h2 text-primary-foreground"
          >
            {({ value }) => value || heading}
          </EditableElement>
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
            <EditableElement
              id="about.cta.button"
              kind="button"
              field="label"
              defaultValue={DEFAULT_BUTTON_LABEL}
              as="div"
            >
              {({ fields }) => (
                <Link
                  href={String(fields.href ?? buttonHref)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-surface text-primary hover:bg-surface/90 no-underline hover:no-underline",
                  )}
                >
                  {String(fields.label ?? buttonLabel)}
                </Link>
              )}
            </EditableElement>
            <a
              href={clinicDetails.phoneHref}
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 no-underline hover:no-underline",
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

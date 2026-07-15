"use client";

import Link from "next/link";

import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { buttonVariants } from "@/components/ui/button";
import {
  resolveElementField,
  resolveElementText,
} from "@/lib/experience/static-pages/elementOverrides";
import { cn } from "@/lib/utils";

const DEFAULT_HEADING = "Ready to begin your journey?";
const DEFAULT_SUBTITLE =
  "Book a consultation with our specialists. We will take time to understand your goals and recommend a personalised plan of care.";
const DEFAULT_BUTTON = "Book a consultation";

export function CTABanner() {
  const { config } = useStaticEditContext();
  const heading = resolveElementText(
    config,
    "home.cta.heading",
    DEFAULT_HEADING,
  );
  const subtitle = resolveElementText(
    config,
    "home.cta.subtitle",
    DEFAULT_SUBTITLE,
  );
  const label = resolveElementField(
    config,
    "home.cta.button",
    "label",
    DEFAULT_BUTTON,
  );
  const href = resolveElementField(config, "home.cta.button", "href", "/contact");

  return (
    <section className="bg-primary">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <EditableElement
            id="home.cta.heading"
            kind="heading"
            defaultValue={DEFAULT_HEADING}
            as="h2"
            className="font-heading text-h2 text-primary-foreground"
          >
            {({ value }) => value || heading}
          </EditableElement>
          <EditableElement
            id="home.cta.subtitle"
            kind="paragraph"
            defaultValue={DEFAULT_SUBTITLE}
            as="p"
            className="mt-4 text-body-lg text-primary-foreground/80"
          >
            {({ value }) => value || subtitle}
          </EditableElement>
          <div className="mt-8">
            <EditableElement
              id="home.cta.button"
              kind="button"
              field="label"
              defaultValue={DEFAULT_BUTTON}
              as="div"
              className="inline-block"
            >
              {({ fields }) => (
                <Link
                  href={String(fields.href ?? href)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-surface text-primary hover:bg-surface/90 no-underline hover:no-underline",
                  )}
                >
                  {String(fields.label ?? label)}
                </Link>
              )}
            </EditableElement>
          </div>
        </div>
      </div>
    </section>
  );
}

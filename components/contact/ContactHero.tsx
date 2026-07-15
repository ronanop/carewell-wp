"use client";

import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { resolveElementText } from "@/lib/experience/static-pages/elementOverrides";

const DEFAULT_LABEL = "Get in Touch";
const DEFAULT_HEADING = "Contact Us";
const DEFAULT_BODY_0 = "Get in Touch with Us";
const DEFAULT_BODY_1 =
  "Have a question or need assistance? The Care Well Medical Centre contact team is here to help! Whether you're looking for expert aesthetic treatments or general inquiries, feel free to reach out to us.";

export function ContactHero() {
  const { config } = useStaticEditContext();

  const label = resolveElementText(config, "contact.hero.label", DEFAULT_LABEL);
  const heading = resolveElementText(
    config,
    "contact.hero.heading",
    DEFAULT_HEADING,
  );
  const body0 = resolveElementText(
    config,
    "contact.hero.body.0",
    DEFAULT_BODY_0,
  );
  const body1 = resolveElementText(
    config,
    "contact.hero.body.1",
    DEFAULT_BODY_1,
  );

  return (
    <section className="bg-background">
      <div className="container-content section-padding pb-10 md:pb-12">
        <EditableElement
          id="contact.hero.label"
          kind="label"
          defaultValue={DEFAULT_LABEL}
          as="p"
          className="text-label uppercase text-primary"
        >
          {({ value }) => value || label}
        </EditableElement>
        <EditableElement
          id="contact.hero.heading"
          kind="heading"
          defaultValue={DEFAULT_HEADING}
          as="h1"
          className="mt-3 font-heading text-h1 font-bold tracking-tight text-[#0A2540]"
        >
          {({ value }) => value || heading}
        </EditableElement>
        <EditableElement
          id="contact.hero.body.0"
          kind="paragraph"
          defaultValue={DEFAULT_BODY_0}
          as="p"
          className="mt-4 max-w-2xl text-body-lg font-medium leading-relaxed text-[#0A2540]/85"
        >
          {({ value }) => value || body0}
        </EditableElement>
        <EditableElement
          id="contact.hero.body.1"
          kind="paragraph"
          defaultValue={DEFAULT_BODY_1}
          as="p"
          className="mt-4 max-w-2xl text-body leading-relaxed text-muted-foreground"
        >
          {({ value }) => value || body1}
        </EditableElement>
      </div>
    </section>
  );
}

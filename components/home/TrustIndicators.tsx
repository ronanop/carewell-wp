"use client";

import { AnimatedStat } from "@/components/home/AnimatedStat";
import { EditableElement } from "@/components/pages/EditableElement";
import { useStaticEditContext } from "@/components/pages/StaticEditProvider";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { resolveElementField } from "@/lib/experience/static-pages/elementOverrides";

const DEFAULT_INDICATORS = [
  { value: "20+", label: "Years Experience" },
  { value: "10,000+", label: "Procedures" },
  { value: "4.3★", label: "Patient Rating" },
  { value: "605+", label: "Positive Google Reviews" },
  { value: "Advanced", label: "Equipment" },
  { value: "Delhi NCR", label: "Trusted Clinic" },
] as const;

export function TrustIndicators() {
  const { config } = useStaticEditContext();

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="container-content py-10 md:py-16 lg:py-24">
        <StaggerReveal
          as="ul"
          stepMs={75}
          className="grid grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3 sm:gap-y-8 lg:grid-cols-6 lg:divide-x lg:divide-border lg:gap-y-0"
        >          {DEFAULT_INDICATORS.map((item, index) => {
            const valueId = `home.trust.stat.${index}.value`;
            const labelId = `home.trust.stat.${index}.label`;
            const value = resolveElementField(
              config,
              valueId,
              "text",
              item.value,
            );
            const label = resolveElementField(
              config,
              labelId,
              "text",
              item.label,
            );

            return (
              <li
                key={item.label}
                className="flex flex-col items-center px-2 text-center sm:px-4 lg:px-5"
              >
                <EditableElement
                  id={valueId}
                  kind="statistic"
                  defaultValue={item.value}
                  as="p"
                  className="text-[1.125rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[1.25rem] md:text-[1.375rem]"
                >
                  {({ value: v }) => (
                    <AnimatedStat value={String(v || value)} />
                  )}
                </EditableElement>
                <EditableElement
                  id={labelId}
                  kind="label"
                  defaultValue={item.label}
                  as="p"
                  className="mt-1 text-[0.75rem] leading-snug text-muted-foreground sm:mt-1.5 sm:text-[0.8125rem]"
                >
                  {({ value: v }) => String(v || label)}
                </EditableElement>
              </li>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}

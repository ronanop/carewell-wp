import { AnimatedStat } from "@/components/home/AnimatedStat";

const indicators = [
  { value: "20+", label: "Years Experience" },
  { value: "10,000+", label: "Procedures" },
  { value: "4.3★", label: "Patient Rating" },
  { value: "605+", label: "Positive Google Reviews" },
  { value: "Advanced", label: "Equipment" },
  { value: "Delhi NCR", label: "Trusted Clinic" },
];

export function TrustIndicators() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="container-content py-8 md:py-10">
        <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-border lg:gap-y-0">
          {indicators.map((item) => (
            <li
              key={item.label}
              className="flex flex-col items-center px-4 text-center lg:px-5"
            >
              <p className="text-[1.25rem] font-semibold leading-tight tracking-tight text-foreground md:text-[1.375rem]">
                <AnimatedStat value={item.value} />
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { Star } from "lucide-react";

import type { DoctorTestimonial } from "@/types/doctor";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: DoctorTestimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-[0_4px_20px_rgb(10_37_64/0.05)]",
        "sm:p-7",
        className
      )}
    >
      <div
        className="flex items-center gap-0.5"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "size-4",
              index < testimonial.rating
                ? "fill-[#FABB05] text-[#FABB05]"
                : "fill-transparent text-border"
            )}
            strokeWidth={index < testimonial.rating ? 0 : 1.5}
            aria-hidden
          />
        ))}
      </div>

      <p className="mt-4 flex-1 text-body leading-relaxed text-muted-foreground">
        “{testimonial.review}”
      </p>

      <div className="mt-6 border-t border-border/60 pt-4">
        <p className="font-heading text-body font-semibold text-[#0A2540]">
          {testimonial.name}
        </p>
        <p className="mt-1 text-small text-muted-foreground">
          {testimonial.treatment}
        </p>
      </div>
    </article>
  );
}

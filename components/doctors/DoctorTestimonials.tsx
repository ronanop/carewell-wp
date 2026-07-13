import { TestimonialCard } from "@/components/doctors/TestimonialCard";
import type { DoctorTestimonial } from "@/types/doctor";

interface DoctorTestimonialsProps {
  testimonials: DoctorTestimonial[];
}

export function DoctorTestimonials({ testimonials }: DoctorTestimonialsProps) {
  return (
    <section className="bg-background" aria-labelledby="testimonials-heading">
      <div className="container-content section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label uppercase text-[#3B82F6]">Patient Voices</p>
          <h2
            id="testimonials-heading"
            className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
          >
            Patient Testimonials
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Real experiences from patients who chose doctor-led care at Care
            Well Medical Centre.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

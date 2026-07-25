import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import { TestimonialCard } from "@/components/doctors/TestimonialCard";
import type { DoctorTestimonial } from "@/types/doctor";

interface DoctorTestimonialsProps {
  testimonials: DoctorTestimonial[];
}

export function DoctorTestimonials({ testimonials }: DoctorTestimonialsProps) {
  return (
    <section className="bg-background" aria-labelledby="testimonials-heading">
      <div className="container-content section-padding">
        <DoctorReveal className="mx-auto max-w-2xl text-center">
          <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
            Patient Voices
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
          >
            Patient Testimonials
          </h2>
          <p className="mt-4 text-body leading-relaxed text-muted-foreground">
            Real experiences from patients who chose doctor-led care at Care
            Well Medical Centre.
          </p>
        </DoctorReveal>

        <ul className="mt-14 grid gap-10 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <DoctorReveal key={testimonial.id} delay={index * 0.05}>
              <li>
                <TestimonialCard testimonial={testimonial} />
              </li>
            </DoctorReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

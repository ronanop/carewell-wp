import { ServiceCard3D } from "@/components/home/ServiceCard3D";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";

const services = [
  {
    title: "Cosmetic Treatments",
    description:
      "Non-surgical anti-aging treatments including Botox, fillers, and laser rejuvenation at our South Delhi clinic.",
    href: "/services/skin-aesthetic",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Cosmetic and aesthetic skin treatment",
    objectPosition: "center top",
  },
  {
    title: "Plastic Surgery",
    description:
      "Advanced cosmetic surgical procedures including rhinoplasty and body contouring performed safely at our South Delhi clinic.",
    href: "/services/surgical-procedures",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Plastic and cosmetic surgery consultation",
    objectPosition: "center 30%",
  },
  {
    title: "Hair Transplant",
    description:
      "Permanent hair restoration using advanced FUE and FUT techniques, performed by a senior cosmetic surgeon in Delhi.",
    href: "/services/hair-treatments",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Hair transplant and restoration treatment",
    objectPosition: "center 70%",
  },
  {
    title: "Skin Treatments",
    description:
      "Doctor-led care for acne scars, pigmentation, dark circles, and skin rejuvenation tailored to your skin type.",
    href: "/services/skin-aesthetic/acne-scar",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Clinical skin treatment and rejuvenation",
    objectPosition: "center 40%",
  },
  {
    title: "Laser Hair Removal",
    description:
      "Safe, effective laser hair reduction for face and body with protocols designed for Indian skin tones.",
    href: "/services/skin-aesthetic/laser-hair-removal",
    imageSrc: "/images/hero-background.png",
    imageAlt: "Laser hair removal treatment",
    objectPosition: "center center",
  },
  {
    title: "Body Contouring",
    description:
      "Non-surgical fat reduction and body sculpting options to refine your silhouette with minimal downtime.",
    href: "/services/skin-aesthetic/cryolipolysis",
    imageSrc: "/images/hero-model.png",
    imageAlt: "Body contouring and sculpting treatment",
    objectPosition: "left center",
  },
  {
    title: "Anti-Aging",
    description:
      "Personalised anti-aging plans combining injectables, skin boosters, and regenerative therapies for natural results.",
    href: "/services/skin-aesthetic/anti-aging-treatments",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Anti-aging aesthetic treatment",
    objectPosition: "center 20%",
  },
  {
    title: "Beard Transplant",
    description:
      "Natural-looking beard restoration with precise graft placement for fuller facial hair density.",
    href: "/services/hair-treatments/beard-transplant",
    imageSrc: "/images/hero-portrait.png",
    imageAlt: "Beard transplant and facial hair restoration",
    objectPosition: "right 45%",
  },
] as const;

export function ServicesSection() {
  return (
    <section className="overflow-x-clip bg-background section-padding">
      <ServicesCarousel
        label="Our services"
        title="Comprehensive Hair Transplant, Skin & Cosmetic Surgery Services"
        description="At Care Well Medical Centre, we provide doctor-led treatments across hair, skin, cosmetic, and surgical care, focused on safety, natural results, and personalised treatment planning."
      >
        {services.map((service) => (
          <ServiceCard3D key={service.title} {...service} />
        ))}
      </ServicesCarousel>
    </section>
  );
}

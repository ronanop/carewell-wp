/**
 * FAQ page body — sourced from the legacy Care Well FAQ page.
 * @see https://web.archive.org/web/20251219050624/https://www.carewellmedicalcentre.com/faq/
 */

export type FaqEntry = {
  question: string;
  answer: string;
  bullets?: readonly string[];
};

export type FaqSection = {
  id: string;
  title: string;
  items: readonly FaqEntry[];
};

export const faqPageTitle =
  "Frequently Asked Questions (FAQ) – Care Well Medical Centre";

export const faqIntro =
  "Are you considering cosmetic surgery or treatments for yourself but not sure where to start? Our Cosmetic Surgery/Treatment FAQs have all the answers you need. This comprehensive guide explains the types of treatments, their costs, and potential risks. You will also find tips on how to choose a qualified doctor. With this information, you will be able to make a confident and informed decision about what’s best for you.";

export const faqClosing =
  "For more information or to book an appointment, feel free to contact us anytime!";

export const faqSections: readonly FaqSection[] = [
  {
    id: "general",
    title: "General Questions",
    items: [
      {
        question: "What is Care Well Medical Centre?",
        answer:
          "Care Well Medical Centre is a leading multispecialty clinic in Delhi, offering advanced medical and cosmetic treatments under the guidance of Dr. Sandeep Bhasin. We specialize in proctology, cosmetic surgery, laser treatments, and general health care.",
      },
      {
        question: "Where is Care Well Medical Centre located?",
        answer:
          "Our clinic is located in CR Park, South Delhi, making it easily accessible for patients from across the city.",
      },
      {
        question: "How can I book an appointment?",
        answer: "You can schedule an appointment by:",
        bullets: [
          "Calling us: +91-9667-977-499",
          "Filling out the appointment form on our website.",
          "Visiting our clinic directly during working hours.",
        ],
      },
      {
        question: "What are the clinic’s working hours?",
        answer:
          "Our clinic operates from Monday to Saturday, 10:00 AM to 7:00 PM. Sundays are available by prior appointment only.",
      },
      {
        question: "Do you offer online consultations?",
        answer:
          "Yes, we provide teleconsultations and video consultations for patients who cannot visit the clinic physically. You can book an online appointment through our website or by calling us.",
      },
    ],
  },
  {
    id: "cosmetic-surgery",
    title: "Cosmetic Surgery FAQs",
    items: [
      {
        question:
          "What cosmetic treatments are offered at Care Well Medical Centre?",
        answer:
          "We offer liposuction, hair transplant, rhinoplasty, breast augmentation/reduction, botox, and laser skin treatments for aesthetic enhancement.",
      },
      {
        question: "Is a hair transplant permanent?",
        answer:
          "Yes, hair transplant results are long-lasting. The transplanted hair grows naturally and does not fall out like regular hair loss.",
      },
      {
        question: "How long does it take to recover from liposuction?",
        answer: "Liposuction recovery varies:",
        bullets: [
          "Small areas: 1-2 weeks",
          "Large areas: 3-4 weeks",
          "Full recovery: 6-8 weeks",
        ],
      },
      {
        question: "Are botox and fillers safe?",
        answer:
          "Yes, botox and dermal fillers are FDA-approved and performed by our experienced specialists to ensure natural-looking results.",
      },
      {
        question: "What is the cost of a cosmetic surgery consultation?",
        answer:
          "Our consultation charges vary depending on the treatment. Contact our clinic for detailed pricing.",
      },
    ],
  },
  {
    id: "laser-treatments",
    title: "Laser Treatments FAQs",
    items: [
      {
        question: "What laser treatments do you offer?",
        answer:
          "We provide laser hair removal, skin resurfacing, acne scar treatment, pigmentation removal, and laser proctology surgeries.",
      },
      {
        question: "Is laser hair removal permanent?",
        answer:
          "Laser hair removal significantly reduces hair growth, but maintenance sessions may be required over time.",
      },
      {
        question: "How many sessions are needed for laser skin treatments?",
        answer:
          "Most laser treatments require 3-6 sessions for optimal results, depending on skin type and condition.",
      },
      {
        question: "Is laser treatment painful?",
        answer:
          "Most laser treatments cause mild discomfort, but numbing creams can be used to minimize pain.",
      },
      {
        question: "Can laser treatments cause side effects?",
        answer:
          "Laser treatments are safe when performed by experts, but some mild redness or swelling may occur, which subsides within a few hours to days.",
      },
    ],
  },
  {
    id: "payment-insurance",
    title: "Payment & Insurance FAQs",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept cash, debit/credit cards, UPI, and online transfers.",
      },
      {
        question: "Do you provide EMI options for treatments?",
        answer:
          "Yes, EMI options are available for selected treatments. Contact us for more details.",
      },
      {
        question: "Is insurance accepted for proctology procedures?",
        answer:
          "Yes, many anorectal treatments (piles, fistula, fissure, pilonidal sinus) are covered under insurance. We assist patients with insurance claims and documentation.",
      },
      {
        question: "Do cosmetic surgeries qualify for insurance coverage?",
        answer:
          "No, most cosmetic surgeries are considered elective procedures and are not covered under insurance.",
      },
      {
        question: "Can I get a cost estimate before treatment?",
        answer:
          "Yes, we provide detailed cost estimates after consultation based on your specific treatment plan.",
      },
    ],
  },
  {
    id: "contact-support",
    title: "Contact & Support",
    items: [
      {
        question: "How can I contact Care Well Medical Centre?",
        answer: "You can reach us via:",
        bullets: [
          "Phone: +91-9667-977-499",
          "Clinic Address: CR Park, South Delhi",
        ],
      },
      {
        question: "Can I walk in without an appointment?",
        answer:
          "We recommend booking an appointment in advance, but walk-ins are accepted based on availability.",
      },
      {
        question: "Do you offer follow-up consultations?",
        answer: "Yes, follow-ups are provided as part of post-treatment care.",
      },
      {
        question: "Can I get a second opinion?",
        answer:
          "Yes, our specialists are available for second opinions and expert consultations.",
      },
      {
        question: "Do you offer emergency medical services?",
        answer:
          "We provide urgent care for certain conditions, but we recommend visiting a hospital for severe medical emergencies.",
      },
    ],
  },
];

export function flattenFaqItems(): FaqEntry[] {
  return faqSections.flatMap((section) => [...section.items]);
}

export function faqAnswerPlainText(item: FaqEntry): string {
  if (!item.bullets?.length) return item.answer;
  return `${item.answer} ${item.bullets.join(" ")}`.trim();
}

# Service Section Templates

Formal catalog of **35+ React section templates** for Care Well service pages.  
Once these are filled from Sanity, every service page can share one layout.

**Components:** `components/service/sections/`  
**Sanity schema:** `schemaTypes/service.ts` (+ CMS docs for testimonials/settings)  
**Public route:** original WordPress URI (e.g. `/hair-transplant-in-delhi/`) via catch-all.  
**Legacy redirect:** `/sanity/service/[slug]` → document `uri`

---

## Design rules

1. One React component = one section job.  
2. Hide section when required props are empty (`return null`).  
3. Prefer Sanity structured fields over legacy `body`.  
4. Brand accents: `#1557A0`, `#0A2E52`, `#0B7B6B`, surfaces `#FAFBFE` / `#F6F8FC`.  
5. Shared wrapper: `SectionShell` (`eyebrow`, `title`, `tone`) — newer sections (Overview, HowItWorks, Pricing, Booking band) use the same shell styles inline.

---

## Wave 1 — Core (must for every service)

| # | Component | Sanity path | Key props |
|---|-----------|-------------|-----------|
| 1 | `HeroBanner` | `hero.*`, `title`, `category`, `uri` | `heading`, `tagline`, `image`, CTAs, `quickFacts` |
| 2 | `QuickFactsCard` | `hero.quickFacts`, `hero.quickFactsNote` | `facts[]` {label,value}, `note` |
| 3 | `BookingFormSection` | `booking.*` + `title` | All form copy from CMS; empty `booking.title` hides section |
| 4 | `OverviewSection` | `overview.*` | `eyebrow`, `heading`, PT `body`, `illustration`, insights* |
| 5 | `InsightCallout` | `overview.insights*` | `eyebrow`, `title`, `items[]`; layouts `card` / `band` |
| 6 | `HowItWorksSection` | `howItWorks.*` | `eyebrow`, `heading`, `stepLabel`, `steps[]`, `youtubeId` — auto-fit grid + highlight animation |
| 7 | `YoutubeEmbedSection` | `howItWorks.youtube*` | `eyebrow`, `title`, `youtubeId`/`url`; `bare` for nesting in HowItWorks |
| 8 | `BeforeAfterSection` | `beforeAfter.*` | `eyebrow`, `heading`, `pairs[]`, `consentNotice` — interactive compare slider |
| 9 | `CandidateSection` | `candidacy.*` | `eyebrow`, `heading`, `goodFitLabel`, `notIdealLabel`, `goodFit[]`, `notIdeal[]`, `quizCtaLabel`, `quizCtaHref` — empty lists hide section |
| 10 | `PricingSection` | `pricing.*` | `eyebrow`, `heading`, `startingFromLabel`, `startingFrom`, `factorsHeading`, `factors[]`, `includedHeading`, `whatsIncluded[]`, `emiNote`, `ctaLabel`, `ctaHref` — empty price+factors+included → null |
| 11 | `EmiCalculatorSection` | `emi.*` | `eyebrow`, `title`, labels, `disclaimer`, `ctaLabel`/`ctaHref`, calculator defaults |
| 12 | `FaqAccordionSection` | `faqEyebrow`, `faqHeading`, `faqEmitJsonLd`, `faqs[]` | `eyebrow`, `title`, `emitJsonLd`, `faqs[]` {question,answer} — empty faqs → null; optional FAQPage JSON-LD |
| 13 | `RelatedServicesSection` | `related.*` | `eyebrow`, `heading`, `services[]->` — auto-fit card grid; empty services → null |
| 14 | `FinalCtaStrip` | `finalCta.*` | `eyebrow`, `headline`, `primaryLabel`/`primaryHref`, `secondaryLabel`/`secondaryHref` — empty labels hide buttons; empty headline+CTAs → null |
| 15 | `DoctorProfileSection` | `doctor.*` | `eyebrow`, `heading`, `name`, `role`, `photo`, `bio[]`, `credentials[]`, `ctaLabel`, `ctaHref` — empty name+bio → null |
| 16 | `TestimonialsSection` | `testimonialsSection.*` | `eyebrow`, `heading`, `items[]` (refs or inline), `videoEnabled`, `videoEyebrow`, `videoHeading`, `videos[]` — empty quotes + (videos off/empty) → null |

---

## Wave 2 — Medical content patterns

| # | Component | Sanity path (planned / body-mapped) | Key props |
|---|-----------|--------------------------------------|-----------|
| 17 | `SymptomsSection` | `symptoms.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 18 | `CausesSection` | `causes.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 19 | `DiagnosisSection` | `diagnosis.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 20 | `BenefitsSection` | `benefits.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 21 | `MythVsFactSection` | `myths.*` | `eyebrow`, `heading`, `mythLabel`, `factLabel`, `pairs[]` {myth,fact} — empty pairs → null |
| 22 | `ComparisonSection` | `comparison.*` | `eyebrow`, `heading`, `columns[]` {title,items}, `tableHtml?` — empty columns+tableHtml → null; flex-wrap centers leftover cards |
| 23 | `TechnologySection` | `technology.*` | `eyebrow`, `heading`→title, `techniques[]` {title,description,bullets[]} — auto-fit cards; empty techniques → null; CMS eyebrow (no hardcode) |
| 24 | `TreatmentOptionsSection` | `treatmentOptions.*` | `eyebrow`, `heading`→title, `options[]` {title,description,bullets[]} — entry `id="options"`; reuses Technology shell; **separate** CMS object from `technology` |
| 25 | `PreparationSection` | `preparation.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 26 | `RecoverySection` | `recovery.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null; timeline UI (optional `Phase: detail` split) |
| 27 | `RisksSection` | `risks.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 28 | `ResultsExpectationsSection` | `expectations.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 29 | `WhyChooseUsSection` | `whyChooseUs.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 30 | `WhenDoctorsRecommendSection` | `whenRecommended.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 31 | `CostSnapshotSection` | `costSnapshot.*` | `eyebrow`, `heading`→title, `cards[]` {label,value,sublabel} — empty cards → null; flex-wrap centers leftover cards |
| 32 | `LocationSection` | `location.*` | `eyebrow`, `heading`, `address`, `hours`, `phone`, `mapHref`, `mapEmbedUrl` — empty details+map → null; iframe when `mapEmbedUrl` set |
| 33 | `MedicalEvidenceSection` | `evidence.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null; journal finding cards |
| 34 | `MistakesToAvoidSection` | `mistakesToAvoid.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |
| 35 | `UntreatedRisksSection` | `untreatedRisks.*` | `eyebrow`, `heading`, `intro`, `items[]` — empty items+intro → null |

**Bonus:** `ContactCard` — `contactCard.*` — `title`, `address`, `hours`, `phone`, `whatsapp`, `callLabel`, `whatsappLabel` — empty phone+whatsapp+address → null; empty labels hide CTAs.

---

## Assembly order (default service page)

```text
HeroBanner (+ QuickFacts)
[sidebar] BookingFormSection + ContactCard
OverviewSection (+ InsightCallout)
HowItWorksSection (+ Youtube)
BeforeAfterSection
CandidateSection
Symptoms / Causes / Benefits / … (optional Wave 2)
PricingSection
EmiCalculatorSection (surgical)
CostSnapshotSection (optional)
DoctorProfileSection
TestimonialsSection
FaqAccordionSection
RelatedServicesSection
LocationSection (optional)
FinalCtaStrip
```

---

## File map

```text
components/service/sections/
  types.ts
  image.ts
  SectionShell.tsx
  index.ts
  HeroBanner.tsx … UntreatedRisksSection.tsx  (35+)
```

Import:

```ts
import {
  HeroBanner,
  BookingFormSection,
  OverviewSection,
  // …
} from "@/components/service/sections";
```

---

## Extending Sanity schema

Wave 1 fields already exist on `service`.  
Wave 2: `symptoms`, `causes`, `diagnosis`, `benefits`, `preparation`, `recovery`, `risks`, `expectations`, `whyChooseUs`, `evidence`, `mistakesToAvoid`, `whenRecommended`, `myths`, `comparison`, `technology`, `treatmentOptions`, and `costSnapshot` are live. Other list sections can follow the same optional-object pattern:

```ts
symptoms: { eyebrow, heading, intro, items[] }   // wired
causes: { eyebrow, heading, intro, items[] }     // wired
diagnosis: { eyebrow, heading, intro, items[] }  // wired
benefits: { eyebrow, heading, intro, items[] }   // wired
preparation: { eyebrow, heading, intro, items[] } // wired
recovery: { eyebrow, heading, intro, items[] }   // wired (timeline)
risks: { eyebrow, heading, intro, items[] }      // wired
untreatedRisks: { eyebrow, heading, intro, items[] } // wired
expectations: { eyebrow, heading, intro, items[] } // wired
whyChooseUs: { eyebrow, heading, intro, items[] } // wired
evidence: { eyebrow, heading, intro, items[] }   // wired (journal findings)
mistakesToAvoid: { eyebrow, heading, intro, items[] } // wired
whenRecommended: { eyebrow, heading, intro, items[] }  // wired
myths: { eyebrow, heading, mythLabel, factLabel, pairs[]{ myth, fact } }  // wired
comparison: { eyebrow, heading, columns[]{ title, items }, tableHtml? }  // wired
technology: { eyebrow, heading, techniques[]{ title, description, bullets } }  // wired
treatmentOptions: { eyebrow, heading, options[]{ title, description, bullets } }  // wired — separate from technology; same UI shell
costSnapshot: { eyebrow, heading, cards[]{ label, value, sublabel } }  // wired
contactCard: { title, address, hours, phone, whatsapp, callLabel, whatsappLabel }  // wired (sidebar)
// …
```

Until remaining Wave 2 objects exist, map from WP headings during pilot scripts or leave unused on the page.

---

## Related

- Backlog: `docs/CAREWELL_SOW_BACKLOG.md` (Phase 2 template polish)  
- Pilot: `npm run pilot:sanity-service -- --slug <slug>`  
- Preview: http://localhost:3001/hair-transplant-in-delhi/ (legacy: `/sanity/service/<slug>` redirects)  

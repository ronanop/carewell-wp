# Care Well Medical Centre — Page Blueprints

**Document Type:** Permanent Creative Reference  
**Audience:** Designers, frontend developers, AI agents generating pages  
**Cross-reference:** `docs/06_ROUTING.md`, `docs/02_PRODUCT_REQUIREMENTS.md`, `reference/brand.md`, `reference/visual-language.md`, `reference/motion-system.md`, `reference/typography.md`

---

## Blueprint Format Key

Each blueprint defines: purpose, goals, hierarchy, layout, sections, components, animation, responsive behaviour, CTAs, WordPress data, React components, accessibility, and performance.

---

# Homepage (`/`)

## Purpose
Primary brand entry point. Establish trust, showcase services and expertise, drive consultation bookings.

## Goals
| Type | Goal |
|------|------|
| Business | Position CWMC as premium healthcare destination; drive consultation enquiries |
| SEO | Rank for brand name + primary service categories; rich MedicalBusiness schema |
| Conversion | "Book a consultation" — target 3–5% click-through to contact/booking |

## Information Hierarchy
1. Brand promise (hero headline)
2. Trust signals (credentials, years, certifications)
3. Services overview
4. Doctor expertise
5. Social proof (testimonials if available)
6. Educational content (blog highlights)
7. Final conversion CTA

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                    [Phone] [CTA]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  HERO                                                        │
│  [Overline: Welcome to Care Well]                            │
│  Advanced Care, Thoughtfully Delivered          [Hero Image]│
│  Supporting subtitle text                                    │
│  [Book a Consultation]                                       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  TRUST INDICATORS                                            │
│  [15+ Years]  [Certified Specialists]  [5000+ Patients]      │
├──────────────────────────────────────────────────────────────┤
│  SERVICES                                                    │
│  [Overline: Our Services]                                    │
│  Treatments & Procedures                                     │
│  [ServiceCard] [ServiceCard] [ServiceCard]                   │
│  [View All Services]                                         │
├──────────────────────────────────────────────────────────────┤
│  DOCTORS                                                     │
│  [Overline: Our Team]                                        │
│  Meet Our Specialists                                        │
│  [DoctorCard] [DoctorCard] [DoctorCard]                      │
│  [Meet All Doctors]                                          │
├──────────────────────────────────────────────────────────────┤
│  TESTIMONIALS (if WordPress data available)                   │
│  [Quote] [Quote] [Quote]                                     │
├──────────────────────────────────────────────────────────────┤
│  BLOG HIGHLIGHTS                                             │
│  [Overline: From Our Blog]                                   │
│  Latest Insights                                             │
│  [BlogCard] [BlogCard] [BlogCard]                            │
│  [Read Our Blog]                                             │
├──────────────────────────────────────────────────────────────┤
│  CTA BANNER                                                  │
│  Ready to Begin Your Journey?                                │
│  [Book a Consultation]                                       │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| # | Section | Background | Components |
|---|---------|------------|------------|
| 1 | Navbar | `bg-background` | `Navbar` |
| 2 | Hero | `bg-background` | `Hero` (split-right variant), `Button` |
| 3 | Trust indicators | `bg-secondary` | `Typography`, stat blocks |
| 4 | Services | `bg-background` | `SectionHeader`, `ServiceCard` ×3–6, `Button` |
| 5 | Doctors | `bg-secondary` | `SectionHeader`, `DoctorCard` ×3–4, `Button` |
| 6 | Testimonials | `bg-background` | `SectionHeader`, quote cards |
| 7 | Blog | `bg-secondary` | `SectionHeader`, `BlogCard` ×3, `Button` |
| 8 | CTA | `bg-primary` | `CTA` |
| 9 | Footer | `bg-foreground` | `Footer` |

## Animation Strategy
- Hero: static on load (LCP)
- Trust indicators: scroll reveal, 500ms
- Service/Doctor/Blog grids: staggered cards, 80ms delay
- CTA banner: scroll fade only
- No animation on navbar or footer

## Responsive Behaviour
| Breakpoint | Changes |
|-----------|---------|
| Mobile | Hero stacked (text above image); 1-col card grids; hamburger nav |
| Tablet | 2-col card grids; hero stacked |
| Desktop | Split hero; 3-col cards; horizontal nav |

## CTA Placement
| Position | CTA | Type |
|----------|-----|------|
| Navbar | "Book a consultation" | Primary button |
| Hero | "Book a consultation" | Primary button |
| Services section | "View all services" | Secondary/link |
| Bottom | "Book a consultation" | Primary on `bg-primary` |

## WordPress Data Required
- Homepage page fields (hero title, subtitle, image)
- Featured services (6 max)
- Featured doctors (4 max)
- Latest blog posts (3)
- Testimonials (if CPT exists)
- Primary navigation menu
- Site-wide contact info

## React Components Required
`Navbar`, `Footer`, `Hero`, `Section`, `Container`, `SectionHeader`, `ServiceCard`, `DoctorCard`, `BlogCard`, `CTA`, `Button`, `AnimatedSection`, `AnimatedGrid`

## Accessibility
- One h1 in hero
- Skip-to-content link
- Trust stats readable by screen readers (not icon-only)
- All cards keyboard-navigable

## Performance
- ISR: 3600s
- Pre-render at build
- Hero image: `priority` + blur placeholder
- Lazy load below-fold images
- Target LCP: hero image < 2.5s

---

# About (`/about`)

## Purpose
Tell the Care Well Medical Centre brand story, establish credibility, humanise the clinic.

## Goals
| Type | Goal |
|------|------|
| Business | Build emotional connection and trust |
| SEO | Rank for "about Care Well Medical Centre" |
| Conversion | Drive to contact or services exploration |

## Information Hierarchy
1. Brand story headline
2. Mission and values narrative
3. Clinic history / timeline
4. Credentials and certifications
5. Facility photography
6. CTA to contact

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  HERO (minimal)                                              │
│  About Care Well Medical Centre                              │
│  One-line brand statement                                    │
├──────────────────────────────────────────────────────────────┤
│  BRAND STORY                                                 │
│  [Image]  |  Narrative text from WordPress Gutenberg         │
│           |  content via ContentRenderer                     │
├──────────────────────────────────────────────────────────────┤
│  VALUES / CREDENTIALS                                        │
│  [Icon+Text] [Icon+Text] [Icon+Text]                         │
├──────────────────────────────────────────────────────────────┤
│  CLINIC PHOTOGRAPHY                                          │
│  [Image grid — 2-3 photos]                                   │
├──────────────────────────────────────────────────────────────┤
│  CTA                                                         │
│  Visit Us / Contact Us                                       │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Hero | `Hero` (centred, minimal) |
| Story | `Container`, `ContentRenderer`, `next/image` |
| Values | `SectionHeader`, feature blocks with Lucide icons |
| Gallery | Image grid |
| CTA | `CTA` |

## Animation Strategy
- Story section: scroll reveal
- Values grid: stagger
- Photography: simple fade

## Responsive Behaviour
- Story: image above text on mobile, side-by-side on desktop
- Values: 1-col mobile, 3-col desktop

## CTA Placement
- Bottom: "Contact us" primary

## WordPress Data Required
- Page slug `about` — title, content (Gutenberg HTML), featured image
- SEO metadata

## React Components Required
`Navbar`, `Footer`, `Hero`, `Section`, `Container`, `ContentRenderer`, `CTA`, `AnimatedSection`

## Accessibility
- Semantic article structure
- Image alt text from WordPress

## Performance
- SSG / ISR 3600s
- Minimal JS — mostly Server Components

---

# Contact (`/contact`)

## Purpose
Enable patients to reach the clinic via form, phone, and location information.

## Goals
| Type | Goal |
|------|------|
| Business | Capture consultation enquiries |
| SEO | Rank for "Care Well Medical Centre contact" + local queries |
| Conversion | Form submission or phone call |

## Information Hierarchy
1. Contact headline
2. Form (primary action)
3. Phone, email, address
4. Map (optional)
5. Operating hours

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  HERO (minimal)                                              │
│  Get in Touch                                                │
│  We respond within one business day.                           │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌────────────────────────────┐ │
│  │  CONTACT FORM           │  │  CONTACT INFO              │ │
│  │  Name                   │  │  Phone: [number]           │ │
│  │  Email                  │  │  Email: [email]            │ │
│  │  Phone (optional)       │  │  Address: [address]        │ │
│  │  Subject                │  │  Hours: [hours]            │ │
│  │  Message                │  │                            │ │
│  │  [Send Enquiry]         │  │  [Map embed]               │ │
│  └─────────────────────────┘  └────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Hero | `Hero` (centred, no image) |
| Contact | `ContactForm` (Client), contact info block, map embed |
| Footer | `Footer` |

## Animation Strategy
- No scroll animations — form page prioritises function
- Form submit: button spinner only

## Responsive Behaviour
- Mobile: form above contact info, stacked
- Desktop: 60/40 split (form left, info right)

## CTA Placement
- Form submit: "Send enquiry"
- Phone number: clickable `tel:` link in header and contact block

## WordPress Data Required
- Page slug `contact` — title, content (optional)
- Site settings: phone, email, address, hours (from WordPress options or page ACF)

## React Components Required
`Navbar`, `Footer`, `Hero`, `Section`, `Container`, `ContactForm`, `Input`, `Textarea`, `Button`

## Accessibility
- All form fields labelled
- Error messages linked via `aria-describedby`
- Phone link accessible
- Map iframe has title attribute

## Performance
- SSG on deploy
- Client Component limited to ContactForm only

---

# Doctors (`/doctors`)

## Purpose
Showcase medical team credentials, specialisations, and humanise the clinic.

## Goals
| Type | Goal |
|------|------|
| Business | Build trust through doctor expertise |
| SEO | Rank for doctor names + specialisations; Physician schema |
| Conversion | Drive consultation bookings with specific doctors |

## Information Hierarchy
1. Team headline
2. Doctor grid (photo, name, specialty, credentials)
3. CTA to book

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  HERO (minimal)                                              │
│  Our Specialists                                             │
│  Experienced professionals dedicated to your care.             │
├──────────────────────────────────────────────────────────────┤
│  DOCTOR GRID                                                 │
│  [DoctorCard] [DoctorCard] [DoctorCard]                        │
│  [DoctorCard] [DoctorCard] [DoctorCard]                        │
├──────────────────────────────────────────────────────────────┤
│  CTA                                                         │
│  Book a Consultation                                         │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Hero | `Hero` (centred) |
| Grid | `SectionHeader`, `DoctorCard` ×all doctors |
| CTA | `CTA` |

## Animation Strategy
- Doctor grid: staggered scroll reveal

## Responsive Behaviour
- 1-col mobile, 2-col tablet, 3-col desktop

## CTA Placement
- Bottom: "Book a consultation"

## WordPress Data Required
- All doctors CPT: name, title, specialty, bio excerpt, featured image, qualifications

## React Components Required
`Navbar`, `Footer`, `Hero`, `Section`, `Container`, `SectionHeader`, `DoctorCard`, `CTA`, `AnimatedGrid`

## Accessibility
- Doctor photos have alt text (doctor name)
- Cards keyboard-navigable

## Performance
- ISR 3600s
- Paginate if > 20 doctors (future)

---

# Gallery (`/gallery`)

## Purpose
Visual showcase of clinic environment, facilities, and treatment context photography.

## Goals
| Type | Goal |
|------|------|
| Business | Demonstrate premium facility and environment |
| SEO | Image search visibility with proper alt text |
| Conversion | Drive contact after visual trust building |

## Information Hierarchy
1. Gallery headline
2. Image grid
3. CTA to visit/contact

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  HERO (minimal)                                              │
│  Our Clinic                                                  │
│  A space designed for your comfort.                            │
├──────────────────────────────────────────────────────────────┤
│  GALLERY GRID                                                │
│  [img] [img] [img]                                           │
│  [img] [img] [img]                                           │
│  [img] [img] [img]                                           │
├──────────────────────────────────────────────────────────────┤
│  CTA                                                         │
│  Visit Our Clinic / Contact Us                               │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Hero | `Hero` (centred) |
| Gallery | `Gallery` (Client — lightbox), `next/image` |
| CTA | `CTA` |

## Animation Strategy
- Grid: optional stagger fade
- Lightbox: modal fade + scale (see motion-system.md)

## Responsive Behaviour
- 2-col mobile, 3-col tablet/desktop
- Lightbox full-screen on all devices

## CTA Placement
- Bottom: "Contact us"

## WordPress Data Required
- Gallery page or gallery CPT: images with alt text, dimensions
- Or extracted from WordPress media library category

## React Components Required
`Navbar`, `Footer`, `Hero`, `Section`, `Container`, `Gallery`, `Dialog` (lightbox), `CTA`

## Accessibility
- All images have alt text
- Lightbox: focus trap, Escape to close, keyboard navigation
- No autoplay carousel

## Performance
- ISR 3600s
- Lazy load all gallery images
- Thumbnail size in grid, full size in lightbox

---

# Services Listing (`/services`)

## Purpose
Catalogue all medical services and treatments. Enable discovery and navigation to service detail pages.

## Goals
| Type | Goal |
|------|------|
| Business | Help patients find relevant treatments |
| SEO | Rank for service category keywords; index all service pages |
| Conversion | Click-through to service detail → consultation |

## Information Hierarchy
1. Services headline
2. Service cards grid
3. Pagination (if > 12 services)
4. CTA

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Home > Services                                 │
├──────────────────────────────────────────────────────────────┤
│  HERO (minimal)                                              │
│  Our Services                                                │
│  Comprehensive treatments for your health and confidence.    │
├──────────────────────────────────────────────────────────────┤
│  SERVICE GRID                                                │
│  [ServiceCard] [ServiceCard] [ServiceCard]                   │
│  [ServiceCard] [ServiceCard] [ServiceCard]                   │
│  [ServiceCard] [ServiceCard] [ServiceCard]                   │
├──────────────────────────────────────────────────────────────┤
│  PAGINATION                                                  │
│  [← Previous]  1  2  3  [Next →]                            │
├──────────────────────────────────────────────────────────────┤
│  CTA                                                         │
│  Not sure which treatment? Book a consultation.              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Breadcrumb | `Breadcrumb` |
| Hero | `Hero` (centred) |
| Grid | `ServiceCard` ×12 per page |
| Pagination | `Pagination` (Client) |
| CTA | `CTA` |

## Animation Strategy
- Card grid: staggered scroll reveal

## Responsive Behaviour
- 1-col mobile, 2-col tablet, 3-col desktop
- Pagination simplified on mobile (prev/next only)

## CTA Placement
- Bottom: "Book a consultation"

## WordPress Data Required
- All services CPT (paginated): slug, title, excerpt, featured image
- Total count for pagination

## React Components Required
`Navbar`, `Footer`, `Breadcrumb`, `Hero`, `Section`, `Container`, `ServiceCard`, `Pagination`, `CTA`, `AnimatedGrid`

## Accessibility
- Pagination: `aria-current="page"`, `aria-label="Pagination"`
- Cards: entire card is link with descriptive text

## Performance
- ISR 3600s
- Cursor-based GraphQL pagination
- 12 services per page maximum

---

# Blogs Listing (`/blogs`)

## Purpose
Showcase educational content, thought leadership, and SEO-driven organic traffic.

## Goals
| Type | Goal |
|------|------|
| Business | Demonstrate expertise through education |
| SEO | Rank for informational healthcare queries; index all posts |
| Conversion | Soft — read → trust → consultation |

## Information Hierarchy
1. Blog headline
2. Blog cards (image, title, date, excerpt)
3. Pagination
4. Optional category filter (future)

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Home > Blog                                     │
├──────────────────────────────────────────────────────────────┤
│  HERO (minimal)                                              │
│  Insights & Articles                                         │
│  Expert perspectives on health, wellness, and treatments.  │
├──────────────────────────────────────────────────────────────┤
│  BLOG GRID                                                   │
│  [BlogCard] [BlogCard] [BlogCard]                            │
│  [BlogCard] [BlogCard] [BlogCard]                            │
│  [BlogCard] [BlogCard] [BlogCard]                            │
├──────────────────────────────────────────────────────────────┤
│  PAGINATION                                                  │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Breadcrumb | `Breadcrumb` |
| Hero | `Hero` (centred) |
| Grid | `BlogCard` ×9–12 per page |
| Pagination | `Pagination` |

## Animation Strategy
- Card grid: staggered scroll reveal

## Responsive Behaviour
- 1-col mobile, 2-col tablet, 3-col desktop

## CTA Placement
- No hard CTA on listing — blog cards are the action
- Navbar CTA always available

## WordPress Data Required
- Posts (paginated): slug, title, excerpt, featured image, date, categories, author

## React Components Required
`Navbar`, `Footer`, `Breadcrumb`, `Hero`, `Section`, `Container`, `BlogCard`, `Pagination`, `AnimatedGrid`

## Accessibility
- Date and author readable by screen readers
- Category badges have text labels

## Performance
- ISR 1800s (more frequent than services)
- 9 posts per page
- Lazy load card images

---

# Individual Service (`/services/[slug]`)

## Purpose
Provide comprehensive information about a specific treatment to educate patients and drive consultation bookings.

## Goals
| Type | Goal |
|------|------|
| Business | Convert interest into consultation for this specific treatment |
| SEO | Rank for treatment-specific keywords; MedicalProcedure schema |
| Conversion | "Book this treatment" CTA |

## Information Hierarchy
1. Service name (h1)
2. Featured image
3. Service description (Gutenberg content)
4. Key benefits / what to expect
5. Related services
6. CTA

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Home > Services > [Service Name]                │
├──────────────────────────────────────────────────────────────┤
│  SERVICE HERO                                                │
│  [Service Name h1]                            [Featured Image]│
│  Lead excerpt text                                           │
│  [Book This Treatment]                                       │
├──────────────────────────────────────────────────────────────┤
│  SERVICE CONTENT                                             │
│  Full Gutenberg HTML via ContentRenderer                     │
│  (headings, paragraphs, images, videos, lists)               │
├──────────────────────────────────────────────────────────────┤
│  RELATED SERVICES                                            │
│  [Overline: Related Treatments]                              │
│  [ServiceCard] [ServiceCard] [ServiceCard]                   │
├──────────────────────────────────────────────────────────────┤
│  CTA                                                         │
│  Ready to Begin? Book a Consultation.                        │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Breadcrumb | `Breadcrumb` + BreadcrumbList schema |
| Hero | `Hero` (split-left), `Button` |
| Content | `ContentRenderer` |
| Related | `SectionHeader`, `ServiceCard` ×3 |
| CTA | `CTA` |

## Animation Strategy
- Related services: staggered grid on scroll
- Content: no animation (readability priority)

## Responsive Behaviour
- Hero: stacked mobile, split desktop
- Content: full reading width (max-w-3xl centred)

## CTA Placement
| Position | CTA |
|----------|-----|
| Hero | "Book this treatment" |
| Bottom | "Book a consultation" |

## WordPress Data Required
- Service by slug: title, excerpt, content (HTML), featured image, SEO, categories
- Related services (same category, 3 max)

## React Components Required
`Navbar`, `Footer`, `Breadcrumb`, `Hero`, `Section`, `Container`, `ContentRenderer`, `ServiceCard`, `CTA`, `Button`

## Accessibility
- One h1 (service name)
- Gutenberg content: semantic HTML preserved
- YouTube embeds: responsive wrapper + title attribute

## Performance
- ISR 3600s
- `generateStaticParams` for top 50 services
- `generateMetadata` from WordPress SEO fields
- Service schema JSON-LD

---

# Individual Blog (`/blogs/[slug]`)

## Purpose
Deliver educational content that builds trust, demonstrates expertise, and drives organic search traffic.

## Goals
| Type | Goal |
|------|------|
| Business | Educate patients; build long-term trust |
| SEO | Rank for informational queries; BlogPosting schema |
| Conversion | Soft — "Speak to a specialist" CTA at bottom |

## Information Hierarchy
1. Article title (h1)
2. Author, date, categories
3. Featured image
4. Article body
5. Related posts
6. CTA

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Home > Blog > [Article Title]                  │
├──────────────────────────────────────────────────────────────┤
│  ARTICLE HEADER                                              │
│  [Category Badge]                                            │
│  Article Title (h1)                                          │
│  By [Author] · [Date]                                        │
│  [Featured Image — full width]                               │
├──────────────────────────────────────────────────────────────┤
│  ARTICLE BODY                                                │
│  Gutenberg content via ContentRenderer                       │
│  (max-w-3xl centred, prose styling)                          │
├──────────────────────────────────────────────────────────────┤
│  RELATED POSTS                                               │
│  [BlogCard] [BlogCard] [BlogCard]                            │
├──────────────────────────────────────────────────────────────┤
│  CTA                                                         │
│  Have Questions? Speak to a Specialist.                      │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Breadcrumb | `Breadcrumb` |
| Header | `Typography`, category badge, `next/image` |
| Body | `ContentRenderer` (prose scoped) |
| Related | `BlogCard` ×3 |
| CTA | `CTA` |

## Animation Strategy
- No animation on article content
- Related posts: optional stagger

## Responsive Behaviour
- Article body: full width mobile, max-w-3xl centred desktop
- Featured image: full container width

## CTA Placement
- Bottom only: "Speak to a specialist"

## WordPress Data Required
- Post by slug: title, content, excerpt, featured image, author, date, categories, SEO
- Related posts (same category, 3 max)

## React Components Required
`Navbar`, `Footer`, `Breadcrumb`, `Container`, `ContentRenderer`, `BlogCard`, `CTA`, `Typography`

## Accessibility
- Article element wrapping content
- Author and date in accessible format
- Heading hierarchy from Gutenberg preserved

## Performance
- ISR 3600s
- `generateStaticParams` for top 50 posts
- BlogPosting schema JSON-LD

---

# 404 Not Found (`/not-found`)

## Purpose
Gracefully handle missing pages without losing the visitor. Guide back to useful content.

## Goals
| Type | Goal |
|------|------|
| Business | Retain visitor who hit a broken link |
| SEO | Return proper 404 status; no index |
| Conversion | Navigate to homepage or contact |

## Information Hierarchy
1. 404 message
2. Explanation
3. Navigation options

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              404                                             │
│              Page Not Found                                  │
│                                                              │
│   The page you're looking for doesn't exist                  │
│   or has been moved.                                         │
│                                                              │
│   [Go to Homepage]    [Contact Us]                           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Content | `Container`, `Heading`, `Typography`, `Button` ×2 |
| Footer | `Footer` |

## Animation Strategy
- None — static page

## Responsive Behaviour
- Centred content, all breakpoints

## CTA Placement
- "Go to homepage" (primary)
- "Contact us" (secondary)

## WordPress Data Required
- Navigation menu (for navbar/footer)
- None for 404 content (hardcoded)

## React Components Required
`Navbar`, `Footer`, `Container`, `Heading`, `Typography`, `Button`

## Accessibility
- h1: "Page not found" (not just "404" alone)
- Clear link text (not "Click here")

## Performance
- Static — no data fetching
- Minimal weight

---

# Search Results (`/search`) — Future

## Purpose
Help users find services, blog posts, and pages by keyword. Planned for post-launch phase.

## Goals
| Type | Goal |
|------|------|
| Business | Reduce bounce from failed navigation |
| SEO | Internal search does not replace SEO — noindex results page |
| Conversion | Surface relevant service → detail → consultation |

## Information Hierarchy
1. Search query display
2. Result count
3. Grouped results (services, blogs, pages)
4. No results state

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
├──────────────────────────────────────────────────────────────┤
│  SEARCH HEADER                                               │
│  Results for "[query]"                                       │
│  [N] results found                                           │
├──────────────────────────────────────────────────────────────┤
│  SERVICES                                                    │
│  [ServiceCard] [ServiceCard]                                 │
├──────────────────────────────────────────────────────────────┤
│  BLOG POSTS                                                  │
│  [BlogCard] [BlogCard] [BlogCard]                            │
├──────────────────────────────────────────────────────────────┤
│  PAGES                                                       │
│  [Link] [Link]                                               │
├──────────────────────────────────────────────────────────────┤
│  (OR) NO RESULTS                                             │
│  No results for "[query]"                                    │
│  [Browse Services] [Read Our Blog] [Contact Us]             │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Sections & Components

| Section | Components |
|---------|------------|
| Header | `Heading`, `Typography` |
| Results | `ServiceCard`, `BlogCard`, link list |
| Empty | Icon, message, `Button` ×3 |
| Footer | `Footer` |

## Animation Strategy
- None — functional page

## Responsive Behaviour
- Standard card grids

## CTA Placement
- No results: "Browse services", "Contact us"
- Navbar search always available

## WordPress Data Required
- WordPress search via GraphQL (WPGraphQL search or custom query)
- Or external search (Algolia — future ADR required)

## React Components Required
`Navbar`, `Footer`, `Container`, `ServiceCard`, `BlogCard`, `Button`, search input component

## Accessibility
- Search input labelled
- Results announced via `aria-live="polite"`
- Grouped results with headings

## Performance
- Dynamic — no ISR (query-dependent)
- `noindex` meta on search results page
- Debounce search input 300ms

---

## Global Page Elements (All Pages)

Every page includes:

| Element | Position | Notes |
|---------|----------|-------|
| Skip-to-content link | First focusable element | `sr-only` until focused |
| Navbar | Top, sticky optional | Phone number visible on desktop |
| Footer | Bottom | Address, phone, email, nav links, copyright |
| Metadata | `<head>` | From `generateMetadata` + WordPress SEO |
| Breadcrumb | Below navbar (except homepage) | With BreadcrumbList schema |
| Primary CTA | Navbar | "Book a consultation" always reachable |

---

## Blueprint Usage for AI Agents

When generating any page:

1. Read the blueprint for that route first.
2. Follow section order exactly unless user specifies otherwise.
3. Use only components listed in the blueprint.
4. Apply animation strategy from blueprint + `reference/motion-system.md`.
5. Apply typography from `reference/typography.md`.
6. Apply visual rules from `reference/visual-language.md`.
7. Apply copy tone from `reference/brand.md`.
8. Fetch only WordPress data listed in blueprint.
9. One primary CTA per viewport.
10. Verify against accessibility and performance notes before completing.

---

*These blueprints are the authoritative page structure reference. Pages must not be built without consulting the relevant blueprint.*

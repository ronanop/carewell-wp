export const SANITY_PAGE_BY_SLUG = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  uri,
  excerpt,
  publishedAt,
  seo{
    title,
    description,
    noIndex
  },
  mainImage{
    alt,
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    }
  },
  body[]{
    ...,
    _type == "bodyImage" => {
      ...,
      asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      }
    }
  }
}`;

export const SANITY_PAGES_LIST = `*[_type == "page" && defined(slug.current)] | order(title asc)[0...30]{
  _id,
  title,
  "slug": slug.current,
  uri
}`;

/** Match page by original URI (with/without trailing slash) or slug. */
export const SANITY_PAGE_BY_URI = `*[_type == "page" && (uri == $uri || uri == $uriNoSlash || slug.current == $slug)][0]{
  _id,
  title,
  "slug": slug.current,
  uri,
  excerpt,
  publishedAt,
  seo{
    title,
    description,
    noIndex
  },
  mainImage{
    alt,
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    }
  },
  body[]{
    ...,
    _type == "bodyImage" => {
      ...,
      asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      }
    }
  }
}`;

const imageProjection = `{
  alt,
  crop,
  hotspot,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  }
}`;

const SANITY_SERVICE_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  uri,
  category,
  excerpt,
  legacyId,
  seo{
    title,
    description,
    noIndex,
    ogTitle,
    ogDescription
  },
  hero{
    heading,
    tagline,
    primaryCtaLabel,
    secondaryCtaLabel,
    quickFacts[]{ label, value },
    quickFactsNote,
    image${imageProjection}
  },
  overview{
    eyebrow,
    heading,
    insightsTitle,
    insightsEyebrow,
    insights,
    body[]{
      ...,
      _type == "bodyImage" => { ..., asset->{ _id, url, metadata { lqip, dimensions } } }
    },
    illustration${imageProjection}
  },
  howItWorks{
    eyebrow,
    heading,
    stepLabel,
    youtubeId,
    youtubeEyebrow,
    youtubeTitle,
    steps[]{ title, description }
  },
  beforeAfter{
    eyebrow,
    heading,
    consentNotice,
    pairs[]{
      patientInitials,
      age,
      gender,
      monthsPost,
      subtype,
      before${imageProjection},
      after${imageProjection}
    }
  },
  candidacy{
    eyebrow,
    heading,
    goodFitLabel,
    goodFit,
    notIdealLabel,
    notIdeal,
    quizCtaLabel,
    quizCtaHref
  },
  symptoms{
    eyebrow,
    heading,
    intro,
    items
  },
  causes{
    eyebrow,
    heading,
    intro,
    items
  },
  diagnosis{
    eyebrow,
    heading,
    intro,
    items
  },
  benefits{
    eyebrow,
    heading,
    intro,
    items
  },
  preparation{
    eyebrow,
    heading,
    intro,
    items
  },
  recovery{
    eyebrow,
    heading,
    intro,
    items
  },
  risks{
    eyebrow,
    heading,
    intro,
    items
  },
  untreatedRisks{
    eyebrow,
    heading,
    intro,
    items
  },
  expectations{
    eyebrow,
    heading,
    intro,
    items
  },
  whenRecommended{
    eyebrow,
    heading,
    intro,
    items
  },
  whyChooseUs{
    eyebrow,
    heading,
    intro,
    items
  },
  evidence{
    eyebrow,
    heading,
    intro,
    items
  },
  mistakesToAvoid{
    eyebrow,
    heading,
    intro,
    items
  },
  myths{
    eyebrow,
    heading,
    mythLabel,
    factLabel,
    pairs[]{ myth, fact }
  },
  comparison{
    eyebrow,
    heading,
    columns[]{ title, items },
    tableHtml
  },
  technology{
    eyebrow,
    heading,
    techniques[]{ title, description, bullets }
  },
  treatmentOptions{
    eyebrow,
    heading,
    options[]{ title, description, bullets }
  },
  pricing{
    eyebrow,
    heading,
    startingFromLabel,
    startingFrom,
    factorsHeading,
    factors,
    includedHeading,
    whatsIncluded,
    emiNote,
    ctaLabel,
    ctaHref
  },
  costSnapshot{
    eyebrow,
    heading,
    cards[]{ label, value, sublabel }
  },
  emi{
    eyebrow,
    title,
    amountLabel,
    tenureLabel,
    resultLabel,
    disclaimer,
    ctaLabel,
    ctaHref,
    defaultAmount,
    defaultMonths,
    annualRatePct
  },
  doctor{
    eyebrow,
    heading,
    name,
    role,
    bio,
    credentials,
    ctaLabel,
    ctaHref,
    photo${imageProjection}
  },
  testimonialsSection{
    eyebrow,
    heading,
    videoEnabled,
    videoEyebrow,
    videoHeading,
    items[]{
      _type == "reference" => @->{
        quote,
        patientName,
        treatment,
        rating,
        photo${imageProjection}
      },
      _type == "inlineTestimonial" => {
        quote,
        patientName,
        treatment,
        rating,
        photo${imageProjection}
      }
    },
    videos[]{
      title,
      youtubeId,
      url,
      thumbnail${imageProjection}
    }
  },
  faqEyebrow,
  faqHeading,
  faqEmitJsonLd,
  faqs[]{ question, answer },
  related{
    eyebrow,
    heading,
    services[]->{
      _id,
      title,
      "slug": slug.current,
      uri,
      excerpt
    }
  },
  location{
    eyebrow,
    heading,
    address,
    hours,
    phone,
    mapHref,
    mapEmbedUrl
  },
  contactCard{
    title,
    address,
    hours,
    phone,
    whatsapp,
    callLabel,
    whatsappLabel
  },
  finalCta{ eyebrow, headline, primaryLabel, primaryHref, secondaryLabel, secondaryHref },
  booking{
    eyebrow,
    title,
    subtitle,
    submitLabel,
    nameLabel,
    namePlaceholder,
    phoneLabel,
    phonePlaceholder,
    trustItems,
    successTitle,
    successBody,
    bandEyebrow,
    bandHeadline,
    bandBody
  },
  body[]{
    ...,
    _type == "bodyImage" => {
      ...,
      asset->{ _id, url, metadata { lqip, dimensions } }
    }
  }
}`;

export const SANITY_SERVICE_BY_SLUG = `*[_type == "service" && slug.current == $slug][0]${SANITY_SERVICE_PROJECTION}`;

/** Match original WP URI (with/without trailing slash) or slug. */
export const SANITY_SERVICE_BY_URI = `*[_type == "service" && (uri == $uri || uri == $uriNoSlash || slug.current == $slug)][0]${SANITY_SERVICE_PROJECTION}`;

/** Lightweight list for QA / review tools — all service public paths. */
export const SANITY_SERVICES_LIST = `*[_type == "service"]{
  _id,
  title,
  "slug": slug.current,
  uri,
  category,
  "faqCount": count(faqs),
  "hasHero": defined(hero.heading) || defined(hero.image)
} | order(uri asc)`;

export const SANITY_REDIRECTS = `*[_type == "redirect" && isEnabled == true]{
  from,
  to,
  permanent
}`;

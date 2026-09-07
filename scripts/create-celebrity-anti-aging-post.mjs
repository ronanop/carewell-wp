/**
 * Create the celebrity anti-aging blog post in Sanity.
 * Hero image is the card/hero only — not repeated in the body.
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import {
  resolveSanityWriteToken,
  sanityProjectConfig,
} from "./lib/sanityEnv.mjs";

const SLUG =
  "how-do-celebrities-look-younger-than-their-age-anti-aging-secrets-explained";
const DOC_ID = `post-${SLUG}`;
const IMAGE_DIR =
  "C:\\Users\\HP\\Downloads\\blogimagehowdocelebritieslookyoungerthantheirage";
const HERO_FILE = "How Do Celebrities Look Younger Than Their Age.jpeg";

const { projectId, dataset, env } = sanityProjectConfig();
const token = resolveSanityWriteToken(env);
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function textBlock(style, text, extra = {}) {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    ...extra,
  };
}

function p(text) {
  return textBlock("normal", text);
}

function h2(text) {
  return textBlock("h2", text);
}

function h3(text) {
  return textBlock("h3", text);
}

function h4(text) {
  return textBlock("h4", text);
}

function bullets(items) {
  return items.map((item) =>
    textBlock("normal", item, { listItem: "bullet", level: 1 }),
  );
}

function imageBlock(assetId, alt) {
  return {
    _type: "bodyImage",
    _key: key(),
    alt,
    asset: { _type: "reference", _ref: assetId },
  };
}

function contentTypeFor(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function uploadFile(filename) {
  const filePath = path.join(IMAGE_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: contentTypeFor(filename),
  });
  console.log(`Uploaded ${filename} → ${asset._id}`);
  return asset._id;
}

const FAQS = [
  {
    question: "How do celebrities keep their face looking young?",
    answer:
      "Celebrities may combine sunscreen, skincare, exercise, nutrition, sleep, and professional treatments. Some may also use aesthetic procedures. However, individual celebrity treatments should not be assumed without reliable confirmation.",
  },
  {
    question: "What is the number one secret for younger-looking skin?",
    answer:
      "Daily sun protection is one of the most important steps. Use broad-spectrum SPF 30 or higher. Sun exposure is a major cause of premature skin aging.",
  },
  {
    question: "Do celebrities use Botox?",
    answer:
      "Botulinum toxin is commonly used worldwide for facial expression lines. However, we cannot assume a particular celebrity uses Botox unless they have publicly confirmed it.",
  },
  {
    question: "Which Bollywood actors look young for their age?",
    answer:
      "Anil Kapoor, Akshay Kumar, Shah Rukh Khan, Hrithik Roshan, and Milind Soman are frequently discussed for maintaining impressive fitness with age.",
  },
  {
    question: "Which Bollywood actresses are known for youthful skin?",
    answer:
      "Kareena Kapoor Khan, Madhuri Dixit, Katrina Kaif, Malaika Arora, Kriti Sanon, and Dimple Kapadia are often discussed for skincare, fitness, or healthy-aging habits.",
  },
  {
    question: "Can retinol make your skin look younger?",
    answer:
      "Retinol may improve fine lines, pigmentation, and skin texture with regular use. Results usually take time. Sensitive skin may require a slower approach.",
  },
  {
    question: "Can anti-aging treatments remove all wrinkles?",
    answer:
      "No. Treatments can reduce certain signs of aging, but they cannot stop natural aging completely.",
  },
  {
    question: "What age is best to start anti-aging treatment?",
    answer:
      "Prevention can begin in your 20s with sunscreen and basic skincare. Medical treatments should depend on your skin concerns rather than age alone.",
  },
  {
    question: "What foods help skin look younger?",
    answer:
      "A balanced diet containing vegetables, fruits, protein, nuts, seeds, and healthy fats supports overall skin health. No single food can stop aging.",
  },
  {
    question: "Are expensive anti-aging creams better?",
    answer:
      "Not necessarily. Dermatologists note that effective skincare products are available across different price ranges. Ingredients and consistent use matter more than price.",
  },
];

function personSection(name, assetId, paragraphs) {
  return [
    h3(name),
    imageBlock(assetId, name),
    ...paragraphs.map(p),
  ];
}

function buildBody(images) {
  return [
    p("Have you ever looked at a Bollywood celebrity and wondered about their age?"),
    p("Some actors remain fit, fresh, and energetic even in their 50s or 60s."),
    p("People often ask, “How do celebrities look younger than their age?”"),
    p("There is no single secret."),
    p("Good genes may help. But daily habits make a huge difference."),
    p(
      "Celebrities also have access to trainers, nutrition experts, skincare professionals, and modern anti-aging treatments.",
    ),
    p("The good news is simple."),
    p("Many habits that support healthy aging are available to everyone."),
    p(
      "Let us understand the real celebrity anti-aging secrets behind younger-looking skin and a healthier body.",
    ),

    h2("Why Do Some Celebrities Look Younger Than Their Actual Age?"),
    p("Celebrities usually work on aging from several directions."),
    p("They may focus on:"),
    ...bullets([
      "Good skincare",
      "Regular sunscreen",
      "Healthy food",
      "Strength training",
      "Better sleep",
      "Stress management",
      "Healthy body weight",
      "Professional skin treatments",
      "Early treatment of skin problems",
    ]),
    p("They also tend to start early."),
    p("This is important."),
    p("Preventing early skin damage is easier than treating deep wrinkles later."),
    p(
      "The American Academy of Dermatology states that sunlight is a major cause of premature skin aging.",
    ),
    p("So, celebrity skin is rarely about one expensive cream."),
    p("It is usually about consistency."),

    h2("Is Genetics the Main Reason Celebrities Look Young?"),
    p("Genes certainly play a role."),
    p("Some people naturally develop wrinkles later."),
    p("Others may have thicker skin or better facial volume."),
    p("But genetics is only part of the story."),
    p(
      "Sun exposure, smoking, diet, stress, sleep, and skincare also affect skin aging.",
    ),
    p("This means your daily choices still matter."),
    p("You cannot change your genes."),
    p("But you can change many habits that speed up aging."),

    h2("What Are the Biggest Celebrity Anti-Aging Secrets?"),
    p("Most effective anti-aging routines are surprisingly simple."),
    p("They begin with habits that protect the skin every day."),

    h3("1. Celebrities Take Sun Protection Seriously"),
    p("Sun protection is probably the most important anti-aging habit."),
    p("Ultraviolet rays damage collagen inside the skin."),
    p("Over time, this may cause:"),
    ...bullets([
      "Fine lines",
      "Wrinkles",
      "Uneven pigmentation",
      "Dark spots",
      "Rough skin",
      "Loss of firmness",
    ]),
    p("Dermatologists recommend broad-spectrum sunscreen with SPF 30 or higher."),
    p("Many celebrities also use sunglasses, hats, and protective clothing."),
    p("Sunscreen is therefore not only a holiday product."),
    p("It should be part of daily skincare."),

    h3("2. They Follow a Consistent Skincare Routine"),
    p("Celebrity skincare can look complicated online."),
    p("However, the basic routine is often simple."),
    p("A useful routine may include:"),
    h4("Morning"),
    ...bullets([
      "Gentle cleanser",
      "Vitamin C or another antioxidant",
      "Moisturizer",
      "Sunscreen",
    ]),
    h4("Night"),
    ...bullets([
      "Cleanser",
      "Retinol or suitable active ingredient",
      "Moisturizer",
    ]),
    p("The exact routine should depend on skin type."),
    p("More products do not always mean better skin."),
    p("Using too many active products may cause redness and irritation."),
    p(
      "The American Academy of Dermatology recommends starting with sunscreen and moisturizer.",
    ),

    h3("3. Retinol and Retinoids May Help Reduce Signs of Aging"),
    p("Retinol has become one of the best-known anti-aging ingredients."),
    p("Retinoids are related to vitamin A."),
    p("They may improve:"),
    ...bullets([
      "Fine wrinkles",
      "Skin texture",
      "Uneven pigmentation",
      "Some dark spots",
    ]),
    p("They also support skin-cell turnover and collagen production."),
    p("However, stronger does not always mean better."),
    p("Retinoids can cause dryness or irritation."),
    p("They also need proper sun protection."),
    p(
      "Pregnant women should avoid retinoids unless their doctor advises otherwise.",
    ),

    h3("4. They Keep Their Body Fit, Not Just Their Face"),
    p("Looking younger is not only about wrinkles."),
    p(
      "Posture, muscle mass, body composition, and movement also affect appearance.",
    ),
    p("This is why many celebrities continue strength training as they age."),
    p("Resistance training may help maintain:"),
    ...bullets([
      "Muscle",
      "Strength",
      "Balance",
      "Better posture",
      "Functional fitness",
    ]),
    p(
      "Hrithik Roshan, for example, has spoken through his fitness team about structured strength work and recovery.",
    ),
    p("Shah Rukh Khan's trainer has also described long-term strength and cardio training."),
    p("The lesson is not to copy a celebrity workout."),
    p("The lesson is to remain active consistently."),

    h2("Which Indian Actors Are Known for Maintaining Their Fitness With Age?"),
    p(
      "Several Indian actors are often discussed for staying fit as they grow older.",
    ),
    ...personSection("Anil Kapoor", images.anil, [
      "Anil Kapoor remains one of India's best-known examples of healthy aging.",
      "At the 2026 India Today Conclave, he discussed longevity and remaining active throughout his career.",
      "His appearance should not be treated as proof of any particular treatment.",
      "What we can learn is the value of long-term health discipline.",
    ]),
    ...personSection("Akshay Kumar", images.akshay, [
      "Akshay Kumar is widely known for his structured lifestyle.",
      "He has spoken about early mornings, regular exercise, and adequate sleep.",
      "Recent reports also describe his preference for functional workouts and disciplined routines.",
    ]),
    ...personSection("Shah Rukh Khan", images.srk, [
      "Shah Rukh Khan has maintained demanding fitness routines for many film roles.",
      "His trainer has described years of resistance exercise and cardiovascular training.",
      "Maintaining muscle as we age can significantly change how young and energetic we appear.",
    ]),
    ...personSection("Hrithik Roshan", images.hrithik, [
      "Hrithik Roshan continues structured exercise beyond age 50.",
      "His routine reportedly combines resistance training, movement, cardio, diet, sleep, and recovery.",
      "Again, consistency matters more than copying an exact routine.",
    ]),
    ...personSection("Milind Soman", images.milind, [
      "Milind Soman is another strong example.",
      "His approach focuses on regular movement rather than complicated gym routines.",
      "He also emphasizes sustainable exercise instead of short-term fitness challenges.",
    ]),

    h2("Which Indian Actresses Are Known for Their Youthful Skin?"),
    p(
      "Bollywood actresses are also frequently discussed for their skincare and fitness habits.",
    ),
    ...personSection("Kareena Kapoor Khan", images.kareena, [
      "Kareena Kapoor Khan has spoken about hydration, food, and keeping skincare uncomplicated.",
      "Her routine also emphasizes regular skin care rather than excessive products.",
    ]),
    ...personSection("Katrina Kaif", images.katrina, [
      "Katrina Kaif has previously highlighted sunscreen, hydration, and proper makeup removal.",
      "These may sound like basic habits.",
      "Yet these basics are exactly what dermatologists recommend for long-term skin health.",
    ]),
    ...personSection("Kriti Sanon", images.kriti, [
      "Kriti Sanon has openly discussed becoming more interested in skincare after turning 30.",
      "Her routine includes ingredients such as niacinamide and other skincare products.",
      "Her example also shows something important.",
      "Preventive skincare often starts before major wrinkles develop.",
    ]),
    ...personSection("Madhuri Dixit", images.madhuri, [
      "Madhuri Dixit is regularly associated with healthy aging and glowing skin.",
      "Published interviews and beauty features highlight regular skincare and overall wellness.",
    ]),
    ...personSection("Malaika Arora", images.malaika, [
      "Malaika Arora is well known for fitness, yoga, and skincare.",
      "She has also spoken about sunscreen, hydration, cleansing, and removing makeup.",
    ]),
    ...personSection("Dimple Kapadia", images.dimple, [
      "Dimple Kapadia remains known for her hair and overall appearance.",
      "Recent reports have discussed her long-term hair-care habits and protein intake.",
    ]),
    p("These examples should inspire healthy habits."),
    p("They should not create unrealistic expectations."),
    p("Celebrities have professional support that most people do not have."),

    h2("Can Diet Help You Look Younger?"),
    p("Food cannot stop aging."),
    p("However, a healthy diet can support your skin and overall health."),
    p("A balanced diet should include:"),
    ...bullets([
      "Vegetables",
      "Fruits",
      "Protein",
      "Whole grains",
      "Nuts and seeds",
      "Healthy fats",
      "Enough fluids",
    ]),
    p("Protein becomes especially important with age."),
    p("It supports muscles and many body tissues."),
    p("Fruits and vegetables also provide vitamins and antioxidants."),
    p("Very restrictive diets are usually unnecessary."),
    p("A healthy diet followed for years matters more than a short “anti-aging diet.”"),

    h2("Does Drinking More Water Prevent Wrinkles?"),
    p("Water is important for health."),
    p("It also helps prevent dehydration."),
    p("But drinking huge amounts of water will not erase wrinkles."),
    p("Moisturizer is more effective for improving dry skin from the outside."),
    p(
      "The National Institute on Aging recommends hydration alongside diet, sun protection, stress management, and regular skincare.",
    ),
    p("So, drink enough water."),
    p("But do not treat water as a miracle anti-aging treatment."),

    h2("How Important Is Sleep for Looking Younger?"),
    p("Sleep is often underestimated."),
    p("During sleep, the body performs important recovery work."),
    p("Poor sleep can make you look:"),
    ...bullets(["Tired", "Puffy", "Dull", "Less energetic"]),
    p("Chronic poor sleep may also make healthy eating and exercise more difficult."),
    p("Many highly disciplined celebrities protect their sleeping routine."),
    p(
      "Akshay Kumar, for example, has frequently discussed getting around seven to eight hours of sleep.",
    ),
    p("Aim for regular and adequate sleep rather than occasional long sleep."),

    h2("Does Stress Make You Look Older?"),
    p("Long-term stress affects much more than mood."),
    p("It may disturb:"),
    ...bullets([
      "Sleep",
      "Eating patterns",
      "Exercise",
      "Skin conditions",
      "General health",
    ]),
    p("Managing stress therefore forms part of healthy aging."),
    p("Useful methods include:"),
    ...bullets([
      "Meditation",
      "Breathing exercises",
      "Walking",
      "Exercise",
      "Yoga",
      "Spending time outdoors",
      "Social connection",
      "Taking regular breaks",
    ]),
    p("Stress cannot always be removed."),
    p("But your response to stress can improve."),

    h2("What Anti-Aging Treatments May Celebrities Use?"),
    p("We should be careful here."),
    p(
      "Nobody should assume that a particular celebrity has undergone a treatment without confirmation.",
    ),
    p(
      "However, celebrities have access to the same modern treatments available in aesthetic medicine.",
    ),
    p("These may include the following."),

    h3("Botox or Botulinum Toxin"),
    p("Botulinum toxin can soften some movement-related wrinkles."),
    p("Common treatment areas include:"),
    ...bullets(["Forehead lines", "Frown lines", "Crow's feet"]),
    p("It works by temporarily reducing selected muscle movement."),
    p("Mayo Clinic lists botulinum toxin among established treatments for facial wrinkles."),
    p("Natural-looking results depend heavily on correct patient selection and dosing."),

    h3("Dermal Fillers"),
    p("Aging can reduce facial volume."),
    p("The cheeks, temples, lips, and lower face may change over time."),
    p("Dermal fillers can sometimes restore selected areas of lost volume."),
    p("The goal should not always be a bigger face."),
    p("Good treatment aims to maintain natural proportions."),

    h3("Laser Skin Treatments"),
    p("Different lasers can target different problems."),
    p("They may help with:"),
    ...bullets([
      "Pigmentation",
      "Sun damage",
      "Skin texture",
      "Fine lines",
      "Certain scars",
    ]),
    p("Not every laser suits every skin colour."),
    p("This is especially important for Indian skin."),
    p("A proper assessment should come first."),

    h3("Chemical Peels"),
    p("Chemical peels remove controlled layers of damaged surface skin."),
    p("Depending on their strength, they may improve:"),
    ...bullets([
      "Uneven tone",
      "Mild pigmentation",
      "Rough texture",
      "Fine surface lines",
    ]),
    p("Peels must be selected according to skin type."),

    h3("Microneedling"),
    p("Microneedling creates tiny controlled injuries in the skin."),
    p("This activates a healing response."),
    p("It may improve skin texture and some scars."),
    p("It is sometimes combined with other regenerative treatments."),

    h3("PRP-Based Skin Treatments"),
    p("Platelet-rich plasma uses components taken from the patient's own blood."),
    p("It is sometimes used for skin rejuvenation and hair treatments."),
    p("Results vary."),
    p("It should not be marketed as a method that reverses biological aging."),

    h2("Can Anti-Aging Treatments Really Make You 10 Years Younger?"),
    p("This depends on what “10 years younger” means."),
    p("No cream can literally change your biological age overnight."),
    p(
      "The American Academy of Dermatology warns against products promising dramatic instant age reversal.",
    ),
    p("However, good treatment may improve visible signs such as:"),
    ...bullets([
      "Fine lines",
      "Pigmentation",
      "Skin dullness",
      "Volume loss",
      "Sagging",
      "Uneven texture",
    ]),
    p("Combining treatments may sometimes produce better results than relying on one method."),
    p(
      "Dermatologists often use different treatments because aging affects the skin in different ways.",
    ),

    h2("What Is the Real Secret Behind Celebrity-Like Younger Skin?"),
    p("The answer is less glamorous than most people expect."),
    p("It is consistent."),
    p("A simple plan can look like this:"),
    ...bullets([
      "Protect your skin from sunlight.",
      "Do not smoke.",
      "Exercise regularly.",
      "Maintain muscle mass.",
      "Eat enough protein and vegetables.",
      "Sleep well.",
      "Manage stress.",
      "Use suitable skincare.",
      "Treat problems before they become severe.",
      "Choose medical procedures carefully.",
    ]),
    p("None of these steps is magical."),
    p("Together, they can make a meaningful difference."),

    h2("At What Age Should You Start Anti-Aging Skincare?"),
    p("You do not need to wait for deep wrinkles."),
    p("Prevention can begin in your 20s."),
    p("The first step is simple."),
    p("Use sunscreen."),
    p("Moisturizer and suitable antioxidants can also be useful."),
    p("Retinoids may be considered later based on your skin type and concerns."),
    p(
      "The American Academy of Dermatology recommends science-backed skincare and consistent sun protection even in younger adults.",
    ),

    h2("Can Everyone Age Like a Celebrity?"),
    p("Not exactly."),
    p("Celebrities may have:"),
    ...bullets([
      "Personal trainers",
      "Nutritionists",
      "Makeup artists",
      "Dermatologists",
      "Cosmetic surgeons",
      "Professional lighting",
      "Professional photography",
      "Image editing",
    ]),
    p("Social media can also change how someone appears."),
    p("Therefore, comparing your face with a celebrity photograph is not always fair."),
    p("The better goal is not to look like someone else."),
    p("The goal is to look healthy, fresh, and confident for your own age."),

    h2("What Should You Avoid in the Search for Younger-Looking Skin?"),
    p("Be careful with extreme promises."),
    p("Avoid:"),
    ...bullets([
      "Unregulated injections",
      "DIY fillers",
      "Unsupervised strong chemical peels",
      "Excessive skin treatments",
      "Random supplements",
      "Very restrictive diets",
      "Overusing retinol",
      "Copying celebrity routines blindly",
    ]),
    p("More treatment is not always better."),
    p("Sometimes an overtreated face looks less natural."),
    p("The safest approach begins with a proper assessment."),

    h2("Anti-Aging Treatment in Delhi at Care Well Medical Centre"),
    p("Healthy aging is not about changing your face completely."),
    p("It is about maintaining healthy skin and natural facial balance."),
    p(
      "At Care Well Medical Centre in Delhi, Dr. Sandeep Bhasin offers personalized anti-aging treatment plans based on individual concerns.",
    ),
    p("Treatment may focus on:"),
    ...bullets([
      "Fine lines and wrinkles",
      "Uneven skin tone",
      "Pigmentation",
      "Loss of facial volume",
      "Skin texture",
      "Skin laxity",
      "Dull or tired-looking skin",
      "Overall facial rejuvenation",
    ]),
    p(
      "Depending on the assessment, options may include skincare guidance, injectables, skin rejuvenation procedures, lasers, peels, or regenerative approaches.",
    ),
    p("No single anti-aging treatment is suitable for everyone."),
    p("A proper consultation helps identify what your skin actually needs."),
    p(
      "The aim should always be natural-looking improvement rather than an artificial or overtreated appearance.",
    ),

    h2("Conclusion"),
    p("So, how do celebrities look younger than their age?"),
    p("There is usually no hidden miracle."),
    p(
      "Their appearance may reflect genetics, skincare, fitness, nutrition, sleep, professional support, and cosmetic treatments.",
    ),
    p("The biggest lesson is consistency."),
    p("Daily sunscreen may matter more than an expensive facial once a year."),
    p("Regular exercise may matter more than a temporary diet."),
    p("Good sleep may matter more than another beauty supplement."),
    p("Healthy aging does not mean trying to remain 25 forever."),
    p(
      "It means protecting your skin, body, strength, and confidence as you grow older.",
    ),
  ];
}

const TITLE =
  "How Do Celebrities Look Younger Than Their Age? Anti-Aging Secrets Explained";

const publishedAt = new Date().toISOString();

const images = {
  hero: await uploadFile(HERO_FILE),
  anil: await uploadFile("Anil Kapoor.jpg"),
  akshay: await uploadFile("Akshay Kumar.jpg"),
  srk: await uploadFile("Shah Rukh Khan.jpg"),
  hrithik: await uploadFile("Hrithik Roshan.jpg"),
  milind: await uploadFile("Milind Soman.jpeg"),
  kareena: await uploadFile("Kareena Kapoor Khan.jpeg"),
  katrina: await uploadFile("Katrina Kaif.jpeg"),
  kriti: await uploadFile("Kriti Sanon.jpeg"),
  madhuri: await uploadFile("Madhuri Dixit.jpeg"),
  malaika: await uploadFile("Malaika Arora.jpeg"),
  dimple: await uploadFile("Dimple Kapadia.jpeg"),
};

const body = buildBody(images);
const wordCount = body
  .filter((block) => block._type === "block")
  .map((block) => block.children.map((child) => child.text).join(" "))
  .join(" ")
  .split(/\s+/)
  .filter(Boolean).length;

const doc = {
  _id: DOC_ID,
  _type: "post",
  title: TITLE,
  slug: { _type: "slug", current: SLUG },
  uri: `/${SLUG}/`,
  publishedAt,
  modifiedAt: publishedAt,
  excerpt:
    "Have you ever looked at a Bollywood celebrity and wondered about their age? Some actors remain fit, fresh, and energetic even in their 50s or 60s. There is no single secret — daily habits make a huge difference.",
  categories: ["Anti-Aging"],
  tags: ["Anti-Aging", "Skincare", "Celebrity", "Delhi"],
  featured: false,
  readTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
  authorName: "Dr. Sandeep Bhasin",
  authorRole: "Cosmetic & Plastic Surgeon",
  mainImage: {
    _type: "image",
    alt: "How do celebrities look younger than their age",
    asset: { _type: "reference", _ref: images.hero },
  },
  midArticleCta: {
    enabled: true,
    headline: "Have questions? Book a free 15-min consultation",
    buttonLabel: "Book free consultation",
  },
  seo: {
    title: `${TITLE} | Care Well Medical Centre`,
    description:
      "How do celebrities look younger than their age? Daily sunscreen, skincare, fitness, sleep, and careful anti-aging treatment — explained.",
    canonical: `https://www.carewellmedicalcentre.com/${SLUG}/`,
    ogTitle: TITLE,
    ogDescription:
      "How do celebrities look younger than their age? Daily sunscreen, skincare, fitness, sleep, and careful anti-aging treatment — explained.",
    noIndex: false,
  },
  faqHeading: "FAQs About Celebrity Anti-Aging Secrets",
  faqs: FAQS.map((faq) => ({
    _key: key(),
    _type: "faq",
    question: faq.question,
    answer: faq.answer,
  })),
  body,
};

await client.createOrReplace(doc);
console.log(`Published ${DOC_ID}`);
console.log(`URI /${SLUG}/`);
console.log(`Words ${wordCount}, read time ${doc.readTimeMinutes} min`);
console.log(`Body blocks ${body.length}, FAQs ${FAQS.length}`);

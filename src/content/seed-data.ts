/**
 * Placeholder content for Phase 1. Shaped like the real thing, but every word here is
 * pending review by Dr. Thrivikraman and the family before launch. No real patient data.
 */

export const therapies = [
  {
    slug: "vamana",
    name: "Vamana",
    category: "panchakarma",
    summary: "A guided therapeutic emesis, done in the early morning after days of careful preparation.",
    description:
      "Vamana is one of the classical cleansing procedures of Panchakarma. It is never the first thing that happens: it follows several days of internal oleation (taking medicated ghee in rising doses) and sweating therapies that loosen what the body is ready to release.\n\nOn the morning itself, the physician is present throughout. Afterwards comes a slow return to food, beginning with thin rice gruel and moving gradually back to a full meal over several days.\n\nVamana is only suggested when it suits a guest's constitution and strength. Many guests never have it, and that is as it should be.",
    duration: "Preparation of 5–7 days; the procedure itself takes a morning",
    order: 1,
  },
  {
    slug: "virechana",
    name: "Virechana",
    category: "panchakarma",
    summary: "Therapeutic purgation with herbal preparations, following a period of oleation and rest.",
    description:
      "Virechana uses herbal preparations to cleanse the digestive tract. Like every Panchakarma procedure, it is prepared for over several days with medicated ghee, oil massage and steam.\n\nThe day of Virechana is a quiet one. Guests rest in their room, take warm water as advised, and are looked in on through the day. A careful diet follows, rebuilding digestion slowly.\n\nIt is decided on only after consultation, and the dose and preparation are chosen for the person, not taken from a chart.",
    duration: "Preparation of 5–7 days, then one day of the procedure and 3–5 days of graded diet",
    order: 2,
  },
  {
    slug: "vasti",
    name: "Vasti",
    category: "panchakarma",
    summary: "Medicated enemas of oil or herbal decoction, given as a course over several days.",
    description:
      "Vasti is often described in the classical texts as half of all treatment. It is given as a course, alternating oil-based and decoction-based preparations according to a schedule the physician sets.\n\nMost guests find it far gentler than they expect. It is usually given in the late morning after an oil massage and gentle steam, and followed by rest.\n\nVasti is frequently part of the plan for guests with joint and nerve complaints, but, like everything here, only after consultation.",
    duration: "Courses of 8, 16 or 30 days",
    order: 3,
  },
  {
    slug: "nasya",
    name: "Nasya",
    category: "panchakarma",
    summary: "Medicated oil or herbal preparations administered through the nose after a facial massage.",
    description:
      "Nasya begins with a massage of the face, head and shoulders, followed by gentle steam to the face. Measured drops of medicated oil are then taken through each nostril while the guest lies back.\n\nIt is a short treatment, usually given in the morning, and often part of the plan for guests with complaints of the head, neck and sinuses, or with disturbed sleep.",
    duration: "About 30 minutes a day, over 7 to 14 days",
    order: 4,
  },
  {
    slug: "abhyanga",
    name: "Abhyanga",
    category: "individual",
    summary: "Full-body oil massage with warm medicated oil chosen for your constitution.",
    description:
      "Abhyanga is the daily oil massage at the heart of Kerala Ayurveda. Two therapists work in unison, using long, rhythmic strokes with warm medicated oil. The oil is selected by the physician after your consultation — it is not the same bottle for everyone.\n\nIt is followed by a herbal steam and a warm bath. Most guests receive some form of Abhyanga on most days of their stay.",
    duration: "45–60 minutes",
    order: 5,
  },
  {
    slug: "shirodhara",
    name: "Shirodhara",
    category: "individual",
    summary: "A slow, steady stream of warm oil, buttermilk or decoction poured across the forehead.",
    description:
      "In Shirodhara, a continuous thin stream of warm liquid is poured across the forehead from a vessel swung gently back and forth above the head. The liquid may be medicated oil, medicated buttermilk (Takradhara) or herbal milk, depending on what the physician advises.\n\nMany guests fall asleep. It is often part of the plan for guests who come with poor sleep, anxiety or long-standing tension.",
    duration: "45 minutes, usually over 7 to 14 days",
    order: 6,
  },
  {
    slug: "pizhichil",
    name: "Pizhichil",
    category: "individual",
    summary: "Warm medicated oil squeezed over the body in a continuous flow while it is gently massaged.",
    description:
      "Pizhichil is a traditional Kerala therapy in which cloths soaked in warm medicated oil are squeezed over the body in a steady flow, while two to four therapists massage in rhythm. The oil is kept at a constant warmth throughout.\n\nIt is nourishing and deeply relaxing, and often suggested for guests with stiffness, joint and nerve complaints.",
    duration: "60–75 minutes, usually over 7 to 14 days",
    order: 7,
  },
  {
    slug: "njavarakizhi",
    name: "Njavarakizhi",
    category: "individual",
    summary: "Massage with warm boluses of Njavara rice cooked in herbal milk.",
    description:
      "Njavara is a medicinal rice grown in Kerala. For this therapy it is cooked in milk and a herbal decoction, tied into cloth boluses and massaged over the body while warm, after an oil massage.\n\nIt is strengthening rather than depleting, and is often part of the plan for guests with muscle weakness, wasting or nerve complaints.",
    duration: "60 minutes, usually over 7 to 14 days",
    order: 8,
  },
  {
    slug: "kati-vasti",
    name: "Kati Vasti",
    category: "individual",
    summary: "Warm medicated oil held in a ring of dough over the lower back.",
    description:
      "A small wall of black gram dough is shaped on the lower back and filled with warm medicated oil, which is kept at an even warmth for the length of the treatment. A gentle massage follows.\n\nIt is local, simple and often part of care for guests who come with lower back pain. Similar treatments are done for the neck (Greeva Vasti) and knees (Janu Vasti).",
    duration: "30–45 minutes",
    order: 9,
  },
  {
    slug: "udvartanam",
    name: "Udvartanam",
    category: "individual",
    summary: "A brisk, upward massage with warm herbal powders.",
    description:
      "Udvartanam uses dry or lightly oiled herbal powders, massaged into the body with firm upward strokes. It is invigorating rather than soothing.\n\nIt is often part of the plan for guests who come for weight and metabolism, alongside changes to food and daily movement that matter just as much.",
    duration: "45 minutes",
    order: 10,
  },
] as const;

type Faq = { question: string; answer: string };
type ConditionSeed = {
  slug: string;
  name: string;
  summary: string;
  approach: string;
  whatToExpect: string;
  faqs: Faq[];
  therapySlugs: string[];
  seoTitle: string;
  seoDescription: string;
  order: number;
};

export const conditions: ConditionSeed[] = [
  {
    slug: "back-and-neck-pain",
    name: "Back and neck pain",
    summary:
      "Yes, Ayurveda can often help with long-standing back and neck pain. At Swetaranya, care usually combines oil therapies such as Kati Vasti and Pizhichil with rest, food that supports digestion, and simple daily movement you can continue at home. How much it helps depends on the cause and on you, which is why it begins with a consultation.",
    approach:
      "We begin by understanding the pain: where it sits, when it is worse, what it followed, and how you sleep, sit and move through a day. Reports and scans you bring are read alongside this.\n\nMost plans combine local therapies for the back or neck with whole-body treatments, a gentle, warm diet, and a lot of rest — something many guests find they have not allowed themselves in years.\n\nBefore you leave, you are shown a small set of movements and habits to keep up at home. The stay is the beginning, not the whole of it.",
    whatToExpect:
      "A typical stay for back or neck pain is 14 to 21 days. Treatments happen in the morning and early afternoon, and the rest of the day is yours to rest, walk in the garden, or sit with the family.",
    faqs: [
      { question: "Will I need to stop my current medication?", answer: "No — never without speaking to your own doctor. Our physician will look at what you take and plan around it." },
      { question: "Can you help with a slipped or herniated disc?", answer: "Many guests with disc problems come to us. Whether a stay suits you depends on your scans and symptoms, so we ask to see your reports before you travel." },
      { question: "How soon will I feel a difference?", answer: "It varies. Some guests feel lighter within days; for others, the change becomes clear in the weeks after they return home. We never promise a result." },
      { question: "Is the treatment painful?", answer: "The therapies themselves are gentle. If anything is uncomfortable, tell your therapist — they will adjust." },
    ],
    therapySlugs: ["kati-vasti", "pizhichil", "abhyanga", "vasti"],
    seoTitle: "Ayurveda for back and neck pain in Kerala",
    seoDescription: "How Swetaranya approaches long-standing back and neck pain: physician-led Ayurvedic care, oil therapies, rest and habits to take home.",
    order: 1,
  },
  {
    slug: "arthritis",
    name: "Arthritis and joint pain",
    summary:
      "Ayurveda does not promise to reverse arthritis, but many people find their stiffness, pain and ease of movement improve with physician-led care. At Swetaranya that means internal medicines, oil and bolus therapies, food adjusted to your digestion, and a daily rhythm that is kind to your joints.",
    approach:
      "Arthritis takes different forms, and Ayurveda treats the person as much as the joint. Some guests need cleansing first; others need nourishing and strengthening. The consultation decides which.\n\nFood matters a great deal here. You will eat simple, warm meals prepared for you, and learn why certain foods are suggested for a time and others set aside.\n\nWe also look at the small things: how you get up in the morning, how long you sit, how warm you keep your joints.",
    whatToExpect:
      "Stays for joint complaints are usually 21 days or longer, often including a course of Vasti. The first days are gentle; treatment builds gradually.",
    faqs: [
      { question: "Is this suitable for rheumatoid arthritis?", answer: "Guests with rheumatoid and other inflammatory arthritis do come to us. Please share your reports and current medicines in your enquiry so the physician can advise honestly whether a stay is right for you." },
      { question: "Can I continue treatment after I go home?", answer: "Yes. You leave with guidance on food and routine, and where appropriate, medicines. Follow-up consultations can be done online." },
      { question: "Will I be able to walk around the property?", answer: "Of course. The ancestral home and garden are all on one level near the rooms, and gentle walking is encouraged." },
    ],
    therapySlugs: ["vasti", "pizhichil", "njavarakizhi", "abhyanga"],
    seoTitle: "Ayurvedic care for arthritis and joint pain in Kerala",
    seoDescription: "Physician-led Ayurvedic care for arthritis at Swetaranya — therapies, food and daily rhythm, with no promises and honest advice.",
    order: 2,
  },
  {
    slug: "parkinsonism",
    name: "Parkinsonism",
    summary:
      "Ayurveda does not cure Parkinson's disease. What physician-led care can sometimes offer is support: help with stiffness, sleep, digestion and a sense of steadiness in daily life, alongside the neurological care you already receive. At Swetaranya this is always planned together with you and your family.",
    approach:
      "Guests with Parkinsonism usually come with a family member, and we plan for both. The pace of the day is slower, the treatments are nourishing rather than draining, and there is always someone near.\n\nTherapies such as Njavarakizhi, Pizhichil and courses of Vasti are commonly part of the plan, alongside internal medicines chosen by the physician to sit safely alongside existing treatment.\n\nWe will always ask you to continue your neurologist's medication. Ayurvedic care here is supportive, not a replacement.",
    whatToExpect:
      "Stays are usually 21 to 28 days. Rooms close to the treatment area are kept for guests who need them, and a companion is welcome to stay.",
    faqs: [
      { question: "Should my father continue his Parkinson's medication?", answer: "Yes. Please do not stop or change any prescribed medication. Our physician works alongside it." },
      { question: "Can a family member stay too?", answer: "Yes, and we encourage it. Companions share the room and the meals, and are welcome to learn alongside." },
      { question: "Is the property safe for someone who is unsteady on their feet?", answer: "Please tell us about mobility in your enquiry. We will be honest about the house — it is an old home — and arrange the most suitable room." },
    ],
    therapySlugs: ["njavarakizhi", "pizhichil", "vasti", "nasya"],
    seoTitle: "Supportive Ayurvedic care for Parkinsonism in Kerala",
    seoDescription: "How Swetaranya offers supportive, physician-led Ayurvedic care for people living with Parkinsonism, alongside their existing treatment.",
    order: 3,
  },
  {
    slug: "insomnia-and-stress",
    name: "Insomnia and stress",
    summary:
      "For many guests, poor sleep and constant stress are the reason they come — and often the first thing that changes. At Swetaranya, care combines calming therapies such as Shirodhara with something just as important: a slower daily rhythm, early nights, warm food at regular times, and time away from screens.",
    approach:
      "Sleep in Ayurveda is one of the pillars of health, and it rarely goes wrong on its own. So we look at the whole day: when you eat, when you wake, what you carry in your mind.\n\nTherapies are part of it — Shirodhara, Abhyanga, sometimes Nasya — but so is the house itself. Lamps are lit at dusk, dinner is early and light, and the evenings are quiet.\n\nBefore you leave, you work out with the physician a small evening routine that fits your life at home.",
    whatToExpect:
      "Even a 7-day stay can help reset a rhythm, though 14 days is more usual. Phones are not banned, but guests often find they reach for them less.",
    faqs: [
      { question: "I take sleeping tablets. Can I still come?", answer: "Yes. Please tell us what you take. Any change to prescribed medication should only happen with your own doctor's guidance." },
      { question: "Is this suitable for anxiety or burnout?", answer: "Many guests come for exactly this. If you are under the care of a psychiatrist or therapist, we will ask you to continue that care." },
      { question: "Will I be able to work during my stay?", answer: "You can, but we gently suggest you don't. The stay works best when you let the day slow down." },
    ],
    therapySlugs: ["shirodhara", "abhyanga", "nasya"],
    seoTitle: "Ayurveda for insomnia and stress in Kerala",
    seoDescription: "Calming Ayurvedic therapies, a slower daily rhythm and habits for home — how Swetaranya approaches poor sleep and stress.",
    order: 4,
  },
  {
    slug: "obesity",
    name: "Weight and obesity",
    summary:
      "Ayurveda sees weight as a matter of digestion and daily rhythm rather than willpower. At Swetaranya, care combines therapies like Udvartanam with food prepared for your digestion, regular movement and a steady routine — and, most importantly, helps you understand what to keep doing at home. We don't promise a number on the scale.",
    approach:
      "We start with digestion: how hungry you feel, when, and what happens after you eat. Weight usually follows from patterns that took years to form, so we work on the patterns.\n\nThe food here is not a crash diet. It is warm, simple, and satisfying, and you will learn how it is made.\n\nTherapies such as Udvartanam and, where suitable, cleansing procedures support this. But the lasting part is what you carry home.",
    whatToExpect:
      "Stays are usually 14 to 21 days. Mornings include yoga or a walk, and the kitchen will show you how to cook several of the dishes you eat.",
    faqs: [
      { question: "How much weight will I lose?", answer: "We don't promise a figure. Some guests lose weight during the stay; for most, the more important change is in the habits they take home." },
      { question: "Will I be hungry?", answer: "No. Meals are regular and filling. The aim is to strengthen digestion, not starve it." },
      { question: "Do you work with thyroid or diabetes-related weight gain?", answer: "Yes, alongside the care you already receive. Please share your reports so the physician can plan safely." },
    ],
    therapySlugs: ["udvartanam", "virechana", "abhyanga"],
    seoTitle: "Ayurveda for weight and obesity in Kerala",
    seoDescription: "Digestion, rhythm and food rather than willpower — how Swetaranya approaches weight with physician-led Ayurvedic care.",
    order: 5,
  },
];

export const journalPosts = [
  {
    slug: "why-we-eat-dinner-before-sunset",
    title: "Why dinner at Swetaranya is served before sunset",
    category: "food-and-daily-routine",
    excerpt: "Guests are often surprised by how early the evening meal is. Here is the reasoning behind it, and how to try it at home.",
    tags: ["dinacharya", "digestion", "food"],
    publishedAt: new Date("2026-08-02"),
    body: "Most guests are surprised on their first evening. Dinner is served early here, while there is still light in the garden, and it is lighter than lunch.\n\n## Digestion follows the sun\n\nIn Ayurveda, digestive strength rises and falls through the day, much like the sun. It is strongest around midday, which is why lunch is the main meal here, and it softens as evening comes.\n\nEating a heavy meal late asks the body to digest when it would rather rest. Many guests notice within a few days that they sleep more deeply and wake feeling lighter.\n\n## Trying it at home\n\n- Move your largest meal to the middle of the day when you can.\n- Keep dinner warm, simple and a little smaller.\n- Leave two to three hours between dinner and sleep.\n\n> You don't need to change everything at once. Begin with one evening a week.\n\n*Placeholder article — to be reviewed and rewritten by Dr. Thrivikraman before publication.*",
  },
  {
    slug: "what-a-consultation-feels-like",
    title: "What actually happens in your first consultation",
    category: "ayurvedic-treatment",
    excerpt: "Pulse, tongue, questions about your sleep and your grandmother — a walk through the first hour with the physician.",
    tags: ["consultation", "first visit"],
    publishedAt: new Date("2026-07-18"),
    body: "The first consultation is unhurried. It usually takes an hour, sometimes longer.\n\n## Listening first\n\nWe begin by asking why you have come — in your own words, not in the words of your reports. Then come the questions that surprise people: how you sleep, what you like to eat, when you feel most tired, what your parents' health was like.\n\n## Reading the body\n\nThe physician will feel your pulse, look at your tongue and eyes, and ask about digestion. None of this is a performance. It is how Ayurveda builds a picture of the person, not only of the complaint.\n\n## Deciding together\n\nAt the end, you are told honestly what we think is going on and what we suggest. If we think Swetaranya is not the right place for you, we will say so.\n\n*Placeholder article — to be reviewed and rewritten by Dr. Thrivikraman before publication.*",
  },
  {
    slug: "the-house-before-the-guests",
    title: "The house before the guests",
    category: "your-ayurveda-stay",
    excerpt: "A short history of the ancestral home at Swetaranya, and why the family chose to open its doors.",
    tags: ["history", "the house"],
    publishedAt: new Date("2026-06-30"),
    body: "Long before anyone called it Swetaranya, this was simply the family home.\n\n## Placeholder history\n\nThis article will tell the story of the house: who built it, how it was used, and how the family came to share it with guests. It is waiting for the family's own words and photographs.\n\n*Placeholder article — pending the family's story and archive photographs.*",
  },
  {
    slug: "three-doshas-without-the-jargon",
    title: "The three doshas, without the jargon",
    category: "understanding-ayurveda",
    excerpt: "Vata, Pitta and Kapha explained the way we explain them over breakfast.",
    tags: ["doshas", "basics"],
    publishedAt: new Date("2026-06-12"),
    body: "Guests often arrive having read about doshas online and feeling slightly worried about which one they are. Let us put that aside.\n\n## Three ways of moving\n\nThink of Vata as movement, Pitta as transformation and Kapha as structure. Everyone has all three. What differs is the balance, and the balance changes with age, season and the way we live.\n\n## Why it matters in daily life\n\nUnderstanding which tendencies are strong in you helps explain why cold, dry weather unsettles one person and hardly touches another — and what you can do about it.\n\n*Placeholder article — to be reviewed and rewritten by Dr. Thrivikraman before publication.*",
  },
];

export const testimonials = [
  {
    patientName: "Guest from Oman — placeholder testimonial, pending consented patient story",
    country: "Oman",
    condition: "Back pain",
    quote: "Placeholder. This space will hold a guest's own words about their stay, published only with their written consent.",
  },
  {
    patientName: "Guest from Germany — placeholder testimonial, pending consented patient story",
    country: "Germany",
    condition: "Sleep and stress",
    quote: "Placeholder. A real guest story will replace this once consent has been recorded by the Swetaranya team.",
  },
  {
    patientName: "Family from Kochi — placeholder testimonial, pending consented patient story",
    country: "India",
    condition: "Parkinsonism (companion's account)",
    quote: "Placeholder. Reserved for a family member's account of accompanying a relative, pending consent.",
  },
];

/** Placeholder films: no real video yet (url empty → the site shows placeholders). */
export const videos = [
  {
    slug: "a-stay-at-swetaranya",
    title: "A stay here, from the gate to the evening lamp",
    description: "Filmed at Swetaranya with our own family and guests who agreed to be seen. Watch it straight through, or choose a chapter.",
    category: "life-at-swetaranya",
    url: "",
    duration: "9:40",
    featured: true,
    order: 0,
    chapters: [
      { title: "Arriving at the house", seconds: 0, body: "The drive in, the gate, the first cup of tender coconut water." },
      { title: "Before sunrise", seconds: 100, body: "Lamps, yoga on the verandah and the garden waking up." },
      { title: "With the physician", seconds: 185, body: "A consultation, unhurried — pulse, questions and listening." },
      { title: "The treatment rooms", seconds: 290, body: "Oils warming, therapists working in rhythm." },
      { title: "The kitchen", seconds: 390, body: "What is cooked, how, and for whom." },
      { title: "Evening", seconds: 495, body: "Dusk, the lamp and an early dinner." },
    ],
  },
  { slug: "what-is-abhyanga", title: "What happens in an Abhyanga", description: "Placeholder film — two therapists, warm oil, and why the oil is chosen for you.", category: "treatments", url: "", duration: "3:10", order: 1, chapters: [] },
  { slug: "a-kitchen-morning", title: "A morning in the kitchen", description: "Placeholder film — rice gruel, steamed dishes and the herbs from the garden.", category: "life-at-swetaranya", url: "", duration: "4:25", order: 2, chapters: [] },
  { slug: "doshas-explained", title: "The three doshas, over breakfast", description: "Placeholder film — Dr. Thrivikraman explains Vata, Pitta and Kapha without the jargon.", category: "learn-ayurveda", url: "", duration: "6:05", order: 3, chapters: [] },
  { slug: "guest-story-placeholder", title: "A guest's story", description: "Placeholder — reserved for a guest's own account, filmed only with consent.", category: "guest-stories", url: "", duration: "", order: 4, chapters: [] },
];

/** Placeholder guides — all point to one obvious placeholder PDF until the real ones are written. */
export const ebooks = [
  {
    slug: "a-kerala-daily-routine",
    title: "A daily routine from Kerala",
    subtitle: "Dinacharya for ordinary weeks",
    description: "Placeholder — the morning-to-night routine guests learn at Swetaranya, adapted for a working life at home.",
    contents: ["Waking, cleansing and the first hour", "When to eat, and why it matters", "An evening routine for deeper sleep"],
    fileUrl: "/ebooks/placeholder-guide.pdf",
    pages: 24,
    order: 1,
  },
  {
    slug: "eating-for-digestion",
    title: "Eating for your digestion",
    subtitle: "Recipes from the family kitchen",
    description: "Placeholder — simple Kerala recipes from our kitchen, with notes on how each supports digestion.",
    contents: ["Rice gruel (kanji) three ways", "Everyday dal and vegetables", "Herbal waters for the seasons"],
    fileUrl: "/ebooks/placeholder-guide.pdf",
    pages: 32,
    order: 2,
  },
  {
    slug: "preparing-for-your-stay",
    title: "Preparing for your stay",
    subtitle: "What to bring, what to expect",
    description: "Placeholder — practical guidance for guests travelling to Swetaranya, from visas to the first morning.",
    contents: ["Before you travel", "Your first three days", "Going home well"],
    fileUrl: "/ebooks/placeholder-guide.pdf",
    pages: 16,
    order: 3,
  },
];

/**
 * Default, admin-editable page copy. Seeded into PageContent; pages merge DB overrides on top,
 * so a missing or half-edited section never breaks a page.
 */

export const dayTimeline = [
  { time: "05:30", title: "Waking before the sun", body: "A lamp is lit in the courtyard. Warm water, a few quiet minutes, and the garden still grey." },
  { time: "06:15", title: "Yoga and breath", body: "An unhurried hour of gentle yoga and pranayama on the verandah, adjusted to what your body allows today." },
  { time: "07:30", title: "Breakfast", body: "Rice gruel, steamed dishes and herbal water, prepared for the digestion of each guest." },
  { time: "09:00", title: "Morning treatment", body: "Your therapies for the day, followed by herbal steam and a warm bath." },
  { time: "11:30", title: "Rounds with the physician", body: "Dr. Thrivikraman sees each guest daily — to ask, adjust, and answer your questions." },
  { time: "12:30", title: "Lunch, the main meal", body: "The fullest meal of the day, eaten when digestion is strongest." },
  { time: "13:30", title: "Rest", body: "No treatment, no schedule. Sleep, read, or sit under the jackfruit tree." },
  { time: "16:00", title: "A class or a walk", body: "A cooking lesson, a talk on daily routine, or a slow walk to the paddy fields." },
  { time: "18:15", title: "Dusk and lamps", body: "The evening lamp is lit. The house gets quieter." },
  { time: "18:45", title: "An early, light dinner", body: "Served while there is still some light, so the body can rest well." },
  { time: "21:00", title: "Sleep", body: "Early, and — for most guests after a few days — deep." },
];

export const arrivalSteps = [
  { title: "You write to us", body: "Through the Talk to the Physician form, by WhatsApp, or by email. A member of the family replies personally." },
  { title: "A first conversation", body: "An online consultation with Dr. Thrivikraman, so we can understand what you need and whether Swetaranya is right for you." },
  { title: "Planning your stay", body: "We suggest a length of stay, share what it involves, and help with visas and travel if you are coming from abroad." },
  { title: "Arriving at the house", body: "Someone meets you at Kochi or Kozhikode airport. At the house there is tender coconut water and time to settle in." },
  { title: "Your full consultation", body: "On the first morning — pulse, tongue, questions, your reports. An hour or more, never rushed." },
  { title: "A plan made for you", body: "Therapies, medicines, food and daily routine, explained so that you understand the reasons, not only the instructions." },
  { title: "Living the days", body: "Treatment in the morning, rest and learning in the afternoon, and daily rounds so the plan can change as you do." },
  { title: "Leaving with what you've learned", body: "A final consultation, written guidance for home, and online follow-ups when you need them." },
];

export const PAGE_DEFAULTS = {
  home: {
    hero: {
      eyebrow: "An Ayurvedic home hospital in Tirur, Kerala",
      heading: "An Ayurvedic home hospital, where treatment is part of the day, not the whole day.",
      time: ["Where there is time to eat properly.", "Time to rest.", "Time to talk to your physician.", "Time to understand your body."],
      closer: "This is Swetaranya.",
      imageUrl: "/hero-bg.png",
      imageAlt: "Veluthat Mana, the family home at Swetaranya, seen through the garden",
    },
    intro: {
      heading: "The care of an Ayurvedic hospital, in the warmth of a family home.",
      body: "Where you come to live, heal and learn. Only a few patients stay at a time, so your physician knows you, sees you every day and shapes your Ayurvedic treatment around you, in a 170-year-old family home in Tirur, Kerala.",
      aside: "You don't come here to be one of many patients. You come as a guest of the home.",
    },
    facts: {
      items: [
        "Only 13 rooms — a home, not a ward",
        "Your physician, 2–3 times a day",
        "Ayurvedic treatment and accommodation under one roof",
        "A 170-year-old ancestral home",
        "25+ years of practice, including Kottakkal Arya Vaidya Sala",
        "Guests from Russia, Italy, Oman, Qatar and across India",
      ],
    },
    thread: {
      heading: "The Thread of Care",
      // Labels for the facts, in the order the thread reaches them; each pairs with a fact by its position in "facts".
      stops: [
        { label: "170 YEARS", fact: 3 },
        { label: "13 ROOMS", fact: 0 },
        { label: "PHYSICIAN 2–3 × DAY", fact: 1 },
        { label: "TREATMENT + STAY", fact: 2 },
        { label: "25+ YEARS", fact: 4 },
        { label: "GUESTS FROM AROUND THE WORLD", fact: 5 },
      ],
    },
    homeHospital: {
      label: "What is a home hospital?",
      heading: "So, what exactly is an Ayurvedic home hospital?",
      answer:
        "An Ayurvedic home hospital gives you the treatment of an Ayurvedic hospital. A physician who lives on site, personalised therapies and structured care with accommodation in a family home instead of a ward. At Swetaranya, that home is Veluthat Mana in Tirur, Kerala, and only a few guests stay at a time.",
      statements: ["It is a hospital in the care it gives you.", "It is a home in the way you live while you are here.", "And it is not a resort."],
    },
    partOfDay: {
      label: "Our approach",
      heading: "At Swetaranya, Ayurveda is part of your day.",
      moments: [
        "You wake up here.",
        "You have your tea.",
        "You pray.",
        "You eat food prepared with care.",
        "You receive your treatment.",
        "You speak to your physician.",
        "You rest.",
        "You practise yoga.",
        "You learn a little more about yourself.",
      ],
      care: "None of these things sits outside the treatment. They are part of your care.",
      body: "Swetaranya grew from a traditional ancestral home. We have kept that feeling at the centre of the home hospital because we believe Ayurveda is easier to understand when you have the time and space to experience it.",
      closer: "Not just receive it.",
    },
    pillars: {
      heading: "Live. Heal. Learn.",
      live: "Experience Ayurveda through food, routine, nature and the everyday rhythm of the home — as one of only a few guests.",
      heal: "Receive personalised Ayurvedic treatment from a physician who sees you every day and adjusts your care as you respond.",
      learn: "Understand your body and your habits, and take home a routine you can keep.",
      closer: "You don't simply come here for treatment.\n\nYou come here to experience another way of living.",
    },
    whyHome: {
      label: "Why a home hospital",
      heading: "Why not just go to a large Ayurvedic hospital?",
      intro: "It's a fair question.",
      body: "Large hospitals have their place. They are built to treat many patients at once, with wards, long corridors, doctors, therapists and structured care.\n\nSwetaranya has doctors, therapists, and structured care too. It is a hospital. But as a home hospital, it is built around something else: the experience of living Ayurveda.\n\nIn a large hospital, you come for treatment. In a home hospital, treatment becomes part of your day. You don't just go from consultation to therapy and back to your room.",
      difference:
        "The difference isn't that one treats you and the other doesn't. The difference is what happens around the treatment and how much time your physician has for you.",
      tableHeading: "Fewer guests. More time. Care that knows your name.",
      rows: [
        { large: "Treatment is the centre", home: "Treatment is part of a way of living" },
        { large: "Many beds, many patients", home: "Only 13 rooms" },
        { large: "Doctor's rounds, often brief", home: "Your physician sees you 2–3 times a day" },
        { large: "Your case is one of many", home: "Your treatment changes as you change" },
        { large: "A ward or hospital room", home: "A room in a family home" },
        { large: "A hospital kitchen", home: "Food cooked in the family kitchen" },
        { large: "The treatment plan defines much of your day", home: "Your day brings together treatment, food, rest, movement and learning" },
        { large: "You are a patient", home: "You are a guest of the family" },
      ],
      footnote: "Same purpose. A different experience. Fewer rooms are not a limitation — it is why the care is personal.",
      quote: "This is how a hospital treatment should be.",
      quoteBy: "Dr M.A. Razak, Tamil Nadu, treated for Parkinsonism",
    },
    physician: {
      label: "Meet the Physician",
      heading: "Your Ayurveda begins with a conversation.",
      lead: "At Swetaranya, your care begins by being heard.",
      body: "Dr. Thrivikraman Veluthat, Chief Physician, is an Ayurvedic doctor with more than 25 years of practice in Kerala and Oman, including at Kottakkal Arya Vaidya Sala.\n\nHe does not visit Swetaranya on rounds. Swetaranya is his family's ancestral home, Veluthat Mana. He lives here, so he is with you through your stay not only at an appointment.\n\nBefore shaping your treatment, he takes time to understand you: your condition, your habits, your lifestyle and what you need. Then he keeps checking in and adjusts your care as your body responds.",
      motto: "Understand first. Treat with purpose.",
    },
    day: {
      heading: "A day with only a few guests follows a different rhythm.",
      body: "Treatment has its place in the day. So do food, prayer, conversation, movement and simply slowing down.",
      items: [
        { time: "7:00 AM", title: "Herbal tea", body: "Begin the morning gently with herbal tea." },
        { time: "7:30 – 9:00 AM", title: "Pooja", body: "A quiet, reflective start to the day." },
        { time: "9:30 AM", title: "Breakfast", body: "A nourishing breakfast from the family kitchen." },
        { time: "10:30 AM – 1:00 PM", title: "Your treatment", body: "Personalised therapies, with the physician looking in on you." },
        { time: "1:15 PM", title: "Lunch", body: "A wholesome meal, then time to rest." },
        { time: "3:30 PM", title: "Time with your physician", body: "Not a five-minute check. A real conversation about how you slept, what you ate and how your body is responding." },
        { time: "4:30 PM", title: "Snacks and herbal tea", body: "A light afternoon break." },
        { time: "6:00 PM", title: "Guided yoga", body: "movement, breath and awareness to close the day." },
        { time: "7:00 PM", title: "Dinner", body: "A calm evening meal." },
      ],
      closer: "More than a timetable — a rhythm built around living, healing and learning.",
    },
    lifestyle: {
      label: "Lifestyle Check",
      heading: "What does your everyday life say about your health?",
      body: "In two minutes, look at the eight everyday areas that shape how you feel:",
      areas: ["Sleep", "Food", "Digestion", "Movement", "Stress", "Routine", "Rest", "Energy"],
    },
    theHome: {
      label: "The Home",
      heading: "An Ayurvedic home hospital, kept small on purpose.",
      lead: "This place matters.",
      body: "Swetaranya began as Veluthat Mana, our family's home for 170 years. We could have turned it into something that looked like every other hospital.",
      didnt: "We didn't.",
      stayed: ["The home stayed.", "The trees stayed.", "The quite stayed.", "The feeling of living here stayed."],
      why: "Because we believe the surroundings matter when you are trying to slow down, recover and pay attention to yourself.",
      rebuilding:
        "We are now rebuilding the home in traditional Kerala architecture, with a little more room for guests. We are still keeping it small — 13 rooms — so every guest still has time with the physician.",
      closer: "The home isn't the backdrop to the treatment. It is part of it.",
    },
    finalCta: {
      heading: "Slow down. Be heard. Experience Ayurveda differently.",
      body: "A home hospital. Only a few guests. A physician who knows you. Wholesome food. A slower rhythm.",
      invite: "Come and stay with us at Swetaranya.",
    },
  },
  about: {
    intro: {
      heading: "A family, a physician and a house that has been waiting",
      body: "Swetaranya began as a home, and it still is one. This page will tell its story in the family's own words.",
    },
    physician: {
      heading: "Dr. Thrivikraman Veluthat",
      body: "Chief Physician. More than twenty-five years of practice in classical Kerala Ayurveda, including years at Kottakkal Arya Vaidya Sala.\n\nPlaceholder biography — to be written with Dr. Thrivikraman: his training, his teachers, and why he chose to practise at home.",
    },
    family: {
      heading: "The family",
      body: "Placeholder — the family members who run the house, the kitchen and the guest care, introduced in their own words, with photographs taken at Swetaranya.",
    },
    home: {
      heading: "The ancestral home",
      body: "Placeholder — the history of the house, its architecture, the generations who lived here, and how it is being carefully expanded to welcome more guests without losing what it is.",
    },
  },
  "your-stay": {
    intro: {
      heading: "Your room is in a family home",
      body: "Not a resort block and not a hospital ward. Rooms are in and around the old house, looking onto the courtyard and the garden.",
    },
    rooms: {
      heading: "The rooms",
      body: "Placeholder — room types, sizes, bathrooms, and which rooms suit guests with limited mobility. Photographs to be taken at the house.",
    },
    included: {
      heading: "What your stay includes",
      items: [
        "Daily consultation with Dr. Thrivikraman",
        "All therapies prescribed in your plan",
        "Internal medicines during your stay",
        "Three meals a day and herbal drinks, cooked for you",
        "Morning yoga and breathing practice",
        "Cooking lessons and talks on daily routine",
        "Laundry of treatment clothes",
        "Airport pickup from Kochi or Kozhikode",
      ],
    },
    international: {
      heading: "Coming from abroad",
      steps: [
        { title: "Consultation online", body: "We speak before you book anything, so you know what to expect." },
        { title: "Medical visa guidance", body: "India offers an e-Medical visa. We send the letter you need once your stay is confirmed." },
        { title: "Flights and arrival", body: "Fly into Kochi (COK) or Kozhikode (CCJ). We meet you at arrivals." },
        { title: "Money and phones", body: "We help you get a local SIM on arrival. Cards and international transfers are accepted." },
        { title: "Going home", body: "Written guidance, medicines to carry if prescribed, and online follow-up consultations." },
      ],
    },
  },
  "the-swetaranya-way": {
    intro: {
      body: "You don't simply come to Swetaranya for a treatment. You experience another way of living — and learn enough of it to keep some of it when you leave.",
    },
    pillars: {
      items: [
        {
          word: "Live",
          heading: "Live the day the way Ayurveda describes it",
          body: "Waking before sunrise. Eating the main meal at midday. Resting in the afternoon, lighting the lamp at dusk, sleeping early. These are not rules we impose, but the rhythm of the house — and after a few days, most guests find they have fallen into it without trying.\n\nThe garden, the courtyard and the paddy fields beyond are part of the treatment too.",
          imageLabel: "a guest resting on the verandah in the afternoon",
        },
        {
          word: "Heal",
          heading: "Care that is planned for you, and changes with you",
          body: "Every guest's care is planned by Dr. Thrivikraman after a long first consultation, and reviewed every day on his rounds. Therapies, medicines and food are adjusted as you respond.\n\nWe will always be honest about what Ayurveda can and cannot do for you, and we never promise results.",
          imageLabel: "therapists preparing warm oil in the treatment room",
        },
        {
          word: "Learn",
          heading: "Understand what is being done, and why",
          body: "We would rather you left understanding your own body than simply feeling better for a while. So we explain: why this oil, why this food, why this hour for sleep.\n\nAfternoon talks and cooking lessons turn the stay into something you can carry home.",
          imageLabel: "a cooking lesson in the family kitchen",
        },
      ],
    },
    arrival: {
      heading: "From your first message to the morning you leave",
      body: "Eight steps, in the order they happen. Choose any step to read more.",
      steps: arrivalSteps,
    },
    food: {
      heading: "Food is the first medicine in this house",
      body: "Nothing here comes from a buffet. Meals are cooked in the family kitchen for each guest's digestion and treatment — often from vegetables grown a few steps away.",
      principles: [
        { title: "Warm and freshly cooked", body: "Nothing reheated, nothing from a packet. Food is made for the meal it is served at." },
        { title: "Timed to digestion", body: "A light breakfast, a full lunch, an early and simple dinner." },
        { title: "Changed as you change", body: "Your meals follow your treatment — gruel on some days, fuller meals on others." },
        { title: "Vegetarian, and Kerala", body: "Rice, lentils, vegetables, coconut and spices from the region, cooked the traditional way." },
      ],
    },
    takeHome: {
      heading: "What you carry home matters more than what happens here",
      body: "Before you leave, you sit with Dr. Thrivikraman once more. Together you work out what is realistic to keep: a morning routine, a few changes to how you eat, a simple practice for the evenings.",
      items: [
        { title: "Written guidance", body: "for food, routine and any medicines — in plain language." },
        { title: "Recipes", body: "for the dishes you ate most, written down in the kitchen." },
        { title: "Online follow-ups", body: "with the physician, when you need them." },
        { title: "The Journal", body: "for the seasons ahead: what to eat, how to adjust your routine." },
      ],
    },
  },
  treatments: {
    intro: {
      heading: "Treatment here begins with a conversation, not a menu.",
      body: "Every plan at Swetaranya is made by Dr. Thrivikraman for one person. What follows is an outline of how treatment unfolds, the therapies we use, and the conditions guests most often come with.",
    },
    journey: {
      heading: "The treatment journey",
      stages: [
        { title: "Consultation", term: "Understanding you", body: "A long first conversation, pulse and tongue, your reports and your history. Nothing is decided before this." },
        { title: "Preparation", term: "Purvakarma", body: "Oil massage, steam and internal oleation that prepare the body for deeper treatment." },
        { title: "Main therapy", term: "Pradhanakarma", body: "The therapies at the centre of your plan — cleansing, nourishing or both, depending on what you need." },
        { title: "Rebuilding", term: "Paschatkarma", body: "A graded return to full food and activity, so the benefit of treatment is kept, not lost." },
      ],
    },
    conditions: {
      heading: "What guests come to us with",
      body: "Each page begins with a straight answer, then explains how we approach it. None of this replaces a consultation.",
    },
    therapies: {
      heading: "Therapies",
      panchakarmaBody: "The five classical cleansing procedures. Only ever given after preparation, and only when they suit you.",
      individualBody: "Traditional Kerala therapies, used on their own or as part of a longer plan.",
    },
  },
  "a-day": {
    intro: {
      heading: "A day at Swetaranya, from the first lamp to the last",
      body: "What does a day actually look like when you stay with us? This is the shape most days take — mornings for treatment, afternoons for rest and learning, early evenings and early nights.",
    },
    moments: {
      heading: "Hour by hour",
      body: "Choose a time to see what happens. Every guest's day differs a little.",
      items: dayTimeline,
    },
    story: {
      heading: "One guest's day, in their own words",
      body: "Placeholder — a real guest's account of an ordinary day at Swetaranya, written with their consent. What surprised them, what they came to look forward to, what they took home.",
    },
    notes: {
      heading: "Good to know",
      items: [
        { title: "Your plan shapes your day", body: "Treatment times move with your therapies. Some days are fuller, some are almost entirely rest." },
        { title: "Nothing is compulsory", body: "Yoga, classes and walks are invitations. Rest is always an acceptable answer." },
        { title: "Families are part of it", body: "Companions share meals and can join classes; many find the rhythm helps them too." },
      ],
    },
  },
  faqs: {
    intro: { heading: "Questions people ask before they come" },
    questions: {
      items: [
        { group: "Before you come", question: "Do I need a consultation before booking a stay?", answer: "Yes. We always speak first — usually online — so the physician can understand what you need and tell you honestly whether a stay is right for you." },
        { group: "Before you come", question: "How long should I stay?", answer: "Most guests stay between 14 and 28 days. Seven days can help reset a routine; deeper treatments such as Panchakarma need longer. The physician will suggest a length after your consultation." },
        { group: "Before you come", question: "Can I come with a family member?", answer: "Yes. Companions are welcome to share the room and meals, and many families come together — especially with an older relative." },
        { group: "Travel", question: "Which airport should I fly into?", answer: "Kochi (COK) or Kozhikode (CCJ). We arrange pickup from either." },
        { group: "Travel", question: "Do I need a medical visa?", answer: "Guests coming for treatment usually apply for India's e-Medical visa. Once your stay is confirmed, we send the invitation letter you need." },
        { group: "During your stay", question: "Is the food vegetarian?", answer: "Yes. Meals are vegetarian Kerala food, cooked in the family kitchen for your digestion and treatment." },
        { group: "During your stay", question: "Is there Wi-Fi?", answer: "Yes, though we gently encourage guests to use it less than they might at home." },
        { group: "During your stay", question: "Can I continue my regular medication?", answer: "Yes. Never stop prescribed medication without your own doctor's advice. Our physician plans around what you take." },
      ],
    },
  },
} as const;

export type PageKey = keyof typeof PAGE_DEFAULTS;

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
      heading: "You don't simply\ncome here for\na treatment.",
      subheading: "You come to live another way for a while.",
      body: "Swetaranya is a traditional Ayurvedic home in Kerala — a family house where treatment, daily life and learning happen together, led by Chief Physician Dr. Thrivikraman Veluthat.",
    },
    pillars: {
      heading: "Three things happen here at once",
      live: "Food cooked for your digestion. Early mornings and early nights. Rest that you haven't allowed yourself in years, in a house surrounded by green.",
      heal: "Care planned by one physician who sees you every day and changes the plan as you change. Never a package off a menu.",
      learn: "Why this oil, why this meal, why sleep matters. You leave understanding your body a little better, with habits you can carry home.",
    },
    physician: {
      heading: "The physician is also your host",
      body: "Dr. Thrivikraman Veluthat has practised Ayurveda for more than twenty-five years, including at Kottakkal Arya Vaidya Sala. At Swetaranya he sees every guest himself, every day.",
      quote: "I would rather a guest understood why they feel better than simply felt better. Understanding is what they take home.",
    },
    stay: {
      heading: "An old family home, opened to guests",
      body: "Rooms in and around the ancestral house, a courtyard, a kitchen garden and the sound of the paddy fields. Simple, clean and quiet.",
    },
    video: {
      heading: "See a day here before you arrive",
      body: "A short film of mornings, meals and treatments at Swetaranya — in chapters, so you can watch the part you are curious about.",
    },
    finalCta: {
      heading: "Tell us what you need help with.",
      body: "Write to us and Dr. Thrivikraman or a member of the family will reply personally, usually within a day.",
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

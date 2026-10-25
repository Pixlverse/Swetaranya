/**
 * Life at Swetaranya: copy taken verbatim from the client's "Life at Swetaranya" document.
 * Square-bracketed values are the client's own placeholders, shown on the page as pending.
 */
export const LIFE = {
  hero: {
    title: "Life at Swetaranya",
    pillars: "Live. Heal. Learn.",
    lead: "Hospital care, in a family home.",
    sub: "A 170-year-old Kerala home where healing becomes part of everyday life.",
  },

  place: {
    label: "The place",
    heading: "A home, where healing becomes part of daily life.",
    body: "Swetaranya is a residential Ayurvedic treatment centre in Kerala. You stay in a traditional family home, surrounded by fields, the family temple, the sarpakkavu and its pond. Your days follow the rhythm of Ayurveda: therapies, food cooked for your condition, rest, conversation and quiet.",
    icons: ["Nature all around", "A traditional home", "Only a few patients"],
    note: "a place that feels like home",
    more: "Why a home",
    expanded: {
      paragraphs: [
        "People come to us carrying more than an illness. Often there are years of pain, worry about what comes next, and the tiredness of trying treatment after treatment. Before the body can heal, a person needs to feel comfortable and secure.",
        "That is hard to feel in a large hospital, where the day passes between departments, corridors and strangers. It comes naturally in a home.",
      ],
      lead: "Small, on purpose.",
      leadBody:
        "We have only a few rooms, so everyone who cares for you knows you, knows your treatment and knows exactly what you need. Nothing gets lost between shifts or departments. That close attention is part of what makes the treatment work.",
    },
  },

  people: {
    label: "The people",
    heading: "Care that knows you, not just your diagnosis.",
    body: "Our Chief Physician lives on the campus with his family. He sees your food, your therapies and how you respond through the day, not only what you say in a consultation. With only a few rooms, you get personal attention and close follow-up every day.",
    quote: "“Living alongside our patients lets us see what a consultation never shows.”",
    more: "Meet our team",
    expanded: [
      {
        title: "Physicians who live alongside you",
        paragraphs: [
          "Dr. Thrivikraman Veluthat, our Chief Physician, practises with his son, Dr. Sarang, who specialises in mental health. They plan care together, so treatment for the body and support for the mind are part of the same stay.",
          "Living this close, the physicians see how your food is cooked, how the medicines for your therapies are prepared, how each therapy is carried out, and how you respond.",
        ],
      },
      {
        title: "Conversations that matter",
        paragraphs: [
          "Useful things come out over a meal or an evening walk. A small detail about when a problem began can change how it is understood and treated. Over time, these conversations build trust. For someone who has lived with a chronic illness for years, a physician who truly knows their case makes the road ahead feel far less uncertain.",
        ],
      },
    ],
    link: { label: "Meet the physicians", href: "/about#physicians" },
  },

  treatment: {
    label: "Your treatment",
    heading: "Treatment that goes to the root.",
    body: "The diagnosis tells us the name of your condition. It doesn’t tell us about you. We look at the whole person, find the root cause and treat it there, so the illness is less likely to return. From the start, we also plan when your medicines can stop.",
    icons: ["Body nature (prakriti)", "Digestion", "Mind & emotions", "Other health conditions", "Where you live & your climate"],
    more: "How we plan your treatment",
    stepsTitle: "How your care comes together",
    steps: [
      { lead: "We listen.", text: "Your history, your daily life and how the illness began." },
      { lead: "We look for the root cause.", text: "Examination, your body nature, digestion and state of mind, any other conditions, and your reports." },
      { lead: "We plan for you.", text: "Medicines, therapies, diet and rest, never decided by the diagnosis alone." },
      { lead: "We observe and adjust.", text: "How you respond over time, with each stage explained to you." },
      { lead: "We plan the end of treatment.", text: "When medicines can be reduced or stopped, so the results last." },
    ],
    notes: [
      {
        title: "The same diagnosis, a different treatment",
        text: "Two people with arthritis, psoriasis, Parkinson’s disease or chronic kidney disease may need completely different medicines and therapies. Other conditions, such as diabetes or high blood pressure, also shape the plan. So do where you live and the climate you live in.",
      },
      {
        title: "Not medicine for life",
        text: "Ayurveda does not aim to keep you on medicine for life. The results should last after the medicine ends, which is why treatment is sometimes given in courses, with breaks between them. In our experience, many patients with chronic conditions have been able to reduce or stop some of their medicines over time. Any change to a medicine you already take is made carefully, under your physician’s guidance. Never stop or change a medicine on your own.",
      },
      {
        title: "Why it can take time",
        text: "Finding and treating the root cause can’t be rushed. The physician observes you closely, waits for your body to respond, and adjusts as you go. Progress can feel slow, so we explain at every stage what we are doing, what to expect and why.",
      },
      {
        title: "Tests that guide your care",
        text: "Where it helps, the physician uses blood tests and imaging alongside traditional examination. For some causes of low back pain, for example, an MRI may show that surgery or specialist care is needed, and we will refer you on. Tests before and after treatment also help measure what has changed.",
      },
      {
        title: "You don’t need to know about Ayurveda to begin",
        text: "Come without fixed ideas about what your treatment should be. Your physician will explain your medicines, your therapies and the reason for each.",
      },
    ],
  },

  everyday: {
    label: "The everyday",
    heading: "A day that supports your healing.",
    body: "Your day has a gentle rhythm, with time for therapies, fresh food, rest and quiet. Medicine is only part of it. How you eat, rest and sleep matters just as much, and your part in that is as important as the physician’s.",
    times: [
      { when: "Early morning", what: "Walk, yoga or quiet time by the pond", more: "Wake early with the village. Quiet time, a gentle walk or yoga. Rising early sets the body’s rhythm for the day." },
      { when: "Morning", what: "Therapies & medicines", more: "Your therapies and medicines, at the times your physician has chosen. Many therapies work best at particular times of day." },
      { when: "Midday", what: "Main meal, to your pathyam", more: "Lunch, the main meal of the day, cooked fresh to your pathyam, the diet prescribed for your condition." },
      { when: "Afternoon", what: "Rest, and time with your physician", more: "Rest and recovery, and a conversation with your physician about how you are responding." },
      { when: "Evening", what: "Temple, a slow walk, light dinner", more: "Time at the temple or by the pond, a slow walk, and an early, light dinner." },
      { when: "Night", what: "Sleep, 6–8 hours", more: "Six to eight hours of sleep. Sleep is part of the treatment, not a break from it." },
    ],
    more: "See a day at Swetaranya",
    expandedIntro: "Ayurveda pays attention to when things happen, not only what happens.",
    part: {
      title: "Your part in the treatment",
      text: "Your physician prescribes your medicines and guides your diet, activity and rest, but much of the daily work is yours. That means waking on time, eating the right food at the right time, taking your medicines on schedule and sleeping well. We explain the reason behind every recommendation. Once you understand it, and begin to feel the changes, the routine becomes easy to follow.",
    },
    footnote: "Your own schedule is set by your physician and changes as you respond.",
  },

  land: {
    label: "From our land",
    heading: "Medicines, grown and prepared here.",
    body: "We grow many of the herbs in our own medicinal garden and fields, without pesticides or chemicals. Fresh herbs go into the medicines and therapies we prepare on the campus, including special treatments that use different methods of heating the body.",
    more: "Our garden & medicines",
    expanded: [
      "We prepare our medicines ourselves, here on the campus. Because many of the herbs grow in our own garden and fields, we can often harvest them fresh and prepare medicines for each patient. We also grow the plants needed for certain therapies.",
      "No pesticides, chemicals or chemical fertilisers are used anywhere on the campus. The herbs grow as nature intended.",
      "Not every medicine can be made from what we grow. Where it can, you know exactly where the plants came from and how your medicine was made.",
    ],
  },

  stay: {
    label: "Your stay",
    heading: "A 170-year-old home, with 13 rooms.",
    body: "Live in Veluthat Mana, a traditional family home with wooden ceilings, open courtyards and cool verandas. The rooms are simple, clean and quiet, made for rest and recovery.",
    more: "View rooms",
    expandedBefore: "Veluthat Mana was built for this climate long before air conditioning, and it has been our family’s home for 170 years.",
    facilitiesLead: "Each room has",
    facilitiesPending: "[facilities: bathroom, air conditioning, etc.]",
    expandedAfter:
      "Part of the mana is being rebuilt in traditional architecture, with rooms set aside only for patients. We are keeping Swetaranya small on purpose, so every patient still gets real attention.",
    pendingActions: ["[Room gallery]", "[Take the 360° Virtual Tour]"],
  },

  yoga: {
    label: "Yoga",
    heading: "Movement, breath and stillness.",
    body: "Yoga supports your treatment. It is gentle, adapted to your condition and focused on what you need, not on what you can’t do.",
    more: "Learn more",
    expanded: {
      first:
        "When your physician recommends it, yoga becomes part of your day. Sessions bring together gentle movement to ease stiffness, breathing practice to calm the mind, and a few minutes of quiet.",
      pending: "[Who leads the sessions.]",
      second:
        "Some patients find the stillness hard at first. Others welcome it after a long time of living with pain or worry. Before you leave, you learn a simple practice to continue at home.",
    },
  },

  arrive: {
    label: "Before you arrive",
    heading: "A little preparation goes a long way.",
    steps: [
      {
        short: "Send your medical reports",
        lead: "Send your reports.",
        text: "Share your medical reports, scans, test results and a list of the medicines you take.",
      },
      {
        short: "Speak with the physician online",
        lead: "Speak with the physician online.",
        text: "The physician tells you honestly what Ayurveda can do for your condition. He also explains the treatment he would plan and how to prepare.",
      },
      {
        short: "Prepare your body (2–4 weeks)",
        lead: "Prepare your body.",
        text: "For two to four weeks before you arrive, eat simple food, keep regular sleep, and avoid heavy physical or mental strain. For some patients in India, the physician may also prescribe medicines to take beforehand. Arriving prepared means treatment can begin soon after you settle in.",
      },
    ],
    more: "Get ready for your stay",
    caution: "Follow your physician’s advice. Don’t start new medicines or change your current treatment on your own.",
  },

  travel: {
    label: "Travel & practicals",
    heading: "Getting to Swetaranya",
    routes: [
      {
        by: "By air",
        parts: [
          { text: "Calicut International Airport (Karipur), ", pending: "[xx km · xx hrs]" },
          { text: ". Cochin International Airport, ", pending: "[xx km · xx hrs]" },
          { text: ". ", pending: "[Pickup details]" },
        ],
      },
      { by: "By train", parts: [{ text: "Tirur railway station, ", pending: "[xx km · xx mins]" }] },
      { by: "What to bring", parts: [{ text: "Comfortable clothing, medical reports and scans, your current medicines, easy footwear" }] },
    ],
    more: "Travel information",
    where: "Swetaranya is in Kavanchery, near Tirur, in the Malappuram district of Kerala.",
    bringTitle: "What to bring",
    bring: [
      "Loose, comfortable clothing for a warm climate",
      "Your medical reports, scans and test results",
      "Your current medicines, with a list of their doses",
      "Footwear that is easy to slip on and off",
    ],
    bringNote: "We will tell you before you travel if your treatment needs anything else.",
  },

  next: {
    label: "Your next step",
    heading: "Come as you are.",
    heading2: "We will guide you from here.",
    body: "You don’t need to know about Ayurveda before you come. Tell us what you have been living with, and we will tell you honestly what Ayurveda can do for your condition.",
    cta: { label: "Book an online consultation", href: "/book-a-consultation" },
  },
} as const;

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
  // Home copy, verbatim from Content/Home page.docx. Splitting a sentence group across layout is the only change.
  home: {
    hero: {
      eyebrow: "An Ayurvedic home hospital in Kerala, India, near Tirur",
      heading: "Healing needs more than a prescription.",
      book: "Book an Online Consultation",
      walkthrough: "Take the 360° Walkthrough",
      imageUrl: "/hero-bg.png",
      imageAlt: "Veluthat Mana, the family home at Swetaranya, seen through the garden",
    },
    intro: {
      paragraphs: [
        "Most of us know the quick fix: a course of tablets, a few sessions, some relief, and then the same problem a few months later. Ayurveda asks for something different. It asks you to slow down, rest properly, eat well and give your mind some quiet, because that’s when the body begins to heal.",
        "That’s hard to do in the middle of everyday life. So we made a place where it comes naturally: An Ayurvedic home hospital on a calm, green campus in a village near Tirur, in Malappuram, where days move at an unhurried pace and treatment is part of your day, not the whole of it.",
      ],
      aside: "You don’t come here to be one of many patients. Your physician knows you by name.",
    },
    homeHospital: {
      label: "What is a home hospital?",
      heading: "A hospital in the care it gives. A home in the way you live.",
      answer:
        "A home hospital gives full hospital care in the setting of a home. At Swetaranya, that means physician-led Ayurvedic treatment, trained therapists and a prescribed diet, in a family home with 12 rooms. It is not home nursing: you come and stay with us for your treatment.",
      hospital: [
        "Say \"hospital\" and most people picture corridors, appointments and a lot of waiting.",
        "Swetaranya is a hospital, and we take that part seriously. You come for Ayurvedic treatment, planned by an experienced physician and delivered by trained therapists.",
      ],
      home: "Treatment is only one part of your day. There's breakfast to sit down to. A quiet corner to rest in. Unhurried time with your doctor, and a campus to walk through when you feel up to it. An evening that doesn't have to be hurried.",
      notResortLead: "Restful, but not a resort.",
      notResort:
        "People come here to get better. Every therapy is authentic Ayurveda, adapted to you, and nothing is sold as a package. Your meals follow your pathyam, the diet Ayurveda prescribes for your condition, and we make sure they are still something to look forward to.",
      building: "Patients have a building of their own on the campus, used only for their stay. The doctor’s family lives a short walk away, so help is never far.",
      closer: "That is what we mean by an Ayurvedic home hospital.",
    },
    lifestyle: {
      label: "Lifestyle Check",
      heading: "What does your everyday life say about your health?",
      lead: "Before you think about treatment, it helps to look at the life around it.",
      questions:
        "How well are you sleeping? How do you feel after a meal? Is there enough movement in your day? Do you ever really rest, or does the day just keep going until you're too tired to do anything else?",
      body: "The Lifestyle Check takes about two minutes. It looks at eight everyday areas that shape how you feel:",
      areas: ["Sleep", "Food", "Digestion", "Movement", "Stress", "Routine", "Rest", "Energy"],
      action: "Take the Lifestyle Check",
    },
    conditions: {
      label: "Conditions we treat",
      heading: "Ayurveda reaches further than most people expect.",
      paragraphs: [
        "For many people, Ayurveda means an oil massage, or a set of herbal remedies. In fact, it is a complete system of medicine, with branches that range from general medicine and mental health to children’s health and fertility.",
        "At Swetaranya, we treat long-standing conditions across seven specialities. Whatever brings you here, we look for the root cause and plan your treatment around you, not the diagnosis alone.",
      ],
      conditionsLabel: "Conditions:",
      specialities: [
        {
          name: "Orthopaedics",
          focus: "Bones, joints and spine.",
          text: "Pain that has settled into the back, neck or joints, treated with internal medicine, therapies and gentle movement, without surgery.",
          conditions: ["Spine problems", "Arthritis"],
        },
        {
          name: "Neurology",
          focus: "Brain and nerves.",
          text: "Patient, long-term care to support recovery after a stroke, and daily life with Parkinson’s.",
          conditions: ["Paralysis and stroke", "Parkinson’s disease"],
        },
        {
          name: "Dermatology",
          focus: "Skin and allergy.",
          text: "Skin problems often begin on the inside, so we treat the digestion, diet and stress behind them as well as the skin itself.",
          conditions: ["Psoriasis", "Skin diseases", "Allergies"],
        },
        {
          name: "Gastroenterology",
          focus: "Digestion and gut.",
          text: "In Ayurveda, good health starts with digestion. Care for the acidity, IBS and constipation that keep coming back.",
          conditions: ["Gut disorders"],
        },
        {
          name: "Lifestyle diseases",
          focus: "Metabolism and weight.",
          text: "Treatment that works alongside the daily habits that matter most: food, sleep, movement and routine.",
          conditions: ["Diabetes", "Weight loss"],
        },
        {
          name: "Gynaecology",
          focus: "Women’s health.",
          text: "Gentle, personalised care for hormonal balance and fertility.",
          conditions: ["Female infertility", "PCOS and PCOD"],
        },
        {
          name: "Mental health",
          focus: "Mind and wellbeing.",
          text: "Time, quiet and treatment to help a tired or anxious mind find its balance again.",
          conditions: ["Stress", "Mental health"],
        },
      ],
      action: "Book an Online Consultation",
    },
    difference: {
      label: "Why Swetaranya is different",
      heading: "The treatment matters. So does everything around it.",
      intro:
        "Swetaranya is an Ayurvedic hospital in Kerala, led by one of the state’s leading Ayurvedic physicians, with trained therapists and careful clinical care. What sets it apart is the life around the treatment, and how much time your physician has for you.",
      groups: [
        {
          word: "Heal",
          items: [
            {
              lead: "A doctor who doesn’t clock out.",
              text: "Dr. Thrivikraman and his family live on the campus. Swetaranya isn’t somewhere he comes to work; it is where his life is. He sees you every day and adjusts your care as you respond.",
            },
            {
              lead: "Getting to the root.",
              text: "Pain, a rash, poor sleep: these are often signals of something deeper. Your physician looks for what sets things off and treats it there, so the problem is less likely to return.",
            },
            {
              lead: "Care that fits you.",
              text: "A diagnosis tells us what is wrong, not who you are. Your treatment is shaped around your body type (prakriti), digestion, state of mind and any other health concerns. Nobody here follows a fixed package.",
            },
            {
              lead: "Only 12 rooms, by choice.",
              text: "We could take more people. We would rather know each one. With so few patients, there's room to know the person behind the illness.",
            },
          ],
        },
        {
          word: "Live",
          items: [
            {
              lead: "A campus with room to breathe.",
              text: "Swetaranya sits on a large, eco-friendly campus in a quiet village. There is farmland, a family temple, a sarpakkavu (sacred serpent grove) with its pond, and a medicinal garden where many of the herbs for our medicines are grown. The quiet here is real, and it is part of the treatment.",
            },
            {
              lead: "Food you’ll look forward to.",
              text: "Meals follow your pathyam, the diet Ayurveda prescribes for your condition. At Swetaranya, we see food as medicine and an important part of the healing process. We focus on serving pure, clean and nourishing meals, prepared with locally sourced ingredients wherever possible. Within your prescribed diet, we work to keep every meal tasty, fresh and varied.",
            },
            {
              lead: "Time between treatments.",
              text: "There's no rigid timetable. Away from the usual demands of daily life, you can focus on yourself, reconnect with your needs and find a routine that feels more balanced. Rest, read, walk around the campus, sit quietly, or simply enjoy some time to yourself and the people around you.",
            },
          ],
        },
        {
          word: "Learn",
          items: [
            {
              lead: "Understand what your body is telling you.",
              text: "Every day you sit down with your physician to talk about your progress, your habits and how you're feeling. You come to understand your treatment as well as receive it.",
            },
            {
              lead: "Take something home.",
              text: "You leave knowing more about your body and your routine, with lifestyle practices you can keep up after your stay.",
            },
          ],
        },
      ],
      closing: [
        "Healing, living and learning happen together here, as three parts of the same stay.",
        "A physician-led approach to Ayurveda, within a home that gives you room to focus on yourself.",
      ],
      action: "Discover the Swetaranya Way",
    },
    journey: {
      label: "How we heal",
      title: "Your Consultation Journey",
      heading: "Your care starts before you travel.",
      intro:
        "Maybe you're reading this from another part of India, or from a country far away. Maybe you've lived with this condition for years, and there's a folder of reports and a list of questions nobody has had time to answer. You don't have to decide anything on your own.",
      first: {
        step: "Step 1",
        title: "Treatment Preparation",
        sub: "Before you come to Swetaranya",
        items: [
          { lead: "Talk to us from home.", text: "Start with an online consultation. Tell us what has been troubling you, for how long, and what you hope will change." },
          { lead: "Share your previous records.", text: "Reports, scans, prescriptions, details of earlier treatment and any medicines you take now." },
          {
            lead: "A detailed evaluation.",
            text: "The doctor goes through your records and asks about your health, your food habits and your daily routine. Together you decide whether a stay at Swetaranya is right for you.",
          },
          {
            lead: "A preparation routine, if you need one.",
            text: "Based on your health, lifestyle and current routine, your physician may recommend changes to your diet, daily habits and sleep schedule to help prepare your body. Medication may also be prescribed when necessary for patients from India. Every recommendation is discussed with you beforehand, so you understand what is needed, why it matters and how to prepare for your arrival.",
          },
        ],
      },
      arrive: "You arrive at Swetaranya",
      steps: [
        {
          step: "Step 2",
          title: "Root Cause Analysis",
          text: "Now your physician examines you in person. Records only tell part of the story, so the aim is to look past the symptoms and find the imbalance underneath them.",
        },
        {
          step: "Step 3",
          title: "Treatment Planning",
          text: "From what is found, your physician prepares a plan for you alone: your therapies, medicines, food and daily routine. You'll hear what each part involves and how your progress will be reviewed.",
        },
        {
          step: "Step 4",
          title: "Guided Healing Plan",
          text: "Therapies, diet guidance and lifestyle correction, with your physician seeing you every day and adjusting as you respond. When it's time to leave, you go home knowing how to carry it on.",
        },
      ],
      closer: "You don't need to know everything before you contact us. That's what the first conversation is for.",
      action: "Book an Online Consultation",
    },
    physician: {
      label: "Meet the Physician",
      heading: "The doctor is not just visiting.",
      lead: "Dr Thrivikraman Veluthat, Chief Physician, lives on the Swetaranya campus with his family.",
      paragraphs: [
        "One of Kerala’s leading Ayurvedic physicians, he has practised for 36 years, in Kerala and Oman. Today he practises on the campus his family has lived on for generations.",
        "That changes what a stay feels like. There is no rushing in for an appointment and no waiting until tomorrow. Swetaranya is part of his family’s everyday life, so he is around; he sees you every day, and your treatment changes as your body does.",
      ],
      timeHeading: "Time with your physician",
      timeIntro: "Beyond regular consultations, you spend time with your physician, discuss your progress and understand your treatment better, it adds up:",
      time: [
        { lead: "A long first conversation.", text: "Often one to two hours." },
        { lead: "Visits during your treatment.", text: "He looks in to see how your body responds to the treatment." },
        { lead: "Every day after that.", text: "Rounds, check-ins and, often, an unhurried evening conversation." },
      ],
      after: [
        "The conversations go beyond your illness. Your physician takes time to understand your lifestyle, daily habits and overall well-being, including your physical and mental health. These conversations help build a clearer picture of your health, understand the factors that may be affecting it and shape a treatment plan around your individual needs.",
        "They also give you a better understanding of your own health, helping you recognise habits that may need attention and make practical changes to your daily routine. Over time, you begin to look at your health and lifestyle differently, with greater awareness of the choices that support your well-being.",
      ],
      motto: "Understand first. Treat with purpose.",
      action: "Meet Dr. Thrivikraman",
    },
    day: {
      label: "A Day at Swetaranya",
      heading: "A day with room to breathe.",
      body: "Mornings at Swetaranya begin early, setting a positive tone for the day ahead. The fresh morning air, a cup of herbal tea and the calm of nature will give you a refreshing start. Your treatment fits around your plan, since some therapies are best given early and others come later. The rest of the day is yours to enjoy wholesome meals, an afternoon conversation with your physician and yoga towards evening. As the days go by, familiar faces become friends, conversations get longer and the place begins to feel like home. There is time to slow down, connect with yourself and enjoy the simple moments that often get lost in everyday life.",
      intro: "The exact schedule depends on your treatment plan, but a typical day looks something like this:",
      // `at` only places a moment without a clock time on the clock face; the page shows `time` as written.
      items: [
        { time: "7:00 AM", title: "Herbal tea", body: "A gentle start to the morning." },
        {
          time: "Early morning",
          at: "8:00 AM",
          title: "Your treatment",
          body: "Some therapies are best given early, so your treatment may begin before breakfast. Others follow later in the morning. Your physician sets the time and the length.",
        },
        { time: "9:30 AM", title: "Breakfast", body: "A nourishing balanced breakfast from Swetaranya's kitchen." },
        { time: "Late morning", at: "11:00 AM", title: "Time for yourself", body: "Once your treatment is done, the morning is yours. Rest, read or sit quietly outside." },
        { time: "1:15 PM", title: "Lunch", body: "A wholesome meal, then a slow afternoon." },
        {
          time: "3:30 PM",
          title: "Time with your physician",
          body: "Not a five-minute check. Time for your physician to understand how you live and how you are in body and mind, so your treatment keeps fitting you.",
        },
        { time: "4:30 PM", title: "Snacks and herbal tea", body: "A light afternoon break." },
        { time: "6:00 PM", title: "Guided yoga", body: "Movement, breath and awareness, suited to you." },
        { time: "7:00 PM", title: "Dinner", body: "A calm meal as the day comes to a close." },
      ],
      note: "None of this replaces medical care. It is the setting that care takes place in.",
      action: "Explore a Day at Swetaranya",
    },
    theHome: {
      label: "The Home",
      heading: "This was a home long before it became a place of healing.",
      paragraphs: [
        "For 170 years, Veluthat Mana in Vaalamaruthoor, Tirur, has been our family’s home. Generations grew up here, among the fields, the family temple, the sarpakkavu (sacred serpent grove) and its pond.",
        "Our home deity is Kiratamoorthy, Lord Shiva in his form as a hunter, revered by the family as the one who brings relief from all illness. The family is also the ooralan, the hereditary trustees, of the Vaalamaruthoor Durga Bhagavathy Temple. By tradition, it is one of the 108 Durgalayas consecrated across Kerala by Lord Parasurama.",
        "Dr Thrivikraman Veluthat left this village to study and practise Ayurveda, and spent many years building his practice in Kerala and abroad. He came back with a clear idea of how he wanted to work: personally, without hurry, in a place where patients could rest as fully as they were treated.",
        "On 29 May 2011, the family opened Veluthat Mana to patients. Swetaranya began with only a few rooms, and for years we had to turn people away.",
        "Today, patients come to us from nearly 50 countries. Part of the Mana is being rebuilt in traditional Kerala architecture, with rooms set aside only for patients, so that we can care for more people without losing what makes this place special. We are keeping it small on purpose, so every patient still has real time with the physician.",
      ],
    },
    walkthrough: {
      heading: "Before you arrive, take a look around.",
      body: "Maybe you'd like to see where you'll sleep, where your treatment will take place, or what the campus looks like. Walk through Swetaranya from wherever you are: the rooms, the treatment spaces, the dining area, the yoga space and the grounds. Take your time.",
      line: "A little familiarity can make your first visit more comfortable.",
      walkthrough: "Take the 360° Walkthrough",
      explore: "Explore the Home",
    },
    guests: {
      label: "In our guests' words",
      heading: "Every person who comes here has a story.",
      body: "Since 2011, patients from nearly 50 countries have stayed with us. They came with different conditions, different questions and different hopes. Here are a few of their stories, in their own words.",
      quote: "This is how a hospital treatment should be.",
      quoteBy: "Dr M.A. Razak, Tamil Nadu, treated for Parkinsonism",
      action: "Read Patient Stories",
    },
    finalCta: {
      heading: "There is a place for you on our table.",
      paragraphs: [
        "Swetaranya has been our family’s home for generations. Today it is also an Ayurvedic home hospital: a physician who knows you, treatment planned around your condition, food that follows your pathyam and time to understand your health.",
        "Whatever brings you here, we're happy to talk it through and help you find the right way forward.",
      ],
      invite: "Slow down. Be heard. Begin your Ayurvedic journey.",
      book: "Book an Online Consultation",
      enquire: "Enquiry form",
      questionLead: "Have a question first?",
      whatsapp: "Message us on WhatsApp",
      familyLead: "Enquiring for someone you love?",
      family: "You are welcome to begin the conversation on their behalf.",
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

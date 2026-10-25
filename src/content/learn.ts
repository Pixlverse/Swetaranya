/**
 * Learn Ayurveda — copy exactly as supplied in CONTENT/LEARN AYURVEDA (1).docx.
 * Only fix: a missing space after "ill." in the Everyday life intro. Trailing → on link labels is dropped
 * (link styling carries that), and the doc's notes ("Answers:", "At the end:") are layout instructions, not copy.
 */
export const LEARN = {
  hero: {
    label: "Learn Ayurveda",
    display: [
      "A little more understanding.",
      "A different way of looking at health.",
    ],
    body: [
      "Ayurveda is often thought of as treatments, herbal oils and medicines. But its understanding of health goes much further. It looks at how we eat, sleep, move and digest, and how we respond to the world around us.",
      "This is a place to learn the basic principles of Ayurveda, one idea at a time.",
    ],
    line: "Understand Ayurveda. Understand yourself. Understand the way you live.",
  },
  chapters: [
    {
      id: "way-of-life",
      n: "01",
      label: "A way of life",
    },
    {
      id: "balance",
      n: "02",
      label: "Balance",
    },
    {
      id: "everyday-life",
      n: "03",
      label: "Everyday life",
    },
    {
      id: "your-habits",
      n: "04",
      label: "Your habits",
    },
    {
      id: "at-swetaranya",
      n: "05",
      label: "At Swetaranya",
    },
  ],
  wayOfLife: {
    n: "01",
    label: "Ayurveda is a way of life",
    heading: "Ayurveda is about more than getting better.",
    body: [
      "Ask most people what Ayurveda is, and they’ll talk about massage, or herbal remedies for back pain, arthritis or a cold. Those are part of it. But Ayurveda is a complete system of medicine, and also a way of living that helps you stay well in the first place.",
      "It has been practised for thousands of years, in hospitals and homes across India. Its classical texts divide it into eight branches.",
    ],
    branchesHeading: "The eight branches of Ayurveda (Ashtanga Ayurveda)",
    branches: [
      {
        name: "Kayachikitsa",
        text: "General medicine, caring for the body as a whole",
      },
      {
        name: "Balachikitsa",
        text: "The health of children",
      },
      {
        name: "Grahachikitsa",
        text: "The mind and mental health",
      },
      {
        name: "Urdhvangachikitsa",
        text: "The head and neck: eyes, ears, nose, throat and mouth",
      },
      {
        name: "Shalyachikitsa",
        text: "Surgical care",
      },
      {
        name: "Damshtrachikitsa (Agadatantra)",
        text: "Toxicology: poisons, bites and their treatment",
      },
      {
        name: "Jarachikitsa (Rasayana)",
        text: "Rejuvenation: strength, immunity and healthy ageing",
      },
      {
        name: "Vrishachikitsa (Vajikarana)",
        text: "Reproductive health and fertility",
      },
    ],
    closer:
      "So Ayurveda isn’t one kind of treatment. It is a whole way of understanding health, from childhood to old age, and from the body to the mind.",
  },
  balance: {
    n: "02",
    label: "What keeps the body in balance?",
    heading: "What Ayurveda teaches us about the body.",
    elements: {
      heading: "Made of the same things as the world",
      body: "Ayurveda sees the body as made of the same five elements as the world around us: space, air, fire, water and earth. They are present in the body in visible, physical forms, and in subtler ones too.",
      words: ["space", "air", "fire", "water", "earth"],
    },
    doshas: {
      heading: "Three energies: Vata, Pitta and Kapha (the Tridosha)",
      intro:
        "In their subtler form, the elements work in the body as three energies, called the doshas:",
      items: [
        {
          name: "Vata",
          text: "linked with movement",
        },
        {
          name: "Pitta",
          text: "linked with transformation, such as digestion",
        },
        {
          name: "Kapha",
          text: "linked with structure and stability",
        },
      ],
      body: "Everyone has all three, in their own balance. In the Ayurvedic way of understanding health, keeping that balance is part of staying well. Treatment is often about helping the body find it again.",
    },
    agni: {
      heading: "Agni in Ayurveda: the fire within",
      body: "At the centre of it all is agni, the digestive fire that turns food into nourishment. When agni works well, the body is well fed and strong. When it weakens, the effects can be felt far beyond the stomach. That’s why an Ayurvedic physician always asks about your digestion, whatever brought you in.",
    },
    mind: {
      heading: "The mind is part of the picture",
      body: "Ayurveda never separates the mind from the body. It describes qualities of the mind, called Rajas and Tamas, which can disturb it when they are out of balance. The mind is cared for through the same doshas and agni as the body, with medicines and therapies chosen for each person.",
    },
    care: {
      heading:
        "Aharam, Viharam, Aushadhi: food, lifestyle and medicine, working together",
      intro: "Ayurvedic care rests on three things:",
      items: [
        {
          name: "Aharam",
          text: "food, the right food for you",
        },
        {
          name: "Viharam",
          text: "lifestyle: how you move, rest and manage your day, in body and mind",
        },
        {
          name: "Aushadhi",
          text: "medicine and therapies",
        },
      ],
      body: "None of them works alone. Ayurveda gives food a special place, because good digestion is seen as the foundation of health and recovery. What is right for you depends on your digestion and your body nature. In some situations, the right food can matter as much as the medicine, or even more.",
    },
    link: {
      label: "Read more from the physician",
      href: "/journal",
    },
  },
  everyday: {
    n: "03",
    label: "Ayurveda in everyday life",
    heading: "Small habits, every day.",
    intro:
      "Ayurveda isn’t only for when you’re ill. Much of it is about the ordinary parts of the day, and how they add up. Ayurveda calls this daily routine dinacharya.",
    routine: [
      {
        title: "Waking",
        body: "The Ayurvedic day traditionally begins early, around 5 am. When you wake, don’t jump straight up. Take a minute or two to notice how your body feels.",
        notice: "Try noticing: do you wake up feeling fresh?",
      },
      {
        title: "Eating",
        body: "Food is chosen to suit your digestion, not only your taste. Eating at regular times helps agni do its work.",
        notice: "Try noticing: how do you feel an hour or two after a meal?",
      },
      {
        title: "Moving",
        body: "The right amount of activity keeps the body and mind steady. Too little or too much both take their toll.",
        notice:
          "Try noticing: does your body feel stiff, tired or light through the day?",
      },
      {
        title: "Resting the mind",
        body: "Ayurveda treats mental strain as seriously as physical strain. Both need balancing.",
        notice:
          "Try noticing: how often do you feel mentally tired by evening?",
      },
      {
        title: "Sleeping",
        body: "Traditional routines suggest going to bed around 10 pm, with six to eight hours of sleep. Everyone’s needs and circumstances are different, but steady sleep is one of the foundations of health.",
        notice: "Try noticing: is your bedtime roughly the same each night?",
      },
    ],
    firstSign: {
      heading: "The first sign: how you wake up",
      body: [
        "If you wake feeling fresh and full of energy, it’s worth asking why. Good sleep, the right food, and a balance of activity and rest all play a part.",
        "If you often wake tired, or without that freshness, it may be your body’s way of saying something in your routine or your health needs attention.",
      ],
    },
  },
  habits: {
    n: "04",
    label: "Discover your own habits",
    heading: "Take two minutes to look at your day.",
    intro:
      "You’ve read how Ayurveda looks at daily life. Now look at your own. There are no right or wrong answers, and no score. These questions are simply a way to notice your habits.",
    questions: [
      "Do you usually wake up feeling fresh?",
      "Do you go to bed at roughly the same time each night?",
      "Do you get around six to eight hours of sleep?",
      "Do you eat your meals at regular times?",
      "Is your digestion usually comfortable?",
      "Do you move your body in some way most days?",
      "Do you feel mentally rested at the end of the day?",
    ],
    answers: ["Most days", "Sometimes", "Rarely"],
    end: {
      heading: "Thank you for taking a moment to reflect.",
      body: "Look back at your answers. Did any surprise you? Ayurveda often begins with small changes to the everyday: a steadier bedtime, regular meals, a little more rest.",
      rarely:
        "If you answered “Rarely” to several questions, or something has been troubling you for a while, a conversation with a physician can help you understand what may be behind it.",
      link: {
        label: "Talk to a Swetaranya physician",
        href: "/talk-to-the-physician",
      },
    },
    disclaimer:
      "This reflection is for general awareness only. It is not a medical assessment or diagnosis.",
  },
  atSwetaranya: {
    n: "05",
    label: "Ayurveda at Swetaranya",
    heading: "Where these ideas become care.",
    intro:
      "Every principle of Ayurveda on this page is part of how we treat patients at Swetaranya.",
    points: [
      {
        lead: "Balance and the root cause.",
        text: "We look at your body nature, your digestion and your state of mind to find what lies beneath your illness, and treat it there.",
      },
      {
        lead: "Food as care.",
        text: "Your meals follow your pathyam, the diet prescribed for your condition, cooked fresh in our kitchen.",
      },
      {
        lead: "The rhythm of the day.",
        text: "Your stay follows an Ayurvedic daily routine, with therapies, meals, rest and sleep at the right time.",
      },
      {
        lead: "Mind and body together.",
        text: "Our physicians plan care for the body and support for the mind as part of the same treatment.",
      },
      {
        lead: "Habits you take home.",
        text: "You leave understanding your body better, with a daily routine to carry on at home.",
      },
    ],
    links: [
      {
        label: "See life at Swetaranya",
        href: "/life-at-swetaranya",
      },
      {
        label: "How treatment works",
        href: "/treatments",
      },
    ],
  },
  closing: {
    heading: "Understanding yourself is where Ayurveda begins.",
    body: "If you’d like to know what Ayurveda could do for your health, start with a conversation.",
    cta: {
      label: "Book an Online Consultation",
      href: "/book-a-consultation",
    },
  },
} as const;

export type LearnContent = typeof LEARN;

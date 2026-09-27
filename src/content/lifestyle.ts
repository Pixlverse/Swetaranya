import type { LifestyleArea } from "@/lib/constants";

/** Eight questions, one per area. Answer values run 0–3; 3 is the steadiest. Order is the order asked. */
export const LIFESTYLE_QUESTIONS: { area: LifestyleArea; question: string; options: { label: string; value: 0 | 1 | 2 | 3 }[] }[] = [
  {
    area: "sleep",
    question: "How do you usually sleep?",
    options: [
      { label: "Deeply, and I wake up rested", value: 3 },
      { label: "Mostly well, with a few restless nights", value: 2 },
      { label: "I find it hard to fall asleep or stay asleep", value: 1 },
      { label: "Poorly, most nights", value: 0 },
    ],
  },
  {
    area: "food",
    question: "What are your meals usually like?",
    options: [
      { label: "Regular, warm and mostly home-cooked", value: 3 },
      { label: "Fairly regular, sometimes rushed", value: 2 },
      { label: "Irregular, often eaten on the go", value: 1 },
      { label: "I often skip meals or eat late at night", value: 0 },
    ],
  },
  {
    area: "digestion",
    question: "How do you feel after you eat?",
    options: [
      { label: "Light and comfortable", value: 3 },
      { label: "Occasionally heavy or bloated", value: 2 },
      { label: "Often heavy, gassy or acidic", value: 1 },
      { label: "Uncomfortable on most days", value: 0 },
    ],
  },
  {
    area: "movement",
    question: "How much do you move in a typical day?",
    options: [
      { label: "I walk, stretch or exercise most days", value: 3 },
      { label: "A few times a week", value: 2 },
      { label: "Rarely — I sit for most of the day", value: 1 },
      { label: "Hardly at all, or movement is painful", value: 0 },
    ],
  },
  {
    area: "stress",
    question: "How often do you feel stressed or anxious?",
    options: [
      { label: "Rarely", value: 3 },
      { label: "Sometimes, and it passes", value: 2 },
      { label: "Often", value: 1 },
      { label: "Almost all the time", value: 0 },
    ],
  },
  {
    area: "routine",
    question: "How regular are your days — waking, eating, sleeping?",
    options: [
      { label: "Very regular, most days look alike", value: 3 },
      { label: "Regular on weekdays, not at weekends", value: 2 },
      { label: "It changes a lot from day to day", value: 1 },
      { label: "I don't really have a routine", value: 0 },
    ],
  },
  {
    area: "rest",
    question: "Do you give yourself time to rest — without screens or work?",
    options: [
      { label: "Yes, every day", value: 3 },
      { label: "A few times a week", value: 2 },
      { label: "Rarely", value: 1 },
      { label: "I can't remember the last time", value: 0 },
    ],
  },
  {
    area: "energy",
    question: "How is your energy through the day?",
    options: [
      { label: "Steady from morning to evening", value: 3 },
      { label: "A dip in the afternoon, then fine", value: 2 },
      { label: "Low for much of the day", value: 1 },
      { label: "I feel tired all the time", value: 0 },
    ],
  },
];

/** Gentle reflections per area. Deliberately not diagnostic. */
export const AREA_NOTES: Record<LifestyleArea, { steady: string; attention: string; care: string }> = {
  sleep: { steady: "Your sleep sounds like a strength.", attention: "Sleep is sometimes unsettled.", care: "Sleep seems to be a struggle at the moment." },
  food: { steady: "Your meals have a good rhythm.", attention: "Meals are sometimes rushed or irregular.", care: "Mealtimes seem to have lost their rhythm." },
  digestion: { steady: "Digestion feels comfortable.", attention: "Digestion is occasionally heavy.", care: "Digestion seems to be troubling you often." },
  movement: { steady: "You move regularly.", attention: "Movement comes and goes.", care: "Your body may be asking for more gentle movement." },
  stress: { steady: "Stress seems to pass through without staying.", attention: "Stress visits fairly often.", care: "Stress seems to be a constant companion." },
  routine: { steady: "Your days have a steady shape.", attention: "Your routine holds on some days, not others.", care: "Your days don't have much of a shape right now." },
  rest: { steady: "You make room for rest.", attention: "Rest is sometimes squeezed out.", care: "Rest seems to have gone missing." },
  energy: { steady: "Your energy holds through the day.", attention: "Energy dips at times.", care: "Energy seems low for much of the day." },
};

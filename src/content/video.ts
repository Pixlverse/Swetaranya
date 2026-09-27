/** Chapters of the Experience Swetaranya film. `seconds` drives seeking once the real video is uploaded. */
export const VIDEO_CHAPTERS = [
  { id: "arrival", at: "0:00", seconds: 0, title: "Arriving at the house", body: "The drive in, the gate, the first cup of tender coconut water." },
  { id: "morning", at: "1:40", seconds: 100, title: "Before sunrise", body: "Lamps, yoga on the verandah and the garden waking up." },
  { id: "consultation", at: "3:05", seconds: 185, title: "With the physician", body: "A consultation, unhurried — pulse, questions and listening." },
  { id: "treatment", at: "4:50", seconds: 290, title: "The treatment rooms", body: "Oils warming, therapists working in rhythm." },
  { id: "kitchen", at: "6:30", seconds: 390, title: "The kitchen", body: "What is cooked, how, and for whom." },
  { id: "evening", at: "8:15", seconds: 495, title: "Evening", body: "Dusk, the lamp and an early dinner." },
];

/** Set when the real film is uploaded to Cloudinary. Until then the page shows a placeholder. */
export const EXPERIENCE_VIDEO_URL: string | null = null;

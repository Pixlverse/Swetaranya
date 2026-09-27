/**
 * Know Your Constitution — PLACEHOLDER questions and descriptions, pending review by Dr. Thrivikraman.
 * Each answer leans towards one dosha. Scoring: share of answers per dosha (see lib/constitution.ts).
 */
export type Dosha = "vata" | "pitta" | "kapha";

export const DOSHAS: Record<Dosha, { name: string; elements: string; qualities: string[]; balanced: string; unsettled: string; everyday: string[] }> = {
  vata: {
    name: "Vata",
    elements: "Air and space",
    qualities: ["Light", "Quick", "Dry", "Cool", "Changeable"],
    balanced: "Creative, lively, adaptable and quick to learn.",
    unsettled: "Worry, restless sleep, dryness, irregular appetite and digestion.",
    everyday: ["Warm, cooked, gently oiled food at regular times", "A steady daily routine and early nights", "Warmth — in food, clothing and oil massage"],
  },
  pitta: {
    name: "Pitta",
    elements: "Fire and water",
    qualities: ["Hot", "Sharp", "Intense", "Oily", "Focused"],
    balanced: "Clear-thinking, driven, warm and a natural leader.",
    unsettled: "Irritability, acidity, feeling overheated, perfectionism.",
    everyday: ["Cooling, fresh food; fewer very spicy or fried meals", "Never skipping meals", "Time outdoors in the cool of morning or evening"],
  },
  kapha: {
    name: "Kapha",
    elements: "Earth and water",
    qualities: ["Steady", "Heavy", "Soft", "Slow", "Stable"],
    balanced: "Calm, patient, loyal, with strong stamina.",
    unsettled: "Sluggishness, heaviness after meals, oversleeping, low motivation.",
    everyday: ["Lighter, warm, well-spiced meals; an early, small dinner", "Daily movement that raises the pulse", "Rising early, before the heaviness of late morning"],
  },
};

export const CONSTITUTION_QUESTIONS: { id: string; question: string; options: { label: string; dosha: Dosha }[] }[] = [
  { id: "frame", question: "How would you describe your natural build?", options: [
    { label: "Slim and light; I find it hard to gain weight", dosha: "vata" },
    { label: "Medium and muscular", dosha: "pitta" },
    { label: "Broad and sturdy; I gain weight easily", dosha: "kapha" } ] },
  { id: "skin", question: "What is your skin usually like?", options: [
    { label: "Dry, rough or cool to touch", dosha: "vata" },
    { label: "Warm, sensitive, reddens easily", dosha: "pitta" },
    { label: "Smooth, soft, slightly oily", dosha: "kapha" } ] },
  { id: "hair", question: "And your hair?", options: [
    { label: "Dry, thin or frizzy", dosha: "vata" },
    { label: "Fine, greying or thinning early", dosha: "pitta" },
    { label: "Thick, lustrous, often wavy", dosha: "kapha" } ] },
  { id: "appetite", question: "How is your appetite?", options: [
    { label: "Irregular — sometimes hungry, sometimes not", dosha: "vata" },
    { label: "Strong; I get irritable if I miss a meal", dosha: "pitta" },
    { label: "Steady; I can skip a meal without much trouble", dosha: "kapha" } ] },
  { id: "digestion", question: "After eating, you usually notice…", options: [
    { label: "Gas, bloating or irregularity", dosha: "vata" },
    { label: "Quick digestion, sometimes acidity", dosha: "pitta" },
    { label: "Heaviness or sleepiness", dosha: "kapha" } ] },
  { id: "weather", question: "Which weather troubles you most?", options: [
    { label: "Cold, dry and windy", dosha: "vata" },
    { label: "Hot and humid", dosha: "pitta" },
    { label: "Cold and damp", dosha: "kapha" } ] },
  { id: "sleep", question: "How do you sleep?", options: [
    { label: "Lightly; I wake easily", dosha: "vata" },
    { label: "Moderately; I may wake feeling warm", dosha: "pitta" },
    { label: "Deeply and long; I'm hard to wake", dosha: "kapha" } ] },
  { id: "energy", question: "Your energy through a day is…", options: [
    { label: "In bursts, then I tire suddenly", dosha: "vata" },
    { label: "Steady and driven", dosha: "pitta" },
    { label: "Slow to start, then strong and lasting", dosha: "kapha" } ] },
  { id: "mind", question: "Your mind tends to be…", options: [
    { label: "Quick, creative, often restless", dosha: "vata" },
    { label: "Sharp, focused, decisive", dosha: "pitta" },
    { label: "Calm, steady, methodical", dosha: "kapha" } ] },
  { id: "stress", question: "Under stress, you become…", options: [
    { label: "Anxious or worried", dosha: "vata" },
    { label: "Irritable or impatient", dosha: "pitta" },
    { label: "Withdrawn or stubborn", dosha: "kapha" } ] },
  { id: "memory", question: "How do you remember things?", options: [
    { label: "I learn quickly and forget quickly", dosha: "vata" },
    { label: "Clearly and precisely", dosha: "pitta" },
    { label: "Slowly — but I never forget", dosha: "kapha" } ] },
  { id: "speech", question: "People would say you speak…", options: [
    { label: "Quickly, and a lot", dosha: "vata" },
    { label: "Precisely and persuasively", dosha: "pitta" },
    { label: "Slowly, softly, thoughtfully", dosha: "kapha" } ] },
];

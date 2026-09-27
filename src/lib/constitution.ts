import { CONSTITUTION_QUESTIONS, type Dosha } from "@/content/constitution";

export type ConstitutionResult = { vata: number; pitta: number; kapha: number; dominant: string };

/** Shared by client (instant result) and API (stored result). PLACEHOLDER method — to be settled with the physician. */
export function scoreConstitution(answers: Record<string, Dosha>): ConstitutionResult {
  const counts = { vata: 0, pitta: 0, kapha: 0 };
  let total = 0;
  for (const q of CONSTITUTION_QUESTIONS) {
    const a = answers[q.id];
    if (a) {
      counts[a] += 1;
      total += 1;
    }
  }
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const vata = pct(counts.vata);
  const pitta = pct(counts.pitta);
  const kapha = 100 - vata - pitta;
  const ranked = (Object.entries({ vata, pitta, kapha }) as [Dosha, number][]).sort((a, b) => b[1] - a[1]);
  // Within 10 points reads as a dual tendency, e.g. "vata-pitta".
  const dominant = ranked[0][1] - ranked[1][1] <= 10 ? `${ranked[0][0]}-${ranked[1][0]}` : ranked[0][0];
  return { vata, pitta, kapha, dominant };
}

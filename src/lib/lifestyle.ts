import { LIFESTYLE_AREAS, type LifestyleArea } from "./constants";

export type LifestyleResponses = Record<LifestyleArea, number>;

/** Shared by the client (instant result) and the API (what gets stored), so both always agree. */
export function scoreLifestyle(responses: LifestyleResponses) {
  const scorePercentages = Object.fromEntries(LIFESTYLE_AREAS.map((a) => [a, Math.round((responses[a] / 3) * 100)])) as Record<LifestyleArea, number>;
  const overallPercentage = Math.round(LIFESTYLE_AREAS.reduce((sum, a) => sum + scorePercentages[a], 0) / LIFESTYLE_AREAS.length);
  return { scorePercentages, overallPercentage };
}

export const band = (pct: number) => (pct >= 67 ? "steady" : pct >= 34 ? "attention" : "care");

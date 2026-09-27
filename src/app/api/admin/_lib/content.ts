import "server-only";
import { Therapy, Video } from "@/models";
import { handleDbError, jsonError } from "./http";

/** Keep only therapy ids that actually exist, de-duplicated, preserving the chosen order. */
export async function existingTherapyIds(ids: string[]) {
  if (!ids.length) return [];
  const found = new Set((await Therapy.find({ _id: { $in: ids } }).select("_id").lean()).map((t) => t._id.toString()));
  return [...new Set(ids)].filter((id) => found.has(id));
}

/** Structural equality for JSON-ish values, ignoring key order. */
export function sameJson(a: unknown, b: unknown) {
  return stableStringify(a) === stableStringify(b);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : 1));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export const CONSENT_REQUIRED = "A testimonial cannot be published without recorded patient consent.";
export const PLACEHOLDER_UNPUBLISHABLE =
  "Placeholder testimonials cannot be published. They are shown only through the labelled placeholder path until a consented story replaces them.";

/** Surface the model's consent-gate hook error as a 400 rather than a generic 500. */
export function testimonialError(err: unknown) {
  if (err instanceof Error && /consent/i.test(err.message)) return jsonError(err.message, 400);
  return handleDbError(err);
}

/** Only one video leads the Experience page: featuring one un-features the rest. */
export async function unfeatureOtherVideos(id: string) {
  await Video.updateMany({ _id: { $ne: id }, featured: true }, { $set: { featured: false } });
}

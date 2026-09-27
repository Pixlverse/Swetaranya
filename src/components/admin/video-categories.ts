import type { VideoInput } from "@/lib/validation/admin";

/**
 * Category options for the video form, from the model's VIDEO_CATEGORIES. The parameter type makes
 * this fail to compile if the model gains a category the admin Zod enum doesn't accept.
 */
export function videoCategoryOptions(categories: readonly { slug: VideoInput["category"]; label: string }[]) {
  return categories.map((c) => ({ slug: c.slug, label: c.label }));
}

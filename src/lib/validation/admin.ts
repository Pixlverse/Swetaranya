/**
 * Zod schemas shared by admin forms (client) and /api/admin route handlers (server).
 * Keep this file free of server-only imports.
 */
import { z } from "zod";
import { ADMIN_ROLES, CONSULTATION_MODES, ENQUIRY_STATUSES, JOURNAL_CATEGORY_SLUGS } from "@/lib/constants";

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id");

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens");

const text = (max: number) => z.string().trim().max(max);
const required = (label: string, max: number) => z.string().trim().min(1, `${label} is required`).max(max);

const optionalUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "Must be an http(s) URL");

const imageSchema = z.object({ url: optionalUrl, alt: text(300) });

export const faqSchema = z.object({ question: required("Question", 300), answer: required("Answer", 4000) });

export const conditionSchema = z.object({
  slug: slugSchema,
  name: required("Name", 120),
  summary: required("Summary", 2000),
  approach: text(20000),
  whatToExpect: text(20000),
  heroImage: imageSchema,
  faqs: z.array(faqSchema).max(40),
  relatedTherapies: z.array(objectIdSchema).max(60),
  seoTitle: text(120),
  seoDescription: text(320),
  order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});
export type ConditionInput = z.input<typeof conditionSchema>;

export const therapySchema = z.object({
  slug: slugSchema,
  name: required("Name", 120),
  malayalamName: text(120),
  category: z.enum(["panchakarma", "individual"]),
  summary: required("Summary", 1000),
  description: required("Description", 20000),
  duration: required("Duration", 120),
  image: imageSchema,
  order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});
export type TherapyInput = z.input<typeof therapySchema>;

export const journalPostSchema = z.object({
  slug: slugSchema,
  title: required("Title", 200),
  category: z.enum(JOURNAL_CATEGORY_SLUGS),
  excerpt: text(600),
  body: required("Body", 60000),
  author: required("Author", 120),
  publishedAt: z.coerce.date({ error: "Enter a valid date" }),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  published: z.boolean(),
});
export type JournalPostInput = z.input<typeof journalPostSchema>;

const mediaSchema = z.object({ kind: z.enum(["image", "video"]), url: optionalUrl.refine((v) => v !== "", "URL is required"), alt: text(300) });

export const testimonialSchema = z.object({
  patientName: required("Name", 120),
  country: required("Country", 80),
  condition: text(120),
  quote: required("Quote", 4000),
  consentGiven: z.boolean(),
  published: z.boolean(),
  media: z.array(mediaSchema).max(10),
});
export const testimonialPatchSchema = testimonialSchema.partial();
export type TestimonialInput = z.input<typeof testimonialSchema>;

/** "m:ss", "h:mm:ss" or plain seconds → seconds. Returns null when it can't be read. */
export function parseTimecode(input: string): number | null {
  const s = input.trim();
  if (/^\d+$/.test(s)) return Number(s);
  const m = /^(?:(\d+):)?([0-5]?\d):([0-5]\d)$/.exec(s);
  if (!m) return null;
  return Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** Seconds → "m:ss" (or "h:mm:ss"). */
export function formatTimecode(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const sec = String(Math.floor(seconds % 60)).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

export const VIDEO_CATEGORY_SLUGS = ["life-at-swetaranya", "treatments", "learn-ayurveda", "guest-stories"] as const;

export const videoChapterSchema = z.object({
  title: required("Chapter title", 200),
  seconds: z.number({ error: "Chapter start must be a time like 1:30" }).int().min(0).max(86_400),
  body: text(2000),
});

export const videoSchema = z.object({
  slug: slugSchema,
  title: required("Title", 200),
  description: text(4000),
  category: z.enum(VIDEO_CATEGORY_SLUGS),
  url: optionalUrl,
  thumbnail: imageSchema,
  duration: text(40),
  chapters: z.array(videoChapterSchema).max(60),
  featured: z.boolean(),
  order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});
export type VideoInput = z.input<typeof videoSchema>;

/** An absolute http(s) URL, or a site-relative path such as /ebooks/guide.pdf. */
const fileUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v) || /^\/(?!\/)\S*$/.test(v), "Must be an http(s) URL or a path starting with /");

export const ebookSchema = z.object({
  slug: slugSchema,
  title: required("Title", 200),
  subtitle: text(300),
  description: text(4000),
  contents: z.array(z.string().trim().min(1, "Remove empty contents lines").max(300)).max(40),
  cover: imageSchema,
  fileUrl,
  pages: z.number().int().min(1).max(5000).nullable(),
  requiresEmail: z.boolean(),
  order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});
export type EbookInput = z.input<typeof ebookSchema>;

export const ebookDownloadsQuerySchema = z.object({ ebook: objectIdSchema.optional() });

export const pageKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const pageSectionsSchema = z.object({
  sections: z
    .array(
      z.object({
        key: z
          .string()
          .trim()
          .min(1)
          .max(60)
          .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Section keys start with a letter and use letters, numbers, - or _"),
        data: z.record(z.string(), z.unknown()),
      }),
    )
    .max(60)
    .refine((s) => new Set(s.map((x) => x.key)).size === s.length, "Section keys must be unique"),
});

export const enquiryUpdateSchema = z
  .object({ status: z.enum(ENQUIRY_STATUSES).optional(), internalNotes: z.string().max(20000).optional() })
  .refine((v) => v.status !== undefined || v.internalNotes !== undefined, "Nothing to update");

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM (24-hour)");
const slotBase = {
  physicianId: objectIdSchema,
  durationMinutes: z.coerce.number().int().min(10, "At least 10 minutes").max(240, "At most 4 hours"),
  mode: z.enum(CONSULTATION_MODES),
};

export const slotCreateSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("single"), date: dateString, time: timeString, ...slotBase }),
  z.object({
    kind: z.literal("batch"),
    startDate: dateString,
    endDate: dateString,
    weekdays: z.array(z.number().int().min(0).max(6)).min(1, "Pick at least one weekday"),
    times: z.array(timeString).min(1, "Add at least one time").max(24),
    ...slotBase,
  }),
]);
export type SlotCreateInput = z.input<typeof slotCreateSchema>;

export const bookingUpdateSchema = z.object({ cancelled: z.literal(true), note: text(1000).optional() });

export const lifestyleUpdateSchema = z.object({ followedUp: z.boolean() });
export const quizUpdateSchema = lifestyleUpdateSchema;

/** Body for admin actions that take no input (POST with `{}`). */
export const emptyBodySchema = z.object({}).strict();

const passwordSchema = z.string().min(10, "Password must be at least 10 characters").max(200);

export const userCreateSchema = z.object({
  name: required("Name", 120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email").max(200)),
  role: z.enum(ADMIN_ROLES),
  password: passwordSchema,
});

export const userUpdateSchema = z
  .object({
    name: required("Name", 120).optional(),
    role: z.enum(ADMIN_ROLES).optional(),
    active: z.boolean().optional(),
    password: passwordSchema.optional(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), "Nothing to update");

/** First issue as a readable message, for API error responses. */
export function zodMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Invalid input";
  const path = issue.path.join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}

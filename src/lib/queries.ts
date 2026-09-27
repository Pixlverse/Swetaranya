import "server-only";
import { connectDB } from "./db";
import { plain } from "./serialize";
import { Condition, Ebook, JournalPost, PageContent, Testimonial, Therapy, Video, PUBLISHABLE_TESTIMONIAL_FILTER } from "@/models";
import { PAGE_DEFAULTS, type PageKey } from "@/content/pages";

type Img = { url?: string | null; alt?: string | null } | null | undefined;

export type TherapyView = {
  _id: string;
  slug: string;
  name: string;
  malayalamName?: string;
  category: "panchakarma" | "individual";
  summary: string;
  description: string;
  duration: string;
  image?: Img;
};
export type ConditionView = {
  _id: string;
  slug: string;
  name: string;
  summary: string;
  approach: string;
  whatToExpect: string;
  heroImage?: Img;
  faqs: { question: string; answer: string }[];
  relatedTherapies: TherapyView[];
  seoTitle?: string;
  seoDescription?: string;
};
export type JournalPostView = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  publishedAt: string;
  tags: string[];
};
export type TestimonialView = {
  _id: string;
  patientName: string;
  country: string;
  condition?: string;
  quote: string;
  isPlaceholder: boolean;
};

export async function getTherapies() {
  await connectDB();
  return plain(await Therapy.find({ published: true }).sort({ order: 1 }).lean()) as unknown as TherapyView[];
}

export async function getTherapy(slug: string) {
  await connectDB();
  const t = await Therapy.findOne({ slug, published: true }).lean();
  if (!t) return null;
  const conditions = await Condition.find({ relatedTherapies: t._id, published: true }).select("slug name").sort({ order: 1 }).lean();
  return { therapy: plain(t) as unknown as TherapyView, conditions: plain(conditions) as unknown as { slug: string; name: string }[] };
}

export async function getConditions() {
  await connectDB();
  return plain(await Condition.find({ published: true }).sort({ order: 1 }).select("slug name summary").lean()) as unknown as Pick<
    ConditionView,
    "_id" | "slug" | "name" | "summary"
  >[];
}

export async function getCondition(slug: string) {
  await connectDB();
  const c = await Condition.findOne({ slug, published: true }).populate({ path: "relatedTherapies", match: { published: true } }).lean();
  return c ? (plain(c) as unknown as ConditionView) : null;
}

export async function getJournalPosts(opts: { category?: string; limit?: number } = {}) {
  await connectDB();
  const q = JournalPost.find({ published: true, ...(opts.category ? { category: opts.category } : {}) }).sort({ publishedAt: -1 });
  if (opts.limit) q.limit(opts.limit);
  return plain(await q.select("-body").lean()) as unknown as Omit<JournalPostView, "body">[];
}

export async function getJournalPost(slug: string) {
  await connectDB();
  const p = await JournalPost.findOne({ slug, published: true }).lean();
  return p ? (plain(p) as unknown as JournalPostView) : null;
}

/**
 * Published, consented testimonials only. If none exist yet, the seeded placeholders are returned
 * flagged `isPlaceholder` so the UI can label them — placeholders contain no patient data.
 */
export async function getTestimonials(limit = 3): Promise<TestimonialView[]> {
  await connectDB();
  const real = await Testimonial.find(PUBLISHABLE_TESTIMONIAL_FILTER).sort({ updatedAt: -1 }).limit(limit).select("patientName country condition quote isPlaceholder").lean();
  if (real.length) return plain(real) as unknown as TestimonialView[];
  const placeholders = await Testimonial.find({ isPlaceholder: true }).limit(limit).select("patientName country condition quote isPlaceholder").lean();
  return plain(placeholders) as unknown as TestimonialView[];
}

export type VideoView = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail?: Img;
  duration: string;
  chapters: { title: string; seconds: number; body?: string }[];
  featured: boolean;
};

export async function getVideos() {
  await connectDB();
  return plain(await Video.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).lean()) as unknown as VideoView[];
}

export type EbookView = {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  contents: string[];
  cover?: Img;
  pages?: number;
  requiresEmail: boolean;
};

/** Public listing — never includes fileUrl; the file is only handed out by the download API. */
export async function getEbooks() {
  await connectDB();
  return plain(await Ebook.find({ published: true }).sort({ order: 1, createdAt: -1 }).select("-fileUrl -downloadCount").lean()) as unknown as EbookView[];
}

/** Page copy: code defaults with admin edits from PageContent layered on top. */
export async function getPageContent<K extends PageKey>(pageKey: K): Promise<(typeof PAGE_DEFAULTS)[K]> {
  const defaults = PAGE_DEFAULTS[pageKey];
  try {
    await connectDB();
    const doc = await PageContent.findOne({ pageKey }).lean();
    if (!doc) return defaults;
    const merged: Record<string, unknown> = { ...defaults };
    for (const s of doc.sections ?? []) {
      const base = (defaults as Record<string, object>)[s.key] ?? {};
      merged[s.key] = { ...base, ...(s.data as object) };
    }
    return merged as (typeof PAGE_DEFAULTS)[K];
  } catch {
    return defaults;
  }
}

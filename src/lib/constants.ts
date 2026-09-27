/**
 * Shared, compliance-relevant constants. Import from here — never retype this copy on a page.
 */

export const PHYSICIAN_NAME = "Dr. Thrivikraman Veluthat";
export const PHYSICIAN_SHORT = "Dr. Thrivikraman";

/** Shown with every Lifestyle Check screen and result (CLAUDE.md §6). */
export const LIFESTYLE_CHECK_DISCLAIMER =
  "The Lifestyle Check is a self-awareness tool to help you notice patterns in your daily life. It is not a medical diagnosis, and it does not replace a consultation with a qualified physician.";

/** Shown with every Know Your Constitution screen and result. Never retype per page. */
export const CONSTITUTION_CHECK_DISCLAIMER =
  "Know Your Constitution is a self-reflection questionnaire based on classical Ayurvedic descriptions of Vata, Pitta and Kapha. It is not a medical diagnosis. Your actual constitution (Prakriti) and current state (Vikriti) can only be assessed in person by a qualified Ayurvedic physician.";

/** Site-wide medical disclaimer (footer + condition/therapy pages). */
export const MEDICAL_DISCLAIMER =
  "Information on this site is for general education about Ayurveda and life at Swetaranya. It is not a substitute for medical advice. Every guest's care is decided in consultation with our physician, and outcomes differ from person to person.";

export const JOURNAL_CATEGORIES = [
  { slug: "living-ayurveda", label: "Living Ayurveda" },
  { slug: "understanding-ayurveda", label: "Understanding Ayurveda" },
  { slug: "ayurvedic-treatment", label: "Ayurvedic Treatment" },
  { slug: "food-and-daily-routine", label: "Food & Daily Routine" },
  { slug: "your-ayurveda-stay", label: "Your Ayurveda Stay" },
] as const;

export type JournalCategorySlug = (typeof JOURNAL_CATEGORIES)[number]["slug"];
export const JOURNAL_CATEGORY_SLUGS = JOURNAL_CATEGORIES.map((c) => c.slug) as [
  JournalCategorySlug,
  ...JournalCategorySlug[],
];
export const journalCategoryLabel = (slug: string) =>
  JOURNAL_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export const LIFESTYLE_AREAS = [
  "sleep",
  "food",
  "digestion",
  "movement",
  "stress",
  "routine",
  "rest",
  "energy",
] as const;
export type LifestyleArea = (typeof LIFESTYLE_AREAS)[number];

export const ENQUIRY_STATUSES = ["new", "contacted", "consultation_booked", "closed"] as const;
export const ENQUIRY_TYPES = [
  "talk_to_physician",
  // Later phases — modelled now so no migration is needed:
  "ask_ayurveda",
  "stay_planner",
  "ebook_download",
] as const;

export const CONSULTATION_MODES = ["online", "in_person"] as const;
export const ADMIN_ROLES = ["physician", "staff", "admin"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const HELP_TOPICS = [
  "Back or neck pain",
  "Arthritis or joint pain",
  "Parkinsonism",
  "Sleep, stress or anxiety",
  "Weight and metabolism",
  "A rejuvenation stay",
  "Learning Ayurveda for daily life",
  "Something else",
] as const;

export const ACCEPTED_REPORT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
export const MAX_REPORT_BYTES = 15 * 1024 * 1024;

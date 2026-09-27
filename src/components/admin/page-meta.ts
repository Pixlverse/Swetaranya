/** Friendly names and public URLs for the built-in PageContent keys (see src/content/pages.ts). */
export const PAGE_META: Record<string, { label: string; href: string }> = {
  home: { label: "Home", href: "/" },
  about: { label: "About", href: "/about" },
  "your-stay": { label: "Your Stay", href: "/your-stay" },
  "the-swetaranya-way": { label: "The Swetaranya Way", href: "/the-swetaranya-way" },
  treatments: { label: "Treatments", href: "/treatments" },
  "a-day": { label: "A Day at Swetaranya", href: "/a-day-at-swetaranya" },
  faqs: { label: "FAQs", href: "/faqs" },
};

const ACRONYMS: Record<string, string> = { cta: "CTA", faq: "FAQ", faqs: "FAQs", url: "URL", seo: "SEO", id: "ID" };

/** "panchakarmaBody" → "Panchakarma body", "finalCta" → "Final CTA", "your-stay" → "Your stay". */
export function humanizeKey(key: string) {
  const words = key
    .replace(/[-_]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return words.map((w, i) => ACRONYMS[w] ?? (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(" ");
}

export const pageLabel = (pageKey: string) => PAGE_META[pageKey]?.label ?? humanizeKey(pageKey);

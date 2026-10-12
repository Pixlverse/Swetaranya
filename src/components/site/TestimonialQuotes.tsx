import type { TestimonialView } from "@/lib/queries";

/**
 * Testimonials are open typography — no boxes. The first quote leads large; the rest follow
 * in a narrower column. Placeholders are labelled so they can never be mistaken for real guests.
 */
export function TestimonialQuotes({ items }: { items: TestimonialView[] }) {
  if (!items.length) return null;
  const [lead, ...rest] = items;
  return (
    <div className="mt-12 grid gap-14 lg:grid-cols-12">
      <Quote item={lead} size="lg" className="lg:col-span-7" />
      <div className="space-y-12 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-nordic/15 lg:pl-10">
        {rest.map((t) => (
          <Quote key={t._id} item={t} size="sm" />
        ))}
      </div>
    </div>
  );
}

function Quote({ item, size, className = "" }: { item: TestimonialView; size: "lg" | "sm"; className?: string }) {
  return (
    <figure className={`relative ${className}`}>
      <span aria-hidden className={`block font-heading leading-none text-blush ${size === "lg" ? "text-[5rem] -mb-9" : "text-[3rem] -mb-5"}`}>
        &ldquo;
      </span>
      <blockquote className={`font-heading italic text-nordic ${size === "lg" ? "text-[clamp(1.6rem,2.5vw,2rem)] leading-snug" : "text-[1.3rem] leading-snug"}`}>
        {item.quote}
      </blockquote>
      <figcaption className="mt-5 text-[0.92rem] text-ink/70">
        {item.isPlaceholder && (
          <span className="mb-2 mr-2 inline-block border border-dashed border-terracotta px-2 py-0.5 text-[0.78rem] font-bold text-terracotta">
            Placeholder
          </span>
        )}
        <span className="block">{item.patientName}</span>
        {item.condition && <span className="block text-ink/55">Came for: {item.condition}</span>}
      </figcaption>
    </figure>
  );
}

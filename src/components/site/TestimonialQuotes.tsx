import type { TestimonialView } from "@/lib/queries";

/**
 * Testimonials are open typography — no boxes. The first quote leads large with one more beneath it, and the
 * rest follow in a narrower column, so both sides carry words. Placeholders are labelled so they can never be
 * mistaken for real guests.
 */
export function TestimonialQuotes({ items }: { items: TestimonialView[] }) {
  if (!items.length) return null;
  const [lead, ...others] = items;
  // With four or more, the last one sits under the lead; the side column keeps the rest.
  const under = others.length >= 3 ? others[others.length - 1] : null;
  const side = under ? others.slice(0, -1) : others;
  return (
    <div className="mt-12 grid gap-14 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Quote item={lead} size="lg" />
        {under && (
          <div className="mt-12 border-t border-nordic/15 pt-10 lg:max-w-[34rem]">
            <Quote item={under} size="sm" />
          </div>
        )}
      </div>
      <div className="space-y-12 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-nordic/15 lg:pl-10">
        {side.map((t) => (
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

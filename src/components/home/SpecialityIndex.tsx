import Link from "next/link";

type Speciality = { name: string; focus: string; text: string; conditions: readonly string[] };

/** Conditions that already have their own page; the rest are named without a link. */
const CONDITION_PAGES: Record<string, string> = {
  "Spine problems": "back-and-neck-pain",
  Arthritis: "arthritis",
  "Parkinson’s disease": "parkinsonism",
  Stress: "insomnia-and-stress",
  "Weight loss": "obesity",
};

/**
 * The seven specialities as an index read down the page: the speciality's name set in Fraunces with its
 * plain-English focus beneath, what we treat beside it, and the conditions as small earth-toned tags.
 * Rows are separated by hairlines, not boxed, so it reads like a contents page rather than a card grid.
 */
export function SpecialityIndex({ items, conditionsLabel }: { items: readonly Speciality[]; conditionsLabel: string }) {
  return (
    <ol className="border-t border-nordic/15">
      {items.map((s) => (
        <li
          key={s.name}
          className="group grid gap-x-8 gap-y-3 border-b border-nordic/15 py-7 transition-colors duration-300 ease-calm hover:bg-keppel/8 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:px-4 md:py-8"
        >
          <div>
            <h3 className="text-[clamp(1.4rem,1.9vw,1.75rem)] leading-tight tracking-[-0.015em] text-nordic">{s.name}</h3>
            <p className="mt-1.5 font-heading text-[1.05rem] text-keppel">{s.focus}</p>
          </div>
          <div>
            <p className="text-[1.03rem] leading-relaxed text-ink/80">{s.text}</p>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-[0.92rem]">
              <span className="mr-1 text-ink/60">{conditionsLabel}</span>
              {s.conditions.map((name) => {
                const slug = CONDITION_PAGES[name];
                const tag = "rounded-pill border border-terracotta/45 px-3 py-1 text-clay";
                return slug ? (
                  <Link
                    key={name}
                    href={`/treatments/conditions/${slug}`}
                    className={`${tag} transition-colors duration-300 ease-calm hover:border-terracotta hover:bg-terracotta/10`}
                  >
                    {name}
                  </Link>
                ) : (
                  <span key={name} className={tag}>
                    {name}
                  </span>
                );
              })}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

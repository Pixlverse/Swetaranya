"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** One line icon per row, in the order the rows are written. */
const ICONS: string[][] = [
  // Treatment is part of a way of living: a leaf.
  ["M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z", "M5 19l8-8"],
  // Only 13 rooms: a door.
  ["M6 20.5v-16a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16", "M4 20.5h16", "M14.5 12.5h.01"],
  // Your physician sees you 2–3 times a day: a stethoscope.
  ["M7 3.5v5a4.5 4.5 0 0 0 9 0v-5", "M5 3.5h4M14 3.5h4", "M11.5 13v2a4.5 4.5 0 0 0 9 0v-1.5", "M20.5 10.6a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"],
  // Your treatment changes as you change: turning arrows.
  ["M20 11a8 8 0 0 0-14.5-4.5", "M5.5 3.5v3h3", "M4 13a8 8 0 0 0 14.5 4.5", "M18.5 20.5v-3h-3"],
  // A room in a family home: a house.
  ["M3.5 11.5 12 4.5l8.5 7", "M6 10v9.5h12V10", "M10 19.5v-5h4v5"],
  // Food cooked in the family kitchen: a pot, steaming.
  ["M4 11h16", "M5.5 11v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6", "M2.5 11h2M19.5 11h2", "M9 7.5c-.8-1 .8-1.8 0-3M12 7.5c-.8-1 .8-1.8 0-3M15 7.5c-.8-1 .8-1.8 0-3"],
  // Your day brings everything together: the sun.
  ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"],
  // You are a guest of the family: two people.
  ["M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M3.5 20a5.5 5.5 0 0 1 11 0", "M16 11a2.5 2.5 0 1 0 0-5", "M17 14.5a4.5 4.5 0 0 1 3.5 4.5"],
];

type Row = { large: string; home: string };

/**
 * The comparison as a lattice of small rooms: each cell leads with what Swetaranya offers, and carries what a
 * large hospital does as a quiet note beneath — so it explains rather than ranks. Pointing at a cell warms it
 * and draws its icon.
 */
export function CareGrid({ heading, rows, largeLabel }: { heading: string; rows: readonly Row[]; largeLabel: string }) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <div>
      <div>
        <h3 className="text-balance text-[clamp(1.5rem,2.6vw,2.4rem)] lg:whitespace-nowrap leading-[1.1] tracking-[-0.015em] text-nordic">{heading}</h3>
      </div>

      <div className="mt-8 md:mt-10">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4" onMouseLeave={() => setActive(null)}>
        {rows.map((r, i) => {
          const on = active === i;
          return (
            <li
              key={r.home}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="relative flex min-h-[12rem] flex-col overflow-hidden rounded-[1.5rem] border border-cream/80 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-keppel)_26%,var(--color-cream)),color-mix(in_srgb,var(--color-keppel)_14%,var(--color-cream)))] p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_14px_30px_-18px_rgb(29_57_60/0.35)] outline-offset-[-3px] sm:min-h-[15.5rem] md:p-7"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 -z-0 bg-cream/45"
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              />
              {/* The icon, large and faded behind the words, set into the corner so about 70% of it shows. */}
              <motion.svg
                aria-hidden
                viewBox="0 0 24 24"
                className="pointer-events-none absolute bottom-0 right-0 aspect-square h-auto w-[54%] max-w-[12rem] translate-x-[20%] translate-y-[20%] text-keppel sm:max-w-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ opacity: on ? 0.38 : 0.22, rotate: on && !reduce ? -4 : 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              >
                {ICONS[i % ICONS.length].map((d, k) =>
                  on && !reduce ? (
                    <motion.path key={`${d}-on`} d={d} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: k * 0.12, duration: 0.9, ease: EASE }} />
                  ) : (
                    <path key={d} d={d} />
                  ),
                )}
              </motion.svg>
              <p className="relative max-w-[16ch] font-heading text-[1.35rem] font-semibold leading-snug tracking-[-0.01em] text-nordic sm:max-w-none sm:pr-8">{r.home}</p>
              <p className="relative mt-auto flex items-start gap-2 pt-8 text-[0.92rem] leading-snug text-ink/60">
                <span aria-hidden className="mt-[0.4em] h-2 w-2 shrink-0 rounded-pill ring-1 ring-ink/40" />
                <span>
                  <span className="sr-only">{largeLabel}: </span>
                  {r.large}
                </span>
              </p>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}

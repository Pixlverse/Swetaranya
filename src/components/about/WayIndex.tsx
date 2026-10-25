"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Principle = { readonly lead: string; readonly text: string };

/**
 * The seven principles as an index: on wide screens the bold leads form a list and the one you point at,
 * focus or choose opens beside it; on phones every principle simply reads in full.
 */
export function WayIndex({ principles }: { principles: readonly Principle[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const cur = principles[active];

  return (
    <>
      {/* Phones and tablets: the whole list, lead and sentence together. */}
      <ul className="divide-y divide-cream/15 border-y border-cream/15 lg:hidden">
        {principles.map((p) => (
          <li key={p.lead} className="py-5">
            <p className="font-heading text-[1.3rem] leading-snug text-cream">{p.lead}</p>
            <p className="mt-2 text-[1.02rem] leading-relaxed text-cream/75">{p.text}</p>
          </li>
        ))}
      </ul>

      {/* Wide screens: an index with the chosen principle opened beside it. */}
      <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <ul className="border-t border-cream/15">
          {principles.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.lead} className="border-b border-cream/15">
                <button
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group flex w-full items-center justify-between gap-6 py-4 text-left font-heading text-[clamp(1.25rem,1.7vw,1.6rem)] leading-snug transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-keppel ${
                    on ? "text-cream" : "text-cream/50 hover:text-cream/80"
                  }`}
                >
                  {p.lead}
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 shrink-0 rounded-pill transition-[background-color,transform] duration-300 ${on ? "scale-125 bg-keppel" : "bg-cream/20"}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="relative flex flex-col justify-center rounded-tl-[3rem] rounded-br-[3rem] bg-cream/[0.06] p-10 ring-1 ring-cream/10 xl:p-14" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cur.lead}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <p className="font-heading text-[clamp(1.9rem,2.8vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-keppel">{cur.lead}</p>
              <p className="mt-6 text-[1.18rem] leading-relaxed text-cream/85">{cur.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

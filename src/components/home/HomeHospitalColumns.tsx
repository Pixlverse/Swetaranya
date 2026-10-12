"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const HOLD_MS = 2000;

/** Splits "It is a hospital in the care it gives you." into its shared opening, the noun, and the rest. */
function parts(statement: string) {
  const m = statement.match(/^(It is a)\s+(\S+)\s+(.*)$/);
  return m ? { lead: m[1], word: m[2], rest: m[3] } : { lead: "", word: "", rest: statement };
}

const LOOKS = [
  { bg: "var(--color-nordic)", text: "var(--color-cream)", soft: "rgb(247 249 248 / 0.55)" },
  { bg: "color-mix(in srgb, var(--color-keppel) 24%, var(--color-cream))", text: "var(--color-nordic)", soft: "rgb(29 57 60 / 0.55)" },
];

const ICONS: string[][] = [
  // Hospital: a stethoscope.
  ["M7 3.5v5a4.5 4.5 0 0 0 9 0v-5", "M5 3.5h4M14 3.5h4", "M11.5 13v2a4.5 4.5 0 0 0 9 0v-1.5", "M20.5 10.6a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"],
  // Home: a house.
  ["M3 11.5 12 4l9 7.5", "M5.5 9.5v11h13v-11", "M10 20.5v-6h4v6"],
];

/**
 * "It is a hospital… / It is a home…" as one sentence that changes its mind: the opening stays put, the
 * noun rolls between the two, and the rest of the line rewrites to match while the panel's colour follows.
 * It alternates on its own and pauses on hover or focus; the icon buttons choose directly.
 */
export function HomeHospitalColumns({ statements, notResort }: { statements: readonly [string, string]; notResort: string }) {
  const reduce = !!useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !reduce && !paused;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % 2), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [playing, i]);

  const p = parts(statements[i]);
  const look = LOOKS[i];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div
        className="relative overflow-hidden rounded-[2rem] px-6 pb-8 pt-12 sm:px-12 sm:pb-10 sm:pt-16 lg:px-16"
        animate={{ backgroundColor: look.bg, color: look.text }}
        initial={false}
        transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
      >
        {/* Both sentences are always in the page for screen readers; the visual line shows one at a time. */}
        <ul className="sr-only">
          {statements.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <p aria-hidden className="min-h-[3.3em] font-heading text-[clamp(1.9rem,4.4vw,4rem)] leading-[1.1] tracking-[-0.025em] sm:min-h-[2.3em]">
          <span>{p.lead} </span>
          <span className="relative inline-block overflow-hidden align-bottom">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={p.word}
                className="inline-block font-semibold"
                initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.6, ease: EASE }}
              >
                {p.word}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={p.rest}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.1 : 0.35 }}
              style={{ color: look.soft }}
            >
              {p.rest}
            </motion.span>
          </AnimatePresence>
        </p>

        {/* Choose directly; the bar shows how long until the line turns again. */}
        <div className="mt-10 flex items-center gap-3" role="group" aria-label="Hospital or home">
          {statements.map((s, n) => {
            const on = n === i;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                aria-label={s}
                onClick={() => setI(n)}
                onFocus={() => {
                  setPaused(true);
                  setI(n);
                }}
                onBlur={() => setPaused(false)}
                className="grid h-11 w-11 place-items-center rounded-pill ring-1 transition-[background-color,box-shadow] duration-300"
                style={{
                  backgroundColor: on ? "var(--color-keppel)" : "transparent",
                  color: on ? "var(--color-nordic)" : look.text,
                  boxShadow: on ? "none" : `inset 0 0 0 1px ${look.soft}`,
                }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[n].map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </button>
            );
          })}
          <span aria-hidden className="ml-3 h-[2px] w-24 overflow-hidden rounded-pill sm:w-40" style={{ backgroundColor: look.soft, opacity: 0.4 }}>
            {playing && (
              <motion.span
                key={`${i}`}
                className="block h-full origin-left"
                style={{ backgroundColor: look.text }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
              />
            )}
          </span>
        </div>
      </motion.div>

      {/* The closing line, apart from both. */}
      <p className="mt-8 text-right font-heading text-[clamp(1.6rem,3vw,2.6rem)] leading-tight tracking-[-0.015em] text-keppel md:mt-10">{notResort}</p>
    </div>
  );
}

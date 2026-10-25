"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Placeholder } from "@/components/brand/Placeholder";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const HOLD_MS = 2600;

/** Each element's own colour, from the brand palette: the light elements cool, fire warm, earth deep. */
const TONE: Record<string, string> = {
  space: "var(--color-nordic)",
  air: "var(--color-keppel)",
  fire: "var(--color-terracotta)",
  water: "color-mix(in srgb, var(--color-keppel) 70%, var(--color-nordic))",
  earth: "var(--color-clay)",
};

/** The photograph each element should get, taken at Swetaranya. Until then the slots show dummy images. */
const PHOTO: Record<string, string> = {
  space: "Element space: open sky above the courtyard at Swetaranya",
  air: "Element air: breeze moving through the paddy fields at Swetaranya",
  fire: "Element fire: the oil lamp lit at the family temple",
  water: "Element water: the pond beside the sarpakkavu",
  earth: "Element earth: red soil of the medicinal garden",
};

/**
 * The five elements as a ring of photographs around one large one. They light in turn while the section is
 * in view, from the subtlest (space) to the densest (earth); pointing at or tapping an element shows it instead.
 */
export function ElementWheel({ words }: { words: readonly string[] }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const n = words.length;
  const cur = words[active];

  useEffect(() => {
    if (reduce || !inView || hold) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % n), HOLD_MS);
    return () => clearTimeout(t);
  }, [reduce, inView, hold, active, n]);

  // Node centres on a pentagon, as fractions of the square: space at the top, then clockwise.
  const pos = words.map((_, i) => {
    const a = ((i * 360) / n - 90) * (Math.PI / 180);
    return { x: Math.round((50 + 38 * Math.cos(a)) * 100) / 100, y: Math.round((52 + 38 * Math.sin(a)) * 100) / 100 };
  });

  const choose = (i: number) => {
    setHold(true);
    setActive(i);
  };

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[26rem]" onMouseLeave={() => setHold(false)}>
      {/* The ring that joins them, and a spoke from the centre to the lit element. */}
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
        <polygon points={pos.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="var(--color-nordic)" strokeOpacity="0.15" strokeWidth="0.4" strokeDasharray="1 1.5" />
        {pos.map((p, i) => (
          <line
            key={i}
            x1="50"
            y1="52"
            x2={p.x}
            y2={p.y}
            stroke={i === active ? TONE[cur] : "var(--color-nordic)"}
            strokeOpacity={i === active ? 0.8 : 0.08}
            strokeWidth={i === active ? 0.7 : 0.4}
            style={{ transition: "stroke 0.5s, stroke-opacity 0.5s" }}
          />
        ))}
      </svg>

      {/* The lit element, large, in the middle: its photograph with the word over it. */}
      <div
        aria-live="polite"
        className="absolute left-1/2 top-[52%] h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-pill p-1.5 shadow-[0_22px_44px_-20px_rgb(29_57_60/0.45)]"
        style={{ backgroundColor: TONE[cur], transition: "background-color 0.5s" }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-pill">
          <AnimatePresence initial={false}>
            <motion.div
              key={cur}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Placeholder label={PHOTO[cur]} className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nordic/85 to-transparent pb-[14%] pt-[30%] text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={cur}
                className="block font-heading text-[1.1rem] font-semibold text-cream sm:text-[1.3rem]"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {cur}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* The five elements on the ring. */}
      <ul className="absolute inset-0">
        {words.map((w, i) => {
          const on = i === active;
          return (
            <li key={w} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}>
              <button
                type="button"
                aria-pressed={on}
                onMouseEnter={() => choose(i)}
                onFocus={() => choose(i)}
                onBlur={() => setHold(false)}
                onClick={() => choose(i)}
                className="group flex flex-col items-center gap-1.5 rounded-pill focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-keppel"
              >
                <motion.span
                  className="block h-14 w-14 rounded-pill p-[3px] sm:h-[4.25rem] sm:w-[4.25rem]"
                  initial={false}
                  animate={{ backgroundColor: on ? TONE[w] : "rgba(29,57,60,0.12)", scale: on ? 1.14 : 1 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                >
                  <span className="block h-full w-full overflow-hidden rounded-pill">
                    <Placeholder label={PHOTO[w]} className={`h-full w-full transition-[filter] duration-500 ${on ? "" : "grayscale-[60%] group-hover:grayscale-0"}`} />
                  </span>
                </motion.span>
                <span className={`text-[0.92rem] font-bold transition-colors ${on ? "text-nordic" : "text-ink/55 group-hover:text-nordic"}`}>{w}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

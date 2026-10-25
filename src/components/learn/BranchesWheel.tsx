"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

type Branch = { name: string; text: string };

const EASE = [0.22, 0.61, 0.36, 1] as const;
/** How long each branch stays lit while the mandala turns through them on its own. */
const HOLD_MS = 2600;

/** A long lotus petal pointing up from the centre: it swells, then curves in to a fine, drawn-out tip. */
const OUTER =
  "M0 -96 C16 -104 50 -130 60 -170 C72 -214 56 -256 30 -280 C18 -292 8 -306 0 -334 C-8 -306 -18 -292 -30 -280 C-56 -256 -72 -214 -60 -170 C-50 -130 -16 -104 0 -96Z";
/** A tendril between two petals, curling out to a drop at the rim. */
const TENDRIL = "M0 -100 C14 -150 -12 -200 6 -248 C10 -258 2 -266 -4 -262";
const DROP = "M0 -9 C4 -4 6 0 6 3 A6 6 0 0 1 -6 3 C-6 0 -4 -4 0 -9Z";

/** White petals, like a lotus opening on the dark ground. */
const PETAL = "var(--color-cream)";
/** The lit petal turns terracotta, the brand's warm earth accent, against the white and green. */
const SELECTED = "var(--color-terracotta)";

const NAME_R = 212;

function at(deg: number, r: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: Math.round(r * Math.cos(a) * 100) / 100, y: Math.round(r * Math.sin(a) * 100) / 100 };
}

/**
 * Ashtanga Ayurveda as a mandala of eight petals, each carrying the name of one branch. The petals light
 * one after another while the mandala is in view; pointing at or focusing a petal lights it instead, and the
 * centre of the flower says what that branch cares for. On phones the names move into a list under the flower.
 */
export function BranchesWheel({ branches }: { branches: readonly Branch[] }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const n = branches.length;
  const step = 360 / n;
  const cur = branches[active];
  const [main, alt] = cur.name.split(" (");

  useEffect(() => {
    if (reduce || !inView || hold) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % n), HOLD_MS);
    return () => clearTimeout(t);
  }, [reduce, inView, hold, active, n]);

  const pick = (i: number) => {
    setHold(true);
    setActive(i);
  };

  return (
    <div ref={ref}>
      <div className="relative mx-auto aspect-square w-full max-w-[44rem]" onMouseLeave={() => setHold(false)}>
        <svg viewBox="-345 -345 690 690" className="h-full w-full overflow-visible" role="group" aria-label="The eight branches of Ayurveda">
          {/* Drops and seeds around the rim, between the petals. */}
          <g aria-hidden fill="var(--color-keppel)">
            {branches.map((_, i) => {
              const a = i * step + step / 2;
              return (
                <g key={i}>
                  {[0, -1, 1].map((k) => {
                    const p = at(a + k * 9, k ? 262 : 292);
                    return <path key={k} d={DROP} transform={`translate(${p.x} ${p.y}) rotate(${a + k * 7}) scale(${k ? 0.7 : 1.25})`} opacity={k ? 0.5 : 0.8} />;
                  })}
                </g>
              );
            })}
          </g>

          {/* Tendrils between the petals. */}
          <g aria-hidden fill="none" stroke="var(--color-keppel)" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.6">
            {branches.map((_, i) => (
              <path key={i} d={TENDRIL} transform={`rotate(${i * step + step / 2})`} />
            ))}
          </g>

          {/* The eight petals, one per branch. */}
          {[...branches.keys()].sort((x, y) => (x === active ? 1 : y === active ? -1 : x - y)).map((i) => {
            const b = branches[i];
            const on = i === active;
            const a = i * step;
            const p = at(a, NAME_R);
            const [name, sub] = b.name.split(" (");
            return (
              <g
                key={b.name}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${b.name}: ${b.text}`}
                className="cursor-pointer outline-none [&:focus-visible>path:first-child]:stroke-keppel"
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onBlur={() => setHold(false)}
                onClick={() => pick(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(i);
                  }
                }}
              >
                <path
                  d={OUTER}
                  transform={`rotate(${a})`}
                  stroke="var(--color-nordic)"
                  strokeWidth="1.6"
                  fill={on ? SELECTED : PETAL}
                  strokeOpacity={0.25}
                  style={{ transition: reduce ? undefined : "fill 0.45s, stroke-opacity 0.45s" }}
                />
                {/* The name sits upright inside its petal; hidden on phones, where it moves to the list. */}
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  className={`hidden font-heading sm:inline ${on ? "fill-cream" : "fill-nordic"}`}
                  style={{ transition: "fill 0.4s" }}
                >
                  <tspan x={p.x} dy={sub ? "-0.3em" : "0.35em"} className="text-[13px] font-semibold">
                    {name}
                  </tspan>
                  {sub && (
                    <tspan x={p.x} dy="1.35em" className="text-[11px]" fillOpacity="0.8">
                      ({sub}
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}

          {/* The centre. */}
          <g aria-hidden>
            <circle r="92" fill="var(--color-nordic)" stroke="var(--color-keppel)" strokeWidth="1.5" />
            <circle r="84" fill="none" stroke="var(--color-cream)" strokeOpacity="0.15" strokeDasharray="2 5" />
          </g>
        </svg>

        {/* What the lit branch cares for, in the heart of the flower. */}
        <div aria-live="polite" className="pointer-events-none absolute inset-[36%] grid place-items-center text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cur.name}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="font-heading text-[clamp(0.8rem,1.5vw,1.05rem)] leading-tight text-keppel sm:hidden">
                {main}
                {alt && <span className="block text-[0.85em] text-cream/70">({alt}</span>}
              </p>
              <p className="mt-1 text-[clamp(0.7rem,1.2vw,0.92rem)] leading-snug text-cream/85 sm:mt-0">{cur.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Phones: the names in a list under the flower, tied to the same lit branch. */}
      <ul className="mt-8 grid gap-x-6 sm:hidden">
        {branches.map((b, i) => {
          const on = i === active;
          return (
            <li key={b.name} className="border-t border-cream/15">
              <button type="button" onClick={() => pick(i)} aria-pressed={on} className="flex w-full items-start gap-3 py-3 text-left">
                <span aria-hidden className={`mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-pill ring-1 transition-colors ${on ? "bg-keppel ring-keppel" : "ring-cream/40"}`} />
                <span>
                  <span className={`block font-heading text-[1.05rem] leading-snug ${on ? "text-keppel" : "text-cream"}`}>{b.name}</span>
                  <span className="mt-0.5 block text-[0.92rem] leading-snug text-cream/70">{b.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Stop = { when: string; what: string };

const EASE = [0.22, 0.61, 0.36, 1] as const;
const W = 1000;
const H = 200;
const GROUND = H - 24;
// The sun's path: one curve from horizon to horizon.
const P0 = { x: 20, y: GROUND };
const P1 = { x: W / 2, y: -GROUND + 40 };
const P2 = { x: W - 20, y: GROUND };

/** Where the sun sits for each stop: rising, high at midday, setting, and low for night. */
function point(i: number, n: number) {
  const t = 0.07 + (i / (n - 1)) * 0.86;
  const u = 1 - t;
  const x = u * u * P0.x + 2 * u * t * P1.x + t * t * P2.x;
  const y = u * u * P0.y + 2 * u * t * P1.y + t * t * P2.y;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

/**
 * The day as the sun's path: six stops from early morning to night along one arc. Pointing at a stop
 * moves the sun there and lights its line; on phones the stops run down as a list beside a small sun.
 */
export function DayArc({ stops }: { stops: readonly Stop[] }) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(2);
  const n = stops.length;
  const pts = stops.map((_, i) => point(i, n));
  const path = `M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`;
  const sun = pts[active];

  return (
    <div>
      {/* Wide screens: the arc. */}
      <div className="relative hidden md:block">
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="h-auto w-full overflow-visible">
          <line x1="0" x2={W} y1={GROUND} y2={GROUND} stroke="var(--color-cream)" strokeOpacity="0.18" />
          <path d={path} fill="none" stroke="var(--color-cream)" strokeOpacity="0.28" strokeDasharray="2 7" strokeLinecap="round" />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === active ? 0 : 5} fill="var(--color-nordic)" stroke="var(--color-keppel)" strokeWidth="1.5" />
          ))}
          <motion.g initial={false} animate={{ x: sun.x, y: sun.y }} transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}>
            <circle r="22" fill="var(--color-blush)" fillOpacity="0.18" />
            {active === n - 1 ? (
              <path d="M5 -11a12 12 0 1 0 6 21 10 10 0 0 1-6-21Z" fill="var(--color-cream)" transform="translate(-3 0)" />
            ) : (
              <circle r="11" fill="var(--color-blush)" />
            )}
          </motion.g>
        </svg>
        <ol className="mt-2 grid grid-cols-6 gap-3">
          {stops.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.when}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`h-full w-full cursor-pointer rounded-[1.1rem] border px-4 py-3.5 text-left transition-colors duration-300 ${
                    on ? "border-keppel bg-keppel/15" : "border-cream/12 hover:border-cream/30"
                  }`}
                >
                  <span className={`block font-heading text-[1.12rem] leading-tight ${on ? "text-cream" : "text-cream/80"}`}>{s.when}</span>
                  <span className={`mt-1.5 block text-[0.92rem] leading-snug ${on ? "text-cream/85" : "text-cream/60"}`}>{s.what}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Phones: the same stops as a list down a line. */}
      <ol className="relative space-y-1 border-l border-cream/20 pl-6 md:hidden">
        {stops.map((s, i) => (
          <li key={s.when} className="relative py-2.5">
            <span
              aria-hidden
              className={`absolute -left-[1.84rem] top-[1.05rem] h-3 w-3 rounded-pill ${i === n - 1 ? "bg-cream" : "bg-blush"}`}
              style={{ opacity: 0.45 + 0.55 * Math.sin(((i + 0.5) / n) * Math.PI) }}
            />
            <p className="font-heading text-[1.15rem] leading-tight text-cream">{s.when}</p>
            <p className="mt-1 text-[0.98rem] text-cream/70">{s.what}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

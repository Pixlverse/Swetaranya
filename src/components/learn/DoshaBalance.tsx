"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Dosha = { name: string; text: string };

const EASE = [0.22, 0.61, 0.36, 1] as const;
const HOLD_MS = 2800;

/**
 * Each energy's circle: where it sits, its colour, and where its name and motif go (towards the outside,
 * away from the shared middle). Vata cool and airy, Pitta warm, Kapha deep and grounded.
 */
const LAYOUT = [
  { cx: 150, cy: 100, color: "var(--color-keppel)", label: { x: 150, y: 52 }, motif: { x: 150, y: 82 } },
  { cx: 100, cy: 186, color: "var(--color-terracotta)", label: { x: 72, y: 230 }, motif: { x: 82, y: 192 } },
  { cx: 200, cy: 186, color: "var(--color-nordic)", label: { x: 228, y: 230 }, motif: { x: 218, y: 192 } },
] as const;
const R = 86;

/** Movement: currents of air drifting through. */
function Vata({ run }: { run: boolean }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      {["M-22 -8c7-6 12 6 19 0s12-6 19 0", "M-26 4c7-6 12 6 19 0s12-6 19 0 9 4 12 1", "M-16 16c6-5 10 5 16 0s10-5 15 0"].map((d, i) => (
        <motion.path key={d} d={d} animate={run ? { x: [-3, 4, -3] } : { x: 0 }} transition={run ? { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 } : {}} />
      ))}
    </g>
  );
}

/** Transformation: a flame, turning one thing into another. */
function Pitta({ run }: { run: boolean }) {
  return (
    <motion.g
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
      animate={run ? { scaleY: [1, 1.1, 0.95, 1], scaleX: [1, 0.95, 1.04, 1] } : { scaleY: 1, scaleX: 1 }}
      transition={run ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : {}}
      style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
    >
      <path d="M0 -24c8 9 13 15 13 22a13 13 0 0 1-26 0c0-5 3-9 6-13 1 4 3 6 5 6 0-6 0-10 2-15Z" />
      <path d="M0 -4c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9Z" />
    </motion.g>
  );
}

/** Structure and stability: stones stacked and settled. */
function Kapha({ run }: { run: boolean }) {
  const stones = [
    { y: 14, rx: 20, ry: 7 },
    { y: 1, rx: 15, ry: 6 },
    { y: -10, rx: 10, ry: 5 },
  ];
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      {stones.map((s, i) => (
        <motion.ellipse
          key={i}
          cx="0"
          cy={s.y}
          rx={s.rx}
          ry={s.ry}
          animate={run ? { y: [0, -2 * (i + 1) * 0.6, 0] } : { y: 0 }}
          transition={run ? { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 } : {}}
        />
      ))}
    </g>
  );
}

const MOTIFS = [Vata, Pitta, Kapha];

/**
 * The Tridosha as three overlapping circles: everyone has all three, and where they meet is balance.
 * Each circle carries a small living sign of what it is linked with. They light in turn while in view;
 * pointing at a circle or its line lights that one instead.
 */
export function DoshaBalance({ items }: { items: readonly Dosha[] }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const n = items.length;

  useEffect(() => {
    if (reduce || !inView || hold) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % n), HOLD_MS);
    return () => clearTimeout(t);
  }, [reduce, inView, hold, active, n]);

  const choose = (i: number) => {
    setHold(true);
    setActive(i);
  };

  return (
    <div ref={ref} className="grid items-center gap-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" onMouseLeave={() => setHold(false)}>
      <svg viewBox="0 0 300 280" className="mx-auto h-auto w-full max-w-[22rem] overflow-visible" aria-hidden>
        {/* The circles, overlapping; multiply lets their meeting places deepen. */}
        <g style={{ mixBlendMode: "multiply" }}>
          {LAYOUT.map((l, i) => {
            const on = i === active;
            return (
              <motion.circle
                key={i}
                cx={l.cx}
                cy={l.cy}
                r={R}
                fill={l.color}
                stroke={l.color}
                strokeWidth="1.5"
                className="cursor-pointer"
                onMouseEnter={() => choose(i)}
                onClick={() => choose(i)}
                initial={false}
                animate={{ fillOpacity: on ? 0.3 : 0.1, strokeOpacity: on ? 1 : 0.35, scale: on && !reduce ? 1.04 : 1 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
              />
            );
          })}
        </g>

        {/* Each energy's name and motif, on the outer side of its circle. */}
        {LAYOUT.map((l, i) => {
          const on = i === active;
          const Motif = MOTIFS[i];
          return (
            <g key={i} className="pointer-events-none" style={{ color: l.color, opacity: on ? 1 : 0.55, transition: "opacity 0.4s" }}>
              <g transform={`translate(${l.motif.x} ${l.motif.y})`}>
                <Motif run={on && !reduce} />
              </g>
              <text x={l.label.x} y={l.label.y} textAnchor="middle" className="font-heading text-[19px] font-semibold" fill="currentColor">
                {items[i].name}
              </text>
            </g>
          );
        })}

        {/* Where all three meet: balance. */}
        <circle cx="150" cy="157" r="5" fill="var(--color-terracotta)" />
        {!reduce && (
          <motion.circle
            cx="150"
            cy="157"
            fill="none"
            stroke="var(--color-terracotta)"
            initial={{ r: 6, opacity: 0.7 }}
            animate={{ r: 18, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </svg>

      <ul className="space-y-2">
        {items.map((d, i) => {
          const on = i === active;
          return (
            <li key={d.name}>
              <button
                type="button"
                aria-pressed={on}
                onMouseEnter={() => choose(i)}
                onFocus={() => choose(i)}
                onBlur={() => setHold(false)}
                onClick={() => choose(i)}
                className="relative block w-full rounded-[1rem] py-2.5 pl-5 pr-3 text-left text-[0.98rem] leading-snug text-ink/80 focus-visible:outline-2 focus-visible:outline-keppel"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-[1rem]"
                  initial={false}
                  animate={{ backgroundColor: on ? "rgba(89,170,153,0.12)" : "rgba(89,170,153,0)" }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                />
                <span aria-hidden className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-pill" style={{ backgroundColor: LAYOUT[i].color, opacity: on ? 1 : 0.35, transition: "opacity 0.35s" }} />
                <span className="relative">
                  <span className="font-bold text-nordic">{d.name}</span>, {d.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

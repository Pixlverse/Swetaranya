"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;
/** How long each area stays lit while the flower turns through them on its own. */
const HOLD_MS = 1700;

const LEN = 118;
const LABEL_R = 152;

/** A petal whose tip sits `len` units from the centre. */
function petal(len: number) {
  const w = len * 0.34;
  return `M0 0 C ${w} ${-len * 0.35} ${w * 0.7} ${-len * 0.85} 0 ${-len} C ${-w * 0.7} ${-len * 0.85} ${-w} ${-len * 0.35} 0 0 Z`;
}

/**
 * The eight everyday areas as the petals of one flower, each named at its tip. The petals draw open when the
 * section arrives, then light one after another; pointing at a petal or its name lights that one instead.
 */
export function LifestyleWheel({ areas, className = "" }: { areas: readonly string[]; className?: string }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const n = areas.length;
  const lit = hover ?? active;

  useEffect(() => {
    if (reduce || !inView || hover !== null) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % n), HOLD_MS);
    return () => clearTimeout(t);
  }, [reduce, inView, hover, active, n]);

  return (
    <div ref={ref} className={className}>
      <ul className="sr-only">
        {areas.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <svg viewBox="-200 -200 400 400" aria-hidden className="h-auto w-full overflow-visible" onMouseLeave={() => setHover(null)}>
        <circle r={LEN + 8} fill="none" stroke="var(--color-cream)" strokeOpacity="0.12" strokeDasharray="2 6" />
        <circle r={LEN * 0.5} fill="none" stroke="var(--color-cream)" strokeOpacity="0.08" strokeDasharray="2 6" />
        {areas.map((a, i) => {
          const angle = (360 / n) * i;
          const on = i === lit;
          const rad = ((angle - 90) * Math.PI) / 180;
          const lx = Math.round(Math.cos(rad) * LABEL_R * 100) / 100;
          const ly = Math.round(Math.sin(rad) * LABEL_R * 100) / 100;
          const anchor = Math.abs(lx) < 4 ? "middle" : lx > 0 ? "start" : "end";
          return (
            <g key={a} className="cursor-pointer" onMouseEnter={() => setHover(i)}>
              <g transform={`rotate(${angle})`}>
                <motion.path
                  d={petal(LEN)}
                  fill={on ? "var(--color-keppel)" : "var(--color-cream)"}
                  stroke="var(--color-cream)"
                  strokeWidth="1.3"
                  fillOpacity={0.03}
                  strokeOpacity={0.45}
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={
                    inView || reduce
                      ? {
                          pathLength: 1,
                          fillOpacity: on ? 0.55 : 0.03,
                          strokeOpacity: on ? 1 : 0.45,
                          scale: on ? 1.06 : 1,
                        }
                      : undefined
                  }
                  style={{ transformOrigin: "0px 0px" }}
                  transition={{
                    pathLength: { delay: i * 0.08, duration: 1.1, ease: EASE },
                    default: { duration: reduce ? 0 : 0.45, ease: EASE },
                  }}
                />
              </g>
              <motion.text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="central"
                className="font-heading text-[19px]"
                initial={false}
                animate={{ fill: on ? "var(--color-cream)" : "rgb(247 249 248 / 0.55)", fontWeight: on ? 600 : 400 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              >
                {a}
              </motion.text>
            </g>
          );
        })}
        <circle r="7" fill="var(--color-blush)" />
        <circle r="15" fill="none" stroke="var(--color-blush)" strokeOpacity="0.4" />
      </svg>
    </div>
  );
}

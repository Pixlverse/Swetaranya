"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LIFESTYLE_AREAS, type LifestyleArea } from "@/lib/constants";

const LABELS: Record<LifestyleArea, string> = {
  sleep: "Sleep",
  food: "Food",
  digestion: "Digestion",
  movement: "Movement",
  stress: "Ease",
  routine: "Routine",
  rest: "Rest",
  energy: "Energy",
};

/** A petal whose tip sits `len` units from the centre. */
function petal(len: number) {
  const w = len * 0.34;
  return `M0 0 C ${w} ${-len * 0.35} ${w * 0.7} ${-len * 0.85} 0 ${-len} C ${-w * 0.7} ${-len * 0.85} ${-w} ${-len * 0.35} 0 0 Z`;
}

/**
 * Eight petals, one per area of daily life. Empty outlines on the teaser; on the result the
 * petals grow to each score in sequence — the Lifestyle Check page's orchestrated moment.
 */
export function PetalChart({
  scores,
  className = "",
  animate = false,
  showLabels = true,
}: {
  scores?: Partial<Record<LifestyleArea, number>>;
  className?: string;
  animate?: boolean;
  showLabels?: boolean;
}) {
  const reduce = useReducedMotion();
  const R = 100;
  return (
    <svg viewBox="-150 -150 300 300" className={className} role="img" aria-label={scores ? "Your lifestyle snapshot" : "Eight areas of daily life"}>
      <circle r={R} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="2 5" />
      <circle r={R * 0.5} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 5" />
      {LIFESTYLE_AREAS.map((area, i) => {
        const angle = (360 / LIFESTYLE_AREAS.length) * i;
        const score = scores?.[area];
        const len = score === undefined ? R : 18 + (R - 18) * (score / 100);
        const rad = ((angle - 90) * Math.PI) / 180;
        const lx = Math.cos(rad) * (R + 26);
        const ly = Math.sin(rad) * (R + 26);
        return (
          <g key={area}>
            <path d={petal(R)} transform={`rotate(${angle})`} fill="none" stroke="currentColor" strokeOpacity={scores ? 0.18 : 0.5} strokeWidth="1.2" />
            {score !== undefined && (
              <motion.g
                transform={`rotate(${angle})`}
                initial={animate && !reduce ? { scale: 0, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.14, duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ transformOrigin: "0px 0px" }}
              >
                <path d={petal(len)} className="fill-keppel/75 stroke-nordic" strokeWidth="1" />
              </motion.g>
            )}
            {showLabels && (
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-nordic font-body text-[11px]">
                {LABELS[area]}
                {score !== undefined && <tspan className="fill-ink/60"> {score}%</tspan>}
              </text>
            )}
          </g>
        );
      })}
      <circle r="5" className="fill-terracotta" />
    </svg>
  );
}

export { LABELS as LIFESTYLE_LABELS };

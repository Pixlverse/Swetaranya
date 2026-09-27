"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { SYMBOL } from "./brandmark-paths";

type Props = {
  className?: string;
  /** "draw": air lines trace in and fill, the drop falls, the land rises. "static": finished mark. */
  mode?: "draw" | "static";
  delay?: number;
  /** Draw when scrolled into view instead of on mount. */
  inView?: boolean;
  title?: string;
  /** Fill for the whole symbol. Defaults to currentColor. */
  color?: string;
};

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * The Swetaranya symbol from the brand guide — the site's one signature animated motif.
 * The air lines are outlined shapes, so they are traced as strokes first and then filled.
 */
export function BrandSymbol({ className, mode = "static", delay = 0, inView = false, title, color = "currentColor" }: Props) {
  const reduce = useReducedMotion();
  const animate = mode === "draw" && !reduce;
  const trigger = (to: TargetAndTransition) => (inView ? { whileInView: to, viewport: { once: true, margin: "-10% 0px" } } : { animate: to });

  return (
    <svg viewBox={SYMBOL.viewBox} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {SYMBOL.air.map((d, i) =>
        animate ? (
          <motion.path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={0.35}
            initial={{ pathLength: 0, fillOpacity: 0 }}
            {...trigger({ pathLength: 1, fillOpacity: 1 })}
            fill={color}
            transition={{
              pathLength: { delay: delay + i * 0.08, duration: 1.8, ease: EASE },
              fillOpacity: { delay: delay + 1.4 + i * 0.08, duration: 0.6 },
            }}
          />
        ) : (
          <path key={i} d={d} fill={color} />
        ),
      )}
      {animate ? (
        <motion.path
          d={SYMBOL.drop}
          fill={color}
          initial={{ y: -10, opacity: 0 }}
          {...trigger({ y: 0, opacity: 1 })}
          transition={{ delay: delay + 1.1, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        />
      ) : (
        <path d={SYMBOL.drop} fill={color} />
      )}
      {SYMBOL.land.map((d, i) =>
        animate ? (
          <motion.path
            key={i}
            d={d}
            fill={color}
            style={{ transformBox: "fill-box", transformOrigin: i === 0 ? "100% 0%" : "0% 100%" }}
            initial={{ scale: 0.4, opacity: 0 }}
            {...trigger({ scale: 1, opacity: 1 })}
            transition={{ delay: delay + 1.5 + i * 0.12, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          />
        ) : (
          <path key={i} d={d} fill={color} />
        ),
      )}
    </svg>
  );
}

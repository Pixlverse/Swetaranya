"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;
/** Sunlight: the brand blush lifted towards cream, so it glows on Nordic. */
const SUN = "color-mix(in srgb, var(--color-blush) 70%, var(--color-cream))";

type Pillar = { word: string; text: string };

/**
 * Live, Heal, Learn as one day. Three columns between hairline rules, with one thin line
 * running behind them like the sun's path: a small sun travels along it as the section scrolls through,
 * and each pillar's dot warms as the sun passes. On phones the columns stack and the path runs down the side.
 */
export function PillarRhythm({ pillars }: { pillars: readonly Pillar[] }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 50%"] });
  const sun = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  const along = useTransform(sun, [0, 1], ["0%", "100%"]);
  // Each dot sits at the centre of its column: 1/6, 1/2 and 5/6 of the way along the path.
  const [passed, setPassed] = useState(0);
  useMotionValueEvent(sun, "change", (v) => setPassed([1 / 6, 1 / 2, 5 / 6].filter((m) => v >= m - 0.02).length));
  const lit = reduce ? pillars.length : passed;

  return (
    <div ref={ref} className="relative">
      {/* The sun path: across on wide screens, down the left edge on phones. */}
      <div aria-hidden className="pointer-events-none absolute bottom-10 left-[0.3rem] top-10 w-px bg-cream/20 md:hidden">
        <motion.span className="absolute inset-x-0 top-0 block" style={{ height: reduce ? "100%" : along, backgroundColor: SUN }} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[0.5rem] hidden h-px bg-cream/20 md:block">
        <motion.span className="absolute inset-y-0 left-0 block" style={{ width: reduce ? "100%" : along, backgroundColor: SUN }} />
        {!reduce && (
          <motion.span
            className="absolute top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-pill shadow-[0_0_0_6px_rgb(221_145_136/0.16),0_0_28px_6px_rgb(221_145_136/0.35)]"
            style={{ left: along, backgroundColor: SUN }}
          />
        )}
      </div>

      <ol className="grid md:grid-cols-3">
        {pillars.map((p, i) => {
          const on = i < lit;
          return (
            <li
              key={p.word}
              className={`relative py-10 pl-9 md:px-8 md:py-0 md:text-center lg:px-12 ${i ? "border-t border-cream/15 md:border-l md:border-t-0" : ""}`}
            >
              {/* This pillar's place on the sun path. */}
              <motion.span
                aria-hidden
                className="absolute left-[0.3rem] top-[4rem] block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-pill ring-1 ring-cream/45 md:left-1/2 md:top-[0.5rem]"
                initial={false}
                animate={{ backgroundColor: on ? SUN : "var(--color-nordic)", scale: on ? 1.3 : 1 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              />
              <h3 className="font-heading text-[clamp(3rem,5.4vw,5rem)] leading-[1] tracking-[-0.03em] font-medium text-cream [text-shadow:0_2px_24px_rgb(0_0_0/0.45)] md:mt-12">{p.word}.</h3>
              <p className="mt-5 max-w-[24rem] text-[1.06rem] leading-relaxed text-cream [text-shadow:0_1px_10px_rgb(0_0_0/0.5)] md:mx-auto">{p.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

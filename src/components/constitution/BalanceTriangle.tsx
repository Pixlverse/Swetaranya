"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/** Vata at the top, Pitta bottom-right, Kapha bottom-left. */
const V = { x: 150, y: 22 };
const P = { x: 272, y: 234 };
const K = { x: 28, y: 234 };
const C = { x: (V.x + P.x + K.x) / 3, y: (V.y + P.y + K.y) / 3 };

/**
 * The Know Your Constitution result: a point travels from the centre of the triangle to the
 * person's balance of the three doshas, then the vertex readings count up. The page's one
 * orchestrated moment.
 */
export function BalanceTriangle({ vata, pitta, kapha, className = "" }: { vata: number; pitta: number; kapha: number; className?: string }) {
  const reduce = useReducedMotion();
  const target = { x: (vata * V.x + pitta * P.x + kapha * K.x) / 100, y: (vata * V.y + pitta * P.y + kapha * K.y) / 100 };
  const t = useMotionValue(reduce ? 1 : 0);
  const cx = useTransform(t, (v) => C.x + (target.x - C.x) * v);
  const cy = useTransform(t, (v) => C.y + (target.y - C.y) * v);
  const [shown, setShown] = useState(reduce ? { vata, pitta, kapha } : { vata: 0, pitta: 0, kapha: 0 });

  useEffect(() => {
    if (reduce) return;
    const a = animate(t, 1, { delay: 0.5, duration: 1.4, ease: [0.22, 0.61, 0.36, 1] });
    const unsub = t.on("change", (v) => setShown({ vata: Math.round(vata * v), pitta: Math.round(pitta * v), kapha: Math.round(kapha * v) }));
    return () => {
      a.stop();
      unsub();
    };
  }, [t, vata, pitta, kapha, reduce]);

  const label = (x: number, y: number, name: string, value: number, anchor: "middle" | "start" | "end", dy: number) => (
    <text x={x} y={y + dy} textAnchor={anchor} className="fill-nordic">
      <tspan className="font-heading text-[15px]">{name}</tspan>
      <tspan className="fill-keppel font-body text-[13px] font-bold" dx="6">
        {value}%
      </tspan>
    </text>
  );

  return (
    <svg viewBox="-40 -14 380 290" className={className} role="img" aria-label={`Vata ${vata}%, Pitta ${pitta}%, Kapha ${kapha}%`}>
      <polygon points={`${V.x},${V.y} ${P.x},${P.y} ${K.x},${K.y}`} className="fill-keppel/10 stroke-nordic/30" strokeWidth="1" />
      {/* inner guide triangle and medians */}
      <polygon
        points={`${(V.x + C.x) / 2},${(V.y + C.y) / 2} ${(P.x + C.x) / 2},${(P.y + C.y) / 2} ${(K.x + C.x) / 2},${(K.y + C.y) / 2}`}
        className="fill-none stroke-nordic/15"
        strokeDasharray="2 5"
      />
      {[V, P, K].map((pt, i) => (
        <line key={i} x1={pt.x} y1={pt.y} x2={C.x} y2={C.y} className="stroke-nordic/10" />
      ))}
      {/* threads from the point to each dosha */}
      {[V, P, K].map((pt, i) => (
        <motion.line key={`t${i}`} x1={pt.x} y1={pt.y} x2={cx} y2={cy} className="stroke-keppel/60" strokeWidth="1.2" />
      ))}
      <motion.circle cx={cx} cy={cy} r="16" className="fill-keppel/20" />
      <motion.circle cx={cx} cy={cy} r="7" className="fill-terracotta" />
      {[V, P, K].map((pt, i) => (
        <circle key={`v${i}`} cx={pt.x} cy={pt.y} r="4" className="fill-nordic" />
      ))}
      {label(V.x, V.y, "Vata", shown.vata, "middle", -12)}
      {label(P.x, P.y, "Pitta", shown.pitta, "end", 26)}
      {label(K.x, K.y, "Kapha", shown.kapha, "start", 26)}
    </svg>
  );
}

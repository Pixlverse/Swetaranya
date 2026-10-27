"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Step = { short: string; text: string };

const EASE = [0.22, 0.61, 0.36, 1] as const;
/** Corner radius where the path turns. */
const R = 22;

/** One line icon per step, in order: reports, a call with the physician, preparing the body. */
const ICONS: string[][] = [
  // Reports: a page with lines, its corner folded.
  ["M7 3.5h7l4 4v13H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z", "M14 3.5v4h4", "M9 12h6M9 15.5h6"],
  // Speaking online: a screen with a speech bubble.
  ["M3.5 5.5h17v11h-17Z", "M9 20.5h6M12 16.5v4", "M9 9.5h6M9 12h4"],
  // Preparing the body: a leaf.
  ["M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z", "M5 19l8-8"],
];

/**
 * The steps before arrival as one path that winds between them: the circles alternate sides and a single line
 * runs down and across from each to the next, drawing itself in when the path comes into view. On narrow
 * screens every circle sits on the left and the line runs straight down.
 */
export function PrepPath({ steps }: { steps: readonly Step[] }) {
  const reduce = !!useReducedMotion();
  const wrap = useRef<HTMLOListElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const inView = useInView(wrap, { once: true, amount: 0.3 });
  const [path, setPath] = useState<{ d: string; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const pts = dots.current.filter(Boolean).map((d) => {
        const r = d!.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      if (pts.length < 2) return setPath(null);
      // Where each turn runs across: in the gap under each step, so the line never crosses its words.
      const gaps = rows.current.map((li, i) => {
        const next = rows.current[i + 1];
        if (!li || !next) return 0;
        return (li.getBoundingClientRect().bottom + next.getBoundingClientRect().top) / 2 - box.top;
      });
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (Math.abs(a.x - b.x) < 1) {
          d += ` L${b.x} ${b.y}`;
          continue;
        }
        // Down from a, across in the gap below its step, down into b, with rounded turns.
        const mid = gaps[i - 1];
        const dir = b.x > a.x ? 1 : -1;
        const r = Math.min(R, mid - a.y, b.y - mid, Math.abs(b.x - a.x) / 2);
        d += ` L${a.x} ${mid - r} Q${a.x} ${mid} ${a.x + dir * r} ${mid}`;
        d += ` L${b.x - dir * r} ${mid} Q${b.x} ${mid} ${b.x} ${mid + r} L${b.x} ${b.y}`;
      }
      setPath({ d, w: box.width, h: box.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [steps.length]);

  return (
    <ol ref={wrap} className="relative mt-10 space-y-12 sm:space-y-14">
      {path && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-visible" width={path.w} height={path.h} viewBox={`0 0 ${path.w} ${path.h}`} fill="none">
          <motion.path
            d={path.d}
            stroke="var(--color-keppel)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: inView || reduce ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
          />
        </svg>
      )}
      {steps.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <li
            key={s.short}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className={`relative flex items-start gap-5 ${right ? "sm:flex-row-reverse sm:text-right" : ""}`}>
            <span
              ref={(el) => {
                dots.current[i] = el;
              }}
              aria-hidden
              className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-nordic text-cream shadow-[0_10px_22px_-10px_rgb(29_57_60/0.7)] ring-4 ring-cream"
            >
              <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[i % ICONS.length].map((p) => (
                  <path key={p} d={p} />
                ))}
              </svg>
            </span>
            <div className={`relative max-w-[30rem] pt-1 ${right ? "sm:ml-auto" : ""}`}>
              <h3 className="font-heading text-[1.2rem] leading-snug text-nordic">
                <span className="text-keppel">{i + 1}.</span> {s.short}
              </h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-ink/75">{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

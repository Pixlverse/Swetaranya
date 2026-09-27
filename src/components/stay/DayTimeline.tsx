"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Moment = { time: string; title: string; body: string };

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const DAY_START = toMinutes("05:30");
const DUSK = toMinutes("18:15");

/**
 * A Day at Swetaranya — the Your Stay page's orchestrated moment. Choosing an hour moves the sun
 * along its arc; after dusk the sun sets, the lamp is lit and the panel turns to evening.
 */
export function DayTimeline({ moments }: { moments: readonly Moment[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const m = moments[active];
  const mins = toMinutes(m.time);
  const evening = mins >= DUSK;

  // Sun travels a half-circle from 05:30 (left horizon) to dusk (right horizon).
  const progress = Math.min(1, Math.max(0, (mins - DAY_START) / (DUSK - DAY_START)));
  const angle = Math.PI * (1 - progress);
  const sunX = 200 + Math.cos(angle) * 170;
  const sunY = 190 - Math.sin(angle) * 150;

  const go = (i: number) => {
    const next = Math.max(0, Math.min(moments.length - 1, i));
    setActive(next);
    tabs.current[next]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      go(active + 1);
    }
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      go(active - 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      go(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      go(moments.length - 1);
    }
  };

  const t = { duration: reduce ? 0 : 0.9, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <motion.div
      className={`${evening ? "on-dark" : ""} overflow-hidden`}
      animate={{ backgroundColor: evening ? "#1D393C" : "#FFFFFF", color: evening ? "#F7F9F8" : "#14201F" }}
      transition={t}
    >
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
        <div className="lg:col-span-6">
          <svg viewBox="0 0 400 210" className="w-full" aria-hidden>
            <path d="M30 190 A170 150 0 0 1 370 190" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="3 6" />
            <line x1="10" y1="190" x2="390" y2="190" stroke="currentColor" strokeOpacity="0.35" />
            <motion.circle
              r="14"
              fill="#59AA99"
              animate={{ cx: evening ? 370 : sunX, cy: evening ? 212 : sunY, opacity: evening ? 0 : 1 }}
              transition={t}
            />
            {/* the evening lamp */}
            <motion.g animate={{ opacity: evening ? 1 : 0 }} transition={t}>
              <path d="M200 168 C 194 156 196 146 200 138 C 204 146 206 156 200 168 Z" fill="#DD9188" />
              <path d="M184 178 Q200 188 216 178 L212 172 Q200 180 188 172 Z" fill="#AA6A59" />
            </motion.g>
          </svg>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0.1 : 0.4 }}
              role="tabpanel"
              id="day-panel"
              aria-labelledby={`day-tab-${active}`}
              aria-live="polite"
              className="mt-6"
            >
              <p className="font-heading text-[clamp(3rem,7vw,5rem)] leading-none tabular-nums text-keppel">{m.time}</p>
              <h3 className={`mt-3 text-[clamp(1.6rem,3vw,2.3rem)] ${evening ? "text-cream" : ""}`}>{m.title}</h3>
              <p className={`mt-3 max-w-md text-[1.05rem] ${evening ? "text-cream/80" : "text-ink/80"}`}>{m.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div role="tablist" aria-label="Times of day" aria-orientation="vertical" onKeyDown={onKey} className="lg:col-span-5 lg:col-start-8">
          <ol className="flex gap-2 overflow-x-auto pb-2 lg:block lg:overflow-visible lg:pb-0">
            {moments.map((mo, i) => {
              const selected = i === active;
              return (
                <li key={mo.time} className="shrink-0">
                  <button
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`day-tab-${i}`}
                    aria-selected={selected}
                    aria-controls="day-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`flex w-full items-baseline gap-4 border-b py-2.5 text-left transition-colors lg:px-2 ${
                      evening ? "border-cream/15" : "border-nordic/10"
                    } ${selected ? "text-keppel" : evening ? "text-cream/70 hover:text-cream" : "text-ink/65 hover:text-nordic"}`}
                  >
                    <span className="w-12 shrink-0 font-bold tabular-nums">{mo.time}</span>
                    <span className={`whitespace-nowrap lg:whitespace-normal ${selected ? "font-bold" : ""}`}>{mo.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </motion.div>
  );
}

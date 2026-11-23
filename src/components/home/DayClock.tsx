"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** `at` places a moment whose `time` is not a clock time ("Early morning") on the face. */
type Item = { time: string; at?: string; title: string; body: string };

/** The clock's own time is counted in minutes from 7 in the morning; a full turn of the day is 24 hours. */
const DAY_START = 7 * 60;
const DAY_END = 12 * 60;
/** Clock minutes per second of real time: through the day, and through the night back to morning. */
const DAY_SPEED = 25;
const NIGHT_SPEED = 320;
/** After dinner the clock runs on at day speed this long, so the evening rests before the night spins past. */
const EVENING = 75;

/** "7:30 – 9:00 AM" or "10:30 AM – 1:00 PM" → minutes after 7 AM at which the moment begins. */
function startOf(time: string) {
  const read = time.split(/\s*[–-]\s*/).map((p) => {
    const m = p.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    return m ? { h: +m[1], min: +m[2], mer: m[3]?.toUpperCase() } : { h: 7, min: 0, mer: "AM" };
  });
  const last = read[read.length - 1].mer ?? "AM";
  const { h, min, mer } = read[0];
  return ((h % 12) + ((mer ?? last) === "PM" ? 12 : 0)) * 60 + min - DAY_START;
}

/** Where a moment sits on an ordinary twelve-hour face, in degrees from twelve. */
const faceAngle = (t: number) => (((DAY_START + t) % 720) / 720) * 360;

const S = 400;
const C = S / 2;
const RIM = 190;

function at(deg: number, r: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  // Rounded so the server and the browser draw identical numbers.
  return { x: Math.round((C + r * Math.cos(a)) * 100) / 100, y: Math.round((C + r * Math.sin(a)) * 100) / 100 };
}

/** Minutes after 7 AM at which noon falls: everything before it is the morning. */
const NOON = 12 * 60 - DAY_START;

/** A sun rising over the horizon for the morning, and one setting for the afternoon and evening. */
function HalfMark({ half }: { half: "am" | "pm" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h18M7 18a5 5 0 0 1 10 0" />
      {half === "am" ? <path d="M12 3v4M9.5 5.5 12 3l2.5 2.5M4.6 10.6l1.4 1.4M19.4 10.6 18 12" /> : <path d="M12 7v4M9.5 8.5 12 11l2.5-2.5M4.6 10.6l1.4 1.4M19.4 10.6 18 12" />}
    </svg>
  );
}

/**
 * A day here on an ordinary wall clock that keeps running. The morning reads down the left of the clock and the
 * afternoon and evening down the right, each in the order it happens, so the two halves of the day never mix
 * (7 AM tea and 7 PM dinner share a place on a twelve-hour face). A small window on the face says which half the
 * hands are in, and only that half's marks stand out on the rim. As the hands reach a moment its box lights and
 * stays lit until the next moment comes round. After dinner the night spins past and the day begins again.
 * Pointing at a box sets the clock to it. With reduced motion the clock stands still until a box is chosen.
 */
export function DayClock({ items }: { items: readonly Item[] }) {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.3 });
  const [hold, setHold] = useState(false);
  const [active, setActive] = useState(0);
  const [pm, setPm] = useState(false);

  const starts = items.map((d) => startOf(d.at ?? d.time));
  const hours = starts.map(faceAngle);
  // Morning on the left, afternoon and evening on the right, each in the order the day runs.
  const inOrder = (list: number[]) => list.sort((x, y) => starts[x] - starts[y] || x - y);
  const left = inOrder(items.map((_, i) => i).filter((i) => starts[i] < NOON));
  const right = inOrder(items.map((_, i) => i).filter((i) => starts[i] >= NOON));
  const isPm = (i: number) => starts[i] >= NOON;

  const t = useMotionValue(0);
  const hourHand = useTransform(t, (v) => faceAngle(v));
  const minuteHand = useTransform(t, (v) => ((DAY_START + v) % 60) * 6);

  // The moment showing is the last one the clock has passed, so it stays lit until the next one comes.
  const momentAt = (v: number) => starts.reduce((found, s, i) => (v >= s ? i : found), 0);
  useMotionValueEvent(t, "change", (v) => {
    const i = momentAt(v);
    if (i !== active) setActive(i);
    const p = (DAY_START + v) % 1440 >= 720;
    if (p !== pm) setPm(p);
  });

  useAnimationFrame((_, delta) => {
    if (reduce || hold || !inView) return;
    const v = t.get();
    const speed = v < DAY_END + EVENING ? DAY_SPEED : NIGHT_SPEED;
    const next = v + (Math.min(delta, 100) / 1000) * speed;
    t.set(next >= 1440 ? 0 : next);
  });

  const choose = (i: number) => {
    setHold(true);
    if (reduce) t.set(starts[i]);
    else animate(t, starts[i], { duration: 0.7, ease: EASE });
  };

  const box = (d: Item, i: number) => {
    const on = i === active;
    return (
      <button
        type="button"
        onMouseEnter={() => choose(i)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => choose(i)}
        onBlur={() => setHold(false)}
        onClick={() => choose(i)}
        aria-pressed={on}
        className={`block w-full cursor-pointer rounded-[1rem] border px-4 py-2.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-keppel ${
          on ? "border-nordic bg-nordic shadow-[0_18px_40px_-18px_rgb(29_57_60/0.55)]" : "border-nordic/12 bg-cream"
        }`}
      >
        <span className={`block font-heading text-[0.85rem] tabular-nums ${on ? "text-keppel" : "text-keppel/80"}`}>{d.time}</span>
        <span className={`mt-0.5 block font-heading text-[1.02rem] font-semibold leading-snug ${on ? "text-cream" : "text-nordic"}`}>{d.title}</span>
        <AnimatePresence initial={false}>
          {on && (
            <motion.span
              key="body"
              className="block overflow-hidden text-[0.86rem] leading-snug text-cream/80"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="block pt-1">{d.body}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  };

  const HALVES = { am: "Morning", pm: "Afternoon and evening" } as const;
  const heading = (half: "am" | "pm", center = false) => {
    const lit = (half === "pm") === pm;
    return (
      <p className={`flex items-center gap-2.5 font-heading text-[1.2rem] transition-colors duration-500 ${center ? "" : half === "am" ? "flex-row-reverse" : ""} ${lit ? "text-nordic" : "text-nordic/45"}`}>
        <span className={`grid h-9 w-9 place-items-center rounded-pill transition-colors duration-500 ${lit ? "bg-keppel text-cream" : "bg-nordic/[0.06] text-nordic/50"}`}>
          <HalfMark half={half} />
        </span>
        {HALVES[half]}
      </p>
    );
  };

  // A column of boxes hugging the rim: those near the clock's middle stand off, those above and below tuck in.
  const column = (list: number[], side: "left" | "right") => (
    <div className={`hidden flex-col gap-4 lg:flex ${side === "left" ? "items-end" : "items-start"}`}>
      {heading(side === "left" ? "am" : "pm")}
    <ol className={`flex flex-col gap-2.5 ${side === "left" ? "items-end" : "items-start"}`}>
      {list.map((i, j) => {
        const k = list.length;
        const yf = k > 1 ? ((j - (k - 1) / 2) / ((k - 1) / 2)) * 0.82 : 0;
        const tuck = 1 - Math.sqrt(1 - yf * yf);
        return (
          <li
            key={items[i].time}
            className="w-[15rem] xl:w-[16.5rem]"
            style={{ translate: `calc(var(--clock) * ${(side === "left" ? 0.28 : -0.28) * tuck}) 0` }}
          >
            {box(items[i], i)}
          </li>
        );
      })}
    </ol>
    </div>
  );

  return (
    <div
      ref={root}
      className="mx-auto mt-10 grid max-w-[88rem] items-center gap-6 px-5 [--clock:min(80vw,22rem)] sm:px-8 md:mt-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8 lg:[--clock:clamp(20rem,28vw,27rem)]"
    >
      {column(left, "left")}
      <div className="relative mx-auto aspect-square w-[var(--clock)]">
        <svg viewBox={`0 0 ${S} ${S}`} aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
          {/* The face and its rim. */}
          <circle cx={C} cy={C} r={RIM} fill="var(--color-cream)" stroke="var(--color-nordic)" strokeWidth="12" style={{ filter: "drop-shadow(0 18px 30px rgb(29 57 60 / 0.18))" }} />
          <circle cx={C} cy={C} r={RIM - 8} fill="none" stroke="var(--color-nordic)" strokeOpacity="0.1" strokeWidth="2" />
          {Array.from({ length: 60 }, (_, m) => {
            const big = m % 5 === 0;
            const o = at(m * 6, RIM - 14);
            const p = at(m * 6, RIM - (big ? 26 : 19));
            return <line key={m} x1={o.x} y1={o.y} x2={p.x} y2={p.y} stroke="var(--color-nordic)" strokeWidth={big ? 3 : 1.2} strokeLinecap="round" />;
          })}
          {Array.from({ length: 12 }, (_, k) => {
            const p = at((k + 1) * 30, RIM - 56);
            return (
              <text key={k} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className="fill-nordic font-heading text-[36px] font-medium tabular-nums">
                {k + 1}
              </text>
            );
          })}

          {/* Each moment's place on the rim. */}
          {hours.map((h, i) => {
            const p = at(h, RIM);
            const on = i === active;
            return (
              <g key={items[i].time} style={{ opacity: on || isPm(i) === pm ? 1 : 0.22, transition: "opacity 500ms" }}>
                {on && !reduce && (
                  <motion.circle
                    key={`halo-${active}`}
                    cx={p.x}
                    cy={p.y}
                    fill="none"
                    stroke="var(--color-keppel)"
                    strokeWidth="2"
                    initial={{ r: 7, opacity: 0.8 }}
                    animate={{ r: 22, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle cx={p.x} cy={p.y} r={on ? 7.5 : 5} fill={on ? "var(--color-keppel)" : "var(--color-cream)"} stroke="var(--color-nordic)" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Which half of the day the hands are in, in a small window like a watch's date. */}
          <g>
            <rect x={C - 24} y={C + 58} width="48" height="26" rx="7" fill="var(--color-nordic)" fillOpacity="0.06" stroke="var(--color-nordic)" strokeOpacity="0.25" />
            <text x={C} y={C + 71.5} textAnchor="middle" dominantBaseline="central" className="fill-nordic font-body text-[14px] font-bold tracking-[0.04em]">
              {pm ? "PM" : "AM"}
            </text>
          </g>

          {/* The hands. An unseen full circle makes each group's box the face, so they turn about the centre. */}
          <motion.g style={{ rotate: hourHand }}>
            <circle cx={C} cy={C} r={RIM} fill="none" />
            <path d={`M${C - 5} ${C + 18} L${C - 3.5} ${C - 92} L${C} ${C - 102} L${C + 3.5} ${C - 92} L${C + 5} ${C + 18} Z`} fill="var(--color-nordic)" />
          </motion.g>
          <motion.g style={{ rotate: minuteHand }}>
            <circle cx={C} cy={C} r={RIM} fill="none" />
            <path d={`M${C - 3.5} ${C + 24} L${C - 2.2} ${C - 140} L${C} ${C - 150} L${C + 2.2} ${C - 140} L${C + 3.5} ${C + 24} Z`} fill="var(--color-nordic)" />
          </motion.g>
          <circle cx={C} cy={C} r="8" fill="var(--color-keppel)" />
          <circle cx={C} cy={C} r="2.5" fill="var(--color-cream)" />
        </svg>

      </div>
      {column(right, "right")}

      {/* On phones and tablets the two halves follow the clock, one after the other, each in order. */}
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-6 lg:hidden">
        {([["am", left], ["pm", right]] as const).map(([half, list]) => (
          <div key={half}>
            {heading(half, true)}
            <ol className="mt-3 grid gap-3">
              {list.map((i) => (
                <li key={items[i].time}>{box(items[i], i)}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

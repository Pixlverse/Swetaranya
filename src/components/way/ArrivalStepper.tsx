"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Step = { title: string; body: string };

/**
 * What Happens When You Arrive — a genuine 8-step sequence. The rail fills to the chosen step and
 * the step's detail slides in from the direction of travel. Tabs pattern for keyboard users.
 */
export function ArrivalStepper({ steps }: { steps: readonly Step[] }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number) => {
    const next = (i + steps.length) % steps.length;
    setDir(next > active ? 1 : -1);
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      go(active + 1);
    }
    if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      go(active - 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      go(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      go(steps.length - 1);
    }
  };

  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div role="tablist" aria-label="Steps of your arrival" aria-orientation="vertical" onKeyDown={onKey} className="relative lg:col-span-5">
        <span aria-hidden className="absolute left-[1.1rem] top-4 bottom-4 w-px bg-nordic/15" />
        <motion.span
          aria-hidden
          className="absolute left-[1.1rem] top-4 w-px origin-top bg-keppel"
          style={{ height: "calc(100% - 2rem)" }}
          animate={{ scaleY: steps.length > 1 ? active / (steps.length - 1) : 1 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        />
        {steps.map((s, i) => {
          const selected = i === active;
          const done = i < active;
          return (
            <button
              key={s.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`arrival-tab-${i}`}
              aria-selected={selected}
              aria-controls="arrival-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => go(i)}
              className="group relative flex w-full items-center gap-5 py-2.5 text-left"
            >
              <span
                className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-pill border text-[0.8rem] font-bold tabular-nums transition-colors duration-300 ${
                  selected ? "border-keppel bg-keppel text-nordic" : done ? "border-keppel bg-cream text-keppel" : "border-nordic/25 bg-cream text-ink/60 group-hover:border-keppel"
                }`}
              >
                {pad(i)}
              </span>
              <span className={`text-[1.02rem] transition-colors ${selected ? "font-bold text-nordic" : "text-ink/70 group-hover:text-nordic"}`}>{s.title}</span>
            </button>
          );
        })}
      </div>

      <div id="arrival-panel" role="tabpanel" aria-labelledby={`arrival-tab-${active}`} className="relative min-h-[18rem] overflow-hidden lg:col-span-7" aria-live="polite">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={active}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 * dir }}
            transition={{ duration: reduce ? 0.1 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            className="border-t border-nordic/15 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-2"
          >
            <p className="font-heading text-[clamp(3.3rem,7.07vw,5.3rem)] leading-[0.8] text-keppel/35 tabular-nums" aria-hidden>
              {pad(active)}
            </p>
            <h3 className="mt-4 text-[clamp(1.75rem,2.67vw,2.2rem)]">{steps[active].title}</h3>
            <p className="mt-4 max-w-lg text-[1.1rem] text-ink/80">{steps[active].body}</p>
            <div className="mt-10 flex gap-6 text-[0.95rem] font-bold">
              <button type="button" onClick={() => go(active - 1)} disabled={active === 0} className="text-nordic underline decoration-keppel underline-offset-4 disabled:opacity-30 disabled:no-underline">
                Previous step
              </button>
              <button type="button" onClick={() => go(active + 1)} disabled={active === steps.length - 1} className="text-nordic underline decoration-keppel underline-offset-4 disabled:opacity-30 disabled:no-underline">
                Next step
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

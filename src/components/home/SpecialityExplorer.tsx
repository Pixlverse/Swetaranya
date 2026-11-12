"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { OrnateMandala } from "@/components/brand/OrnateMandala";

type Speciality = { name: string; focus: string; text: string; conditions: readonly string[] };

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Conditions that already have their own page; the rest are named without a link. */
const CONDITION_PAGES: Record<string, string> = {
  "Spine problems": "back-and-neck-pain",
  Arthritis: "arthritis",
  "Parkinson’s disease": "parkinsonism",
  Stress: "insomnia-and-stress",
  "Weight loss": "obesity",
};

/** One line mark per speciality, in the order the copy lists them. */
const ICONS: string[][] = [
  // Orthopaedics: the spine, stacked.
  ["M9.5 3.5h5a1.5 1.5 0 0 1 0 3h-5a1.5 1.5 0 0 1 0-3Z", "M8.5 9.5h7a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3Z", "M9.5 15.5h5a1.5 1.5 0 0 1 0 3h-5a1.5 1.5 0 0 1 0-3Z", "M12 6.5v3M12 12.5v3M12 18.5v2"],
  // Neurology: a nerve cell and its branches.
  ["M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z", "M12 9V4M9.4 13.5 5 16M14.6 13.5 19 16", "M12 4l-2-1.5M12 4l2-1.5M5 16l-1 2M19 16l1 2"],
  // Dermatology: layers of skin, and a leaf.
  ["M3.5 15c3-2 5.5-2 8.5 0s5.5 2 8.5 0", "M3.5 19c3-2 5.5-2 8.5 0s5.5 2 8.5 0", "M9 11c0-4 2.5-6.5 7-7-.5 4.5-3 7-7 7Z", "M9 11l4-4"],
  // Gastroenterology: agni, the digestive fire.
  ["M12 20.5c-3.6 0-6-2.4-6-5.6 0-3.4 2.6-5 3.4-8.4 1.6 1.4 2.4 3 2.4 4.6 1-1 1.6-2.2 1.8-3.8 2.3 1.9 4.4 4.6 4.4 7.6 0 3.2-2.4 5.6-6 5.6Z", "M12 20.5c-1.5 0-2.6-1-2.6-2.5 0-1.6 1.4-2.4 2.6-4 1.2 1.6 2.6 2.4 2.6 4 0 1.5-1.1 2.5-2.6 2.5Z"],
  // Lifestyle diseases: balance.
  ["M12 4v16M8 20h8", "M5 7h14", "M5 7l-2.5 6h5Z", "M19 7l-2.5 6h5Z"],
  // Gynaecology: a lotus in bloom.
  ["M12 18.5c-1.6-2.6-1.6-6.6 0-11.5 1.6 4.9 1.6 8.9 0 11.5Z", "M12 18.5c-3.2-1-5.2-4-5.6-8 2.4.6 4.3 2 5.6 4", "M12 18.5c3.2-1 5.2-4 5.6-8-2.4.6-4.3 2-5.6 4", "M4.5 15.5c1.7 2.4 4.3 3.4 7.5 3M19.5 15.5c-1.7 2.4-4.3 3.4-7.5 3"],
  // Mental health: a still mind, a ripple beneath it.
  ["M12 4.5a4.5 4.5 0 0 1 4.5 4.5c0 2.5-2 4.5-4.5 4.5S7.5 11.5 7.5 9A4.5 4.5 0 0 1 12 4.5Z", "M4 17.5c2.7-1.7 5.3-1.7 8 0s5.3 1.7 8 0", "M7 20.5c1.7-1 3.3-1 5 0s3.3 1 5 0"],
];

function SpecialityIcon({ index, className = "" }: { index: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[index % ICONS.length].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * The seven specialities as one explorer: an index to choose from, and a panel that shows the chosen one in
 * full against a faint temple-cloth mandala. Choosing turns the mandala a little and cross-fades the words,
 * so the change is felt without being loud. Every panel stays in the page (hidden ones with `hidden`), so
 * the copy is there for search and assistive technology. Arrow keys move through the index.
 */
export function SpecialityExplorer({ items, conditionsLabel, action }: { items: readonly Speciality[]; conditionsLabel: string; action: { label: string; href: string } }) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  const onKey = (e: KeyboardEvent) => {
    const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    const edge = { Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined && edge === undefined) return;
    e.preventDefault();
    const i = edge ?? (active + next! + items.length) % items.length;
    setActive(i);
    tabs.current[i]?.focus();
  };


  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      {/* The index: a column on wide screens, a row of pills to swipe through on phones. */}
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Specialities"
        onKeyDown={onKey}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-nordic/12 lg:px-0 lg:pb-0"
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${base}-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group relative flex shrink-0 items-center gap-3 rounded-pill border px-4 py-2.5 text-left transition-colors duration-300 ease-calm lg:rounded-none lg:border-0 lg:border-b lg:border-nordic/12 lg:px-3 lg:py-4 ${
                on ? "border-nordic bg-nordic text-cream lg:bg-keppel/12 lg:text-nordic" : "border-nordic/20 text-nordic hover:border-nordic/40 lg:hover:bg-keppel/6"
              }`}
            >
              {/* The keppel thread beside the chosen one, on wide screens. */}
              <span aria-hidden className={`absolute inset-y-0 left-0 hidden w-[3px] bg-keppel transition-transform duration-300 ease-calm lg:block ${on ? "scale-y-100" : "scale-y-0"}`} />
              <span
                className={`hidden h-10 w-10 shrink-0 place-items-center rounded-pill transition-colors duration-300 lg:grid ${on ? "bg-keppel text-nordic" : "bg-keppel/12 text-keppel group-hover:bg-keppel/20"}`}
              >
                <SpecialityIcon index={i} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap font-heading text-[1.02rem] leading-tight lg:text-[1.2rem]">{it.name}</span>
                <span className={`mt-0.5 hidden text-[0.88rem] lg:block ${on ? "text-keppel" : "text-ink/55"}`}>{it.focus}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* The panel: the chosen speciality, given room. */}
      <div className="relative isolate min-h-[24rem] overflow-hidden rounded-bl-[1.25rem] rounded-br-[3rem] rounded-tl-[3rem] rounded-tr-[1.25rem] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--color-keppel)_20%,var(--color-cream)),color-mix(in_srgb,var(--color-keppel)_8%,var(--color-cream)))] lg:col-span-8 lg:min-h-full">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 -right-48 -z-10 h-[34rem] w-[34rem] text-nordic opacity-[0.09] sm:-bottom-40 sm:-right-40"
          animate={{ rotate: reduce ? 0 : active * 24 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <OrnateMandala className="h-full w-full" />
        </motion.div>

        {items.map((it, i) => (
          <div key={it.name} role="tabpanel" id={`${base}-panel-${i}`} aria-labelledby={`${base}-tab-${i}`} hidden={i !== active} tabIndex={0} className="h-full outline-none">
            {/* Re-keyed when it becomes the chosen one, so it fades in (and its drawing draws) each time it is picked. */}
            <motion.div
              key={`${it.name}-${i === active}`}
              initial={reduce || i !== active ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="grid h-full gap-8 p-7 sm:p-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-6 md:p-12"
            >
              {/* The words. */}
              <div className="flex flex-col">
                <h3 className="text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.03em] text-nordic">{it.name}</h3>
                <p className="mt-2 font-heading text-[clamp(1.2rem,1.7vw,1.45rem)] text-keppel">{it.focus}</p>
                <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-ink/80">{it.text}</p>

                <div className="mt-auto pt-10">
                  <p className="text-[0.95rem] font-bold text-nordic/70">{conditionsLabel}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {it.conditions.map((name) => {
                      const slug = CONDITION_PAGES[name];
                      const tag = "rounded-pill border border-terracotta/45 bg-cream/70 px-4 py-1.5 text-[0.95rem] text-clay";
                      return slug ? (
                        <Link key={name} href={`/treatments/conditions/${slug}`} className={`${tag} transition-colors duration-300 ease-calm hover:border-terracotta hover:bg-cream`}>
                          {name}
                        </Link>
                      ) : (
                        <span key={name} className={tag}>
                          {name}
                        </span>
                      );
                    })}
                  </div>
                  <Link
                    href={action.href}
                    className="mt-8 inline-flex items-center justify-center rounded-pill bg-keppel px-6 py-3 text-[0.95rem] font-bold text-nordic transition-[background-color,color,transform] duration-300 ease-calm hover:bg-nordic hover:text-cream active:translate-y-px"
                  >
                    {action.label}
                  </Link>
                </div>
              </div>

              {/* The drawing: the speciality's mark, drawn large inside ripples, and a dot for each speciality beneath. */}
              <div className="flex flex-col items-center justify-center gap-6 max-md:order-first">
                <div className="relative aspect-square w-full max-w-[12rem] md:max-w-[19rem]">
                  {[0, 1, 2].map((r) => (
                    <motion.span
                      key={r}
                      aria-hidden
                      className="absolute rounded-pill border border-nordic/15"
                      style={{ inset: `${r * 13}%` }}
                      initial={reduce || i !== active ? false : { opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + (2 - r) * 0.12, duration: 0.9, ease: EASE }}
                    />
                  ))}
                  <span aria-hidden className="absolute inset-[26%] rounded-pill bg-cream/80 shadow-[0_24px_48px_-28px_rgb(29_57_60/0.55)] ring-1 ring-keppel/30" />
                  <svg viewBox="0 0 24 24" aria-hidden className="absolute inset-[33%] text-nordic" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[i % ICONS.length].map((d, k) => (
                      <motion.path
                        key={d}
                        d={d}
                        initial={reduce || i !== active ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.35 + k * 0.15, duration: 1.1, ease: EASE }}
                      />
                    ))}
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  {items.map((d, k) => (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => setActive(k)}
                      aria-label={d.name}
                      aria-current={k === active ? "true" : undefined}
                      tabIndex={-1}
                      className={`h-2 rounded-pill transition-[width,background-color] duration-500 ease-calm ${k === active ? "w-6 bg-keppel" : "w-2 bg-nordic/20 hover:bg-nordic/40"}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

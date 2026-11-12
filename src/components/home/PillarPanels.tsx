"use client";

import { useEffect, useId, useRef, useState } from "react";

type Item = { lead: string; text: string };
type Group = { word: string; items: readonly Item[] };

/** How much wider the open panel grows than a closed one. */
const GROW = 2.7;

/** A large line mark per pillar, drawn faint in its panel: the drop for Heal, the sun for Live, an open book for Learn. */
const MARKS: Record<string, string[]> = {
  Heal: ["M12 2.5C9.4 7.6 5 11.6 5 15.5a7 7 0 0 0 14 0c0-3.9-4.4-7.9-7-13Z", "M9 16a3 3 0 0 0 3 3"],
  Live: ["M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z", "M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"],
  Learn: ["M12 6.5C9.8 5 6.8 4.5 3.5 4.8v13c3.3-.3 6.3.2 8.5 1.7 2.2-1.5 5.2-2 8.5-1.7v-13C17.2 4.5 14.2 5 12 6.5Z", "M12 6.5v13"],
};

function Mark({ word, className = "" }: { word: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      {(MARKS[word] ?? MARKS.Heal).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * Heal, Live and Learn as three panels side by side. Choosing one (click, keyboard, or resting a mouse on it)
 * widens it and opens its points in full; the others narrow to their titles.
 *
 * To keep that smooth on wide screens, nothing re-wraps while a panel changes width: each panel holds two layers
 * stacked in one grid cell, each laid out once at its final width (open or closed, worked out from the row's
 * width with container units), and the panel's edge simply reveals or hides them as it moves. The layers
 * cross-fade, and because every panel always holds both, the row keeps one steady height. On phones the panels
 * stack and the open one shows its points in place.
 */
export function PillarPanels({ groups }: { groups: readonly Group[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const hover = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (hover.current && clearTimeout(hover.current)), []);

  const total = GROW + (groups.length - 1);
  // Inner widths, after the 0.75rem gaps between panels and 2rem of padding on each side of a panel.
  const openW = `calc((100cqw - ${(groups.length - 1) * 0.75}rem) * ${GROW / total} - 4rem)`;
  const closedW = `calc((100cqw - ${(groups.length - 1) * 0.75}rem) * ${1 / total} - 4rem)`;

  return (
    <div className="@container">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        {groups.map((g, i) => {
          const on = i === active;
          return (
            <section
              key={g.word}
              aria-labelledby={`${base}-h-${i}`}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                if (hover.current) clearTimeout(hover.current);
                hover.current = setTimeout(() => setActive(i), 160);
              }}
              onPointerLeave={() => hover.current && clearTimeout(hover.current)}
              style={{ flexGrow: on ? GROW : 1 }}
              className={`relative isolate min-w-0 overflow-hidden rounded-bl-[1rem] rounded-br-[2.5rem] rounded-tl-[2.5rem] rounded-tr-[1rem] ring-1 transition-[flex-grow,background-color,box-shadow] duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none lg:basis-0 ${
                on ? "bg-cream/[0.09] ring-keppel/45" : "bg-cream/[0.035] ring-cream/12 hover:bg-cream/[0.06]"
              }`}
            >
              <Mark
                word={g.word}
                className={`pointer-events-none absolute -bottom-10 -right-10 -z-10 h-48 w-48 transition-[color,opacity,transform] duration-[900ms] ease-calm motion-reduce:transition-none ${on ? "rotate-0 text-keppel opacity-30" : "-rotate-6 text-cream opacity-10"}`}
              />

              <h3 id={`${base}-h-${i}`}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={on}
                  aria-controls={`${base}-p-${i}`}
                  className="flex w-full items-center gap-4 px-6 pb-2 pt-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-keppel sm:px-8 sm:pt-8"
                >
                  <span className={`whitespace-nowrap font-heading text-[clamp(2.6rem,4.6vw,4.2rem)] leading-none tracking-[-0.04em] transition-colors duration-500 ${on ? "text-cream" : "text-cream/75"}`}>
                    {g.word}
                  </span>
                  <span
                    aria-hidden
                    className={`ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-pill transition-[background-color,color,transform] duration-500 ease-calm ${on ? "rotate-45 bg-keppel text-nordic" : "bg-cream/10 text-cream"}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M12 6v12M6 12h12" />
                    </svg>
                  </span>
                </button>
              </h3>

              <div id={`${base}-p-${i}`} className="grid px-6 pb-8 pt-4 sm:px-8">
                {/* Open: every point in full, laid out at the open width. */}
                <ul
                  aria-hidden={!on}
                  style={{ "--w": openW } as React.CSSProperties}
                  className={`grid gap-x-8 gap-y-6 transition-opacity motion-reduce:transition-none lg:[grid-area:1/1] lg:w-[var(--w)] ${g.items.length > 2 ? "xl:grid-cols-2" : ""} ${
                    on ? "opacity-100 delay-[260ms] duration-500" : "pointer-events-none opacity-0 duration-200 max-lg:hidden"
                  }`}
                >
                  {g.items.map((it, k) => (
                    <li
                      key={it.lead}
                      style={{ transitionDelay: on ? `${300 + k * 70}ms` : "0ms" }}
                      className={`border-t border-cream/15 pt-4 text-[1rem] leading-relaxed text-cream/75 transition-[transform,opacity] duration-500 ease-calm motion-reduce:transition-none ${
                        on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                      }`}
                    >
                      <strong className="block font-heading text-[1.2rem] font-medium leading-snug text-keppel">{it.lead}</strong>
                      <span className="mt-1.5 block">{it.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Closed: the titles only, laid out at the closed width. */}
                <ul
                  aria-hidden={on}
                  style={{ "--w": closedW } as React.CSSProperties}
                  className={`space-y-2.5 self-start transition-opacity motion-reduce:transition-none lg:[grid-area:1/1] lg:w-[var(--w)] ${
                    on ? "pointer-events-none opacity-0 duration-150 max-lg:hidden" : "opacity-100 delay-[380ms] duration-500"
                  }`}
                >
                  {g.items.map((it) => (
                    <li key={it.lead} className="flex gap-2.5 text-[0.98rem] leading-snug text-cream/60">
                      <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-pill bg-keppel" />
                      <span>
                        {it.lead}
                        <span className="sr-only"> {it.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

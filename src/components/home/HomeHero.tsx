"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LotusMandala } from "@/components/brand/LotusMandala";

type Props = {
  eyebrow: string;
  heading: string;
  time: readonly string[];
  imageUrl?: string;
  imageAlt?: string;
};

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Home hero: the family home behind the words, and the "time to…" lines laid over the garden
 * in a frosted panel.
 *
 * The Home page's one orchestrated moment: the photograph settles, the words rise, then the panel
 * arrives. Pointing at a line in the panel highlights it and draws its icon.
 */
export function HomeHero({ eyebrow, heading, time, imageUrl, imageAlt }: Props) {
  const reduce = !!useReducedMotion();
  const at = (s: number) => (reduce ? 0 : s);
  const [active, setActive] = useState<number | null>(null);
  const url = imageUrl?.trim();
  const optimisable = !!url && (url.startsWith("/") || url.includes("res.cloudinary.com"));

  return (
    // Pulled up under the floating nav so the photograph runs to the top edge.
    <section className="on-dark relative isolate -mt-24 flex min-h-[100svh] flex-col overflow-hidden bg-ink text-cream sm:-mt-28" aria-labelledby="hero-heading">
      <motion.div
        className="absolute inset-0 -z-20"
        initial={reduce ? false : { scale: 1.07 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: EASE }}
      >
        {url && <Image src={url} alt={imageAlt ?? ""} fill priority sizes="100vw" unoptimized={!optimisable} className="object-cover object-[62%_center]" />}
      </motion.div>

      {/* Legibility, not decoration: deep on the left where the words sit, clear over the house. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(0_0_0/0.72)_0%,rgb(0_0_0/0.5)_32%,rgb(0_0_0/0.1)_62%,rgb(0_0_0/0)_80%)] max-lg:bg-[linear-gradient(to_bottom,rgb(0_0_0/0.45),rgb(0_0_0/0.7))]"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.35),transparent)]" />

      <div className="mx-auto grid w-full max-w-[88rem] flex-1 gap-10 px-5 pb-10 pt-36 sm:px-8 sm:pt-40 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-12">
        {/* Words */}
        <div className="lg:col-span-7">
          <motion.p
            className="inline-flex items-center gap-2.5 rounded-pill bg-black/35 py-1.5 pl-2.5 pr-3.5 text-[0.95rem] font-medium text-cream ring-1 ring-cream/25 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: at(0.5), duration: 0.8, ease: EASE }}
          >
            <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem] shrink-0 fill-keppel" aria-hidden>
              <path d="M12 2.5a7 7 0 0 0-7 7c0 4.9 5.6 10.9 6.3 11.6a1 1 0 0 0 1.4 0c.7-.7 6.3-6.7 6.3-11.6a7 7 0 0 0-7-7Zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />
            </svg>
            {eyebrow}
          </motion.p>

          <h1
            id="hero-heading"
            className="mt-5 max-w-[18ch] overflow-hidden pb-[0.08em] text-[clamp(2.1rem,3.7vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-cream [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]"
          >
            <motion.span
              className="block"
              initial={reduce ? false : { y: "30%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: at(0.65), duration: 1.1, ease: EASE }}
            >
              {heading}
            </motion.span>
          </h1>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: at(1.1), duration: 0.9 }}
          >
            <Link
              href="/talk-to-the-physician"
              className="inline-flex items-center justify-center rounded-pill bg-keppel px-7 py-3.5 text-[0.98rem] font-bold text-nordic transition-[background-color,color,transform] duration-300 ease-calm hover:bg-cream hover:text-nordic active:translate-y-px"
            >
              Talk to the Physician
            </Link>
            <Link
              href="/your-stay"
              className="inline-flex items-center justify-center rounded-pill border border-cream/80 px-7 py-3.5 text-[0.98rem] font-bold text-cream transition-colors duration-300 ease-calm hover:border-cream hover:bg-cream hover:text-nordic"
            >
              Plan Your Stay
            </Link>
          </motion.div>
        </div>

        {/* The day, laid over the garden */}
        <motion.div
          className="lg:col-span-5 lg:col-start-8 lg:self-end"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: at(1.3), duration: 1, ease: EASE }}
        >
          {/* A sage card in the brandmark's leaf silhouette, a lotus opening from its corner. */}
          <div className="relative w-fit max-w-full overflow-hidden rounded-[1.5rem] rounded-br-[5rem] rounded-tl-[5rem] bg-[color-mix(in_srgb,var(--color-keppel)_24%,var(--color-cream))] py-9 pl-9 pr-14 shadow-[0_30px_70px_-25px_rgb(0_0_0/0.65)] sm:pl-10 sm:pr-20 lg:ml-auto">
            {/* One lotus mandala opening from the corner. */}
            <LotusMandala className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 text-nordic opacity-[0.16]" />
            <ul className="relative space-y-2" onMouseLeave={() => setActive(null)}>
              {time.map((line, i) => {
                const on = i === active;
                return (
                  <li
                    key={line}
                    tabIndex={0}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="flex cursor-default items-center gap-4 rounded-pill py-1.5 pr-2"
                  >
                    <span
                      aria-hidden
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-keppel text-cream shadow-[0_8px_18px_-10px] shadow-nordic transition-transform duration-300 ease-calm motion-reduce:transition-none ${
                        on ? "scale-110" : ""
                      }`}
                    >
                      <MomentIcon index={i} draw={on && !reduce} className="h-[1.45rem] w-[1.45rem]" />
                    </span>
                    <span
                      className={`font-heading text-[1.08rem] leading-snug text-nordic transition-transform duration-300 ease-calm motion-reduce:transition-none ${
                        on ? "translate-x-1" : ""
                      }`}
                    >
                      {line}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Line icons for the moments of the day, drawn in the brand's quiet stroke style. */
const MOMENT_ICONS: string[][] = [
  // Eating properly: a warm bowl, steam rising.
  ["M4 12h16a8 8 0 0 1-16 0Z", "M9 20.5h6", "M9 8.5c-1-1.2 1-2.1 0-3.5", "M12 8.5c-1-1.2 1-2.1 0-3.5", "M15 8.5c-1-1.2 1-2.1 0-3.5"],
  // Rest: a crescent moon and a small star.
  ["M19.5 14.5A8 8 0 1 1 9.5 4.5a6.4 6.4 0 0 0 10 10Z", "M17.5 3.5v3", "M16 5h3"],
  // Talking to your physician: two speech bubbles.
  [
    "M4 4.5h10a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5H9l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5Z",
    "M18.5 8.5h1A1.5 1.5 0 0 1 21 10v5.5a1.5 1.5 0 0 1-1.5 1.5H18v3l-3.5-3H11a1.5 1.5 0 0 1-1.5-1.5V15",
  ],
  // Understanding your body: a seated figure, breathing.
  ["M12 3.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8Z", "M12 9v5.5", "M5.5 12.5c2.3.2 4.5-.9 6.5-3.5 2 2.6 4.2 3.7 6.5 3.5", "M4.5 18.5c2.8-2.6 12.2-2.6 15 0-3.2 2-11.8 2-15 0Z"],
];

function MomentIcon({ index, draw, className = "" }: { index: number; draw: boolean; className?: string }) {
  const paths = MOMENT_ICONS[index % MOMENT_ICONS.length];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) =>
        draw ? (
          <motion.path
            key={`${d}-draw`}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: EASE }}
          />
        ) : (
          <path key={d} d={d} />
        ),
      )}
    </svg>
  );
}

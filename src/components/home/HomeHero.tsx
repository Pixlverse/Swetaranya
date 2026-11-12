"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  eyebrow: string;
  heading: string;
  book: string;
  walkthrough: string;
  imageUrl?: string;
  imageAlt?: string;
};

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Home hero: the family home behind one short sentence, set large, and the way in beneath it.
 *
 * The Home page's one orchestrated moment: the photograph settles, the heading rises a line at a time, then
 * the actions arrive. The 360° walkthrough isn't built yet (a later phase), so it shows as a pending action.
 */
export function HomeHero({ eyebrow, heading, book, walkthrough, imageUrl, imageAlt }: Props) {
  const reduce = !!useReducedMotion();
  const at = (s: number) => (reduce ? 0 : s);
  const url = imageUrl?.trim();
  const optimisable = !!url && (url.startsWith("/") || url.includes("res.cloudinary.com"));
  // "Healing needs more than a prescription." breaks after "more", so each line carries one idea.
  const words = heading.split(" ");
  const cut = Math.max(1, words.findIndex((w) => w === "more") + 1 || Math.ceil(words.length / 2));
  const lines = [words.slice(0, cut).join(" "), words.slice(cut).join(" ")].filter(Boolean);

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

      {/* Legibility, not decoration: deep at the lower left where the words sit, clear over the house. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(0_0_0/0.62)_0%,rgb(0_0_0/0.35)_45%,rgb(0_0_0/0)_75%),linear-gradient(to_top,rgb(0_0_0/0.6)_0%,rgb(0_0_0/0.15)_45%,rgb(0_0_0/0)_70%)] max-lg:bg-[linear-gradient(to_top,rgb(0_0_0/0.8)_0%,rgb(0_0_0/0.45)_50%,rgb(0_0_0/0.15)_100%)]"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.35),transparent)]" />

      <div className="mx-auto flex w-full max-w-[88rem] flex-1 flex-col justify-end px-5 pb-16 pt-36 sm:px-8 sm:pt-40 lg:pb-20">
        <div className="max-w-[40rem] lg:max-w-[46rem]">
        <motion.p
          className="inline-flex w-fit items-center gap-2.5 rounded-pill bg-black/35 py-1.5 pl-2.5 pr-3.5 text-[0.95rem] font-medium text-cream ring-1 ring-cream/25 backdrop-blur-sm"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: at(0.5), duration: 0.8, ease: EASE }}
        >
          <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem] shrink-0 fill-keppel" aria-hidden>
            <path d="M12 2.5a7 7 0 0 0-7 7c0 4.9 5.6 10.9 6.3 11.6a1 1 0 0 0 1.4 0c.7-.7 6.3-6.7 6.3-11.6a7 7 0 0 0-7-7Zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />
          </svg>
          {eyebrow}
        </motion.p>

        {/* Two lines on one left edge with everything else, sized so the house stays in view. */}
        <h1
          id="hero-heading"
          className="mt-6 text-[clamp(2.5rem,5.4vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-cream [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]"
        >
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: at(0.65 + i * 0.25), duration: 1.1, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: at(1.35), duration: 0.9 }}
        >
          <Link
            href="/book-a-consultation"
            className="inline-flex w-full items-center justify-center rounded-pill bg-keppel px-7 py-3.5 text-[0.98rem] font-bold text-nordic transition-[background-color,color,transform] duration-300 ease-calm hover:bg-cream hover:text-nordic active:translate-y-px sm:w-auto"
          >
            {book}
          </Link>
          <span
            title="The 360° walkthrough is not available yet"
            className="inline-flex w-full cursor-default items-center justify-center rounded-pill border border-dashed border-cream/70 px-7 py-3.5 text-[0.98rem] font-bold text-cream sm:w-auto"
          >
            {walkthrough}
          </span>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrandSymbol } from "@/components/brand/BrandSymbol";
import { Placeholder } from "@/components/brand/Placeholder";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";

/**
 * Sized to the first screen on desktop: the hero fills the viewport below the floating nav, and the
 * heading, spacing and image scale with viewport height so the CTA is always above the fold.
 *
 * The Home page's one orchestrated moment: the brand symbol draws itself (air, drop, land), then the heading rises
 * line by line out of its own baseline, then the supporting copy settles in.
 */
export function HomeHero({ heading, subheading, body }: { heading: string; subheading: string; body: string }) {
  const reduce = useReducedMotion();
  const lines = heading.split("\n");
  const lineDelay = (i: number) => (reduce ? 0 : 1.3 + i * 0.16);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[88rem] gap-10 px-5 pb-16 pt-4 sm:px-8 lg:h-[calc(100svh-7rem)] lg:min-h-[30rem] lg:max-h-[52rem] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-[3svh]">
        <div className="relative z-10 lg:col-span-8">
          <h1 className="text-[clamp(2.4rem,min(6vw,10.5svh),5.6rem)] leading-[1.02] tracking-[-0.02em] text-nordic">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 1 ? "pl-[0.9em]" : i === 2 ? "pl-[0.35em]" : ""}`}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: lineDelay(i), duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 2.1, duration: 0.8 }}
            className="mt-7 max-w-xl md:ml-[0.35em] lg:mt-[3.5svh]"
          >
            <p className="font-heading text-[1.5rem] italic leading-snug text-keppel lg:text-[clamp(1.3rem,3.6svh,1.9rem)]">{subheading}</p>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/80 lg:mt-[2svh]">{body}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-[3.5svh]">
              <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
              <TextLink href="/the-swetaranya-way">How a stay unfolds</TextLink>
            </div>
          </motion.div>
        </div>

        <div className="relative lg:col-span-4 lg:flex lg:h-full lg:items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            transition={{ delay: reduce ? 0 : 0.5, duration: 1.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative ml-auto aspect-[4/5] w-[82%] max-w-md lg:h-full lg:max-h-[36rem] lg:w-auto lg:max-w-none"
          >
            <Placeholder label="the inner courtyard of the ancestral house in early morning light" shape="leaf" className="h-full w-full" />
          </motion.div>
          {/* The brandmark symbol, set on a cream disc so it reads clearly over the photograph. */}
          <div className="pointer-events-none absolute -left-2 bottom-[-8%] w-[46%] max-w-[15rem] rounded-pill bg-cream p-[5%] sm:-left-8 lg:-left-16 lg:bottom-[4%] lg:w-[clamp(7rem,24svh,13rem)]">
            <BrandSymbol mode="draw" delay={0.2} className="w-full text-keppel" title="Swetāranya symbol" />
          </div>
        </div>
      </div>
    </section>
  );
}

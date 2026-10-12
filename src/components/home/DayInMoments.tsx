"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Placeholder } from "@/components/brand/Placeholder";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Portrait frames of a few heights and drops, so the row reads like pages laid out in a journal rather than a grid. */
const FRAMES = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]", "aspect-[4/5]", "aspect-[3/4]"];
const DROPS = ["mt-0", "mt-8", "mt-3", "mt-10", "mt-2"];

/**
 * The day as a row of photographs. The section holds still while scrolling carries the row sideways, and
 * each moment turns into view like a page of a journal as it arrives — on phones too. On very short windows,
 * and with reduced motion, the row simply swipes sideways.
 */
export function DayInMoments({ label, heading, moments }: { label: string; heading: string; moments: readonly string[] }) {
  const reduce = !!useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLOListElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [frameH, setFrameH] = useState(0);

  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    // How far the row must move for its last photograph to reach the right edge.
    const measure = () => {
      // Hold the row only where a whole photograph and its line fit on screen; on very short windows it swipes.
      setTravel(window.innerHeight >= 600 ? Math.max(0, el.scrollWidth - el.clientWidth) : 0);
      setFrameH(frame.current?.offsetHeight ?? 0);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (frame.current) ro.observe(frame.current);
    measure();
    return () => ro.disconnect();
  }, []);

  const pinned = !reduce && travel > 0;
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(eased, [0, 1], [0, -travel]);

  return (
    // Scrolling one pixel down moves the row one pixel across. The held frame is only as tall as its content,
    // centred under the nav, so no empty band scrolls in before or after it.
    <div ref={track} className="relative" style={pinned && frameH ? { height: frameH + travel } : undefined}>
      <div
        ref={frame}
        className={`pb-4 pt-20 md:pt-24 ${pinned ? "sticky overflow-hidden" : ""}`}
        style={pinned ? { top: `max(0px, calc((100svh - ${frameH}px) / 2 + 2.5rem))` } : undefined}
      >
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8">
          <p className="text-[0.95rem] font-bold text-keppel">{label}</p>
          <h2 id="pod-heading" className="mt-3 max-w-[24ch] text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.025em]">
            {heading}
          </h2>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[88rem] md:mt-[min(3.5rem,5svh)]">
          <motion.ol
            ref={row}
            style={pinned ? { x } : undefined}
            className={`flex items-start gap-5 px-5 pb-4 sm:gap-7 sm:px-8 ${pinned ? "" : "scroll-px-5 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"}`}
          >
            {moments.map((m, i) => (
              <motion.li
                key={m}
                className={`w-[min(68vw,calc((100svh-25rem)/1.5))] shrink-0 snap-start md:w-[clamp(11rem,calc((100svh-27rem)/1.5),26rem)] ${DROPS[i % DROPS.length]}`}
                style={{ transformPerspective: 1200, transformOrigin: "left center" }}
                initial={reduce ? false : { opacity: 0, rotateY: -28, x: 24 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <Placeholder label={m} className={`w-full rounded-[1.25rem] ${FRAMES[i % FRAMES.length]}`} />
                <p className="mt-4 flex items-baseline gap-3 font-heading text-[1.12rem] leading-snug text-nordic">
                  <span aria-hidden className="h-px w-6 shrink-0 translate-y-[-0.3em] bg-keppel" />
                  {m}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </div>
  );
}

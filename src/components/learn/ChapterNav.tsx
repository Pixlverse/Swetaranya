"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Chapter = { id: string; n: string; label: string };

/**
 * The page's five chapters as a small index that rides along the bottom of the screen while you are
 * inside them, lighting the one you are reading. It stays out of the way of the header at the top.
 */
export function ChapterNav({ chapters }: { chapters: readonly Chapter[] }) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((e): e is HTMLElement => !!e);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        // The chapter crossing the middle of the screen is the one being read.
        const best = [...visible.entries()].filter(([, r]) => r > 0).sort((a, b) => b[1] - a[1])[0];
        setCurrent(best ? best[0] : null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.01, 1] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [chapters]);

  return (
    <AnimatePresence>
      {current && (
        <motion.nav
          aria-label="Chapters"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          className="on-dark fixed inset-x-0 bottom-4 z-40 flex justify-center px-3"
        >
          <ol className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-pill bg-nordic/95 p-1.5 shadow-[0_18px_40px_-18px] shadow-nordic/80 ring-1 ring-cream/10 backdrop-blur [scrollbar-width:none]">
            {chapters.map((c) => {
              const on = c.id === current;
              return (
                <li key={c.id} className="shrink-0">
                  <a
                    href={`#${c.id}`}
                    aria-current={on ? "true" : undefined}
                    className={`relative flex items-center gap-2 rounded-pill px-3 py-2 text-[0.85rem] transition-colors ${on ? "text-nordic" : "text-cream/70 hover:text-cream"}`}
                  >
                    {on && (
                      <motion.span
                        layoutId={reduce ? undefined : "chapter-pill"}
                        className="absolute inset-0 rounded-pill bg-keppel"
                        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      />
                    )}
                    <span className="relative font-heading tabular-nums">{c.n}</span>
                    <span className={`relative font-bold ${on ? "" : "hidden md:inline"}`}>{c.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

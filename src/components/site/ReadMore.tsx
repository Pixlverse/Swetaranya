"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * The "Expanded" layer of a section: a short summary stays on the page, and the button opens the
 * longer copy beneath it in place, easing open so the reader sees exactly what was added.
 */
export function ReadMore({
  label,
  children,
  tone = "light",
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const btn =
    tone === "light"
      ? "border-nordic/25 text-nordic hover:border-nordic hover:bg-nordic hover:text-cream"
      : "border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-nordic";

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`group inline-flex items-center gap-3 rounded-pill border py-2.5 pl-5 pr-2.5 text-[0.95rem] font-bold transition-colors duration-300 ease-calm ${btn}`}
      >
        {label}
        <span aria-hidden className="relative grid h-7 w-7 place-items-center rounded-pill bg-keppel text-nordic">
          <span className="absolute h-[2px] w-3 bg-current" />
          <span className={`absolute h-3 w-[2px] bg-current transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            aria-label={label}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

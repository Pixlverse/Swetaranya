"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function FaqAccordion({ faqs, tone = "light" }: { faqs: { question: string; answer: string }[]; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const id = useId();
  const line = tone === "light" ? "border-nordic/15" : "border-cream/15";

  return (
    <div className={`border-t ${line}`}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.question} className={`border-b ${line}`}>
            <h3 className="font-body text-base">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left text-[1.08rem] font-bold text-nordic"
              >
                {f.question}
                <span aria-hidden className="relative mt-2 h-3 w-3 shrink-0">
                  <span className="absolute left-0 top-1/2 h-[2px] w-3 -translate-y-1/2 bg-keppel" />
                  <span className={`absolute left-1/2 top-0 h-3 w-[2px] -translate-x-1/2 bg-keppel transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-${i}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-ink/80">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

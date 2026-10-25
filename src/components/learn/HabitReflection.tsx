"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  questions: readonly string[];
  answers: readonly string[];
  end: { heading: string; body: string; rarely: string; link: { label: string; href: string } };
  disclaimer: string;
};

/**
 * Seven everyday questions, three plain answers each. Nothing is scored: the row of marks only shows how
 * far through you are, and the closing words open once every question has an answer.
 */
export function HabitReflection({ questions, answers, end, disclaimer }: Props) {
  const reduce = useReducedMotion();
  const id = useId();
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const done = picked.every((p) => p !== null);

  return (
    <div>
      {/* How far through: one mark per question. */}
      <div aria-hidden className="flex gap-1.5">
        {questions.map((q, i) => (
          <span key={q} className={`h-1 flex-1 rounded-pill transition-colors duration-500 ${picked[i] !== null ? "bg-keppel" : "bg-cream/15"}`} />
        ))}
      </div>

      <ol className="mt-6 divide-y divide-cream/12 border-y border-cream/12">
        {questions.map((q, i) => (
          <li key={q} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8">
            <p id={`${id}-q${i}`} className="font-heading text-[1.12rem] leading-snug text-cream md:text-[1.2rem]">
              {q}
            </p>
            <div role="radiogroup" aria-labelledby={`${id}-q${i}`} className="grid grid-cols-3 rounded-pill bg-cream/8 p-1 ring-1 ring-cream/12 md:w-[22rem]">
              {answers.map((a, k) => {
                const on = picked[i] === k;
                return (
                  <label key={a} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name={`${id}-q${i}`}
                      value={a}
                      checked={on}
                      onChange={() => setPicked((p) => p.map((v, j) => (j === i ? k : v)))}
                      className="peer sr-only"
                    />
                    {on && (
                      <motion.span
                        layoutId={reduce ? undefined : `${id}-pill-${i}`}
                        className="absolute inset-0 rounded-pill bg-keppel"
                        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      />
                    )}
                    <span
                      className={`relative block rounded-pill px-2 py-2 text-center text-[0.9rem] font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cream ${
                        on ? "text-nordic" : "text-cream/75 hover:text-cream"
                      }`}
                    >
                      {a}
                    </span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <AnimatePresence initial={false}>
        {done && (
          <motion.div
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-8 grid gap-6 rounded-[1.75rem] bg-cream p-6 text-ink md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:p-9">
              <div>
                <p className="font-heading text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight text-nordic">{end.heading}</p>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{end.body}</p>
              </div>
              <div className="md:border-l md:border-nordic/12 md:pl-10">
                <p className="text-[1.02rem] leading-relaxed text-ink/80">{end.rarely}</p>
                <Link
                  href={end.link.href}
                  className="mt-5 inline-flex items-center rounded-pill bg-keppel px-6 py-3 text-[0.95rem] font-bold text-nordic transition-colors duration-300 hover:bg-nordic hover:text-cream"
                >
                  {end.link.label}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 border-l-2 border-blush pl-4 text-[0.88rem] text-cream/65">{disclaimer}</p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LIFESTYLE_QUESTIONS, AREA_NOTES } from "@/content/lifestyle";
import { LIFESTYLE_AREAS, LIFESTYLE_CHECK_DISCLAIMER, type LifestyleArea } from "@/lib/constants";
import { band, scoreLifestyle, type LifestyleResponses } from "@/lib/lifestyle";
import { PetalChart, LIFESTYLE_LABELS } from "./PetalChart";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";
import { DrawnCheck } from "@/components/enquiry/Field";

type Stage = "intro" | "questions" | "result";

/** The disclaimer is always rendered from the shared constant — never retyped. */
function Disclaimer({ className = "" }: { className?: string }) {
  return <p className={`border-l-2 border-terracotta pl-4 text-[0.88rem] leading-relaxed text-ink/70 ${className}`}>{LIFESTYLE_CHECK_DISCLAIMER}</p>;
}

export function LifestyleCheck() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<LifestyleResponses>>({});
  const [saved, setSaved] = useState<{ id: string; token: string } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const q = LIFESTYLE_QUESTIONS[step];

  useEffect(() => {
    if (stage !== "intro") heading.current?.focus();
  }, [stage, step]);

  const choose = (value: number) => {
    const next = { ...answers, [q.area]: value };
    setAnswers(next);
    window.setTimeout(
      () => {
        if (step < LIFESTYLE_QUESTIONS.length - 1) setStep(step + 1);
        else finish(next as LifestyleResponses);
      },
      reduce ? 0 : 260,
    );
  };

  const finish = (responses: LifestyleResponses) => {
    setStage("result");
    fetch("/api/lifestyle-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ responses }) })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setSaved(d))
      .catch(() => {});
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setSaved(null);
    setStage("questions");
  };

  if (stage === "intro") {
    return (
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h1 className="text-[clamp(2.2rem,4.15vw,3.5rem)] leading-[0.96] tracking-[-0.02em]">How is your daily life treating you?</h1>
          <p className="mt-6 max-w-lg text-[1.1rem] text-ink/80">
            Eight short questions about the everyday things Ayurveda pays attention to. It takes about two minutes. At the end you&apos;ll see a
            snapshot of where your days feel steady, and where they may need more care.
          </p>
          <Disclaimer className="mt-8 max-w-lg" />
          <button type="button" onClick={() => setStage("questions")} className="mt-10 rounded-pill bg-keppel px-8 py-3.5 font-bold text-nordic transition-colors hover:bg-nordic hover:text-cream">
            Begin
          </button>
        </div>
        <PetalChart className="mx-auto w-full max-w-sm text-nordic md:col-span-5 md:col-start-8" />
      </div>
    );
  }

  if (stage === "questions") {
    const partial = Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, Math.round(((v as number) / 3) * 100)])) as Partial<Record<LifestyleArea, number>>;
    return (
      <div className="grid gap-12 md:grid-cols-12">
        <div className="order-2 md:order-1 md:col-span-7">
          <p className="text-[0.92rem] font-bold text-keppel" aria-live="polite">
            Question {step + 1} of {LIFESTYLE_QUESTIONS.length}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.fieldset
              key={step}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: reduce ? 0.1 : 0.3 }}
              className="mt-4"
            >
              <legend className="sr-only">{q.question}</legend>
              <h2 ref={heading} tabIndex={-1} className="text-[clamp(1.8rem,3.24vw,2.5rem)] leading-[1.05] focus:outline-none">
                {q.question}
              </h2>
              <div className="mt-10 border-t border-nordic/15">
                {q.options.map((o) => {
                  const on = answers[q.area] === o.value;
                  return (
                    <label key={o.label} className="group flex cursor-pointer items-center gap-5 border-b border-nordic/15 py-5 has-[:focus-visible]:bg-keppel/5">
                      <input type="radio" name={q.area} value={o.value} checked={on} onChange={() => choose(o.value)} className="peer sr-only" />
                      <svg viewBox="0 0 16 16" className={`h-5 w-5 shrink-0 transition-colors ${on ? "text-keppel" : "text-nordic/30 group-hover:text-keppel/70"}`} aria-hidden>
                        <path d="M8 1 C8 1 3 7 3 10 a5 5 0 0 0 10 0 C13 7 8 1 8 1 Z" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      <span className={`text-[1.1rem] ${on ? "font-bold text-nordic" : "text-ink/85"}`}>{o.label}</span>
                    </label>
                  );
                })}
              </div>
            </motion.fieldset>
          </AnimatePresence>
          <div className="mt-8 flex items-center gap-6">
            <button
              type="button"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="font-bold text-nordic underline decoration-keppel underline-offset-4 disabled:opacity-30 disabled:no-underline"
            >
              Previous question
            </button>
          </div>
        </div>
        <aside className="order-1 md:order-2 md:col-span-4 md:col-start-9">
          <PetalChart scores={partial} showLabels={false} className="mx-auto w-40 text-nordic md:w-full md:max-w-[16rem]" />
          <Disclaimer className="mt-6 hidden md:block" />
        </aside>
      </div>
    );
  }

  const responses = answers as LifestyleResponses;
  const { scorePercentages, overallPercentage } = scoreLifestyle(responses);
  const sorted = [...LIFESTYLE_AREAS].sort((a, b) => scorePercentages[a] - scorePercentages[b]);
  const needsCare = sorted.filter((a) => band(scorePercentages[a]) !== "steady");
  const steady = sorted.filter((a) => band(scorePercentages[a]) === "steady").reverse();

  return (
    <div>
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <PetalChart scores={scorePercentages} animate className="mx-auto w-full max-w-md text-nordic" />
        </div>
        <motion.div
          className="md:col-span-5 md:col-start-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.6, duration: 0.6 }}
        >
          <h2 ref={heading} tabIndex={-1} className="text-[clamp(1.9rem,3.32vw,2.6rem)] leading-[1.02] focus:outline-none">
            Your lifestyle snapshot
          </h2>
          <p className="mt-4 text-[1.05rem] text-ink/80">
            Overall, your daily life sits at <span className="font-bold text-nordic">{overallPercentage}%</span> of steady. The fuller a petal, the
            steadier that part of your day feels.
          </p>
          <Disclaimer className="mt-6" />
        </motion.div>
      </div>

      <motion.div
        className="mt-16 grid gap-12 border-t border-nordic/15 pt-12 md:grid-cols-2"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 2.1, duration: 0.6 }}
      >
        {needsCare.length > 0 && (
          <section aria-labelledby="care-heading">
            <h3 id="care-heading" className="text-[1.7rem]">Where your days may need care</h3>
            <ul className="mt-5 space-y-4">
              {needsCare.map((a) => (
                <li key={a} className="flex gap-4">
                  <span className="w-24 shrink-0 font-bold text-nordic">{LIFESTYLE_LABELS[a]}</span>
                  <span className="text-ink/80">{AREA_NOTES[a][band(scorePercentages[a])]}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {steady.length > 0 && (
          <section aria-labelledby="steady-heading">
            <h3 id="steady-heading" className="text-[1.7rem]">What already feels steady</h3>
            <ul className="mt-5 space-y-4">
              {steady.map((a) => (
                <li key={a} className="flex gap-4">
                  <span className="w-24 shrink-0 font-bold text-nordic">{LIFESTYLE_LABELS[a]}</span>
                  <span className="text-ink/80">{AREA_NOTES[a].steady}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </motion.div>

      <div className="mt-16 grid gap-12 border-t border-nordic/15 pt-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h3 className="text-[1.9rem]">If you&apos;d like to talk it through</h3>
          <p className="mt-3 text-ink/80">
            A snapshot can only notice patterns. Understanding what lies behind them is what a consultation is for.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
            <button type="button" onClick={restart} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
              Take it again
            </button>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">{saved ? <FollowUp saved={saved} /> : <p className="text-[0.9rem] text-ink/55">Saving your snapshot…</p>}</div>
      </div>
      <TextLink href="/journal?category=food-and-daily-routine" className="mt-12 inline-block">
        Reading on food and daily routine
      </TextLink>
    </div>
  );
}

function FollowUp({ saved }: { saved: { id: string; token: string } }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    const res = await fetch(`/api/lifestyle-check/${saved.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: saved.token, contactEmail: fd.get("email"), followUpRequested: fd.get("followUp") === "on" }),
    });
    setState(res.ok ? "done" : "error");
  };
  if (state === "done")
    return (
      <div role="status" className="flex items-center gap-4">
        <DrawnCheck className="h-10 w-10 shrink-0 text-keppel" />
        <p className="text-nordic">Thank you. If you asked us to, someone from Swetaranya will be in touch.</p>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-4">
      <label htmlFor="lc-email" className="block font-bold text-nordic">
        Keep a copy, or ask the physician to look at it
      </label>
      <input id="lc-email" name="email" type="email" required autoComplete="email" placeholder="Your email" className="block w-full border-0 border-b border-nordic/30 bg-transparent py-3 focus:border-keppel focus:outline-none" />
      <label className="flex items-start gap-3 text-[0.92rem] text-ink/80">
        <input type="checkbox" name="followUp" className="mt-1 h-4 w-4 accent-keppel" />
        I&apos;d like someone from Swetaranya to follow up with me
      </label>
      {state === "error" && <p role="alert" className="text-[0.9rem] text-clay">That didn&apos;t work. Please check your email and try again.</p>}
      <button type="submit" disabled={state === "sending"} className="rounded-pill border border-nordic px-6 py-2.5 font-bold text-nordic transition-colors hover:bg-nordic hover:text-cream disabled:opacity-60">
        {state === "sending" ? "Saving" : "Save"}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CONSTITUTION_QUESTIONS, DOSHAS, type Dosha } from "@/content/constitution";
import { CONSTITUTION_CHECK_DISCLAIMER } from "@/lib/constants";
import { scoreConstitution } from "@/lib/constitution";
import { BalanceTriangle } from "./BalanceTriangle";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";
import { DrawnCheck } from "@/components/enquiry/Field";

/** The disclaimer is always rendered from the shared constant — never retyped. */
function Disclaimer({ className = "" }: { className?: string }) {
  return <p className={`border-l-2 border-terracotta pl-4 text-[0.88rem] leading-relaxed text-ink/70 ${className}`}>{CONSTITUTION_CHECK_DISCLAIMER}</p>;
}

/** Progress as a vine that grows a leaf for every answer. */
function Vine({ done, total }: { done: number; total: number }) {
  return (
    <svg viewBox={`0 0 ${total * 24 + 8} 24`} className="h-6 w-full max-w-sm" aria-hidden>
      <path d={`M4 12 H${total * 24 + 4}`} className="stroke-nordic/15" strokeWidth="1.5" />
      <motion.path d={`M4 12 H${done * 24 + 4}`} className="stroke-keppel" strokeWidth="1.5" initial={false} animate={{ d: `M4 12 H${done * 24 + 4}` }} />
      {Array.from({ length: total }, (_, i) => (
        <path
          key={i}
          d={`M${i * 24 + 16} 12 c 2 -6 6 -8 8 -9 c 0 4 -3 8 -8 9 z`}
          transform={i % 2 ? `rotate(180 ${i * 24 + 16} 12)` : undefined}
          className={`transition-colors duration-500 ${i < done ? "fill-keppel" : "fill-nordic/10"}`}
        />
      ))}
    </svg>
  );
}

type Stage = "intro" | "questions" | "result";

export function ConstitutionCheck() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Dosha>>({});
  const [saved, setSaved] = useState<{ id: string; token: string } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const q = CONSTITUTION_QUESTIONS[step];

  useEffect(() => {
    if (stage !== "intro") heading.current?.focus();
  }, [stage, step]);

  const choose = (d: Dosha) => {
    const next = { ...answers, [q.id]: d };
    setAnswers(next);
    window.setTimeout(
      () => {
        if (step < CONSTITUTION_QUESTIONS.length - 1) setStep(step + 1);
        else {
          setStage("result");
          fetch("/api/constitution-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: next }) })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => d && setSaved(d))
            .catch(() => {});
        }
      },
      reduce ? 0 : 260,
    );
  };

  if (stage === "intro") {
    return (
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h1 className="text-[clamp(2.8rem,6.4vw,5.2rem)] leading-[0.98] tracking-[-0.02em]">Know your constitution</h1>
          <p className="mt-6 max-w-lg text-[1.1rem] text-ink/80">
            Ayurveda describes three tendencies — Vata, Pitta and Kapha — present in everyone in different measure. Twelve short questions
            about your body, digestion, sleep and temperament show which of them may lead in you.
          </p>
          <Disclaimer className="mt-8 max-w-lg" />
          <button type="button" onClick={() => setStage("questions")} className="mt-10 rounded-pill bg-keppel px-8 py-3.5 font-bold text-white transition-colors hover:bg-nordic">
            Begin
          </button>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <BalanceTriangle vata={34} pitta={33} kapha={33} className="mx-auto w-full max-w-sm" />
          <p className="mt-2 text-center text-[0.85rem] text-ink/55">Your result places a point between the three.</p>
        </div>
      </div>
    );
  }

  if (stage === "questions") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.92rem] font-bold text-keppel" aria-live="polite">
            Question {step + 1} of {CONSTITUTION_QUESTIONS.length}
          </p>
          <Vine done={Object.keys(answers).length} total={CONSTITUTION_QUESTIONS.length} />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.fieldset
            key={step}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduce ? 0.1 : 0.3 }}
            className="mt-8"
          >
            <legend className="sr-only">{q.question}</legend>
            <h2 ref={heading} tabIndex={-1} className="text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.05] focus:outline-none">
              {q.question}
            </h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {q.options.map((o) => {
                const on = answers[q.id] === o.dosha;
                return (
                  <label
                    key={o.label}
                    className={`flex min-h-32 cursor-pointer flex-col justify-between rounded-soft border p-5 transition-[border-color,background-color,transform] duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-keppel ${
                      on ? "-translate-y-1 border-keppel bg-keppel/10" : "border-nordic/20 bg-white/50 hover:border-nordic/45"
                    }`}
                  >
                    <input type="radio" name={q.id} value={o.dosha} checked={on} onChange={() => choose(o.dosha)} className="sr-only" />
                    <span className={`text-[1.05rem] leading-snug ${on ? "font-bold text-nordic" : "text-ink/85"}`}>{o.label}</span>
                    <span aria-hidden className={`mt-4 block h-1 w-8 rounded-pill ${on ? "bg-keppel" : "bg-nordic/15"}`} />
                  </label>
                );
              })}
            </div>
          </motion.fieldset>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between gap-6">
          <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="font-bold text-nordic underline decoration-keppel underline-offset-4 disabled:opacity-30 disabled:no-underline">
            Previous question
          </button>
        </div>
        <Disclaimer className="mt-12" />
      </div>
    );
  }

  const r = scoreConstitution(answers);
  const leading = r.dominant.split("-") as Dosha[];
  const title = leading.map((d) => DOSHAS[d].name).join("–");

  return (
    <div>
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <BalanceTriangle vata={r.vata} pitta={r.pitta} kapha={r.kapha} className="mx-auto w-full max-w-md" />
        </div>
        <motion.div className="md:col-span-5 md:col-start-8" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 1.8, duration: 0.6 }}>
          <h2 ref={heading} tabIndex={-1} className="text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] focus:outline-none">
            {leading.length > 1 ? `A ${title} tendency` : `${title} may lead in you`}
          </h2>
          <p className="mt-4 text-[1.05rem] text-ink/80">
            From your answers, {title} {leading.length > 1 ? "qualities appear in similar measure" : "qualities appear most"}. Everyone carries all three;
            what differs is the balance — and it shifts with age, season and the way we live.
          </p>
          <Disclaimer className="mt-6" />
        </motion.div>
      </div>

      <motion.div className="mt-16 grid gap-10 border-t border-nordic/15 pt-12 md:grid-cols-3" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 2.2, duration: 0.6 }}>
        {(["vata", "pitta", "kapha"] as Dosha[]).map((d) => {
          const info = DOSHAS[d];
          const lead = leading.includes(d);
          return (
            <section key={d} aria-labelledby={`dosha-${d}`} className={lead ? "" : "opacity-75"}>
              <p className="font-heading text-[2.4rem] leading-none text-keppel tabular-nums">{r[d]}%</p>
              <h3 id={`dosha-${d}`} className="mt-3 text-[1.8rem]">
                {info.name}
              </h3>
              <p className="font-heading italic text-terracotta">{info.elements}</p>
              <p className="mt-3 text-[0.95rem] text-ink/70">{info.qualities.join(", ")}</p>
              <dl className="mt-4 space-y-3 text-[0.95rem]">
                <div>
                  <dt className="font-bold text-nordic">In balance</dt>
                  <dd className="text-ink/75">{info.balanced}</dd>
                </div>
                <div>
                  <dt className="font-bold text-nordic">When unsettled</dt>
                  <dd className="text-ink/75">{info.unsettled}</dd>
                </div>
              </dl>
              {lead && (
                <div className="mt-4 border-l-2 border-keppel pl-4">
                  <p className="font-bold text-nordic">Everyday things that often help</p>
                  <ul className="mt-2 space-y-1 text-[0.95rem] text-ink/75">
                    {info.everyday.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </motion.div>
      <p className="mt-6 inline-block border border-dashed border-terracotta px-2 py-0.5 text-[0.8rem] font-bold text-terracotta">
        Placeholder descriptions — pending review by Dr. Thrivikraman
      </p>

      <div className="mt-16 grid gap-12 border-t border-nordic/15 pt-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h3 className="text-[1.9rem]">The real picture takes a physician</h3>
          <p className="mt-3 text-ink/80">
            In person, the physician reads your pulse, tongue and history to understand both your constitution and how it stands today — something no
            questionnaire can do.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PrimaryLink href="/book-a-consultation">Book a consultation</PrimaryLink>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setStep(0);
                setSaved(null);
                setStage("questions");
              }}
              className="font-bold text-nordic underline decoration-keppel underline-offset-4"
            >
              Take it again
            </button>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">{saved ? <FollowUp saved={saved} /> : <p className="text-[0.9rem] text-ink/55">Saving your result…</p>}</div>
      </div>
      <TextLink href="/lifestyle-check" className="mt-12 inline-block">
        Also try the Lifestyle Check
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
    const res = await fetch(`/api/constitution-check/${saved.id}`, {
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
      <label htmlFor="cc-email" className="block font-bold text-nordic">
        Keep a copy, or ask the physician to look at it
      </label>
      <input id="cc-email" name="email" type="email" required autoComplete="email" placeholder="Your email" className="block w-full border-0 border-b border-nordic/30 bg-transparent py-3 focus:border-keppel focus:outline-none" />
      <label className="flex items-start gap-3 text-[0.92rem] text-ink/80">
        <input type="checkbox" name="followUp" className="mt-1 h-4 w-4 accent-keppel" />
        I&apos;d like someone from Swetaranya to follow up with me
      </label>
      {state === "error" && (
        <p role="alert" className="text-[0.9rem] text-clay">
          That didn&apos;t work. Please check your email and try again.
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="rounded-pill border border-nordic px-6 py-2.5 font-bold text-nordic transition-colors hover:bg-nordic hover:text-cream disabled:opacity-60">
        {state === "sending" ? "Saving" : "Save"}
      </button>
    </form>
  );
}

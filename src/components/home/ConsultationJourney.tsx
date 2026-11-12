type Item = { lead: string; text: string };
type Step = { step: string; title: string; text: string };

/**
 * The consultation journey is a genuine sequence, so its steps keep their numbers. Step 1 happens at home and
 * is given the room its four parts need; a line with the brandmark's drop marks the arrival; the three steps
 * at Swetaranya then read across.
 */
export function ConsultationJourney({
  first,
  arrive,
  steps,
}: {
  first: { step: string; title: string; sub: string; items: readonly Item[] };
  arrive: string;
  steps: readonly Step[];
}) {
  return (
    <div>
      <section className="grid gap-8 lg:grid-cols-12 lg:gap-12" aria-labelledby="journey-step-1">
        <div className="lg:col-span-4">
          <StepMark step={first.step} size="text-[clamp(3.6rem,6vw,5.4rem)]" />
          <h3 id="journey-step-1" className="mt-3 text-[clamp(1.55rem,2.3vw,2rem)] leading-tight text-nordic">
            {first.title}
          </h3>
          <p className="mt-2 text-[1.02rem] text-ink/70">{first.sub}</p>
        </div>
        <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-8">
          {first.items.map((it) => (
            <li key={it.lead} className="border-t-2 border-keppel/60 pt-4 text-[1.02rem] leading-relaxed text-ink/80">
              <strong className="block font-heading text-[1.2rem] font-medium text-nordic">{it.lead}</strong>
              <span className="mt-1.5 block">{it.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* The arrival: one line across, the drop at its centre. */}
      <div className="my-12 flex items-center gap-4 md:my-16" role="separator" aria-label={arrive}>
        <span aria-hidden className="h-px flex-1 bg-nordic/25" />
        <span className="flex items-center gap-3 font-heading text-[clamp(1.2rem,1.8vw,1.5rem)] text-nordic">
          <svg viewBox="0 0 12 16" aria-hidden className="h-5 w-4 fill-keppel">
            <path d="M6 0C4.2 3.6 0 7.2 0 10.2a6 6 0 0 0 12 0C12 7.2 7.8 3.6 6 0Z" />
          </svg>
          {arrive}
        </span>
        <span aria-hidden className="h-px flex-1 bg-nordic/25" />
      </div>

      <ol className="grid gap-10 md:grid-cols-3 md:gap-0">
        {steps.map((s, i) => (
          <li key={s.step} className={`md:px-8 ${i ? "md:border-l md:border-nordic/15" : "md:pl-0"} ${i === steps.length - 1 ? "md:pr-0" : ""}`}>
            <StepMark step={s.step} size="text-[clamp(2.6rem,4vw,3.6rem)]" />
            <h3 className="mt-3 text-[1.45rem] leading-tight text-nordic">{s.title}</h3>
            <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** "Step 2" with the word small and the number set large, so the sequence reads at a glance. */
function StepMark({ step, size }: { step: string; size: string }) {
  const [word, num] = [step.replace(/\s*\d+\s*$/, ""), step.match(/\d+/)?.[0] ?? ""];
  return (
    <p className="flex items-baseline gap-2 text-keppel">
      <span className="text-[0.95rem] font-bold">{word}</span>
      <span className={`font-heading leading-none tracking-[-0.04em] ${size}`}>{num}</span>
    </p>
  );
}

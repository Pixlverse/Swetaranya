import type { Metadata } from "next";
import { Placeholder } from "@/components/brand/Placeholder";
import { OutlineLink, PrimaryLink, TextLink } from "@/components/site/Buttons";
import { BranchesWheel } from "@/components/learn/BranchesWheel";
import { ChapterNav } from "@/components/learn/ChapterNav";
import { AgniMark } from "@/components/learn/Diagrams";
import { DoshaBalance } from "@/components/learn/DoshaBalance";
import { ElementWheel } from "@/components/learn/ElementWheel";
import { HabitReflection } from "@/components/learn/HabitReflection";
import { LEARN } from "@/content/learn";

export const metadata: Metadata = {
  title: "Learn Ayurveda",
  description: LEARN.hero.body[0],
};

/** A chapter's number and name, then its heading. The numbering is the page's own reading order. */
function ChapterHead({ n, label, heading, id, dark = false }: { n: string; label: string; heading: string; id: string; dark?: boolean }) {
  return (
    <div>
      <p className="flex items-center gap-3 text-[0.98rem] font-bold text-keppel">
        <span className={`grid h-9 w-9 place-items-center rounded-pill font-heading text-[0.9rem] tabular-nums ${dark ? "bg-cream/10 text-cream" : "bg-nordic text-cream"}`}>{n}</span>
        {label}
      </p>
      <h2 id={`${id}-heading`} className={`mt-4 max-w-[22ch] text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.025em] ${dark ? "text-cream" : ""}`}>
        {heading}
      </h2>
    </div>
  );
}

export default function LearnAyurvedaPage() {
  const { hero, chapters, wayOfLife, balance, everyday, habits, atSwetaranya, closing } = LEARN;

  return (
    <>
      <ChapterNav chapters={chapters} />

      {/* Hero: the page opens on its own words, with the chapters laid out as the way in. */}
      <section className="mx-auto max-w-[88rem] px-5 pb-12 pt-10 sm:px-8 md:pb-16 md:pt-14" aria-labelledby="learn-heading">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <h1 id="learn-heading" className="font-body text-[1rem] font-bold leading-none text-keppel">
              {hero.label}
            </h1>
            <p className="mt-5 font-heading text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.035em] text-nordic">
              {hero.display.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          </div>
          <div className="space-y-4 text-[1.08rem] leading-relaxed text-ink/80 lg:col-span-5 lg:pb-2">
            {hero.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <p className="mt-10 border-l-[3px] border-keppel pl-5 font-heading text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug text-nordic md:mt-12">{hero.line}</p>

        <nav aria-label="Chapters on this page" className="mt-10 md:mt-12">
          <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] bg-nordic/12 ring-1 ring-nordic/12 md:grid-cols-5">
            {chapters.map((c) => (
              <li key={c.id} className="bg-cream last:col-span-2 md:last:col-span-1">
                <a href={`#${c.id}`} className="group flex h-full items-center gap-4 p-4 transition-colors hover:bg-keppel/12 md:p-5">
                  <span className="font-heading text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none tabular-nums text-keppel transition-colors group-hover:text-nordic">{c.n}</span>
                  <span className="font-heading text-[1.08rem] leading-tight text-nordic">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* 01 — A way of life: the eight branches as one ring. */}
      <section id="way-of-life" className="on-dark scroll-mt-28 bg-nordic text-cream" aria-labelledby="way-of-life-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <ChapterHead id="way-of-life" n={wayOfLife.n} label={wayOfLife.label} heading={wayOfLife.heading} dark />
            </div>
            <div className="space-y-4 text-[1.06rem] leading-relaxed text-cream/80 lg:col-span-6 lg:pt-14">
              {wayOfLife.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          {/* The mandala beside its heading and closing line, so the flower fills the width rather than floating alone. */}
          <div className="mt-12 grid items-center gap-8 md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,44rem)] lg:gap-12">
            <div className="contents lg:block">
              <h3 className="text-[clamp(1.35rem,2.2vw,1.8rem)] text-cream">{wayOfLife.branchesHeading}</h3>
              <p className="order-last border-t border-cream/15 pt-8 font-heading text-[clamp(1.2rem,2vw,1.55rem)] leading-snug text-cream lg:mt-10">{wayOfLife.closer}</p>
            </div>
            <BranchesWheel branches={wayOfLife.branches} />
          </div>
        </div>
      </section>

      {/* 02 — Balance: five elements, three doshas, agni, the mind, and the three supports of care. */}
      <section id="balance" className="scroll-mt-28" aria-labelledby="balance-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-20">
          <ChapterHead id="balance" n={balance.n} label={balance.label} heading={balance.heading} />

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] bg-nordic/12 ring-1 ring-nordic/12 lg:grid-cols-2">
            {/* The five elements */}
            <article className="flex flex-col bg-cream p-6 md:p-9">
              <h3 className="text-[clamp(1.35rem,2vw,1.7rem)]">{balance.elements.heading}</h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{balance.elements.body}</p>
              <div className="mt-6 flex flex-1 items-center justify-center">
                <ElementWheel words={balance.elements.words} />
              </div>
            </article>

            {/* The three doshas */}
            <article className="bg-cream p-6 md:p-9">
              <h3 className="text-[clamp(1.35rem,2vw,1.7rem)]">{balance.doshas.heading}</h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{balance.doshas.intro}</p>
              <div className="mt-6">
                <DoshaBalance items={balance.doshas.items} />
              </div>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/80">{balance.doshas.body}</p>
            </article>

            {/* Agni */}
            <article className="on-dark relative overflow-hidden bg-nordic p-6 text-cream md:p-9">
              <AgniMark className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 opacity-90 md:h-48 md:w-48" />
              <h3 className="relative max-w-[16ch] text-[clamp(1.35rem,2vw,1.7rem)] text-cream">{balance.agni.heading}</h3>
              <p className="relative mt-3 text-[1.02rem] leading-relaxed text-cream/80">{balance.agni.body}</p>
            </article>

            {/* The mind */}
            <article className="bg-keppel/12 p-6 md:p-9">
              <h3 className="text-[clamp(1.35rem,2vw,1.7rem)]">{balance.mind.heading}</h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{balance.mind.body}</p>
            </article>
          </div>

          {/* Aharam, Viharam, Aushadhi */}
          <div className="mt-px grid gap-8 rounded-[1.75rem] p-6 ring-1 ring-nordic/12 md:p-9 lg:mt-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h3 className="text-[clamp(1.35rem,2vw,1.7rem)]">{balance.care.heading}</h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">{balance.care.intro}</p>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid gap-3 sm:grid-cols-3">
                {balance.care.items.map((it, i) => (
                  <li
                    key={it.name}
                    className={`relative rounded-[1.25rem] p-5 ${i === 0 ? "bg-nordic text-cream" : i === 1 ? "bg-keppel/20" : "bg-blush/20"}`}
                  >
                    <p className={`font-heading text-[1.45rem] leading-none ${i === 0 ? "text-cream" : "text-nordic"}`}>{it.name}</p>
                    <p className={`mt-3 text-[0.95rem] leading-snug ${i === 0 ? "text-cream/80" : "text-ink/75"}`}>{it.text}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/80">{balance.care.body}</p>
              <TextLink href={balance.link.href} className="mt-6 inline-block">
                {balance.link.label}
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Everyday life: the five moments of a day as one rhythm, each with its own small question. */}
      <section id="everyday-life" className="scroll-mt-28 bg-keppel/12" aria-labelledby="everyday-life-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-20">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-6">
              <ChapterHead id="everyday-life" n={everyday.n} label={everyday.label} heading={everyday.heading} />
            </div>
            <p className="text-[1.06rem] leading-relaxed text-ink/80 lg:col-span-6 lg:pb-2">{everyday.intro}</p>
          </div>

          <ol className="relative mt-12 grid gap-4 md:grid-cols-5 md:gap-0">
            {/* The day's line, running through every moment. */}
            <span aria-hidden className="absolute bottom-6 left-[1.1rem] top-6 w-px bg-nordic/20 md:inset-x-0 md:bottom-auto md:left-0 md:top-[1.1rem] md:h-px md:w-auto" />
            {everyday.routine.map((r) => {
              const [lead, ...rest] = r.notice.split(": ");
              return (
                <li key={r.title} className="relative grid grid-cols-[2.2rem_minmax(0,1fr)] gap-4 md:flex md:flex-col md:gap-0 md:pr-5">
                  <span aria-hidden className="relative z-10 mt-1 grid h-[2.2rem] w-[2.2rem] place-items-center rounded-pill bg-cream ring-1 ring-nordic/25 md:mt-0">
                    <span className="h-2.5 w-2.5 rounded-pill bg-keppel" />
                  </span>
                  <div className="flex flex-col md:mt-5 md:flex-1">
                    <h3 className="text-[1.35rem] leading-tight">{r.title}</h3>
                    <p className="mt-2 text-[0.98rem] leading-relaxed text-ink/80 md:mb-4">{r.body}</p>
                    <p className="mt-4 rounded-[1rem] bg-cream p-4 md:mt-auto md:min-h-[6.75rem] text-[0.95rem] leading-snug text-nordic ring-1 ring-nordic/10">
                      <span className="block text-[0.82rem] font-bold text-terracotta">{lead}:</span>
                      <span className="mt-1 block font-heading text-[1.05rem]">{rest.join(": ")}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 grid gap-6 rounded-[1.75rem] bg-nordic p-6 text-cream md:grid-cols-12 md:gap-10 md:p-10">
            <h3 className="text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight text-cream md:col-span-4">{everyday.firstSign.heading}</h3>
            <div className="grid gap-5 md:col-span-8 md:grid-cols-2">
              {everyday.firstSign.body.map((p, i) => (
                <p key={p} className={`border-t-2 pt-4 text-[1.02rem] leading-relaxed text-cream/85 ${i === 0 ? "border-keppel" : "border-blush"}`}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Your habits: the reflection. */}
      <section id="your-habits" className="on-dark scroll-mt-28 bg-nordic text-cream" aria-labelledby="your-habits-heading">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-40">
              <ChapterHead id="your-habits" n={habits.n} label={habits.label} heading={habits.heading} dark />
              <p className="mt-5 text-[1.06rem] leading-relaxed text-cream/80">{habits.intro}</p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <HabitReflection questions={habits.questions} answers={habits.answers} end={habits.end} disclaimer={habits.disclaimer} />
          </div>
        </div>
      </section>

      {/* 05 — At Swetaranya: where the ideas become care. */}
      <section id="at-swetaranya" className="scroll-mt-28" aria-labelledby="at-swetaranya-heading">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ChapterHead id="at-swetaranya" n={atSwetaranya.n} label={atSwetaranya.label} heading={atSwetaranya.heading} />
            <p className="mt-5 text-[1.06rem] leading-relaxed text-ink/80">{atSwetaranya.intro}</p>
            <Placeholder label="Care at Swetaranya: a physician with a patient on the campus" shape="leaf" className="mt-8 hidden aspect-[16/9] w-full lg:block" />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-nordic/12 border-y border-nordic/12">
              {atSwetaranya.points.map((p) => (
                <li key={p.lead} className="group grid gap-2 py-5 transition-colors sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8">
                  <p className="flex items-start gap-3 font-heading text-[1.25rem] leading-snug text-nordic">
                    <span aria-hidden className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-pill bg-keppel transition-transform duration-300 group-hover:scale-150" />
                    {p.lead}
                  </p>
                  <p className="text-[1.02rem] leading-relaxed text-ink/80 sm:pt-0.5">{p.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <OutlineLink href={atSwetaranya.links[0].href}>{atSwetaranya.links[0].label}</OutlineLink>
              <OutlineLink href={atSwetaranya.links[1].href}>{atSwetaranya.links[1].label}</OutlineLink>
            </div>
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="px-3 pb-16 sm:px-5 md:pb-20" aria-labelledby="learn-closing-heading">
        <div className="on-dark mx-auto grid max-w-[86rem] gap-6 rounded-[2rem] bg-nordic px-6 py-12 text-cream sm:px-10 md:grid-cols-12 md:items-end md:gap-10 md:py-16">
          <h2 id="learn-closing-heading" className="text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.025em] text-cream md:col-span-7">
            {closing.heading}
          </h2>
          <div className="md:col-span-5">
            <p className="text-[1.08rem] leading-relaxed text-cream/80">{closing.body}</p>
            <PrimaryLink href={closing.cta.href} className="mt-6">
              {closing.cta.label}
            </PrimaryLink>
          </div>
        </div>
      </section>
    </>
  );
}

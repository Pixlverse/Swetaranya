import type { Metadata } from "next";
import Link from "next/link";
import { LIFE } from "@/content/life";
import { Placeholder } from "@/components/brand/Placeholder";
import { PrimaryLink } from "@/components/site/Buttons";
import { Pending } from "@/components/site/Pending";
import { ReadMore } from "@/components/site/ReadMore";
import { LifeIcon } from "@/components/life/LifeIcons";
import { DayArc } from "@/components/life/DayArc";

export const metadata: Metadata = {
  title: "Life at Swetaranya",
  description: LIFE.hero.sub,
};

const c = LIFE;

/** The small, normal-case name of a section, with a short keppel rule. */
function SectionLabel({ children }: { children: string; tone?: "light" | "dark" }) {
  return (
    <p className="flex items-center gap-3 text-[0.95rem] font-bold text-keppel">
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

/** A lead-in phrase set as a small heading over its paragraph. */
function Note({ title, children, tone = "light" }: { title: string; children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <div>
      <h4 className={`font-heading text-[1.15rem] leading-snug ${tone === "light" ? "text-nordic" : "text-cream"}`}>{title}</h4>
      <p className={`mt-2 leading-relaxed ${tone === "light" ? "text-ink/75" : "text-cream/75"}`}>{children}</p>
    </div>
  );
}

/** Two buttons the document names but that have no destination yet. */
function PendingAction({ children }: { children: string }) {
  return (
    <span
      title="To be confirmed by Swetaranya"
      className="inline-flex items-center rounded-pill border border-dashed border-terracotta/60 bg-blush/15 px-5 py-2.5 text-[0.92rem] font-bold text-clay"
    >
      {children}
    </span>
  );
}

export default function LifeAtSwetaranyaPage() {
  return (
    <>
      {/* Hero: the name, the three words, and the home in an arch. */}
      <section className="mx-auto grid max-w-[88rem] items-center gap-10 px-5 pb-14 pt-6 sm:px-8 md:grid-cols-12 md:pb-16 md:pt-8">
        <div className="md:col-span-7">
          <h1 className="text-[clamp(2.6rem,6.2vw,5.6rem)] leading-[0.95] tracking-[-0.03em]">{c.hero.title}</h1>
          <p className="mt-4 font-heading text-[clamp(1.4rem,2.4vw,2.1rem)] tracking-[-0.01em] text-keppel">{c.hero.pillars}</p>
          <div className="mt-10 border-l-2 border-keppel pl-6 md:mt-14">
            <p className="font-heading text-[clamp(1.5rem,2.3vw,2rem)] leading-snug text-nordic">{c.hero.lead}</p>
            <p className="mt-3 max-w-md text-[1.1rem] leading-relaxed text-ink/75">{c.hero.sub}</p>
          </div>
        </div>
        <div className="md:col-span-5">
          <Placeholder label="Veluthat Mana, the family home at Swetaranya" shape="arch" className="mx-auto aspect-[1/1.05] w-full max-w-[30rem]" />
        </div>
      </section>

      {/* The place */}
      <section id="the-place" className="scroll-mt-28 bg-keppel/10" aria-labelledby="place-heading">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-16 sm:px-8 md:grid-cols-12 md:gap-12 md:py-20">
          <div className="relative md:col-span-5">
            <Placeholder label="The fields, the family temple and the pond around the home" shape="leaf" className="aspect-square w-full" />
            {/* Handwritten note, pinned to the photograph. */}
            <p className="absolute -bottom-6 right-2 rotate-[-4deg] rounded-[0.9rem] bg-cream px-5 py-3 font-heading text-[1.3rem] italic text-nordic shadow-[0_18px_30px_-18px] shadow-nordic/40 md:right-6">
              {c.place.note}
              <svg viewBox="0 0 200 12" aria-hidden className="mt-0.5 h-2.5 w-full text-terracotta" preserveAspectRatio="none">
                <path d="M2 8c30-6 60 2 90-2s70-5 106 1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </p>
          </div>
          <div className="md:col-span-7 md:pl-4">
            <SectionLabel>{c.place.label}</SectionLabel>
            <h2 id="place-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
              {c.place.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-ink/80">{c.place.body}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {c.place.icons.map((i) => (
                <li key={i} className="flex items-center gap-3 rounded-[1rem] border border-nordic/12 bg-cream px-4 py-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-keppel/15 text-keppel">
                    <LifeIcon name={i} />
                  </span>
                  <span className="font-heading text-[1.02rem] leading-snug text-nordic">{i}</span>
                </li>
              ))}
            </ul>
            <ReadMore label={c.place.more} className="mt-8">
              <div className="max-w-2xl space-y-4 text-[1.05rem] leading-relaxed text-ink/80">
                {c.place.expanded.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p>
                  <strong className="font-heading font-semibold text-nordic">{c.place.expanded.lead}</strong> {c.place.expanded.leadBody}
                </p>
              </div>
            </ReadMore>
          </div>
        </div>
      </section>

      {/* The people */}
      <section id="the-people" className="on-dark scroll-mt-28 bg-nordic text-cream" aria-labelledby="people-heading">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-16 sm:px-8 md:grid-cols-12 md:gap-12 md:py-20">
          <div className="md:col-span-7">
            <SectionLabel tone="dark">{c.people.label}</SectionLabel>
            <h2 id="people-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-cream">
              {c.people.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-cream/80">{c.people.body}</p>
          </div>
          <figure className="relative self-end md:col-span-5">
            <svg viewBox="0 0 40 30" aria-hidden className="h-8 w-10 text-keppel">
              <path d="M2 28V17C2 8 7 3 15 2v6c-4 1-6 4-6 8h6v12H2Zm22 0V17c0-9 5-14 13-15v6c-4 1-6 4-6 8h6v12H24Z" fill="currentColor" />
            </svg>
            <blockquote className="mt-4 font-heading text-[clamp(1.5rem,2.4vw,2.1rem)] leading-snug text-cream">{c.people.quote}</blockquote>
          </figure>
          <div className="md:col-span-12">
            <ReadMore label={c.people.more} tone="dark">
              <div className="grid gap-8 border-t border-cream/15 pt-8 md:grid-cols-2 md:gap-14">
                {c.people.expanded.map((e) => (
                  <div key={e.title}>
                    <h3 className="font-heading text-[1.3rem] text-cream">{e.title}</h3>
                    <div className="mt-3 space-y-3 leading-relaxed text-cream/75">
                      {e.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={c.people.link.href}
                className="mt-8 inline-block font-bold text-cream underline decoration-keppel decoration-2 underline-offset-[6px] hover:decoration-[3px]"
              >
                {c.people.link.label}
              </Link>
            </ReadMore>
          </div>
        </div>
      </section>

      {/* Your treatment */}
      <section id="your-treatment" className="scroll-mt-28" aria-labelledby="treatment-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-20">
          <div className="grid gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              <SectionLabel>{c.treatment.label}</SectionLabel>
              <h2 id="treatment-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
                {c.treatment.heading}
              </h2>
            </div>
            <p className="max-w-2xl self-end text-[1.1rem] leading-relaxed text-ink/80 md:col-span-6">{c.treatment.body}</p>
          </div>
          {/* What the physician looks at: five sides of one person, joined on a single line. */}
          <ul className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-5 md:gap-0">
            <span aria-hidden className="absolute inset-x-[10%] top-7 hidden h-px bg-keppel/40 md:block" />
            {c.treatment.icons.map((i) => (
              <li key={i} className="relative flex flex-col items-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-pill border border-keppel/40 bg-cream text-keppel">
                  <LifeIcon name={i} className="h-7 w-7" />
                </span>
                <span className="mt-3 max-w-[11rem] font-heading text-[1rem] leading-snug text-nordic">{i}</span>
              </li>
            ))}
          </ul>
          <ReadMore label={c.treatment.more} className="mt-10">
            <div className="grid gap-10 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <h3 className="font-heading text-[1.5rem] text-nordic">{c.treatment.stepsTitle}</h3>
                <ol className="mt-5 pl-3">
                  {c.treatment.steps.map((s, i) => (
                    <li key={s.lead} className="relative border-l border-keppel/40 pb-5 pl-7 last:border-transparent last:pb-0">
                      <span className="absolute -left-[0.8rem] top-0 grid h-6 w-6 place-items-center rounded-pill bg-keppel font-heading text-[0.8rem] text-nordic">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed text-ink/80">
                        <strong className="font-heading font-semibold text-nordic">{s.lead}</strong> {s.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
              {/* Notes flow in two balanced columns, so the long one does not leave holes. */}
              <div className="gap-10 md:col-span-7 md:columns-2">
                {c.treatment.notes.map((n) => (
                  <div key={n.title} className="mb-8 break-inside-avoid">
                    <Note title={n.title}>{n.text}</Note>
                  </div>
                ))}
              </div>
            </div>
          </ReadMore>
        </div>
      </section>

      {/* The everyday: the day as the sun's path. */}
      <section id="a-day" className="on-dark scroll-mt-28 bg-nordic text-cream" aria-labelledby="day-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-20">
          <div className="grid gap-6 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              <SectionLabel tone="dark">{c.everyday.label}</SectionLabel>
              <h2 id="day-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-cream">
                {c.everyday.heading}
              </h2>
            </div>
            <p className="max-w-2xl self-end text-[1.1rem] leading-relaxed text-cream/80 md:col-span-6">{c.everyday.body}</p>
          </div>
          <div className="mt-10 md:mt-12">
            <DayArc stops={c.everyday.times} />
          </div>
          <ReadMore label={c.everyday.more} tone="dark" className="mt-10">
            <p className="font-heading text-[1.3rem] text-cream">{c.everyday.expandedIntro}</p>
            <ul className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
              {c.everyday.times.map((t) => (
                <li key={t.when} className="border-t border-cream/15 pt-4 leading-relaxed text-cream/75">
                  <strong className="font-heading font-semibold text-cream">{t.when}.</strong> {t.more}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-[1.25rem] bg-cream/[0.06] p-6 ring-1 ring-cream/10 md:p-8">
              <Note title={c.everyday.part.title} tone="dark">
                {c.everyday.part.text}
              </Note>
            </div>
          </ReadMore>
          <p className="mt-8 text-[0.95rem] text-cream/60">{c.everyday.footnote}</p>
        </div>
      </section>

      {/* From our land */}
      <section id="from-our-land" className="scroll-mt-28" aria-labelledby="land-heading">
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-12 md:gap-12 md:py-20">
          <div className="md:col-span-7">
            <SectionLabel>{c.land.label}</SectionLabel>
            <h2 id="land-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
              {c.land.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-ink/80">{c.land.body}</p>
            <ReadMore label={c.land.more} className="mt-8">
              <div className="max-w-2xl space-y-4 border-l-2 border-keppel/50 pl-6 text-[1.05rem] leading-relaxed text-ink/80">
                {c.land.expanded.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </ReadMore>
          </div>
          <div className="grid grid-cols-5 gap-3 md:col-span-5">
            <Placeholder label="Herbs growing in the medicinal garden" shape="drop" className="col-span-3 aspect-[3/4] w-full" />
            <Placeholder label="Medicines being prepared on the campus" className="col-span-2 mt-12 aspect-[2/3] w-full rounded-[1.25rem]" />
          </div>
        </div>
      </section>

      {/* Your stay */}
      <section id="rooms" className="scroll-mt-28 bg-keppel/10" aria-labelledby="stay-heading">
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-12 md:gap-12 md:py-20">
          {/* A small collage: the room large, the courtyard and veranda stacked beside it. */}
          <div className="grid aspect-[5/4] grid-cols-5 grid-rows-2 gap-3 md:col-span-6">
            <Placeholder label="A room at Swetaranya" className="col-span-3 row-span-2 h-full w-full rounded-[1.5rem]" />
            <Placeholder label="The open courtyard" shape="arch" className="col-span-2 h-full w-full" />
            <Placeholder label="A cool veranda" className="col-span-2 h-full w-full rounded-[1.25rem]" />
          </div>
          <div className="md:col-span-6 md:pl-4">
            <SectionLabel>{c.stay.label}</SectionLabel>
            <h2 id="stay-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
              {c.stay.heading}
            </h2>
            <p className="mt-6 text-[1.1rem] leading-relaxed text-ink/80">{c.stay.body}</p>
            <ReadMore label={c.stay.more} className="mt-8">
              <div className="space-y-4 text-[1.05rem] leading-relaxed text-ink/80">
                <p>{c.stay.expandedBefore}</p>
                <p>
                  {c.stay.facilitiesLead} <Pending>{c.stay.facilitiesPending}</Pending>
                </p>
                <p>{c.stay.expandedAfter}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {c.stay.pendingActions.map((a) => (
                  <PendingAction key={a}>{a}</PendingAction>
                ))}
              </div>
            </ReadMore>
          </div>
        </div>
      </section>

      {/* Yoga */}
      <section id="yoga" className="on-dark scroll-mt-28 bg-nordic text-cream" aria-labelledby="yoga-heading">
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-12 md:gap-12 md:py-20">
          <div className="md:col-span-4">
            <Placeholder label="A yoga session in the home" shape="leaf" tone="dark" className="aspect-square w-full max-w-sm" />
          </div>
          <div className="md:col-span-8">
            <SectionLabel tone="dark">{c.yoga.label}</SectionLabel>
            <h2 id="yoga-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-cream">
              {c.yoga.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-cream/80">{c.yoga.body}</p>
            <ReadMore label={c.yoga.more} tone="dark" className="mt-8">
              <div className="max-w-2xl space-y-4 text-[1.05rem] leading-relaxed text-cream/75">
                <p>
                  {c.yoga.expanded.first} <Pending tone="dark">{c.yoga.expanded.pending}</Pending>
                </p>
                <p>{c.yoga.expanded.second}</p>
              </div>
            </ReadMore>
          </div>
        </div>
      </section>

      {/* Before you arrive + travel, side by side: the practical end of the page. */}
      <section className="mx-auto grid max-w-[88rem] gap-14 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div id="before-you-arrive" className="scroll-mt-28" aria-labelledby="arrive-heading">
          <SectionLabel>{c.arrive.label}</SectionLabel>
          <h2 id="arrive-heading" className="mt-3 text-[clamp(1.9rem,3vw,2.7rem)] leading-[1.05] tracking-[-0.02em]">
            {c.arrive.heading}
          </h2>
          <ol className="mt-8 grid gap-3">
            {c.arrive.steps.map((s, i) => (
              <li key={s.short} className="flex items-center gap-4 rounded-[1.1rem] border border-nordic/12 bg-keppel/[0.06] px-5 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-nordic font-heading text-[1.05rem] text-cream">{i + 1}</span>
                <span className="font-heading text-[1.15rem] text-nordic">{s.short}</span>
              </li>
            ))}
          </ol>
          <ReadMore label={c.arrive.more} className="mt-8">
            <ol className="space-y-5">
              {c.arrive.steps.map((s, i) => (
                <li key={s.lead} className="leading-relaxed text-ink/80">
                  <strong className="font-heading font-semibold text-nordic">
                    {i + 1}. {s.lead}
                  </strong>{" "}
                  {s.text}
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-[1rem] border-l-2 border-terracotta bg-blush/10 px-5 py-4 text-[0.98rem] text-ink/80">{c.arrive.caution}</p>
          </ReadMore>
        </div>

        <div id="travel" className="scroll-mt-28 rounded-[2rem] bg-keppel/10 p-6 sm:p-8 md:p-10" aria-labelledby="travel-heading">
          <SectionLabel>{c.travel.label}</SectionLabel>
          <h2 id="travel-heading" className="mt-3 text-[clamp(1.9rem,3vw,2.7rem)] leading-[1.05] tracking-[-0.02em]">
            {c.travel.heading}
          </h2>
          <dl className="mt-8 divide-y divide-nordic/12 border-y border-nordic/12">
            {c.travel.routes.map((r) => (
              <div key={r.by} className="grid gap-1 py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4">
                <dt className="font-heading text-[1.05rem] text-nordic">{r.by}</dt>
                <dd className="leading-relaxed text-ink/80">
                  {r.parts.map((p, k) => (
                    <span key={k}>
                      {p.text}
                      {"pending" in p && p.pending ? <Pending>{p.pending}</Pending> : null}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <ReadMore label={c.travel.more} className="mt-8">
            <p className="leading-relaxed text-ink/80">{c.travel.where}</p>
            <h3 className="mt-6 font-heading text-[1.2rem] text-nordic">{c.travel.bringTitle}</h3>
            <ul className="mt-3 space-y-2">
              {c.travel.bring.map((b) => (
                <li key={b} className="flex gap-3 leading-relaxed text-ink/80">
                  <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-pill bg-keppel" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.98rem] text-ink/70">{c.travel.bringNote}</p>
          </ReadMore>
        </div>
      </section>

      {/* Your next step */}
      <section className="mx-auto max-w-[88rem] px-5 pb-16 sm:px-8 md:pb-20" aria-labelledby="next-heading">
        <div className="on-dark grid items-end gap-8 rounded-[2rem] bg-nordic px-6 py-12 text-cream sm:px-10 md:grid-cols-12 md:rounded-[2.5rem] md:px-14 md:py-16">
          <div className="md:col-span-7">
            <SectionLabel tone="dark">{c.next.label}</SectionLabel>
            <h2 id="next-heading" className="mt-3 text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.025em] text-cream">
              {c.next.heading}
              <span className="block text-cream/70">{c.next.heading2}</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-[1.1rem] leading-relaxed text-cream/80">{c.next.body}</p>
            <PrimaryLink href={c.next.cta.href} className="mt-6">
              {c.next.cta.label}
            </PrimaryLink>
          </div>
        </div>
      </section>
    </>
  );
}


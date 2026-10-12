import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { ThreadOfCare } from "@/components/home/ThreadOfCare";
import { HomeHospitalColumns } from "@/components/home/HomeHospitalColumns";
import { DayInMoments } from "@/components/home/DayInMoments";
import { PillarRhythm } from "@/components/home/PillarRhythm";
import { CareGrid } from "@/components/home/CareGrid";
import { DayClock } from "@/components/home/DayClock";
import { LifestyleWheel } from "@/components/home/LifestyleWheel";
import { Placeholder } from "@/components/brand/Placeholder";
import { SymbolDivider } from "@/components/brand/SymbolDivider";
import { OutlineLink, PrimaryLink, TextLink } from "@/components/site/Buttons";
import { TestimonialQuotes } from "@/components/site/TestimonialQuotes";
import { getPageContent, getTestimonials } from "@/lib/queries";
import { LIFESTYLE_CHECK_DISCLAIMER, PHYSICIAN_NAME } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";
import { OrnamentPattern } from "@/components/brand/OrnamentPattern";
import { RipplePattern } from "@/components/brand/RipplePattern";
import { LotusMandala } from "@/components/brand/LotusMandala";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Swetaranya — An Ayurvedic home hospital in Tirur, Kerala" },
  description:
    "The care of an Ayurvedic hospital in the warmth of a 170-year-old family home. Only a few guests stay at a time, so your physician knows you, sees you every day and shapes your treatment around you.",
};

const paragraphs = (text: string) => text.split(/\n\n+/);

export default async function HomePage() {
  const [c, testimonials] = await Promise.all([getPageContent("home"), getTestimonials(3).catch(() => [])]);

  return (
    <>
      <HomeHero {...c.hero} />

      {/* The promise in one breath: hospital care, family home. */}
      <section className="relative isolate overflow-hidden bg-cream" aria-labelledby="intro-heading">
        {/* Ripples on still water: a faint field of circles behind the words. */}
        <RipplePattern className="-z-10" scale={1.1} />
        <div className="mx-auto grid max-w-[88rem] gap-8 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-10">
          <h2 id="intro-heading" className="text-[clamp(1.9rem,3.3vw,2.8rem)] leading-[1.1] lg:col-span-6">
            {c.intro.heading}
          </h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-[1.05rem] leading-relaxed text-ink/80">{c.intro.body}</p>
            <p className="mt-6 border-l-2 border-keppel pl-5 font-heading text-[clamp(1.2rem,1.7vw,1.4rem)] leading-snug text-nordic">{c.intro.aside}</p>
          </div>
        </div>
      </section>

      {/* The thread of care — one copper line that becomes each fact as it draws down the page. */}
      <section aria-label={c.thread.heading}>
        <ThreadOfCare heading={c.thread.heading} stops={c.thread.stops.map((s) => ({ label: s.label, text: c.facts.items[s.fact] ?? "" }))} />
      </section>

      {/* What is a home hospital — answered first, then what it is and is not. */}
      <section className="mx-auto max-w-[88rem] px-5 pb-20 sm:px-8 md:pb-24" aria-labelledby="hh-heading">
        {/* The question across the full width, then the answer beneath it, led in by a thread that ends in the brandmark's drop. */}
        <div className="border-t border-nordic/15 pt-14 md:pt-20">
          <p className="text-[0.95rem] font-bold text-keppel">{c.homeHospital.label}</p>
          <h2 id="hh-heading" className="mt-3 text-balance text-[clamp(2rem,4.4vw,4rem)] leading-[1.05] tracking-[-0.025em]">
            {c.homeHospital.heading}
          </h2>
          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-12 md:gap-8">
            <div aria-hidden className="hidden items-center gap-1.5 self-start md:col-span-3 md:mt-[0.95rem] md:flex">
              <span className="h-[1.5px] flex-1 rounded-pill bg-keppel" />
              <svg viewBox="0 0 12 10" className="h-2.5 w-3 shrink-0 fill-keppel">
                <path d="M0 5c3.4-2.6 6-4.2 8.3-4.2a4.2 4.2 0 0 1 0 8.4C6 9.2 3.4 7.6 0 5Z" />
              </svg>
            </div>
            <p className="text-pretty font-heading text-[clamp(1.2rem,1.9vw,1.65rem)] leading-[1.5] text-nordic/90 md:col-span-9">{c.homeHospital.answer}</p>
          </div>
        </div>
        <div className="mt-12 md:mt-16">
          <HomeHospitalColumns
            statements={[c.homeHospital.statements[0], c.homeHospital.statements[1]]}
            notResort={c.homeHospital.statements[2]}
          />
        </div>
      </section>

      {/* Ayurveda as part of the day — one long, unhurried run of sentences. */}
      {/* overflow-x-clip, not hidden, so the pinned row can stick while it scrolls. */}
      <section className="overflow-x-clip bg-keppel/12" aria-labelledby="pod-heading">
        {/* The day, one photograph at a time. */}
        <DayInMoments label={c.partOfDay.label} heading={c.partOfDay.heading} moments={c.partOfDay.moments} />

        {/* Then the words, given room. */}
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 pb-20 pt-10 sm:px-8 md:grid-cols-12 md:pb-24 md:pt-12">
          <p className="self-start border-l-2 border-keppel pl-6 font-heading text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.25] text-nordic md:col-span-6">
            {c.partOfDay.care}
          </p>
          <div className="md:col-span-5 md:col-start-8 md:pt-2">
            <p className="text-[1.1rem] leading-relaxed text-ink/80">{c.partOfDay.body}</p>
            <p className="mt-6 font-heading text-[clamp(1.5rem,2vw,1.8rem)] text-keppel">{c.partOfDay.closer}</p>
          </div>
        </div>
      </section>

      {/* Live · Heal · Learn — three times of one day, a sun path running behind them. */}
      <section className="on-dark relative overflow-hidden bg-nordic text-cream" aria-labelledby="pillars-heading">
        <div className="relative mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-20">
          <h2 id="pillars-heading" className="sr-only">
            {c.pillars.heading}
          </h2>
          <PillarRhythm
            pillars={[
              { word: "Live", text: c.pillars.live },
              { word: "Heal", text: c.pillars.heal },
              { word: "Learn", text: c.pillars.learn },
            ]}
          />
          <div className="mt-14 flex flex-col items-center gap-7 border-t border-cream/15 pt-10 text-center md:mt-16">
            <p className="max-w-4xl text-balance font-heading text-[clamp(1.5rem,2.6vw,2.2rem)] leading-snug text-cream">
              {/* The two sentences as consecutive lines, without the blank line between them. */}
              {paragraphs(c.pillars.closer).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <OutlineLink href="/the-swetaranya-way" tone="light">
              Discover Swetaranya
            </OutlineLink>
          </div>
        </div>
      </section>

      {/* Why a home hospital — the question asked plainly, answered in three steps, then the difference set apart. */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24" aria-labelledby="why-heading">
        <p className="text-[0.95rem] font-bold text-keppel">{c.whyHome.label}</p>
        <div className="mt-3 flex flex-wrap items-end gap-x-10 gap-y-3">
          <h2 id="why-heading" className="max-w-[20ch] text-[clamp(2.1rem,4.2vw,3.7rem)] leading-[1.05] tracking-[-0.025em]">
            {c.whyHome.heading}
          </h2>
          {/* The reply, said kindly beside the question. */}
          <p className="flex items-center gap-3 pb-[0.35em] font-heading text-[clamp(1.3rem,1.9vw,1.65rem)] text-keppel">
            <span aria-hidden className="h-px w-10 bg-keppel" />
            {c.whyHome.intro}
          </p>
        </div>

        {/* The answer, read across in three steps. */}
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-0">
          {paragraphs(c.whyHome.body).map((p, i) => (
            <p
              key={i}
              className={`border-t-2 border-keppel/70 pt-5 text-[1.06rem] leading-relaxed text-ink/80 md:pt-6 ${i ? "md:ml-0 md:border-l md:border-l-nordic/10 md:pl-8" : ""} ${i < 2 ? "md:pr-8" : ""}`}
            >
              {p}
            </p>
          ))}
        </div>

        {/* The difference, set apart: what it isn't, then what it is. */}
        <div className="relative mt-12 overflow-hidden rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-[1.25rem] rounded-bl-[1.25rem] bg-nordic px-6 py-10 text-cream sm:px-10 md:mt-16 md:px-14 md:py-14">
          <LotusMandala className="pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] text-cream opacity-[0.09] md:-bottom-48 md:-right-16 md:h-[36rem] md:w-[36rem]" />
          <p className="relative max-w-5xl text-balance font-heading text-[clamp(1.45rem,2.6vw,2.3rem)] leading-[1.3]">
            {c.whyHome.difference.split(/(?<=\.)\s+/).map((sentence, i) => (
              <span key={i} className={i === 0 ? "text-cream/55" : "text-cream"}>
                {sentence}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* Fewer guests, more time: what changes, cell by cell. */}
        <div className="mt-16 md:mt-20">
          <CareGrid heading={c.whyHome.tableHeading} rows={c.whyHome.rows} largeLabel="In a large Ayurvedic hospital" />
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <p className="text-[1.1rem] leading-relaxed text-ink/85 md:col-span-5">{c.whyHome.footnote}</p>
          <figure className="md:col-span-6 md:col-start-7">
            <blockquote className="font-heading text-[clamp(1.65rem,2.46vw,2.05rem)] leading-tight text-nordic">&ldquo;{c.whyHome.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-[0.95rem] text-ink/70">— {c.whyHome.quoteBy}</figcaption>
            <TextLink href="/the-swetaranya-way" className="mt-8 inline-block">
              Discover the Swetaranya Way
            </TextLink>
          </figure>
        </div>
      </section>

      {/* Meet the physician — a host who lives in the house, not a visiting doctor. */}
      <section className="bg-keppel/12" aria-labelledby="physician-heading">
        <div className="mx-auto grid max-w-[88rem] items-start gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-24">
          <div className="md:sticky md:top-32 md:col-span-4">
            <Placeholder label={`${PHYSICIAN_NAME} on the verandah of Veluthat Mana`} shape="drop" className="mx-auto aspect-[4/5] w-3/4 max-w-sm md:w-full" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-[0.95rem] font-bold text-keppel">{c.physician.label}</p>
            <h2 id="physician-heading" className="mt-3 text-[clamp(1.9rem,3.18vw,2.6rem)]">
              {c.physician.heading}
            </h2>
            <p className="mt-5 font-heading text-[1.45rem] text-keppel">{c.physician.lead}</p>
            <div className="mt-8 max-w-xl space-y-5 text-[1.05rem] leading-relaxed text-ink/80">
              {paragraphs(c.physician.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-12 border-t border-terracotta/50 pt-8 font-heading text-[clamp(1.75rem,2.67vw,2.2rem)] leading-tight text-nordic">{c.physician.motto}</p>
            <OutlineLink href="/about" className="mt-8">
              Meet the Physician
            </OutlineLink>
          </div>
        </div>
      </section>

      {/* A day here — a genuine sequence, told on a clock face from seven to seven. */}
      <section className="overflow-x-clip py-20 md:py-24" aria-labelledby="day-heading">
        <div className="mx-auto grid max-w-[88rem] gap-5 px-5 sm:px-8 md:grid-cols-12 md:items-end md:gap-12">
          <h2 id="day-heading" className="text-[clamp(1.85rem,3.4vw,3rem)] leading-[1.06] md:col-span-7">
            {c.day.heading}
          </h2>
          <p className="max-w-md text-[1.05rem] text-ink/80 md:col-span-5 md:pb-2">{c.day.body}</p>
        </div>
        <DayClock items={c.day.items} />
        <div className="mx-auto mt-10 flex max-w-[88rem] flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md font-heading text-[1.4rem] leading-snug text-nordic">{c.day.closer}</p>
          <TextLink href="/a-day-at-swetaranya">Experience a Day at Swetaranya</TextLink>
        </div>
      </section>

      {/* Lifestyle Check teaser: the eight areas as one flower, named at each petal's tip. */}
      <section className="on-dark overflow-hidden bg-nordic text-cream" aria-labelledby="lc-heading">
        <div className="mx-auto grid max-w-[88rem] gap-8 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-x-6 lg:gap-y-0">
          <div className="lg:self-end">
            <p className="text-[0.95rem] font-bold text-keppel">{c.lifestyle.label}</p>
            <h2 id="lc-heading" className="mt-3 max-w-[16ch] text-[clamp(2.1rem,3.9vw,3.5rem)] leading-[1.04] tracking-[-0.025em] text-cream">
              {c.lifestyle.heading}
            </h2>
            <p className="mt-6 max-w-md text-[1.1rem] leading-relaxed text-cream/80">{c.lifestyle.body}</p>
          </div>
          {/* Straight after "…shape how you feel:" on phones; beside the words on wide screens. */}
          <LifestyleWheel
            areas={c.lifestyle.areas}
            className="mx-auto w-full max-w-[24rem] px-10 sm:max-w-[32rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[38rem] lg:self-center lg:px-16"
          />
          <div className="lg:self-start lg:pt-8">
            <OutlineLink href="/lifestyle-check" tone="light">
              Take the Lifestyle Check
            </OutlineLink>
            <p className="mt-8 max-w-md border-l-2 border-blush pl-4 text-[0.88rem] text-cream/65">{LIFESTYLE_CHECK_DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {/* The home — kept small on purpose. */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24" aria-labelledby="home-heading">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[0.95rem] font-bold text-keppel">{c.theHome.label}</p>
            <h2 id="home-heading" className="mt-3 text-[clamp(1.9rem,3.18vw,2.6rem)]">
              {c.theHome.heading}
            </h2>
            <p className="mt-6 font-heading text-[1.5rem] text-keppel">{c.theHome.lead}</p>
            <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-ink/80">{c.theHome.body}</p>
            <p className="mt-6 font-heading text-[clamp(1.8rem,2.83vw,2.2rem)] text-nordic">{c.theHome.didnt}</p>
            <ul className="mt-6 space-y-1 border-l border-keppel pl-6">
              {c.theHome.stayed.map((line) => (
                <li key={line} className="font-heading text-[clamp(1.35rem,2.2vw,1.75rem)] leading-snug text-nordic">
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 max-w-lg space-y-4 text-[1.05rem] leading-relaxed text-ink/80">
              <p>{c.theHome.why}</p>
              <p>{c.theHome.rebuilding}</p>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Placeholder label="Veluthat Mana from the courtyard — the old house, its trees and the quiet around it" shape="arch" className="aspect-[3/4] w-full" />
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-6 border-t border-nordic/15 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl font-heading text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug text-nordic">{c.theHome.closer}</p>
          <TextLink href="/your-stay">Explore the Home</TextLink>
        </div>
      </section>

      {/* Patient experiences */}
      <section className="mx-auto max-w-[88rem] px-5 pb-20 sm:px-8 md:pb-24" aria-labelledby="exp-heading">
        <SymbolDivider className="mb-16" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="exp-heading" className="text-[clamp(1.85rem,3.12vw,2.45rem)]">
            In our guests&apos; words
          </h2>
          <TextLink href="/experience">Read patient stories</TextLink>
        </div>
        <TestimonialQuotes items={testimonials} />
      </section>

      {/* Final invitation */}
      <section className="relative overflow-hidden border-t border-keppel/30 bg-cream" aria-labelledby="final-cta">
        <span aria-hidden className="absolute inset-0 bg-keppel/12" />
        <OrnamentPattern tone="nordic" opacity={0.07} />
        <div className="relative mx-auto max-w-[88rem] px-5 py-24 sm:px-8 md:py-24">
          <h2 id="final-cta" className="max-w-5xl text-[clamp(2.1rem,4.15vw,3.5rem)] leading-[1]">
            {c.finalCta.heading}
          </h2>
          <div className="mt-10 grid gap-10 md:ml-[20%] md:grid-cols-2 md:items-end">
            <div>
              <p className="max-w-md text-[1.07rem] text-ink/80">{c.finalCta.body}</p>
              <p className="mt-4 font-heading text-[1.45rem] text-nordic">{c.finalCta.invite}</p>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
                <OutlineLink href="/talk-to-the-physician">Enquiry form</OutlineLink>
              </div>
              <p className="mt-6 text-[0.95rem] text-ink/75">
                Prefer WhatsApp?{" "}
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                  Message us
                </a>
              </p>
              <p className="mt-1 text-[0.95rem] text-ink/75">
                Enquiring for a family member?{" "}
                <Link href="/talk-to-the-physician" className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                  We&apos;d be glad to help.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

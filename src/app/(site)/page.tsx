import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { Placeholder } from "@/components/brand/Placeholder";
import { AirLines } from "@/components/brand/AirLines";
import { SymbolDivider } from "@/components/brand/SymbolDivider";
import { OutlineLink, PrimaryLink, TextLink } from "@/components/site/Buttons";
import { PetalChart } from "@/components/lifestyle/PetalChart";
import { TestimonialQuotes } from "@/components/site/TestimonialQuotes";
import { JournalRows } from "@/components/journal/JournalRows";
import { getJournalPosts, getPageContent, getTestimonials } from "@/lib/queries";
import { LIFESTYLE_CHECK_DISCLAIMER, PHYSICIAN_NAME } from "@/lib/constants";
import { VIDEO_CHAPTERS } from "@/content/video";
import { OrnamentPattern } from "@/components/brand/OrnamentPattern";

export const dynamic = "force-dynamic";

const DAY_SNIPPET = ["05:30", "09:00", "12:30", "13:30", "18:45"];

export default async function HomePage() {
  const [c, testimonials, posts, aDay] = await Promise.all([getPageContent("home"), getTestimonials(3), getJournalPosts({ limit: 3 }), getPageContent("a-day")]);
  const moments = aDay.moments.items;
  // Prefer the five signature moments; if the timeline was edited and they're gone, spread five across the day.
  const picked = moments.filter((d) => DAY_SNIPPET.includes(d.time));
  const day = picked.length >= 3 ? picked : moments.filter((_, i) => i % Math.max(1, Math.floor(moments.length / 5)) === 0).slice(0, 5);

  return (
    <>
      <HomeHero {...c.hero} />

      {/* Live · Heal · Learn — one sentence, stepping down the page */}
      <section className="on-dark relative overflow-hidden bg-nordic text-cream" aria-labelledby="pillars-heading">
        <AirLines className="absolute -right-[12%] top-0 h-full w-[70%] opacity-[0.07]" tone="cream" />
        <div className="relative mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-28">
          <h2 id="pillars-heading" className="max-w-md font-body text-[1.05rem] font-normal leading-relaxed text-cream/75">
            {c.pillars.heading}
          </h2>
          <div className="mt-10 space-y-12 md:mt-6 md:space-y-4">
            {(
              [
                ["Live", c.pillars.live, "md:ml-0", "/the-swetaranya-way#live"],
                ["Heal", c.pillars.heal, "md:ml-[14%]", "/treatments"],
                ["Learn", c.pillars.learn, "md:ml-[28%]", "/the-swetaranya-way#take-ayurveda-home"],
              ] as const
            ).map(([word, text, indent, href]) => (
              <div key={word} className={`grid items-end gap-4 md:grid-cols-[auto_minmax(0,22rem)] md:gap-10 ${indent}`}>
                <p className="font-heading text-[clamp(4.5rem,14vw,11rem)] leading-[0.85] tracking-[-0.03em] text-cream" aria-hidden>
                  {word}.
                </p>
                <div className="border-l border-keppel pl-5 md:mb-5">
                  <h3 className="sr-only">{word}</h3>
                  <p className="text-cream/85">{text}</p>
                  <Link href={href} className="mt-3 inline-block text-[0.92rem] font-bold text-keppel underline-offset-4 hover:underline">
                    More about how we {word.toLowerCase()}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Day at Swetaranya — a real sequence, so times are shown */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-28" aria-labelledby="day-heading">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="day-heading" className="max-w-2xl text-[clamp(2.2rem,4.6vw,3.6rem)]">
            Days here have a shape, and it isn&apos;t a spa menu.
          </h2>
          <TextLink href="/a-day-at-swetaranya">Walk through a whole day</TextLink>
        </div>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
          <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-nordic/20 md:left-0 md:top-[7px] md:h-px md:w-full" />
          {day.map((d) => (
            <li key={d.time} className="relative pl-8 md:pl-0 md:pt-10">
              <span aria-hidden className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-pill border-2 border-keppel bg-cream md:top-0" />
              <p className="font-heading text-[1.9rem] leading-none text-keppel">{d.time}</p>
              <h3 className="mt-3 font-body text-[1rem] font-bold text-nordic">{d.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-ink/75">{d.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Lifestyle Check teaser */}
      <section className="bg-keppel/20" aria-labelledby="lc-heading">
        <div className="mx-auto grid max-w-[88rem] items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:py-24">
          <PetalChart className="mx-auto w-full max-w-[22rem] text-nordic" />
          <div>
            <h2 id="lc-heading" className="text-[clamp(2.1rem,4.2vw,3.3rem)]">How is your daily life treating you?</h2>
            <p className="mt-5 max-w-lg text-[1.07rem] text-ink/80">
              Eight honest questions about sleep, food, digestion, movement, stress, routine, rest and energy. At the end you see a snapshot
              of where your days feel steady, and where they may need care.
            </p>
            <p className="mt-5 max-w-lg border-l-2 border-terracotta pl-4 text-[0.88rem] text-ink/65">{LIFESTYLE_CHECK_DISCLAIMER}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <OutlineLink href="/lifestyle-check">Take the Lifestyle Check</OutlineLink>
              <TextLink href="/constitution-check">Or discover your constitution</TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the physician */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-32" aria-labelledby="physician-heading">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <Placeholder label={`${PHYSICIAN_NAME} in the consulting room at Swetaranya`} shape="drop" className="mx-auto aspect-[4/5] w-3/4 max-w-sm md:col-span-4 md:w-full" />
          <div className="md:col-span-7 md:col-start-6">
            <h2 id="physician-heading" className="text-[clamp(2.1rem,4.2vw,3.3rem)]">{c.physician.heading}</h2>
            <p className="mt-5 max-w-xl text-[1.07rem] text-ink/80">{c.physician.body}</p>
            <figure className="mt-10 border-t border-terracotta/60 pt-8">
              <blockquote className="font-heading text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug text-nordic">
                &ldquo;{c.physician.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-[0.95rem] text-ink/70">{PHYSICIAN_NAME}, Chief Physician</figcaption>
            </figure>
            <TextLink href="/about" className="mt-8 inline-block">
              The physician, the family and the house
            </TextLink>
          </div>
        </div>
      </section>

      {/* Stay teaser */}
      <section className="relative" aria-labelledby="stay-heading">
        <Placeholder label="the ancestral house seen from the kitchen garden, paddy fields beyond" captionAt="top" className="h-[clamp(22rem,62vh,40rem)] w-full border-x-0" />
        <div className="mx-auto -mt-28 max-w-[88rem] px-5 sm:px-8">
          <div className="relative max-w-xl bg-cream p-8 md:p-12">
            <h2 id="stay-heading" className="text-[clamp(2rem,3.8vw,3rem)]">{c.stay.heading}</h2>
            <p className="mt-4 text-ink/80">{c.stay.body}</p>
            <TextLink href="/your-stay" className="mt-6 inline-block">
              The house, the rooms and what&apos;s included
            </TextLink>
          </div>
        </div>
      </section>

      {/* Video teaser */}
      <section className="on-dark relative isolate mt-24 bg-nordic text-cream md:mt-32" aria-labelledby="video-heading">
        <OrnamentPattern tone="cream" opacity={0.045} className="-z-10" />
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="video-heading" className="text-[clamp(2rem,3.8vw,3rem)] text-cream">{c.video.heading}</h2>
            <p className="mt-4 text-cream/80">{c.video.body}</p>
            <ol className="mt-8 space-y-2 border-t border-cream/15 pt-6 text-[0.95rem]">
              {VIDEO_CHAPTERS.map((ch) => (
                <li key={ch.id} className="flex gap-4 text-cream/80">
                  <span className="w-12 shrink-0 tabular-nums text-keppel">{ch.at}</span>
                  {ch.title}
                </li>
              ))}
            </ol>
          </div>
          <Link href="/experience" className="group relative block lg:col-span-8" aria-label="Watch the film on the Experience Swetaranya page">
            <Placeholder label="short film — mornings, meals and treatments at Swetaranya" tone="dark" className="aspect-video w-full" />
            <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill border border-cream/70 bg-nordic/60 transition-transform duration-500 ease-calm group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-cream" aria-hidden>
                <path d="M7 4.5v15l12-7.5z" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* Patient experiences */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-28" aria-labelledby="exp-heading">
        <h2 id="exp-heading" className="max-w-2xl text-[clamp(2.1rem,4.2vw,3.3rem)]">In our guests&apos; words</h2>
        <TestimonialQuotes items={testimonials} />
      </section>

      {/* Journal */}
      <section className="mx-auto max-w-[88rem] px-5 pb-20 sm:px-8 md:pb-28" aria-labelledby="journal-heading">
        <SymbolDivider className="mb-16" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="journal-heading" className="text-[clamp(2.1rem,4.2vw,3.3rem)]">From the Journal</h2>
          <TextLink href="/journal">All writing</TextLink>
        </div>
        <JournalRows posts={posts} className="mt-10" />
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-keppel/30 bg-cream" aria-labelledby="final-cta">
        <span aria-hidden className="absolute inset-0 bg-keppel/12" />
        <OrnamentPattern tone="nordic" opacity={0.07} />
        <div className="relative mx-auto max-w-[88rem] px-5 py-24 sm:px-8 md:py-32">
          <h2 id="final-cta" className="max-w-4xl text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[1]">
            {c.finalCta.heading}
          </h2>
          <div className="mt-8 flex flex-col gap-8 md:ml-[20%] md:flex-row md:items-center">
            <p className="max-w-md text-[1.07rem] text-ink/80">{c.finalCta.body}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
              <TextLink href="/book-a-consultation">Or book a time directly</TextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

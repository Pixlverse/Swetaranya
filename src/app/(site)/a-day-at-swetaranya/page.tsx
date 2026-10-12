import type { Metadata } from "next";
import { Placeholder } from "@/components/brand/Placeholder";
import { OrnamentPattern } from "@/components/brand/OrnamentPattern";
import { DayTimeline } from "@/components/stay/DayTimeline";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";
import { getPageContent } from "@/lib/queries";
import { paragraphs } from "@/lib/markdown";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "A Day at Swetaranya",
  description: "What a day looks like when you stay at Swetaranya — hour by hour, from the first lamp before sunrise to an early night.",
};

export default async function ADayPage() {
  const c = await getPageContent("a-day");
  const moments = c.moments.items;
  const first = moments[0]?.time ?? "05:30";
  const last = moments[moments.length - 1]?.time ?? "21:00";

  return (
    <>
      <section className="mx-auto grid max-w-[88rem] gap-10 px-5 pb-12 pt-10 sm:px-8 md:pt-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(2.1rem,4.15vw,3.5rem)] leading-[1] tracking-[-0.02em]">{c.intro.heading}</h1>
          <p className="mt-8 max-w-xl text-[1.1rem] text-ink/80">{c.intro.body}</p>
        </div>
        {/* the span of the day, set as type */}
        <p className="self-end font-heading leading-[0.9] tabular-nums lg:col-span-4 lg:col-start-9 lg:text-right" aria-label={`From ${first} to ${last}`}>
          <span className="block text-[clamp(2.8rem,5.46vw,4.55rem)] text-keppel">{first}</span>
          <span className="block pr-2 text-[1.2rem] italic text-terracotta" aria-hidden>
            to
          </span>
          <span className="block text-[clamp(2.8rem,5.46vw,4.55rem)] text-nordic">{last}</span>
        </p>
      </section>

      <section id="hour-by-hour" className="scroll-mt-32 py-12 sm:px-8 md:py-16" aria-labelledby="moments-heading">
        <div className="mx-auto max-w-[88rem]">
          <div className="mb-10 grid gap-4 px-5 sm:px-0 md:grid-cols-12">
            <h2 id="moments-heading" className="text-[clamp(1.8rem,3vw,2.4rem)] md:col-span-6">
              {c.moments.heading}
            </h2>
            <p className="self-end text-ink/75 md:col-span-5 md:col-start-8">{c.moments.body}</p>
          </div>
          <DayTimeline moments={moments} />
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-24" aria-label="The day in photographs">
        <div className="grid grid-cols-6 items-end gap-4 md:gap-8">
          <figure className="col-span-6 sm:col-span-2">
            <Placeholder label="the courtyard lamp lit before sunrise" shape="arch" className="aspect-[3/4] w-full" />
            <figcaption className="mt-3 font-heading text-[1.3rem] text-keppel">Morning</figcaption>
          </figure>
          <figure className="col-span-6 sm:col-span-2 sm:-translate-y-12">
            <Placeholder label="a guest reading under the jackfruit tree after lunch" shape="leaf" className="aspect-[3/4] w-full" />
            <figcaption className="mt-3 font-heading text-[1.3rem] text-keppel">Afternoon</figcaption>
          </figure>
          <figure className="col-span-6 sm:col-span-2">
            <Placeholder label="the verandah at dusk, lamps and an early dinner" shape="drop" className="aspect-[3/4] w-full" />
            <figcaption className="mt-3 font-heading text-[1.3rem] text-keppel">Dusk</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-nordic/10 bg-white/60" aria-labelledby="story-heading">
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <Placeholder label="the guest whose day this is, photographed with consent" shape="drop" className="aspect-[4/5] w-full max-w-xs" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <span aria-hidden className="-mb-10 block font-heading text-[7rem] leading-none text-blush">
              &ldquo;
            </span>
            <h2 id="story-heading" className="text-[clamp(1.75rem,2.79vw,2.25rem)]">
              {c.story.heading}
            </h2>
            <div className="prose-swet mt-6 font-heading text-[1.3rem] italic leading-relaxed text-nordic/85">
              {paragraphs(c.story.body).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 inline-block border border-dashed border-terracotta px-2 py-0.5 text-[0.8rem] font-bold text-terracotta">
              Placeholder — pending a consented guest story
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-[clamp(1.75rem,2.79vw,2.25rem)]">
          {c.notes.heading}
        </h2>
        <ul className="mt-10 grid gap-10 md:grid-cols-3">
          {c.notes.items.map((n) => (
            <li key={n.title} className="flex gap-4">
              <svg viewBox="0 0 16 16" className="mt-1.5 h-4 w-4 shrink-0 text-keppel" aria-hidden>
                <path d="M8 1 C8 1 3 7 3 10 a5 5 0 0 0 10 0 C13 7 8 1 8 1 Z" fill="currentColor" />
              </svg>
              <div>
                <h3 className="font-body text-[1.05rem] font-bold text-nordic">{n.title}</h3>
                <p className="mt-1.5 text-ink/75">{n.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="relative isolate mt-20 overflow-hidden rounded-soft bg-keppel/10 px-6 py-12 md:px-12">
          <OrnamentPattern opacity={0.065} className="-z-10" />
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <p className="font-heading text-[clamp(1.6rem,2.5vw,2rem)] leading-tight text-nordic md:col-span-7">
              Would a few weeks of days like these help you? The physician can tell you honestly.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-5 md:justify-end">
              <TextLink href="/your-stay">Rooms and what&apos;s included</TextLink>
              <PrimaryLink href="/book-a-consultation">Book a consultation</PrimaryLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

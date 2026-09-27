import type { Metadata } from "next";
import { Placeholder } from "@/components/brand/Placeholder";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";
import { getPageContent } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your Stay",
  description: "The ancestral home and its rooms, a day at Swetaranya hour by hour, what your stay includes, and guidance for international guests.",
};

export default async function YourStayPage() {
  const [c, aDay] = await Promise.all([getPageContent("your-stay"), getPageContent("a-day")]);

  return (
    <>
      <section className="mx-auto grid max-w-[88rem] gap-10 px-5 pb-16 pt-14 sm:px-8 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-7">
          <h1 className="text-[clamp(2.8rem,7.2vw,6.2rem)] leading-[0.95] tracking-[-0.02em]">{c.intro.heading}</h1>
          <p className="mt-8 max-w-xl text-[1.1rem] text-ink/80 md:ml-[10%]">{c.intro.body}</p>
        </div>
        <Placeholder label="the front of the ancestral house, with its tiled roof and verandah" shape="arch" className="aspect-[3/4] w-full md:col-span-4 md:col-start-9" />
      </section>

      <section id="rooms" className="mx-auto max-w-[88rem] scroll-mt-32 px-5 py-16 sm:px-8 md:py-24" aria-labelledby="rooms-heading">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="rooms-heading" className="text-[clamp(2rem,4vw,3.2rem)]">{c.rooms.heading}</h2>
            <p className="mt-5 text-ink/80">{c.rooms.body}</p>
          </div>
          <div className="grid grid-cols-6 gap-3 md:col-span-8">
            <Placeholder label="a room in the old house, wooden ceiling and window to the courtyard" className="col-span-6 aspect-[16/9] sm:col-span-4 sm:row-span-2 sm:aspect-auto" />
            <Placeholder label="a garden room with its own sit-out" className="col-span-3 aspect-square sm:col-span-2" />
            <Placeholder label="a bathroom, simple and clean" className="col-span-3 aspect-square sm:col-span-2" />
          </div>
        </div>
      </section>

      {/* The full interactive day lives on its own page; this is the doorway to it. */}
      <section id="a-day" className="mx-auto max-w-[88rem] scroll-mt-32 px-5 py-16 sm:px-8 md:py-24" aria-labelledby="day-heading">
        <div className="grid gap-10 border-y border-nordic/10 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 id="day-heading" className="text-[clamp(2rem,4vw,3.2rem)]">What a day here looks like</h2>
            <p className="mt-4 text-ink/75">{aDay.intro.body}</p>
            <TextLink href="/a-day-at-swetaranya" className="mt-6 inline-block">
              A day at Swetaranya, hour by hour
            </TextLink>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3 md:col-span-6 md:col-start-7">
            {aDay.moments.items.filter((_, i, all) => i === 0 || i === Math.floor(all.length / 2) || i === all.length - 1).map((m) => (
              <li key={m.time} className="border-t-2 border-keppel pt-4">
                <p className="font-heading text-[2rem] leading-none text-keppel tabular-nums">{m.time}</p>
                <p className="mt-2 font-bold text-nordic">{m.title}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="included" className="mx-auto max-w-[88rem] scroll-mt-32 px-5 py-16 sm:px-8 md:py-24" aria-labelledby="included-heading">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="included-heading" className="text-[clamp(2rem,4vw,3.2rem)] md:col-span-4">{c.included.heading}</h2>
          <ul className="grid gap-x-10 sm:grid-cols-2 md:col-span-8">
            {c.included.items.map((item) => (
              <li key={item} className="flex gap-4 border-b border-nordic/10 py-4">
                <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-keppel" aria-hidden>
                  <path d="M8 1 C8 1 3 7 3 10 a5 5 0 0 0 10 0 C13 7 8 1 8 1 Z" fill="currentColor" />
                </svg>
                <span className="text-ink/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="international" className="on-dark scroll-mt-32 bg-nordic text-cream" aria-labelledby="intl-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-28">
          <h2 id="intl-heading" className="max-w-3xl text-[clamp(2rem,4vw,3.2rem)] text-cream">{c.international.heading}</h2>
          <p className="mt-4 max-w-2xl text-cream/75">Many of our guests travel from the Gulf, Europe and beyond. This is how the journey usually goes.</p>
          <ol className="mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
            {c.international.steps.map((s, i) => (
              <li key={s.title} className="border-t border-cream/20 pt-5">
                <p className="font-heading text-[2.4rem] leading-none text-keppel tabular-nums">{i + 1}</p>
                <h3 className="mt-4 font-body text-[1.05rem] font-bold text-cream">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] text-cream/75">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
            <TextLink href="/faqs" className="!text-cream">Travel and stay FAQs</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}

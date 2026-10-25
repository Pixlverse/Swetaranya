import type { Metadata } from "next";
import { Placeholder } from "@/components/brand/Placeholder";
import { LotusMandala } from "@/components/brand/LotusMandala";
import { OutlineLink, PrimaryLink } from "@/components/site/Buttons";
import { Pending } from "@/components/site/Pending";
import { WayIndex } from "@/components/about/WayIndex";
import { ABOUT } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description: "Swetaranya, an Ayurvedic home hospital on the campus of Veluthat Mana, and its physicians Dr. Thrivikraman Veluthat and Dr. Sarang.",
};

/** Renders `{{…}}` in a sentence as a value still to be confirmed by the client. */
function WithPending({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{[^}]+\}\})/).map((part, i) =>
        part.startsWith("{{") ? <Pending key={i}>{part.slice(2, -2)}</Pending> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

export default function AboutPage() {
  const c = ABOUT;
  const { chief, second } = c.physicians;

  return (
    <>
      {/* The blessing opens the page; who we are follows straight on. */}
      <section className="mx-auto max-w-[88rem] px-5 pb-14 pt-10 sm:px-8 md:pb-20 md:pt-16" aria-labelledby="who-heading">
        <figure className="max-w-5xl">
          <blockquote className="font-heading text-[clamp(2.3rem,5.6vw,5rem)] leading-[1] tracking-[-0.03em] text-nordic">{c.blessing.sanskrit}</blockquote>
          <figcaption className="mt-5 flex items-center gap-4 text-[clamp(1.1rem,1.6vw,1.35rem)] text-keppel">
            <span aria-hidden className="h-px w-12 bg-keppel" />
            {c.blessing.meaning}
          </figcaption>
        </figure>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Placeholder label="Veluthat Mana, the family's ancestral home, seen from the courtyard" shape="leaf" className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[24rem]" />
          </div>
          <div className="lg:col-span-7 lg:self-center">
            <h2 id="who-heading" className="text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
              {c.whoWeAre.heading}
            </h2>
            <div className="mt-6 space-y-5 text-[1.1rem] leading-relaxed text-ink/80">
              {c.whoWeAre.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-8 border-l-2 border-keppel pl-5 font-heading text-[clamp(1.35rem,2vw,1.75rem)] leading-snug text-nordic">{c.whoWeAre.closer}</p>
          </div>
        </div>
      </section>

      {/* Our story: four moments along one line. */}
      <section id="our-story" className="scroll-mt-28 bg-keppel/12" aria-labelledby="story-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-8 md:py-20">
          <h2 id="story-heading" className="text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
            {c.story.heading}
          </h2>
          <ol className="relative mt-10 grid gap-8 border-l border-nordic/20 pl-7 md:mt-12 md:grid-cols-4 md:gap-8 md:border-l-0 md:border-t md:pl-0 md:pt-10">
            {c.story.stops.map((s, i) => (
              <li key={s.mark} className="relative">
                <span
                  aria-hidden
                  className={`absolute -left-[2.05rem] top-1.5 h-3 w-3 rounded-pill ring-4 ring-cream md:-top-[2.95rem] md:left-0 ${i === c.story.stops.length - 1 ? "bg-keppel" : "bg-nordic"}`}
                />
                <p className="font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-tight tracking-[-0.015em] text-nordic">{s.mark}</p>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The Swetaranya Way: seven principles as an index. */}
      <section id="the-swetaranya-way" className="on-dark relative scroll-mt-28 overflow-hidden bg-nordic text-cream" aria-labelledby="way-heading">
        <LotusMandala className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] text-cream opacity-[0.06]" />
        <div className="relative mx-auto max-w-[88rem] px-5 py-14 sm:px-8 md:py-20">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <h2 id="way-heading" className="text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-cream md:col-span-5">
              {c.way.heading}
            </h2>
            <p className="text-[1.1rem] leading-relaxed text-cream/80 md:col-span-7">{c.way.intro}</p>
          </div>
          <div className="mt-10 md:mt-12">
            <WayIndex principles={c.way.principles} />
          </div>
        </div>
      </section>

      {/* Live. Heal. Learn. */}
      <section className="mx-auto max-w-[88rem] px-5 pb-6 pt-14 sm:px-8 md:pb-8 md:pt-20" aria-labelledby="pillars-heading">
        <h2 id="pillars-heading" className="sr-only">
          {c.pillars.heading}
        </h2>
        <ul className="grid border-t border-nordic/15 md:grid-cols-3">
          {c.pillars.items.map((p, i) => (
            <li key={p.word} className={`py-8 md:px-8 md:py-10 ${i ? "border-t border-nordic/15 md:border-l md:border-t-0" : "md:pl-0"}`}>
              <p aria-hidden className="font-heading text-[clamp(3rem,6vw,5.4rem)] leading-[0.95] tracking-[-0.04em] text-nordic">
                {p.word}.
              </p>
              <p className="mt-4 max-w-[22rem] text-[1.08rem] leading-relaxed text-ink/75">
                <span className="sr-only">{p.word} — </span>
                {p.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Vision and mission side by side; values beneath. */}
      <section className="border-t border-nordic/10" aria-label={`${c.vision.heading}, ${c.mission.heading}, ${c.values.heading}`}>
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-[1.05rem] font-bold text-keppel">{c.vision.heading}</h2>
            <p className="mt-4 font-heading text-[clamp(1.6rem,2.6vw,2.35rem)] leading-[1.15] tracking-[-0.015em] text-nordic">{c.vision.text}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-[1.05rem] font-bold text-keppel">{c.mission.heading}</h2>
            <ul className="mt-4 divide-y divide-nordic/10 border-y border-nordic/10">
              {c.mission.items.map((m) => (
                <li key={m} className="flex gap-4 py-4 text-[1.06rem] leading-relaxed text-ink/85">
                  <svg viewBox="0 0 24 24" aria-hidden className="mt-1 h-5 w-5 shrink-0 text-keppel" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
                    <path d="M5 19l8-8" />
                  </svg>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-[88rem] px-5 pb-14 sm:px-8 md:pb-20">
          <h2 className="text-[1.05rem] font-bold text-keppel">{c.values.heading}</h2>
          <dl className="mt-4 grid gap-px overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] bg-nordic/12 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.items.map((v) => (
              <div key={v.word} className="group bg-cream p-6 transition-colors duration-300 hover:bg-keppel/10 md:p-7">
                <dt className="font-heading text-[clamp(1.5rem,2vw,1.85rem)] leading-tight tracking-[-0.015em] text-nordic">{v.word}</dt>
                <dd className="mt-3 text-[1rem] leading-relaxed text-ink/75">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Meet the physicians. */}
      <section id="physicians" className="scroll-mt-28 bg-keppel/12" aria-labelledby="physicians-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-8 md:py-20">
          <h2 id="physicians-heading" className="text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
            {c.physicians.heading}
          </h2>

          <article className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-12 lg:gap-12" aria-labelledby="chief-name">
            <div className="lg:col-span-4">
              <Placeholder label="Dr. Thrivikraman Veluthat, portrait taken at Swetaranya" shape="drop" className="mx-auto aspect-[4/5] w-full max-w-[22rem] lg:max-w-none" />
              <h3 id="chief-name" className="mt-6 text-[1.6rem] leading-tight text-nordic">
                {chief.name}
              </h3>
              <p className="mt-1 text-[1.02rem] text-keppel">{chief.role}</p>
            </div>
            <div className="lg:col-span-8">
              <p className="font-heading text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.04] tracking-[-0.025em] text-nordic">{chief.quote}</p>
              <div className="mt-8 gap-10 space-y-5 text-[1.04rem] leading-relaxed text-ink/80 md:columns-2 md:space-y-0 [&>p]:mb-5 [&>p]:break-inside-avoid-column">
                {chief.paragraphs.map((p) => (
                  <p key={p}>
                    <WithPending text={p} />
                  </p>
                ))}
              </div>
            </div>
          </article>

          <article className="mt-12 grid gap-8 border-t border-nordic/15 pt-10 md:mt-14 md:grid-cols-12 md:gap-12" aria-labelledby="second-name">
            <div className="md:col-span-4 md:order-2 lg:col-span-3 lg:col-start-10">
              <Placeholder label="Dr. Sarang, portrait taken at Swetaranya" shape="arch" className="mx-auto aspect-[4/5] w-full max-w-[16rem] md:max-w-none" />
            </div>
            <div className="md:col-span-8 md:order-1">
              <h3 id="second-name" className="text-[1.6rem] leading-tight text-nordic">
                {second.name}
              </h3>
              <p className="mt-1 text-[1.02rem] text-keppel">{second.role}</p>
              <div className="mt-6 space-y-5 text-[1.04rem] leading-relaxed text-ink/80">
                {second.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Take a look around. */}
      <section id="virtual-tour" className="mx-auto max-w-[88rem] scroll-mt-28 px-5 py-14 sm:px-8 md:py-16" aria-labelledby="tour-heading">
        <div className="relative overflow-hidden rounded-tl-[3.5rem] rounded-br-[3.5rem]">
          <Placeholder label="the grounds and verandas of Veluthat Mana, wide view for the virtual tour" className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/8]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-nordic/90 via-nordic/45 to-transparent sm:bg-gradient-to-r sm:from-nordic/90 sm:via-nordic/55" />
          <div className="on-dark absolute inset-x-0 bottom-0 p-6 sm:inset-y-0 sm:right-auto sm:flex sm:max-w-xl sm:flex-col sm:justify-center sm:p-10 lg:p-14">
            <h2 id="tour-heading" className="text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-cream">
              {c.tour.heading}
            </h2>
            <p className="mt-4 text-[1.04rem] leading-relaxed text-cream/85">{c.tour.text}</p>
            <span
              title="The virtual tour is not available yet"
              className="mt-6 inline-flex w-fit cursor-default items-center gap-2 rounded-pill border border-dashed border-cream/60 px-6 py-3 text-[0.95rem] font-bold text-cream"
            >
              {c.tour.action}
            </span>
          </div>
        </div>
      </section>

      {/* Begin with a conversation. */}
      <section className="mx-auto max-w-[88rem] px-5 pb-14 sm:px-8 md:pb-20" aria-labelledby="begin-heading">
        <div className="on-dark relative grid gap-8 overflow-hidden rounded-tl-[3.5rem] rounded-br-[3.5rem] bg-nordic px-6 py-12 text-cream sm:px-10 md:grid-cols-12 md:items-center md:px-14 md:py-16">
          <LotusMandala className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] text-cream opacity-[0.07]" />
          <div className="relative md:col-span-7">
            <h2 id="begin-heading" className="text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-cream">
              {c.begin.heading}
            </h2>
            <p className="mt-5 max-w-xl text-[1.1rem] leading-relaxed text-cream/80">{c.begin.text}</p>
          </div>
          <div className="relative flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <PrimaryLink href="/book-a-consultation" className="hover:!bg-cream hover:!text-nordic">
              {c.begin.book}
            </PrimaryLink>
            <OutlineLink href="/talk-to-the-physician" tone="light">
              {c.begin.enquire}
            </OutlineLink>
          </div>
        </div>
      </section>
    </>
  );
}

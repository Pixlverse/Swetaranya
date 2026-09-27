import type { Metadata } from "next";
import { Placeholder } from "@/components/brand/Placeholder";
import { SymbolDivider } from "@/components/brand/SymbolDivider";
import { OrnamentPattern } from "@/components/brand/OrnamentPattern";
import { ArrivalStepper } from "@/components/way/ArrivalStepper";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";
import { getPageContent } from "@/lib/queries";
import { paragraphs } from "@/lib/markdown";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "The Swetaranya Way",
  description: "Live, heal and learn — how a stay at Swetaranya unfolds, what happens when you arrive, the food, and what you take home.",
};

const CHAPTERS = [
  { id: "live-heal-learn", label: "Live, heal, learn" },
  { id: "arrival", label: "What happens when you arrive" },
  { id: "food", label: "Food at Swetaranya" },
  { id: "take-ayurveda-home", label: "Take Ayurveda home" },
];

/** Each pillar keeps its own image silhouette, whatever the copy says. */
const SHAPES = ["leaf", "drop", "arch"] as const;

export default async function SwetaranyaWayPage() {
  const c = await getPageContent("the-swetaranya-way");

  return (
    <>
      <section className="mx-auto grid max-w-[88rem] gap-12 px-5 pb-16 pt-14 sm:px-8 md:pt-20 lg:grid-cols-12">
        <h1 className="text-[clamp(3.2rem,9vw,8rem)] leading-[0.92] tracking-[-0.025em] lg:col-span-8">
          <span className="block">Live.</span>
          <span className="block pl-[0.6em]">Heal.</span>
          <span className="block pl-[1.2em]">Learn.</span>
        </h1>
        <div className="self-end lg:col-span-4">
          <p className="text-[1.1rem] text-ink/80">{c.intro.body}</p>
          <nav aria-label="On this page" className="mt-8 border-t border-nordic/15 pt-5">
            <ul className="space-y-2">
              {CHAPTERS.map((ch) => (
                <li key={ch.id}>
                  <a href={`#${ch.id}`} className="text-nordic underline decoration-keppel/0 underline-offset-4 transition-colors hover:decoration-keppel">
                    {ch.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section id="live-heal-learn" aria-label="Live, heal, learn" className="scroll-mt-32">
        {c.pillars.items.map((p, i) => (
          <article key={p.word} id={p.word.toLowerCase()} className="scroll-mt-32 border-t border-nordic/10">
            <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-24">
              <div className={`md:col-span-5 ${i % 2 ? "md:order-2 md:col-start-8" : ""}`}>
                <Placeholder label={p.imageLabel} shape={SHAPES[i % SHAPES.length]} className="aspect-[4/5] w-full max-w-md" />
              </div>
              <div className={`md:col-span-6 ${i % 2 ? "md:order-1" : "md:col-start-7"}`}>
                <p className="font-heading text-[clamp(3.5rem,7vw,5.5rem)] leading-none text-keppel" aria-hidden>
                  {p.word}
                </p>
                <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)]">{p.heading}</h2>
                <div className="mt-5 space-y-4 text-[1.05rem] text-ink/80">
                  {paragraphs(p.body).map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section id="arrival" className="scroll-mt-32 border-y border-nordic/10 bg-white/60" aria-labelledby="arrival-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-28">
          <div className="mb-14 grid gap-6 md:grid-cols-12">
            <h2 id="arrival-heading" className="text-[clamp(2.2rem,4.6vw,3.6rem)] md:col-span-7">
              {c.arrival.heading}
            </h2>
            <p className="self-end text-ink/75 md:col-span-4 md:col-start-9">{c.arrival.body}</p>
          </div>
          <ArrivalStepper steps={c.arrival.steps} />
        </div>
      </section>

      <section id="food" className="on-dark relative isolate scroll-mt-32 bg-nordic text-cream" aria-labelledby="food-heading">
        <OrnamentPattern tone="cream" opacity={0.045} className="-z-10" />
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28">
          <div className="md:col-span-6">
            <h2 id="food-heading" className="text-[clamp(2.2rem,4.6vw,3.6rem)] text-cream">
              {c.food.heading}
            </h2>
            <p className="mt-6 max-w-xl text-[1.07rem] text-cream/80">{c.food.body}</p>
            <dl className="mt-10 divide-y divide-cream/15 border-y border-cream/15">
              {c.food.principles.map((f) => (
                <div key={f.title} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="font-bold text-keppel">{f.title}</dt>
                  <dd className="text-cream/80">{f.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Placeholder label="a lunch served on banana leaf in the dining room" tone="dark" shape="drop" className="aspect-square w-full" />
          </div>
        </div>
      </section>

      <section id="take-ayurveda-home" className="mx-auto max-w-[88rem] scroll-mt-32 px-5 py-20 sm:px-8 md:py-28" aria-labelledby="home-heading">
        <div className="grid gap-12 md:grid-cols-12">
          <h2 id="home-heading" className="text-[clamp(2.2rem,4.6vw,3.6rem)] md:col-span-5">
            {c.takeHome.heading}
          </h2>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-[1.07rem] text-ink/80">{c.takeHome.body}</p>
            <ul className="mt-8 space-y-5">
              {c.takeHome.items.map((t) => (
                <li key={t.title} className="border-l-2 border-keppel pl-5">
                  <span className="font-bold text-nordic">{t.title}</span> <span className="text-ink/75">{t.body}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
              <TextLink href="/constitution-check">Know your constitution</TextLink>
              <TextLink href="/ebooks">Guides to take home</TextLink>
            </div>
          </div>
        </div>
        <SymbolDivider className="mt-24" />
      </section>
    </>
  );
}

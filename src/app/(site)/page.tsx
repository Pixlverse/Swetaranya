import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HomeHero } from "@/components/home/HomeHero";
import { DayClock } from "@/components/home/DayClock";
import { LifestyleWheel } from "@/components/home/LifestyleWheel";
import { SpecialityExplorer } from "@/components/home/SpecialityExplorer";
import { ConsultationJourney } from "@/components/home/ConsultationJourney";
import { PillarPanels } from "@/components/home/PillarPanels";
import { Placeholder } from "@/components/brand/Placeholder";
import { SymbolDivider } from "@/components/brand/SymbolDivider";
import { RipplePattern } from "@/components/brand/RipplePattern";
import { OutlineLink, PrimaryLink, TextLink } from "@/components/site/Buttons";
import { getPageContent } from "@/lib/queries";
import { LIFESTYLE_CHECK_TEASER_NOTE, PHYSICIAN_NAME } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Swetaranya — An Ayurvedic home hospital in Kerala, India, near Tirur" },
  description:
    "A home hospital gives full hospital care in the setting of a home. At Swetaranya, that means physician-led Ayurvedic treatment, trained therapists and a prescribed diet, in a family home near Tirur, Kerala.",
};

/** A heading made of two sentences, split so each can sit over its own column. */
const sentences = (text: string) => text.split(/(?<=\.)\s+/);

export default async function HomePage() {
  const c = await getPageContent("home");
  const [hospitalLine, homeLine] = sentences(c.homeHospital.heading);

  return (
    <>
      <HomeHero {...c.hero} />

      {/* Why healing needs more: the two paragraphs, then the promise said plainly beside them. */}
      <section className="relative isolate overflow-hidden bg-cream" aria-label={c.hero.heading}>
        <RipplePattern className="-z-10" scale={1.1} />
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 text-[1.12rem] leading-relaxed text-ink/80 lg:col-span-6">
            {c.intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="self-end border-l-2 border-keppel pl-6 font-heading text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.2] text-nordic lg:col-span-5 lg:col-start-8">
            {c.intro.aside}
          </p>
        </div>
      </section>

      {/* What is a home hospital: the question and its answer as one header, then a single framed panel —
          the hospital half, the home half, and "not a resort" running across the foot of both. */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24" aria-labelledby="hh-heading">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-6">
            <p className="text-[0.95rem] font-bold text-keppel">{c.homeHospital.label}</p>
            <h2 id="hh-heading" className="mt-3 text-[clamp(2.1rem,3.9vw,3.4rem)] leading-[1.05] tracking-[-0.025em]">
              <span className="block text-nordic">{hospitalLine}</span>
              <span className="block text-keppel">{homeLine}</span>
            </h2>
          </div>
          <p className="text-pretty text-[1.12rem] leading-relaxed text-ink/80 lg:col-span-6 lg:pb-1">{c.homeHospital.answer}</p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-bl-[1.25rem] rounded-br-[3rem] rounded-tl-[3rem] rounded-tr-[1.25rem] border border-nordic/12 md:mt-14 md:grid-cols-2">
          <div className="bg-cream p-7 sm:p-10 md:p-12">
            <HalfIcon kind="hospital" />
            <div className="mt-6 space-y-4 text-[1.06rem] leading-relaxed text-ink/80">
              {c.homeHospital.hospital.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="border-t border-nordic/12 bg-keppel/12 p-7 sm:p-10 md:border-l md:border-t-0 md:p-12">
            <HalfIcon kind="home" />
            <p className="mt-6 text-[1.06rem] leading-relaxed text-ink/80">{c.homeHospital.home}</p>
          </div>
          <div className="on-dark grid gap-4 bg-nordic p-7 text-cream sm:p-10 md:col-span-2 md:grid-cols-12 md:items-baseline md:gap-10 md:px-12 md:py-10">
            <p className="font-heading text-[clamp(1.6rem,2.5vw,2.2rem)] leading-[1.1] text-cream md:col-span-4">{c.homeHospital.notResortLead}</p>
            <p className="text-[1.06rem] leading-relaxed text-cream/80 md:col-span-8">{c.homeHospital.notResort}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-end md:gap-0">
          <p className="text-[1.06rem] leading-relaxed text-ink/80 md:pr-12">{c.homeHospital.building}</p>
          <p className="font-heading text-[clamp(1.4rem,2.1vw,1.8rem)] leading-snug text-nordic md:pl-12">{c.homeHospital.closer}</p>
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
            <p className="mt-6 max-w-md font-heading text-[1.3rem] leading-snug text-keppel">{c.lifestyle.lead}</p>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-cream/70">{c.lifestyle.questions}</p>
            <p className="mt-4 max-w-md text-[1.1rem] leading-relaxed text-cream/85">{c.lifestyle.body}</p>
          </div>
          {/* Straight after "…shape how you feel:" on phones; beside the words on wide screens. */}
          <LifestyleWheel
            areas={c.lifestyle.areas}
            className="mx-auto w-full max-w-[24rem] px-10 sm:max-w-[32rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[38rem] lg:self-center lg:px-16"
          />
          <div className="lg:self-start lg:pt-8">
            <OutlineLink href="/lifestyle-check" tone="light">
              {c.lifestyle.action}
            </OutlineLink>
            <p className="mt-8 max-w-md border-l-2 border-blush pl-4 text-[0.9rem] text-cream/70">{LIFESTYLE_CHECK_TEASER_NOTE}</p>
          </div>
        </div>
      </section>

      {/* Conditions we treat: the claim and its reasons as one header, then the seven specialities to explore. */}
      <section
        className="bg-[linear-gradient(to_bottom,var(--color-cream),color-mix(in_srgb,var(--color-keppel)_7%,var(--color-cream)))]"
        aria-labelledby="conditions-heading"
      >
        <div className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-6">
              <p className="text-[0.95rem] font-bold text-keppel">{c.conditions.label}</p>
              <h2 id="conditions-heading" className="mt-3 text-[clamp(2.1rem,3.9vw,3.4rem)] leading-[1.05] tracking-[-0.025em]">
                {c.conditions.heading}
              </h2>
            </div>
            <div className="space-y-4 text-[1.06rem] leading-relaxed text-ink/80 lg:col-span-6 lg:pb-1">
              {c.conditions.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="mt-12 md:mt-14">
            <SpecialityExplorer
              items={c.conditions.specialities}
              conditionsLabel={c.conditions.conditionsLabel}
              action={{ label: c.conditions.action, href: "/book-a-consultation" }}
            />
          </div>
        </div>
      </section>

      {/* Why Swetaranya is different: Heal, Live and Learn as three rows, each word large beside what it means here. */}
      <section className="on-dark relative overflow-hidden bg-nordic text-cream" aria-labelledby="diff-heading">
        <Image src="/pillars-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <span aria-hidden className="absolute inset-0 bg-nordic/80" />
        <div className="relative mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6">
              <p className="text-[0.95rem] font-bold text-keppel">{c.difference.label}</p>
              <h2 id="diff-heading" className="mt-3 text-[clamp(2.1rem,3.9vw,3.4rem)] leading-[1.05] tracking-[-0.025em] text-cream">
                {c.difference.heading}
              </h2>
            </div>
            <p className="text-[1.1rem] leading-relaxed text-cream/80 md:col-span-6">{c.difference.intro}</p>
          </div>

          <div className="mt-12 md:mt-14">
            <PillarPanels groups={c.difference.groups} />
          </div>

          <div className="mt-14 flex flex-col items-center gap-7 border-t border-cream/20 pt-12 text-center">
            <p className="max-w-4xl text-balance font-heading text-[clamp(1.45rem,2.5vw,2.1rem)] leading-snug text-cream">
              {c.difference.closing.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <OutlineLink href="/the-swetaranya-way" tone="light">
              {c.difference.action}
            </OutlineLink>
          </div>
        </div>
      </section>

      {/* How we heal: the consultation journey, from home to Swetaranya. */}
      <section className="bg-keppel/12" aria-labelledby="journey-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="text-[0.95rem] font-bold text-keppel">{c.journey.label}</p>
              <p className="mt-3 font-heading text-[1.35rem] text-nordic/80">{c.journey.title}</p>
              <h2 id="journey-heading" className="mt-2 text-[clamp(2.1rem,3.9vw,3.4rem)] leading-[1.05] tracking-[-0.025em]">
                {c.journey.heading}
              </h2>
            </div>
            <p className="text-[1.06rem] leading-relaxed text-ink/80 md:col-span-5">{c.journey.intro}</p>
          </div>
          <div className="mt-14 md:mt-16">
            <ConsultationJourney first={c.journey.first} arrive={c.journey.arrive} steps={c.journey.steps} />
          </div>
          <div className="mt-14 flex flex-col gap-6 border-t border-nordic/15 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-heading text-[clamp(1.3rem,1.9vw,1.6rem)] leading-snug text-nordic">{c.journey.closer}</p>
            <PrimaryLink href="/book-a-consultation" className="self-start md:self-auto">
              {c.journey.action}
            </PrimaryLink>
          </div>
        </div>
      </section>

      {/* Meet the physician: a doctor who lives here, and the time that adds up. */}
      <section aria-labelledby="physician-heading">
        <div className="mx-auto grid max-w-[88rem] items-start gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-24">
          <div className="md:sticky md:top-32 md:col-span-4">
            <Placeholder label={`${PHYSICIAN_NAME} on the verandah of Veluthat Mana`} shape="drop" className="mx-auto aspect-[4/5] w-3/4 max-w-sm md:w-full" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-[0.95rem] font-bold text-keppel">{c.physician.label}</p>
            <h2 id="physician-heading" className="mt-3 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
              {c.physician.heading}
            </h2>
            <p className="mt-5 font-heading text-[clamp(1.3rem,1.8vw,1.5rem)] leading-snug text-keppel">{c.physician.lead}</p>
            <div className="mt-6 max-w-xl space-y-5 text-[1.05rem] leading-relaxed text-ink/80">
              {c.physician.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-10 rounded-tl-[2rem] rounded-br-[2rem] bg-keppel/12 p-6 md:p-8">
              <h3 className="text-[1.4rem] leading-tight text-nordic">{c.physician.timeHeading}</h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/75">{c.physician.timeIntro}</p>
              <ul className="mt-5 divide-y divide-nordic/12 border-y border-nordic/12">
                {c.physician.time.map((t) => (
                  <li key={t.lead} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-6">
                    <strong className="font-heading text-[1.12rem] font-medium text-nordic">{t.lead}</strong>
                    <span className="text-[1.02rem] leading-relaxed text-ink/80">{t.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 max-w-xl space-y-5 text-[1.05rem] leading-relaxed text-ink/80">
              {c.physician.after.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-12 border-t border-terracotta/50 pt-8 font-heading text-[clamp(1.75rem,2.67vw,2.2rem)] leading-tight text-nordic">{c.physician.motto}</p>
            <OutlineLink href="/about#physicians" className="mt-8">
              {c.physician.action}
            </OutlineLink>
          </div>
        </div>
      </section>

      {/* A day here: a genuine sequence, told on a clock face. */}
      <section className="overflow-x-clip bg-keppel/12 py-20 md:py-24" aria-labelledby="day-heading">
        <div className="mx-auto grid max-w-[88rem] gap-6 px-5 sm:px-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="text-[0.95rem] font-bold text-keppel">{c.day.label}</p>
            <h2 id="day-heading" className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
              {c.day.heading}
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-[1.05rem] leading-relaxed text-ink/80">{c.day.body}</p>
            <p className="mt-5 font-heading text-[1.2rem] text-nordic">{c.day.intro}</p>
          </div>
        </div>
        <DayClock items={c.day.items} />
        <div className="mx-auto mt-10 flex max-w-[88rem] flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md border-l-2 border-terracotta/60 pl-4 text-[1rem] text-ink/75">{c.day.note}</p>
          <TextLink href="/a-day-at-swetaranya">{c.day.action}</TextLink>
        </div>
      </section>

      {/* The home: the family's story, the house beside it. */}
      <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24" aria-labelledby="home-heading">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[0.95rem] font-bold text-keppel">{c.theHome.label}</p>
            <h2 id="home-heading" className="mt-3 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
              {c.theHome.heading}
            </h2>
            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-ink/80">
              {c.theHome.paragraphs.map((p, i) =>
                i === 0 ? (
                  <p key={p} className="font-heading text-[clamp(1.25rem,1.8vw,1.45rem)] leading-snug text-nordic">
                    {p}
                  </p>
                ) : i === 1 ? (
                  <p key={p} className="border-l-2 border-terracotta/60 pl-5 text-ink/75">
                    {p}
                  </p>
                ) : (
                  <p key={p}>{p}</p>
                ),
              )}
            </div>
          </div>
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:col-start-8 lg:self-start">
            <Placeholder label="Veluthat Mana from the courtyard — the old house, its trees and the quiet around it" shape="arch" className="aspect-[3/4] w-full" />
          </div>
        </div>

        {/* Before you arrive, take a look around: a sage panel in the leaf silhouette, the house drawn in its corner. */}
        <div className="relative mt-16 overflow-hidden rounded-bl-[1.25rem] rounded-br-[3.5rem] rounded-tl-[3.5rem] rounded-tr-[1.25rem] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-keppel)_30%,var(--color-cream)),color-mix(in_srgb,var(--color-keppel)_14%,var(--color-cream)))] px-6 py-10 sm:px-10 md:px-14 md:py-14">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute -bottom-14 right-4 h-56 w-56 text-nordic opacity-[0.09] md:right-[6%] md:h-64 md:w-64"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 11.5 12 4.5l8.5 7" />
            <path d="M6 10v9.5h12V10" />
            <path d="M10 19.5v-5h4v5" />
          </svg>
          <div className="relative grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] text-nordic">{c.walkthrough.heading}</h2>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/80">{c.walkthrough.body}</p>
              <p className="mt-4 font-heading text-[1.25rem] text-nordic">{c.walkthrough.line}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <span
                title="The 360° walkthrough is not available yet"
                className="inline-flex cursor-default items-center justify-center rounded-pill border border-dashed border-nordic/60 px-6 py-3 text-[0.95rem] font-bold text-nordic"
              >
                {c.walkthrough.walkthrough}
              </span>
              <Link
                href="/your-stay"
                className="inline-flex shrink-0 items-center justify-center rounded-pill bg-nordic px-6 py-3 text-[0.95rem] font-bold text-cream transition-[background-color,color,transform] duration-300 ease-calm hover:bg-keppel hover:text-nordic active:translate-y-px"
              >
                {c.walkthrough.explore}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* In our guests' words: one voice, given the room. */}
      <section className="mx-auto max-w-[88rem] px-5 pb-20 sm:px-8 md:pb-24" aria-labelledby="guests-heading">
        <SymbolDivider className="mb-16" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="text-[0.95rem] font-bold text-keppel">{c.guests.label}</p>
            <h2 id="guests-heading" className="mt-3 text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.08]">
              {c.guests.heading}
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/80">{c.guests.body}</p>
          </div>
          <figure className="md:col-span-6 md:col-start-7 md:self-end">
            <blockquote className="font-heading text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.08] tracking-[-0.02em] text-nordic">&ldquo;{c.guests.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-[1rem] text-ink/70">— {c.guests.quoteBy}</figcaption>
            <TextLink href="/experience" className="mt-8 inline-block">
              {c.guests.action}
            </TextLink>
          </figure>
        </div>
      </section>

      {/* Final invitation: a place at the table. */}
      <section className="relative overflow-hidden border-t border-keppel/30 bg-cream" aria-labelledby="final-cta">
        <Image src="/final-cta-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <span aria-hidden className="absolute inset-0 bg-cream/60 md:bg-transparent" />
        <div className="relative mx-auto max-w-[88rem] px-5 py-24 sm:px-8 md:py-24">
          <h2 id="final-cta" className="max-w-4xl text-[clamp(2.1rem,4.15vw,3.5rem)] leading-[1.02]">
            {c.finalCta.heading}
          </h2>
          <div className="mt-8 max-w-2xl space-y-4 text-[1.07rem] leading-relaxed text-ink/80 md:ml-[20%]">
            {c.finalCta.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-12 grid gap-8 md:ml-[20%] md:grid-cols-2 md:items-end">
            <p className="font-heading text-[clamp(1.5rem,2.3vw,2rem)] leading-snug text-nordic">{c.finalCta.invite}</p>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryLink href="/book-a-consultation">{c.finalCta.book}</PrimaryLink>
                <OutlineLink href="/talk-to-the-physician">{c.finalCta.enquire}</OutlineLink>
              </div>
              <p className="mt-6 text-[0.95rem] text-ink/75">
                {c.finalCta.questionLead}{" "}
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                  {c.finalCta.whatsapp}
                </a>
              </p>
              <p className="mt-1 text-[0.95rem] text-ink/75">
                {c.finalCta.familyLead}{" "}
                <Link href="/talk-to-the-physician" className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                  {c.finalCta.family}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Line marks for the two halves of the panel: a hospital cross, and the house. */
function HalfIcon({ kind }: { kind: "hospital" | "home" }) {
  return (
    <span aria-hidden className={`grid h-12 w-12 place-items-center rounded-pill ${kind === "hospital" ? "bg-nordic text-cream" : "bg-keppel text-nordic"}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {kind === "hospital" ? (
          <>
            <rect x="4" y="4" width="16" height="16" rx="3.5" />
            <path d="M12 8.5v7M8.5 12h7" />
          </>
        ) : (
          <>
            <path d="M3.5 11.5 12 4.5l8.5 7" />
            <path d="M6 10v9.5h12V10" />
            <path d="M10 19.5v-5h4v5" />
          </>
        )}
      </svg>
    </span>
  );
}

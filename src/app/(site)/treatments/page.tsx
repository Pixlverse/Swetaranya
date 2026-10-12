import type { Metadata } from "next";
import Link from "next/link";
import { getConditions, getPageContent, getTherapies } from "@/lib/queries";
import { PrimaryLink } from "@/components/site/Buttons";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import { OrnamentPattern } from "@/components/brand/OrnamentPattern";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Treatments",
  description: "The treatment journey at Swetaranya, Panchakarma and individual therapies, and the conditions guests most often come to us with.",
};


export default async function TreatmentsPage() {
  const [conditions, therapies, c] = await Promise.all([getConditions(), getTherapies(), getPageContent("treatments")]);
  const panchakarma = therapies.filter((t) => t.category === "panchakarma");
  const individual = therapies.filter((t) => t.category === "individual");

  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pb-10 pt-14 sm:px-8 md:pt-20">
        <h1 className="max-w-5xl text-[clamp(2.2rem,4.43vw,3.8rem)] leading-[0.98] tracking-[-0.02em]">
          {c.intro.heading}
        </h1>
        <p className="mt-8 max-w-2xl text-[1.1rem] text-ink/80 md:ml-[8%]">{c.intro.body}</p>
      </section>

      <section id="journey" aria-labelledby="journey-heading" className="mx-auto max-w-[88rem] scroll-mt-32 px-5 py-16 sm:px-8 md:py-24">
        <h2 id="journey-heading" className="text-[clamp(1.8rem,3vw,2.4rem)]">{c.journey.heading}</h2>
        <ol className="mt-12 grid gap-0 md:auto-cols-fr md:grid-flow-col">
          {c.journey.stages.map((j, i, all) => (
            <li key={j.title} className="relative border-t-2 border-nordic/15 pt-6 md:pr-8">
              <span aria-hidden className="absolute -top-[2px] left-0 h-[2px] bg-keppel" style={{ width: `${((i + 1) / all.length) * 100}%` }} />
              <p className="text-[0.85rem] font-bold text-keppel">Stage {i + 1}</p>
              <h3 className="mt-2 text-[1.8rem]">{j.title}</h3>
              <p className="mt-1 font-heading italic text-terracotta">{j.term}</p>
              <p className="mt-3 pb-10 text-ink/75">{j.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="conditions" aria-labelledby="conditions-heading" className="on-dark scroll-mt-32 bg-nordic text-cream">
        <div className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24">
          <div className="grid gap-6 md:grid-cols-12">
            <h2 id="conditions-heading" className="text-[clamp(1.8rem,3vw,2.4rem)] text-cream md:col-span-6">
              {c.conditions.heading}
            </h2>
            <p className="self-end text-cream/75 md:col-span-5 md:col-start-8">{c.conditions.body}</p>
          </div>
          <ul className="mt-12 border-t border-cream/15">
            {conditions.map((c) => (
              <li key={c._id} className="border-b border-cream/15">
                <Link href={`/treatments/conditions/${c.slug}`} className="group grid gap-3 py-8 md:grid-cols-12 md:gap-8">
                  <span className="font-heading text-[clamp(1.75rem,2.76vw,2.3rem)] leading-tight text-cream transition-colors group-hover:text-keppel md:col-span-5">
                    {c.name}
                  </span>
                  <span className="line-clamp-3 text-cream/70 md:col-span-6 md:col-start-7">{c.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="therapies" aria-labelledby="therapies-heading" className="mx-auto max-w-[88rem] scroll-mt-32 px-5 py-20 sm:px-8 md:py-24">
        <h2 id="therapies-heading" className="text-[clamp(1.8rem,3vw,2.4rem)]">{c.therapies.heading}</h2>
        <div className="mt-12 grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <h3 className="text-[1.7rem]">Panchakarma</h3>
            <p className="mt-2 max-w-md text-ink/75">{c.therapies.panchakarmaBody}</p>
            <ul className="mt-8">
              {panchakarma.map((t) => (
                <li key={t._id}>
                  <Link href={`/treatments/therapies/${t.slug}`} className="group flex items-baseline gap-3 py-3">
                    <span className="font-heading text-[1.5rem] text-nordic transition-colors group-hover:text-keppel">{t.name}</span>
                    <span aria-hidden className="mb-1.5 flex-1 border-b border-dotted border-nordic/35" />
                    <span className="max-w-[45%] text-right text-[0.88rem] text-ink/60">{t.summary.split(",")[0].split(".")[0]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[1.7rem]">Individual therapies</h3>
            <p className="mt-2 max-w-md text-ink/75">{c.therapies.individualBody}</p>
            <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
              {individual.map((t) => (
                <li key={t._id} className="border-t border-nordic/15">
                  <Link href={`/treatments/therapies/${t.slug}`} className="group block py-4">
                    <span className="block font-heading text-[1.35rem] text-nordic transition-colors group-hover:text-keppel">{t.name}</span>
                    <span className="mt-1 block text-[0.92rem] text-ink/70">{t.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-nordic/10 bg-keppel/10">
        <OrnamentPattern opacity={0.06} className="-z-10" />
        <div className="mx-auto flex max-w-[88rem] flex-col gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[0.9rem] text-ink/65">{MEDICAL_DISCLAIMER}</p>
          <PrimaryLink href="/talk-to-the-physician" className="shrink-0 self-start">
            Talk to the Physician
          </PrimaryLink>
        </div>
      </section>
    </>
  );
}

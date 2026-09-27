import type { Metadata } from "next";
import { Placeholder } from "@/components/brand/Placeholder";
import { SymbolDivider } from "@/components/brand/SymbolDivider";
import { PrimaryLink } from "@/components/site/Buttons";
import { getPageContent } from "@/lib/queries";
import { paragraphs } from "@/lib/markdown";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "About",
  description: "Chief Physician Dr. Thrivikraman Veluthat, the family, and the story of the ancestral home at Swetaranya.",
};

export default async function AboutPage() {
  const c = await getPageContent("about");

  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pb-16 pt-14 sm:px-8 md:pt-20">
        <h1 className="max-w-5xl text-[clamp(2.8rem,7vw,6rem)] leading-[0.98] tracking-[-0.02em]">{c.intro.heading}</h1>
        <p className="mt-8 max-w-xl text-[1.1rem] text-ink/80 md:ml-[30%]">{c.intro.body}</p>
      </section>

      <section id="physician" className="border-t border-nordic/10" aria-labelledby="physician-heading">
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <Placeholder label="Dr. Thrivikraman Veluthat, portrait taken at Swetaranya" shape="drop" className="aspect-[4/5] w-full max-w-md" />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-heading italic text-terracotta">Chief Physician</p>
            <h2 id="physician-heading" className="mt-2 text-[clamp(2.2rem,4.4vw,3.6rem)]">{c.physician.heading}</h2>
            <div className="prose-swet mt-6">
              {paragraphs(c.physician.body).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-nordic/15 pt-6">
              <div>
                <dt className="text-[0.85rem] font-bold text-keppel">In practice</dt>
                <dd className="mt-1 font-heading text-[2rem] text-nordic">25+ years</dd>
              </div>
              <div>
                <dt className="text-[0.85rem] font-bold text-keppel">Trained and practised at</dt>
                <dd className="mt-1 text-ink/85">Kottakkal Arya Vaidya Sala</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="family" className="bg-white/60 border-y border-nordic/10" aria-labelledby="family-heading">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-24">
          <div className="grid gap-8 md:grid-cols-12">
            <h2 id="family-heading" className="text-[clamp(2rem,4vw,3.2rem)] md:col-span-4">{c.family.heading}</h2>
            <p className="text-[1.05rem] text-ink/80 md:col-span-6 md:col-start-6">{c.family.body}</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
            <Placeholder label="a family member who runs the kitchen" shape="arch" className="aspect-[3/4]" />
            <Placeholder label="a family member who looks after guests" shape="arch" className="aspect-[3/4] md:mt-16" />
            <Placeholder label="the family together in the courtyard" shape="arch" className="col-span-2 aspect-[3/2] md:col-span-1 md:aspect-[3/4]" />
          </div>
        </div>
      </section>

      <section id="home" className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 md:py-24" aria-labelledby="home-heading">
        <Placeholder label="the ancestral house from the old approach path — archive photograph if available" className="aspect-[21/9] w-full" />
        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <h2 id="home-heading" className="text-[clamp(2rem,4vw,3.2rem)] md:col-span-5">{c.home.heading}</h2>
          <div className="prose-swet md:col-span-6 md:col-start-7">
            {paragraphs(c.home.body).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <SymbolDivider className="mt-20" />
        <div className="mt-14 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl font-heading text-[clamp(1.6rem,3vw,2.3rem)] leading-tight text-nordic">You are welcome to write to the family directly.</p>
          <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
        </div>
      </section>
    </>
  );
}

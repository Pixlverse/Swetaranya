import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCondition } from "@/lib/queries";
import { paragraphs } from "@/lib/markdown";
import { FaqAccordion } from "@/components/treatments/FaqAccordion";
import { PrimaryLink } from "@/components/site/Buttons";
import { SymbolDivider } from "@/components/brand/SymbolDivider";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import { OrnamentPattern } from "@/components/brand/OrnamentPattern";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/treatments/conditions/[slug]">): Promise<Metadata> {
  const c = await getCondition((await params).slug);
  if (!c) return {};
  const image = c.heroImage?.url ? [{ url: c.heroImage.url, alt: c.heroImage.alt ?? c.name }] : undefined;
  return { title: c.seoTitle ?? c.name, description: c.seoDescription ?? c.summary.slice(0, 160), openGraph: image ? { images: image } : undefined };
}

export default async function ConditionPage({ params }: PageProps<"/treatments/conditions/[slug]">) {
  const c = await getCondition((await params).slug);
  if (!c) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-[88rem] px-5 pt-10 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-[0.9rem] text-ink/60">
          <Link href="/treatments" className="hover:text-nordic">Treatments</Link>
          <span aria-hidden className="mx-2">/</span>
          <Link href="/treatments#conditions" className="hover:text-nordic">Conditions</Link>
        </nav>
      </div>

      {/* Answer first */}
      <header className="mx-auto max-w-[88rem] px-5 pb-16 pt-8 sm:px-8 md:pt-12">
        <h1 className="text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.95] tracking-[-0.02em]">
          {c.name}
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <h2 className="font-body text-[0.95rem] font-bold text-keppel md:col-span-2 md:pt-2">The short answer</h2>
          <p className="border-l-2 border-keppel pl-6 font-heading text-[clamp(1.35rem,2.5vw,1.95rem)] leading-[1.4] text-nordic md:col-span-9">
            {c.summary}
          </p>
        </div>
      </header>

      <div className="border-y border-nordic/10 bg-white/60">
        <div className="mx-auto grid max-w-[88rem] gap-14 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-24">
          <section className="md:col-span-7" aria-labelledby="approach">
            <h2 id="approach" className="text-[clamp(1.8rem,3.2vw,2.6rem)]">How we approach it at Swetaranya</h2>
            <div className="prose-swet mt-6">
              {paragraphs(c.approach).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
          <aside className="space-y-10 md:col-span-4 md:col-start-9">
            {c.whatToExpect && (
              <section aria-labelledby="expect">
                <h2 id="expect" className="text-[1.5rem]">What to expect</h2>
                <p className="mt-3 text-ink/80">{c.whatToExpect}</p>
              </section>
            )}
            {c.relatedTherapies.length > 0 && (
              <section aria-labelledby="therapies">
                <h2 id="therapies" className="text-[1.5rem]">Therapies often involved</h2>
                <ul className="mt-3">
                  {c.relatedTherapies.map((t) => (
                    <li key={t._id} className="border-t border-nordic/15">
                      <Link href={`/treatments/therapies/${t.slug}`} className="group flex items-baseline justify-between gap-4 py-3">
                        <span className="font-heading text-[1.2rem] text-nordic group-hover:text-keppel">{t.name}</span>
                        <span className="text-[0.82rem] text-ink/55">{t.category === "panchakarma" ? "Panchakarma" : "Therapy"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.88rem] text-ink/60">Your own plan may differ — it is decided in consultation.</p>
              </section>
            )}
          </aside>
        </div>
      </div>

      {c.faqs.length > 0 && (
        <section className="mx-auto grid max-w-[88rem] gap-10 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-24" aria-labelledby="faqs">
          <h2 id="faqs" className="text-[clamp(1.8rem,3.2vw,2.6rem)] md:col-span-4">Questions guests ask</h2>
          <div className="md:col-span-8">
            <FaqAccordion faqs={c.faqs} />
          </div>
        </section>
      )}

      <footer className="mx-auto max-w-[88rem] px-5 pb-20 sm:px-8">
        <SymbolDivider className="mb-14" />
        <div className="relative isolate grid gap-8 overflow-hidden rounded-soft bg-keppel/10 px-6 py-12 md:grid-cols-12 md:items-center md:px-12">
          <OrnamentPattern opacity={0.065} className="-z-10" />
          <p className="font-heading text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-nordic md:col-span-7">
            Every person is different. The honest next step is a conversation with the physician.
          </p>
          <div className="md:col-span-4 md:col-start-9">
            <PrimaryLink href={`/talk-to-the-physician?topic=${encodeURIComponent(c.name)}`}>Talk to the Physician</PrimaryLink>
          </div>
        </div>
        <p className="mt-12 max-w-3xl text-[0.88rem] text-ink/60">{MEDICAL_DISCLAIMER}</p>
      </footer>
    </article>
  );
}

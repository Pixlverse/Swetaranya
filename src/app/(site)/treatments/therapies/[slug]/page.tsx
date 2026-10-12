import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTherapy } from "@/lib/queries";
import { paragraphs } from "@/lib/markdown";
import { MediaImage } from "@/components/brand/MediaImage";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/treatments/therapies/[slug]">): Promise<Metadata> {
  const data = await getTherapy((await params).slug);
  if (!data) return {};
  return { title: `${data.therapy.name} — Ayurvedic therapy`, description: data.therapy.summary };
}

export default async function TherapyPage({ params }: PageProps<"/treatments/therapies/[slug]">) {
  const data = await getTherapy((await params).slug);
  if (!data) notFound();
  const { therapy: t, conditions } = data;

  return (
    <article>
      <div className="mx-auto max-w-[88rem] px-5 pt-10 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-[0.9rem] text-ink/60">
          <Link href="/treatments" className="hover:text-nordic">Treatments</Link>
          <span aria-hidden className="mx-2">/</span>
          <Link href="/treatments#therapies" className="hover:text-nordic">Therapies</Link>
        </nav>
      </div>

      <header className="mx-auto grid max-w-[88rem] gap-10 px-5 pb-12 pt-8 sm:px-8 md:grid-cols-12 md:pt-12">
        <div className="md:col-span-7">
          <p className="font-heading italic text-terracotta">{t.category === "panchakarma" ? "One of the five Panchakarma procedures" : "An individual Kerala therapy"}</p>
          <h1 className="mt-3 text-[clamp(2.5rem,5.94vw,5.05rem)] leading-[0.9] tracking-[-0.03em]">{t.name}</h1>
          <p className="mt-8 max-w-xl font-heading text-[clamp(1.35rem,2.4vw,1.8rem)] leading-snug text-nordic">{t.summary}</p>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <MediaImage image={t.image} label={`${t.name} being given at Swetaranya`} shape="arch" className="aspect-[3/4] w-full max-w-xs md:ml-auto" sizes="320px" priority />
        </div>
      </header>

      <div className="mx-auto grid max-w-[88rem] gap-12 border-t border-nordic/10 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-20">
        <dl className="space-y-6 md:col-span-3">
          <div>
            <dt className="text-[0.85rem] font-bold text-keppel">Duration</dt>
            <dd className="mt-1 text-ink/85">{t.duration}</dd>
          </div>
          <div>
            <dt className="text-[0.85rem] font-bold text-keppel">Who decides</dt>
            <dd className="mt-1 text-ink/85">The physician, after your consultation</dd>
          </div>
          {conditions.length > 0 && (
            <div>
              <dt className="text-[0.85rem] font-bold text-keppel">Often part of care for</dt>
              <dd className="mt-1">
                <ul className="space-y-1">
                  {conditions.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/treatments/conditions/${c.slug}`} className="text-nordic underline decoration-keppel underline-offset-4">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
        <div className="prose-swet md:col-span-7 md:col-start-5">
          {paragraphs(t.description).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <footer className="mx-auto max-w-[88rem] px-5 pb-20 sm:px-8">
        <div className="flex flex-col gap-6 border-t border-nordic/10 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[0.88rem] text-ink/60">{MEDICAL_DISCLAIMER}</p>
          <div className="flex flex-wrap items-center gap-6">
            <TextLink href="/treatments#therapies">All therapies</TextLink>
            <PrimaryLink href="/talk-to-the-physician">Ask whether it suits you</PrimaryLink>
          </div>
        </div>
      </footer>
    </article>
  );
}

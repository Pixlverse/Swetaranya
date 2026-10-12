import type { Metadata } from "next";
import { getEbooks } from "@/lib/queries";
import { BookCover } from "@/components/ebooks/BookCover";
import { EbookDownload } from "@/components/ebooks/EbookDownload";
import { TextLink } from "@/components/site/Buttons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Guides to take home",
  description: "Free guides from Swetaranya on daily routine, food and living Ayurveda — written for guests before and after their stay.",
};

export default async function EbooksPage() {
  const ebooks = await getEbooks();

  return (
    <div className="mx-auto max-w-[88rem] px-5 pb-24 pt-10 sm:px-8 md:pt-16">
      <header className="grid gap-8 md:grid-cols-12">
        <h1 className="text-[clamp(2.2rem,4.43vw,3.8rem)] leading-[0.95] tracking-[-0.02em] md:col-span-7">Guides to take home</h1>
        <p className="self-end text-[1.05rem] text-ink/75 md:col-span-4 md:col-start-9">
          Short, practical guides written in the house — the things guests most often ask us to write down before they leave.
        </p>
      </header>

      {ebooks.length === 0 ? (
        <p className="mt-16 max-w-lg text-[1.05rem] text-ink/70">The first guides are being written. Please check back soon.</p>
      ) : (
        <ul className="mt-16 space-y-20 md:mt-20">
          {ebooks.map((b, i) => (
            <li key={b._id} className="grid items-center gap-10 border-t border-nordic/15 pt-14 md:grid-cols-12 md:gap-14">
              <div className={`md:col-span-4 ${i % 2 ? "md:order-2 md:col-start-9" : ""}`}>
                <BookCover title={b.title} subtitle={b.subtitle} cover={b.cover} className="mx-auto w-full max-w-[17rem]" />
              </div>
              <div className={`md:col-span-7 ${i % 2 ? "md:order-1" : "md:col-start-6"}`}>
                <h2 className="text-[clamp(1.8rem,3.07vw,2.3rem)]">{b.title}</h2>
                {b.subtitle && <p className="mt-2 font-heading text-[1.25rem] italic text-keppel">{b.subtitle}</p>}
                {b.description && <p className="mt-5 max-w-xl text-[1.05rem] text-ink/80">{b.description}</p>}
                {b.contents.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-body text-[0.95rem] font-bold text-nordic">Inside</h3>
                    <ul className="mt-2 space-y-1.5">
                      {b.contents.map((c) => (
                        <li key={c} className="flex gap-3 text-ink/80">
                          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-keppel" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {b.pages ? <p className="mt-4 text-[0.9rem] text-ink/55">{b.pages} pages, PDF</p> : null}
                <div className="mt-8 max-w-xl">
                  <EbookDownload slug={b.slug} title={b.title} requiresEmail={b.requiresEmail} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-24 border-t border-nordic/15 pt-10">
        <p className="max-w-xl font-heading text-[1.6rem] leading-snug text-nordic">Looking for something more personal?</p>
        <TextLink href="/talk-to-the-physician" className="mt-4 inline-block">
          Ask the physician directly
        </TextLink>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getJournalPosts } from "@/lib/queries";
import { JournalRows, formatDate } from "@/components/journal/JournalRows";
import { JOURNAL_CATEGORIES, journalCategoryLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Journal",
  description: "Writing from Swetaranya on living Ayurveda, understanding it, treatment, food and daily routine, and staying with us.",
};

export default async function JournalPage({ searchParams }: PageProps<"/journal">) {
  const { category: raw } = await searchParams;
  const category = JOURNAL_CATEGORIES.some((c) => c.slug === raw) ? (raw as string) : undefined;
  const posts = await getJournalPosts({ category });
  const [lead, ...rest] = posts;

  return (
    <div className="mx-auto max-w-[88rem] px-5 pb-24 pt-14 sm:px-8 md:pt-20">
      <header className="grid gap-8 md:grid-cols-12">
        <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.025em] md:col-span-6">The Journal</h1>
        <p className="self-end text-[1.05rem] text-ink/75 md:col-span-5 md:col-start-8">
          Notes from the house and the consulting room — written by Dr. Thrivikraman and the family, for guests before and after their stay.
        </p>
      </header>

      <nav aria-label="Journal categories" className="mt-12 border-y border-nordic/15 py-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
          <li>
            <Link href="/journal" aria-current={!category ? "page" : undefined} className="text-ink/65 hover:text-nordic aria-[current=page]:font-bold aria-[current=page]:text-nordic aria-[current=page]:underline aria-[current=page]:decoration-keppel aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8">
              Everything
            </Link>
          </li>
          {JOURNAL_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/journal?category=${c.slug}`}
                aria-current={category === c.slug ? "page" : undefined}
                className="text-ink/65 hover:text-nordic aria-[current=page]:font-bold aria-[current=page]:text-nordic aria-[current=page]:underline aria-[current=page]:decoration-keppel aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!lead ? (
        <p className="mt-16 max-w-lg text-[1.05rem] text-ink/70">
          Nothing in {category ? journalCategoryLabel(category) : "the Journal"} yet. New writing is added through the seasons.
        </p>
      ) : (
        <>
          <article className="grid gap-6 py-16 md:grid-cols-12 md:py-20">
            <p className="text-[0.9rem] font-bold text-terracotta md:col-span-3">{journalCategoryLabel(lead.category)}</p>
            <div className="md:col-span-8">
              <h2 className="text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02]">
                <Link href={`/journal/${lead.slug}`} className="transition-colors hover:text-keppel">
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-5 max-w-2xl text-[1.1rem] text-ink/75">{lead.excerpt}</p>
              <p className="mt-5 text-[0.9rem] text-ink/55">
                {lead.author} — <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
              </p>
            </div>
          </article>
          {rest.length > 0 && <JournalRows posts={rest} />}
        </>
      )}
    </div>
  );
}

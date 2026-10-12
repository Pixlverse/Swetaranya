import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournalPost, getJournalPosts } from "@/lib/queries";
import { Markdown } from "@/lib/markdown";
import { formatDate } from "@/components/journal/JournalRows";
import { SymbolDivider } from "@/components/brand/SymbolDivider";
import { TextLink } from "@/components/site/Buttons";
import { journalCategoryLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const p = await getJournalPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { type: "article", publishedTime: p.publishedAt, authors: [p.author] } };
}

export default async function JournalPostPage({ params }: PageProps<"/journal/[slug]">) {
  const post = await getJournalPost((await params).slug);
  if (!post) notFound();
  const related = (await getJournalPosts({ category: post.category, limit: 4 })).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="px-5 pb-24 pt-12 sm:px-8 md:pt-16">
      <header className="mx-auto max-w-3xl">
        <Link href={`/journal?category=${post.category}`} className="inline-flex items-center gap-2 text-[0.9rem] font-bold text-terracotta hover:text-clay">
          <span aria-hidden className="h-2 w-2 rotate-45 bg-terracotta" />
          {journalCategoryLabel(post.category)}
        </Link>
        <h1 className="mt-5 text-[clamp(2rem,4.04vw,3.1rem)] leading-[1.02] tracking-[-0.02em]">{post.title}</h1>
        {post.excerpt && <p className="mt-6 font-heading text-[1.35rem] italic leading-snug text-nordic/80">{post.excerpt}</p>}
        <p className="mt-8 border-t border-nordic/15 pt-4 text-[0.92rem] text-ink/60">
          {post.author} — <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        <Markdown text={post.body} />
        {post.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t} className="border border-nordic/20 px-2.5 py-1 text-[0.82rem] text-ink/70">{t}</li>
            ))}
          </ul>
        )}
      </div>

      <footer className="mx-auto mt-20 max-w-3xl">
        <SymbolDivider />
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-body text-[0.95rem] font-bold text-keppel">More in {journalCategoryLabel(post.category)}</h2>
            <ul className="mt-4">
              {related.map((r) => (
                <li key={r._id} className="border-b border-nordic/15">
                  <Link href={`/journal/${r.slug}`} className="block py-4 font-heading text-[1.4rem] text-nordic hover:text-keppel">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <TextLink href="/journal" className="mt-10 inline-block">Back to the Journal</TextLink>
      </footer>
    </article>
  );
}

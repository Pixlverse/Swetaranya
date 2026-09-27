import Link from "next/link";
import { journalCategoryLabel } from "@/lib/constants";
import type { JournalPostView } from "@/lib/queries";

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** Journal entries read like a table of contents — rows, not cards. */
export function JournalRows({ posts, className = "" }: { posts: Omit<JournalPostView, "body">[]; className?: string }) {
  return (
    <ul className={`border-t border-nordic/15 ${className}`}>
      {posts.map((p) => (
        <li key={p._id} className="border-b border-nordic/15">
          <Link href={`/journal/${p.slug}`} className="group grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-6">
            <span className="text-[0.85rem] font-bold text-terracotta md:col-span-3">{journalCategoryLabel(p.category)}</span>
            <span className="md:col-span-7">
              <span className="block font-heading text-[1.55rem] leading-tight text-nordic transition-colors group-hover:text-keppel md:text-[1.8rem]">
                {p.title}
              </span>
              {p.excerpt && <span className="mt-2 block max-w-2xl text-[0.97rem] text-ink/70">{p.excerpt}</span>}
            </span>
            <time dateTime={p.publishedAt} className="text-[0.85rem] text-ink/55 md:col-span-2 md:text-right">
              {formatDate(p.publishedAt)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { JournalPost } from "@/models";
import { JOURNAL_CATEGORIES, journalCategoryLabel } from "@/lib/constants";
import { Badge, ButtonLink, EmptyState, PageHeader, Table } from "@/components/admin/ui";
import { fmtDate } from "@/components/admin/format";

export const metadata = { title: "Journal" };

export default async function JournalAdminPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  await requireAdmin();
  const { category } = await searchParams;
  const valid = JOURNAL_CATEGORIES.some((c) => c.slug === category);
  await connectDB();
  const rows = await JournalPost.find(valid ? { category } : {})
    .sort({ publishedAt: -1 })
    .select("title slug category author publishedAt published")
    .lean();
  const now = new Date();
  return (
    <>
      <PageHeader title="Journal" description="Posts across the five fixed categories." actions={<ButtonLink href="/admin/journal/new">New post</ButtonLink>} />
      <nav aria-label="Categories" className="mb-4 flex flex-wrap gap-1 text-sm">
        {[{ slug: "", label: "All" }, ...JOURNAL_CATEGORIES].map((c) => {
          const active = (valid ? category : "") === c.slug;
          return (
            <Link
              key={c.slug || "all"}
              href={c.slug ? `/admin/journal?category=${c.slug}` : "/admin/journal"}
              aria-current={active ? "page" : undefined}
              className={`rounded-hair px-3 py-1.5 ${active ? "bg-nordic font-bold text-cream" : "text-nordic hover:bg-nordic/10"}`}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>
      {rows.length === 0 ? (
        <EmptyState>No posts here yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Publish date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id.toString()}>
                <td>
                  <Link href={`/admin/journal/${p._id.toString()}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                    {p.title}
                  </Link>
                  <div className="text-xs text-ink/60">/{p.slug}</div>
                </td>
                <td>{journalCategoryLabel(p.category)}</td>
                <td>{p.author}</td>
                <td className="whitespace-nowrap">{fmtDate(p.publishedAt)}</td>
                <td>
                  {!p.published ? (
                    <Badge>Draft</Badge>
                  ) : p.publishedAt && p.publishedAt > now ? (
                    <Badge tone="info">Scheduled</Badge>
                  ) : (
                    <Badge tone="success">Published</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Ebook, EbookDownload } from "@/models";
import { Badge, ButtonLink, EmptyState, PageHeader, Table } from "@/components/admin/ui";
import { fmtDate } from "@/components/admin/format";

export const metadata = { title: "E-books" };

export default async function EbooksPage() {
  await requireAdmin();
  await connectDB();
  const [rows, leads] = await Promise.all([
    Ebook.find().sort({ order: 1, title: 1 }).select("title slug subtitle requiresEmail published order downloadCount fileUrl updatedAt").lean(),
    EbookDownload.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: "$ebookId", count: { $sum: 1 } } }]),
  ]);
  const leadCount = new Map(leads.map((l) => [String(l._id), l.count]));
  return (
    <>
      <PageHeader
        title="E-books"
        description="Downloadable guides for the E-books page."
        actions={
          <>
            <ButtonLink variant="secondary" href="/admin/ebooks/downloads">
              Downloads
            </ButtonLink>
            <ButtonLink href="/admin/ebooks/new">New e-book</ButtonLink>
          </>
        }
      />
      {rows.length === 0 ? (
        <EmptyState>No e-books yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Email required</th>
              <th>Downloads</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const id = e._id.toString();
              const count = leadCount.get(id) ?? 0;
              return (
                <tr key={id}>
                  <td className="tabular-nums">{e.order}</td>
                  <td>
                    <Link href={`/admin/ebooks/${id}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                      {e.title}
                    </Link>
                    <div className="text-xs text-ink/60">
                      {e.subtitle || `/${e.slug}`}
                      {e.fileUrl ? "" : ", no file yet"}
                    </div>
                  </td>
                  <td>{e.requiresEmail ? "Yes" : "No"}</td>
                  <td className="tabular-nums">
                    <Link href={`/admin/ebooks/downloads?ebook=${id}`} className="text-nordic underline decoration-keppel underline-offset-4">
                      {count} with details
                    </Link>
                    {(e.downloadCount ?? 0) !== count && <div className="text-xs text-ink/60">{e.downloadCount ?? 0} total downloads</div>}
                  </td>
                  <td>{e.published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}</td>
                  <td className="whitespace-nowrap">{fmtDate(e.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}

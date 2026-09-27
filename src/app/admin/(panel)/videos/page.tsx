import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { VIDEO_CATEGORIES, Video } from "@/models";
import { Badge, ButtonLink, EmptyState, PageHeader, Table } from "@/components/admin/ui";
import { fmtDate } from "@/components/admin/format";

export const metadata = { title: "Videos" };

export default async function VideosPage() {
  await requireAdmin();
  await connectDB();
  const rows = await Video.find().sort({ order: 1, title: 1 }).select("title slug category featured published order chapters url updatedAt").lean();
  const label = new Map<string, string>(VIDEO_CATEGORIES.map((c) => [c.slug, c.label]));
  return (
    <>
      <PageHeader
        title="Videos"
        description="Films for the Experience page. One featured video leads the page with its chapters."
        actions={
          <>
            <ButtonLink variant="secondary" href="/experience" target="_blank">
              View on site
            </ButtonLink>
            <ButtonLink href="/admin/videos/new">New video</ButtonLink>
          </>
        }
      />
      {rows.length === 0 ? (
        <EmptyState>No videos yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v._id.toString()}>
                <td className="tabular-nums">{v.order}</td>
                <td>
                  <Link href={`/admin/videos/${v._id.toString()}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                    {v.title}
                  </Link>
                  <div className="text-xs text-ink/60">
                    {v.chapters.length} chapter{v.chapters.length === 1 ? "" : "s"}
                    {v.url ? "" : ", no video URL yet"}
                  </div>
                </td>
                <td>{label.get(v.category) ?? v.category}</td>
                <td>{v.featured ? <Badge tone="info">Featured</Badge> : <span className="text-ink/50">—</span>}</td>
                <td>{v.published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}</td>
                <td className="whitespace-nowrap">{fmtDate(v.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Therapy } from "@/models";
import { Badge, ButtonLink, EmptyState, PageHeader, Table } from "@/components/admin/ui";
import { fmtDate } from "@/components/admin/format";

export const metadata = { title: "Therapies" };

export default async function TherapiesPage() {
  await requireAdmin();
  await connectDB();
  const rows = await Therapy.find().sort({ category: 1, order: 1, name: 1 }).select("name malayalamName slug category duration published order updatedAt").lean();
  return (
    <>
      <PageHeader title="Therapies" description="Panchakarma and individual therapies, one public page each." actions={<ButtonLink href="/admin/therapies/new">New therapy</ButtonLink>} />
      {rows.length === 0 ? (
        <EmptyState>No therapies yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t._id.toString()}>
                <td className="tabular-nums">{t.order}</td>
                <td>
                  <Link href={`/admin/therapies/${t._id.toString()}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                    {t.name}
                  </Link>
                  <div className="text-xs text-ink/60">
                    {t.malayalamName ? `${t.malayalamName}, ` : ""}/{t.slug}
                  </div>
                </td>
                <td>{t.category === "panchakarma" ? "Panchakarma" : "Individual"}</td>
                <td>{t.duration}</td>
                <td>{t.published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}</td>
                <td className="whitespace-nowrap">{fmtDate(t.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Condition } from "@/models";
import { Badge, ButtonLink, EmptyState, PageHeader, Table } from "@/components/admin/ui";
import { fmtDate } from "@/components/admin/format";

export const metadata = { title: "Conditions" };

export default async function ConditionsPage() {
  await requireAdmin();
  await connectDB();
  const rows = await Condition.find().sort({ order: 1, name: 1 }).select("name slug published faqs relatedTherapies order updatedAt").lean();
  return (
    <>
      <PageHeader title="Conditions" description="Answer-first condition pages under Treatments." actions={<ButtonLink href="/admin/conditions/new">New condition</ButtonLink>} />
      {rows.length === 0 ? (
        <EmptyState>No conditions yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>FAQs</th>
              <th>Therapies</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c._id.toString()}>
                <td className="tabular-nums">{c.order}</td>
                <td>
                  <Link href={`/admin/conditions/${c._id.toString()}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                    {c.name}
                  </Link>
                  <div className="text-xs text-ink/60">/{c.slug}</div>
                </td>
                <td className="tabular-nums">{c.faqs.length}</td>
                <td className="tabular-nums">{c.relatedTherapies.length}</td>
                <td>{c.published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}</td>
                <td className="whitespace-nowrap">{fmtDate(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Testimonial } from "@/models";
import { Badge, ButtonLink, EmptyState, PageHeader, Table } from "@/components/admin/ui";
import { fmtDate } from "@/components/admin/format";
import { ActionButton } from "@/components/admin/actions";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  await requireAdmin();
  await connectDB();
  const rows = await Testimonial.find().sort({ isPlaceholder: 1, createdAt: -1 }).lean();
  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Only real guests, only with recorded consent. A testimonial cannot be published without consent, and withdrawing consent unpublishes it."
        actions={<ButtonLink href="/admin/testimonials/new">New testimonial</ButtonLink>}
      />
      {rows.length === 0 ? (
        <EmptyState>No testimonials yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Quote</th>
              <th>Consent</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const id = t._id.toString();
              const publishBlocked = t.isPlaceholder ? "Placeholders cannot be published" : !t.consentGiven ? "Record consent first" : undefined;
              return (
                <tr key={id}>
                  <td>
                    <Link href={`/admin/testimonials/${id}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                      {t.patientName}
                    </Link>
                    <div className="text-xs text-ink/60">
                      {t.country}
                      {t.condition ? `, ${t.condition}` : ""}
                    </div>
                    {t.isPlaceholder && (
                      <div className="mt-1">
                        <Badge tone="warning">Placeholder</Badge>
                      </div>
                    )}
                  </td>
                  <td className="max-w-md">
                    <p className="line-clamp-3 text-ink/80">{t.quote}</p>
                  </td>
                  <td>
                    <div className="flex flex-col items-start gap-1">
                      {t.consentGiven ? <Badge tone="success">Given</Badge> : <Badge tone="danger">Not recorded</Badge>}
                      {t.consentGiven && t.consentRecordedAt && <span className="text-xs text-ink/60">{fmtDate(t.consentRecordedAt)}</span>}
                      <ActionButton
                        url={`/api/admin/testimonials/${id}`}
                        method="PATCH"
                        body={{ consentGiven: !t.consentGiven }}
                        label={t.consentGiven ? "Withdraw consent" : "Record consent"}
                        variant="ghost"
                        confirm={
                          t.consentGiven
                            ? "Withdraw consent? The testimonial will be unpublished immediately."
                            : "Confirm you hold the patient's written consent to publish this story."
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col items-start gap-1">
                      {t.published ? <Badge tone="success">Live</Badge> : <Badge>Hidden</Badge>}
                      <ActionButton
                        url={`/api/admin/testimonials/${id}`}
                        method="PATCH"
                        body={{ published: !t.published }}
                        label={t.published ? "Unpublish" : "Publish"}
                        variant="ghost"
                        disabled={!t.published && Boolean(publishBlocked)}
                        title={!t.published ? publishBlocked : undefined}
                      />
                      {!t.published && publishBlocked && <span className="text-xs text-ink/60">{publishBlocked}</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}

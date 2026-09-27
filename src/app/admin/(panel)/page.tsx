import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AvailabilitySlot, ConsultationBooking, EbookDownload, Enquiry, LifestyleCheckResult, QuizSubmission } from "@/models";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { Badge, EmptyState, Notice, PageHeader, Panel, Table } from "@/components/admin/ui";
import { ADMIN_TZ_LABEL, doshaResult, fmtDateTime, modeLabel, statusLabel } from "@/components/admin/format";

export const metadata = { title: "Dashboard" };

type Populated = {
  _id: { toString(): string };
  timezone: string;
  slotId: { startTime: Date; mode: string } | null;
  enquiryId: { _id: { toString(): string }; name: string; email: string; country: string } | null;
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  await requireAdmin();
  const { denied } = await searchParams;
  await connectDB();

  const now = new Date();
  const since = new Date(now.getTime() - 30 * 86_400_000);
  const [bySource, byStatus, total, last30, upcomingSlotIds, recentChecks, recentConstitution, ebookDownloads30] = await Promise.all([
    Enquiry.aggregate<{ _id: string | null; count: number }>([
      { $group: { _id: { $ifNull: ["$utmSource", null] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Enquiry.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ createdAt: { $gte: since } }),
    AvailabilitySlot.find({ startTime: { $gte: now }, isBooked: true }).select("_id").lean(),
    LifestyleCheckResult.find().sort({ createdAt: -1 }).limit(8).lean(),
    QuizSubmission.find({ quiz: "dosha" }).sort({ createdAt: -1 }).limit(8).select("result contactEmail followUpRequested followedUp createdAt").lean(),
    EbookDownload.countDocuments({ createdAt: { $gte: since } }),
  ]);

  const upcoming = (await ConsultationBooking.find({ slotId: { $in: upcomingSlotIds.map((s) => s._id) }, cancelled: false })
    .populate("slotId", "startTime mode")
    .populate("enquiryId", "name email country")
    .lean()) as unknown as Populated[];
  upcoming.sort((a, b) => (a.slotId?.startTime.getTime() ?? 0) - (b.slotId?.startTime.getTime() ?? 0));

  // Merge null and empty-string sources into one "direct/unknown" bucket.
  const sources = new Map<string, number>();
  for (const s of bySource) {
    const key = s._id ? s._id : "direct/unknown";
    sources.set(key, (sources.get(key) ?? 0) + s.count);
  }
  const statusCounts = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));

  return (
    <>
      <PageHeader title="Dashboard" description={`All times are shown in ${ADMIN_TZ_LABEL}.`} />
      {denied && (
        <div className="mb-6">
          <Notice tone="warning">That section is restricted to another role.</Notice>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <Stat label="Enquiries, all time" value={total} />
        <Stat label="Enquiries, last 30 days" value={last30} />
        <Stat label="New, not yet contacted" value={statusCounts.new ?? 0} href="/admin/enquiries?status=new" />
        <Stat label="Upcoming consultations" value={upcoming.length} href="/admin/consultations" />
        <Stat label="E-book downloads, last 30 days" value={ebookDownloads30} href="/admin/ebooks/downloads" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Enquiries by source">
          {sources.size === 0 ? (
            <EmptyState>No enquiries yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-nordic/10 text-sm">
              {[...sources].map(([source, count]) => (
                <li key={source} className="flex items-center justify-between gap-3 py-2">
                  <Link
                    href={`/admin/enquiries?source=${encodeURIComponent(source === "direct/unknown" ? "direct" : source)}`}
                    className="text-nordic underline decoration-keppel underline-offset-4 hover:decoration-2"
                  >
                    {source}
                  </Link>
                  <span className="font-bold tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Enquiries by status">
          <ul className="divide-y divide-nordic/10 text-sm">
            {ENQUIRY_STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between gap-3 py-2">
                <Link href={`/admin/enquiries?status=${s}`} className="text-nordic underline decoration-keppel underline-offset-4 hover:decoration-2">
                  {statusLabel(s)}
                </Link>
                <span className="font-bold tabular-nums">{statusCounts[s] ?? 0}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming consultations" className="xl:col-span-2">
          {upcoming.length === 0 ? (
            <EmptyState>No upcoming consultations booked.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>When (IST)</th>
                  <th>Guest</th>
                  <th>Mode</th>
                  <th>Guest time zone</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.slice(0, 10).map((b) => (
                  <tr key={b._id.toString()}>
                    <td className="whitespace-nowrap">{fmtDateTime(b.slotId?.startTime)}</td>
                    <td>
                      {b.enquiryId ? (
                        <Link href={`/admin/enquiries/${b.enquiryId._id.toString()}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                          {b.enquiryId.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                      <div className="text-xs text-ink/60">{b.enquiryId?.country}</div>
                    </td>
                    <td>{b.slotId ? modeLabel(b.slotId.mode) : "—"}</td>
                    <td>{b.timezone}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>

        <Panel
          title="Recent Lifestyle Check submissions"
          actions={
            <Link href="/admin/lifestyle" className="text-sm font-bold text-nordic underline decoration-keppel underline-offset-4">
              View all
            </Link>
          }
        >
          {recentChecks.length === 0 ? (
            <EmptyState>No submissions yet.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Submitted (IST)</th>
                  <th>Overall</th>
                  <th>Contact</th>
                  <th>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {recentChecks.map((r) => (
                  <tr key={r._id.toString()}>
                    <td className="whitespace-nowrap">{fmtDateTime(r.createdAt)}</td>
                    <td className="tabular-nums">{r.overallPercentage ?? "—"}%</td>
                    <td>{r.contactEmail ?? <span className="text-ink/50">none given</span>}</td>
                    <td>
                      {r.followedUp ? (
                        <Badge tone="success">Followed up</Badge>
                      ) : r.followUpRequested ? (
                        <Badge tone="warning">Requested</Badge>
                      ) : (
                        <span className="text-ink/50">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>

        <Panel
          title="Recent constitution checks"
          actions={
            <Link href="/admin/constitution" className="text-sm font-bold text-nordic underline decoration-keppel underline-offset-4">
              View all
            </Link>
          }
        >
          {recentConstitution.length === 0 ? (
            <EmptyState>No submissions yet.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Submitted (IST)</th>
                  <th>Leaning</th>
                  <th>Contact</th>
                  <th>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {recentConstitution.map((r) => {
                  const res = doshaResult(r.result);
                  const pct = res.dominant ? res[res.dominant as "vata" | "pitta" | "kapha"] : undefined;
                  return (
                    <tr key={r._id.toString()}>
                      <td className="whitespace-nowrap">{fmtDateTime(r.createdAt)}</td>
                      <td className="capitalize">
                        {res.dominant ?? "—"}
                        {pct !== undefined && <span className="tabular-nums text-ink/60"> {pct}%</span>}
                      </td>
                      <td>{r.contactEmail ?? <span className="text-ink/50">none given</span>}</td>
                      <td>
                        {r.followedUp ? (
                          <Badge tone="success">Followed up</Badge>
                        ) : r.followUpRequested ? (
                          <Badge tone="warning">Requested</Badge>
                        ) : (
                          <span className="text-ink/50">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Panel>
      </div>
    </>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <>
      <p className="text-sm text-ink/70">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-nordic">{value}</p>
    </>
  );
  const cls = "block rounded-soft border border-nordic/10 bg-white p-4";
  return href ? (
    <Link href={href} className={`${cls} transition-colors hover:border-keppel`}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ConsultationBooking, Enquiry, MedicalReportUpload } from "@/models";
import { objectIdSchema } from "@/lib/validation/admin";
import { privateStorageConfigured } from "@/lib/spaces";
import { Badge, EmptyState, Notice, PageHeader, Panel, buttonClass } from "@/components/admin/ui";
import { fmtDate, fmtDateTime, modeLabel, statusLabel, statusTone } from "@/components/admin/format";
import { EnquiryUpdateForm } from "@/components/admin/EnquiryUpdateForm";
import { ReportViewButton } from "@/components/admin/ReportViewButton";

export const metadata = { title: "Enquiry" };

type BookingRow = { _id: { toString(): string }; timezone: string; cancelled: boolean; slotId: { startTime: Date; mode: string } | null };

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;
  if (!objectIdSchema.safeParse(id).success) notFound();
  await connectDB();

  const enquiry = await Enquiry.findById(id).lean();
  if (!enquiry) notFound();

  const isPhysician = session.user.role === "physician";
  // PHI: only query report metadata at all when the viewer is the physician.
  const reports = isPhysician
    ? await MedicalReportUpload.find({ enquiryId: id, status: "uploaded" })
        .select("+originalName fileType sizeBytes uploadedAt retentionExpiresAt")
        .sort({ uploadedAt: -1 })
        .lean()
    : [];
  const bookings = (await ConsultationBooking.find({ enquiryId: id })
    .populate("slotId", "startTime mode")
    .sort({ createdAt: -1 })
    .lean()) as unknown as BookingRow[];

  const rows: [string, React.ReactNode][] = [
    ["Name", enquiry.name],
    ...(enquiry.enquiringForSomeoneElse
      ? ([
          ["Enquiring for", enquiry.patientName || "—"],
          ["Relationship", enquiry.relationship || "—"],
        ] as [string, React.ReactNode][])
      : []),
    ["Country", enquiry.country],
    [
      "WhatsApp",
      <a key="wa" href={`https://wa.me/${enquiry.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="text-nordic underline decoration-keppel underline-offset-4">
        {enquiry.whatsapp}
      </a>,
    ],
    [
      "Email",
      <a key="em" href={`mailto:${enquiry.email}`} className="text-nordic underline decoration-keppel underline-offset-4">
        {enquiry.email}
      </a>,
    ],
    ["Needs help with", enquiry.helpWith],
    ["Consultation", modeLabel(enquiry.consultationMode)],
    ["Type", statusLabel(enquiry.type)],
    ["Received", `${fmtDateTime(enquiry.createdAt)} IST`],
    ["Confirmation email", enquiry.confirmationSent ? "Sent" : "Not sent"],
  ];
  const attribution: [string, string | undefined | null][] = [
    ["Source", enquiry.utmSource || "direct/unknown"],
    ["Medium", enquiry.utmMedium],
    ["Campaign", enquiry.utmCampaign],
    ["Term", enquiry.utmTerm],
    ["Content", enquiry.utmContent],
    ["Landing page", enquiry.landingPage],
    ["Referrer", enquiry.referrer],
  ];

  return (
    <>
      <PageHeader
        title={enquiry.name}
        description={
          <span className="inline-flex items-center gap-2">
            <Badge tone={statusTone[enquiry.status] ?? "neutral"}>{statusLabel(enquiry.status)}</Badge>
            <span>Received {fmtDate(enquiry.createdAt)}</span>
          </span>
        }
        actions={
          <Link href="/admin/enquiries" className={buttonClass.secondary}>
            Back to enquiries
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <Panel title="Details">
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-bold text-nordic/80">{k}</dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Message">
            {enquiry.message ? <p className="whitespace-pre-wrap text-sm">{enquiry.message}</p> : <p className="text-sm text-ink/60">No message.</p>}
          </Panel>

          <Panel title="Medical reports">
            {!isPhysician ? (
              <Notice tone="info">Medical reports are restricted to the physician role.</Notice>
            ) : reports.length === 0 ? (
              <EmptyState>No reports uploaded for this enquiry.</EmptyState>
            ) : (
              <>
                {!privateStorageConfigured() && (
                  <div className="mb-3">
                    <Notice tone="warning">Private storage is not configured in this environment, so reports cannot be opened here.</Notice>
                  </div>
                )}
                <ul className="divide-y divide-nordic/10 text-sm">
                  {reports.map((r) => (
                    <li key={r._id.toString()} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-bold">{r.originalName || "Report"}</p>
                        <p className="text-xs text-ink/60">
                          {r.fileType}
                          {r.sizeBytes ? `, ${(r.sizeBytes / 1024 / 1024).toFixed(1)} MB` : ""}. Uploaded {fmtDateTime(r.uploadedAt)} IST. Kept until{" "}
                          {fmtDate(r.retentionExpiresAt)}.
                        </p>
                      </div>
                      <ReportViewButton reportId={r._id.toString()} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>

          <Panel title="Consultations">
            {bookings.length === 0 ? (
              <EmptyState>No consultation booked yet.</EmptyState>
            ) : (
              <ul className="divide-y divide-nordic/10 text-sm">
                {bookings.map((b) => (
                  <li key={b._id.toString()} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span>
                      {b.slotId ? `${fmtDateTime(b.slotId.startTime)} IST, ${modeLabel(b.slotId.mode)}` : "Slot removed"}
                      <span className="text-ink/60"> (guest time zone {b.timezone})</span>
                    </span>
                    {b.cancelled ? <Badge tone="danger">Cancelled</Badge> : <Badge tone="success">Booked</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Status and notes">
            <EnquiryUpdateForm id={id} status={enquiry.status} internalNotes={enquiry.internalNotes ?? ""} />
          </Panel>
          <Panel title="Attribution">
            <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2 text-sm">
              {attribution.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-bold text-nordic/80">{k}</dt>
                  <dd className="break-all">{v || <span className="text-ink/50">—</span>}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
}

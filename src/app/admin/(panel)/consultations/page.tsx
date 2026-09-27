import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AdminUser, AvailabilitySlot, ConsultationBooking } from "@/models";
import { Badge, EmptyState, PageHeader, Panel, Table } from "@/components/admin/ui";
import { ADMIN_TZ_LABEL, fmtDateTime, fmtDay, fmtTime, istDateInput, modeLabel } from "@/components/admin/format";
import { SlotCreator } from "@/components/admin/SlotCreator";
import { CancelBookingButton } from "@/components/admin/CancelBookingButton";
import { ActionButton } from "@/components/admin/actions";

export const metadata = { title: "Consultations" };

type BookingRow = {
  _id: { toString(): string };
  timezone: string;
  cancelled: boolean;
  confirmationSent: boolean;
  slotId: { _id: { toString(): string }; startTime: Date; endTime: Date; mode: string } | null;
  enquiryId: { _id: { toString(): string }; name: string; email: string; whatsapp: string } | null;
};

const VIEWS = { upcoming: "Upcoming", past: "Past", cancelled: "Cancelled" } as const;
type View = keyof typeof VIEWS;

export default async function ConsultationsPage({ searchParams }: { searchParams: Promise<{ view?: string; past?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const view: View = sp.view && sp.view in VIEWS ? (sp.view as View) : "upcoming";
  await connectDB();
  const now = new Date();

  const [physicians, slots, bookingsRaw] = await Promise.all([
    AdminUser.find({ role: "physician", active: true }).select("name").sort({ name: 1 }).lean(),
    AvailabilitySlot.find({ endTime: { $gte: now } }).sort({ startTime: 1 }).limit(400).lean(),
    ConsultationBooking.find(view === "cancelled" ? { cancelled: true } : { cancelled: false })
      .populate("slotId", "startTime endTime mode")
      .populate("enquiryId", "name email whatsapp")
      .sort({ createdAt: -1 })
      .limit(300)
      .lean(),
  ]);

  const bookings = (bookingsRaw as unknown as BookingRow[])
    .filter((b) => {
      if (view === "cancelled") return true;
      const start = b.slotId?.startTime;
      return view === "upcoming" ? !start || start >= now : Boolean(start && start < now);
    })
    .sort((a, b) => {
      const d = (a.slotId?.startTime.getTime() ?? 0) - (b.slotId?.startTime.getTime() ?? 0);
      return view === "upcoming" ? d : -d;
    });

  const physicianName = new Map(physicians.map((p) => [p._id.toString(), p.name]));
  const byDay = new Map<string, typeof slots>();
  for (const s of slots) {
    const day = fmtDay(s.startTime);
    byDay.set(day, [...(byDay.get(day) ?? []), s]);
  }

  return (
    <>
      <PageHeader
        title="Consultations"
        description={`Slots are entered and shown in ${ADMIN_TZ_LABEL}. Guests see them converted to their own time zone.`}
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Panel title="Add availability">
          <SlotCreator physicians={physicians.map((p) => ({ id: p._id.toString(), name: p.name }))} today={istDateInput()} />
        </Panel>

        <Panel title={`Open and booked slots (${slots.length})`}>
          {slots.length === 0 ? (
            <EmptyState>No upcoming slots. Add some so guests can book.</EmptyState>
          ) : (
            <div className="max-h-[36rem] space-y-4 overflow-y-auto pr-1">
              {[...byDay].map(([day, daySlots]) => (
                <div key={day}>
                  <h3 className="sticky top-0 bg-white py-1 text-sm text-nordic">{day}</h3>
                  <ul className="divide-y divide-nordic/10 text-sm">
                    {daySlots.map((s) => (
                      <li key={s._id.toString()} className="flex flex-wrap items-center justify-between gap-2 py-2">
                        <span className="tabular-nums">
                          {fmtTime(s.startTime)}–{fmtTime(s.endTime)} IST
                          <span className="ml-2 text-ink/60">{modeLabel(s.mode)}</span>
                          {physicians.length > 1 && <span className="ml-2 text-ink/60">{physicianName.get(s.physicianId.toString()) ?? ""}</span>}
                        </span>
                        <span className="flex items-center gap-2">
                          {s.isBooked ? (
                            <Badge tone="success">Booked</Badge>
                          ) : (
                            <>
                              <Badge tone="neutral">Open</Badge>
                              <ActionButton
                                url={`/api/admin/slots/${s._id.toString()}`}
                                method="DELETE"
                                label="Delete"
                                pendingLabel="Deleting…"
                                variant="ghost"
                                confirm={`Delete the ${fmtTime(s.startTime)} IST slot on ${day}?`}
                              />
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg">Bookings</h2>
          <nav aria-label="Booking views" className="flex gap-1 text-sm">
            {(Object.keys(VIEWS) as View[]).map((v) => (
              <Link
                key={v}
                href={v === "upcoming" ? "/admin/consultations" : `/admin/consultations?view=${v}`}
                aria-current={v === view ? "page" : undefined}
                className={`rounded-hair px-3 py-1.5 ${v === view ? "bg-nordic font-bold text-cream" : "text-nordic hover:bg-nordic/10"}`}
              >
                {VIEWS[v]}
              </Link>
            ))}
          </nav>
        </div>
        {bookings.length === 0 ? (
          <EmptyState>No {VIEWS[view].toLowerCase()} bookings.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>When (IST)</th>
                <th>Guest</th>
                <th>Contact</th>
                <th>Guest time zone</th>
                <th>Mode</th>
                <th>Confirmation</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id.toString()}>
                  <td className="whitespace-nowrap">{b.slotId ? fmtDateTime(b.slotId.startTime) : "Slot removed"}</td>
                  <td>
                    {b.enquiryId ? (
                      <Link href={`/admin/enquiries/${b.enquiryId._id.toString()}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                        {b.enquiryId.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="text-xs">
                    <div>{b.enquiryId?.email}</div>
                    <div className="text-ink/60">{b.enquiryId?.whatsapp}</div>
                  </td>
                  <td>{b.timezone}</td>
                  <td>{b.slotId ? modeLabel(b.slotId.mode) : "—"}</td>
                  <td>{b.confirmationSent ? <Badge tone="success">Sent</Badge> : <Badge tone="warning">Not sent</Badge>}</td>
                  <td>
                    {b.cancelled ? (
                      <Badge tone="danger">Cancelled</Badge>
                    ) : (
                      <CancelBookingButton
                        bookingId={b._id.toString()}
                        guestName={b.enquiryId?.name ?? "this guest"}
                        when={b.slotId ? fmtDateTime(b.slotId.startTime) : "an unknown time"}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </>
  );
}

import Link from "next/link";
import type { QueryFilter } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enquiry, type EnquiryDoc } from "@/models";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { Badge, EmptyState, Pagination, PageHeader, Table, buttonClass, inputClass } from "@/components/admin/ui";
import { fmtDateTime, modeLabel, statusLabel, statusTone } from "@/components/admin/format";
import { RetentionPurgeButton } from "@/components/admin/RetentionPurgeButton";

export const metadata = { title: "Enquiries" };
const PER_PAGE = 25;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requireAdmin();
  const sp = await searchParams;
  const status = one(sp.status);
  const source = one(sp.source);
  const q = one(sp.q).trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(one(sp.page), 10) || 1);

  await connectDB();
  const filter: QueryFilter<EnquiryDoc> = {};
  if ((ENQUIRY_STATUSES as readonly string[]).includes(status)) filter.status = status as EnquiryDoc["status"];
  if (source === "direct") filter.utmSource = { $in: [null, ""] };
  else if (source) filter.utmSource = source;
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ name: rx }, { email: rx }, { patientName: rx }, { whatsapp: rx }];
  }

  const [total, rows, sources] = await Promise.all([
    Enquiry.countDocuments(filter),
    Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .select("name patientName enquiringForSomeoneElse country email helpWith consultationMode status utmSource createdAt reportUploads")
      .lean(),
    Enquiry.distinct("utmSource"),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const canPurge = session.user.role === "admin" || session.user.role === "physician";
  const sourceOptions = (sources as (string | null)[]).filter((s): s is string => Boolean(s)).sort();

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/enquiries${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        description={`${total} matching ${total === 1 ? "enquiry" : "enquiries"}.`}
        actions={canPurge ? <RetentionPurgeButton /> : undefined}
      />

      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-soft border border-nordic/10 bg-white p-3">
        <label className="text-sm">
          <span className="mb-1 block font-bold text-nordic">Status</span>
          <select name="status" defaultValue={status} className={inputClass}>
            <option value="">All statuses</option>
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-bold text-nordic">Source</span>
          <select name="source" defaultValue={source} className={inputClass}>
            <option value="">All sources</option>
            <option value="direct">direct/unknown</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-48 flex-1 text-sm">
          <span className="mb-1 block font-bold text-nordic">Search</span>
          <input name="q" defaultValue={q} placeholder="Name, email or WhatsApp" className={inputClass} />
        </label>
        <button type="submit" className={buttonClass.primary}>
          Filter
        </button>
        {(status || source || q) && (
          <Link href="/admin/enquiries" className={buttonClass.ghost}>
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <EmptyState>No enquiries match these filters.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Received (IST)</th>
              <th>Name</th>
              <th>Help with</th>
              <th>Mode</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e._id.toString()}>
                <td className="whitespace-nowrap">{fmtDateTime(e.createdAt)}</td>
                <td>
                  <Link href={`/admin/enquiries/${e._id.toString()}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                    {e.name}
                  </Link>
                  <div className="text-xs text-ink/60">
                    {e.country}
                    {e.enquiringForSomeoneElse && e.patientName ? `, for ${e.patientName}` : ""}
                  </div>
                </td>
                <td>{e.helpWith}</td>
                <td>{modeLabel(e.consultationMode)}</td>
                <td>{e.utmSource || <span className="text-ink/50">direct/unknown</span>}</td>
                <td>
                  <Badge tone={statusTone[e.status] ?? "neutral"}>{statusLabel(e.status)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Pagination page={page} pages={pages} hrefFor={hrefFor} />
    </>
  );
}

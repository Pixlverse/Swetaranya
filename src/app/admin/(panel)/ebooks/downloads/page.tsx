import Link from "next/link";
import type { QueryFilter } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Ebook, EbookDownload, type EbookDownloadDoc } from "@/models";
import { objectIdSchema } from "@/lib/validation/admin";
import { Badge, EmptyState, Pagination, PageHeader, Table, buttonClass, inputClass } from "@/components/admin/ui";
import { fmtDateTime } from "@/components/admin/format";

export const metadata = { title: "E-book downloads" };
const PER_PAGE = 50;

export default async function EbookDownloadsPage({ searchParams }: { searchParams: Promise<{ ebook?: string; page?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const ebook = sp.ebook && objectIdSchema.safeParse(sp.ebook).success ? sp.ebook : "";
  const page = Math.max(1, Number.parseInt(sp.page ?? "", 10) || 1);
  await connectDB();
  const filter: QueryFilter<EbookDownloadDoc> = ebook ? { ebookId: ebook } : {};
  const [total, rows, ebooks] = await Promise.all([
    EbookDownload.countDocuments(filter),
    EbookDownload.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .lean(),
    Ebook.find().sort({ order: 1, title: 1 }).select("title").lean(),
  ]);
  const titles = new Map(ebooks.map((e) => [e._id.toString(), e.title]));
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (ebook) params.set("ebook", ebook);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/ebooks/downloads${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="E-book downloads"
        description={`${total} download${total === 1 ? "" : "s"} with contact details${ebook ? ` for “${titles.get(ebook) ?? "a deleted e-book"}”` : ""}. Only contact people who ticked “happy to be contacted”.`}
        actions={
          <>
            <a href={`/api/admin/ebooks/downloads/export${ebook ? `?ebook=${ebook}` : ""}`} className={buttonClass.secondary} download>
              Export CSV
            </a>
            <Link href="/admin/ebooks" className={buttonClass.secondary}>
              Back to e-books
            </Link>
          </>
        }
      />

      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-soft border border-nordic/10 bg-white p-3">
        <label className="text-sm">
          <span className="mb-1 block font-bold text-nordic">E-book</span>
          <select name="ebook" defaultValue={ebook} className={inputClass}>
            <option value="">All e-books</option>
            {ebooks.map((e) => (
              <option key={e._id.toString()} value={e._id.toString()}>
                {e.title}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={buttonClass.primary}>
          Filter
        </button>
        {ebook && (
          <Link href="/admin/ebooks/downloads" className={buttonClass.ghost}>
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <EmptyState>No downloads yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Date (IST)</th>
              <th>E-book</th>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>Contact</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id.toString()}>
                <td className="whitespace-nowrap">{fmtDateTime(r.createdAt)}</td>
                <td>{titles.get(r.ebookId.toString()) ?? <span className="text-ink/50">deleted e-book</span>}</td>
                <td>{r.name || <span className="text-ink/50">—</span>}</td>
                <td>
                  <a href={`mailto:${r.email}`} className="text-nordic underline decoration-keppel underline-offset-4">
                    {r.email}
                  </a>
                </td>
                <td>{r.country || <span className="text-ink/50">—</span>}</td>
                <td>{r.consentToContact ? <Badge tone="success">Happy to be contacted</Badge> : <Badge>No consent</Badge>}</td>
                <td>{r.utmSource || <span className="text-ink/50">direct/unknown</span>}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Pagination page={page} pages={pages} hrefFor={hrefFor} />
    </>
  );
}

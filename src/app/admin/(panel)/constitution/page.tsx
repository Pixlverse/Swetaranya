import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { QuizSubmission } from "@/models";
import { Badge, EmptyState, Notice, Pagination, PageHeader, Table, buttonClass } from "@/components/admin/ui";
import { doshaResult, fmtDateTime } from "@/components/admin/format";
import { ActionButton } from "@/components/admin/actions";

export const metadata = { title: "Constitution check results" };
const PER_PAGE = 50;

const FILTERS = {
  all: { label: "All", query: {} },
  requested: { label: "Follow-up requested", query: { followUpRequested: true, followedUp: { $ne: true } } },
  done: { label: "Followed up", query: { followedUp: true } },
} as const;
type Filter = keyof typeof FILTERS;

const DOSHAS = ["vata", "pitta", "kapha"] as const;

export default async function ConstitutionResultsPage({ searchParams }: { searchParams: Promise<{ filter?: string; page?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const filter: Filter = sp.filter && sp.filter in FILTERS ? (sp.filter as Filter) : "all";
  const page = Math.max(1, Number.parseInt(sp.page ?? "", 10) || 1);
  await connectDB();
  const query = { quiz: "dosha" as const, ...FILTERS[filter].query };
  const [total, rows] = await Promise.all([
    QuizSubmission.countDocuments(query),
    QuizSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .select("result contactEmail followUpRequested followedUp createdAt")
      .lean(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/constitution${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Constitution check results"
        description={`${total} submission${total === 1 ? "" : "s"}. Percentages are the self-reported leaning towards each dosha.`}
        actions={
          <a href="/api/admin/constitution/export" className={buttonClass.secondary} download>
            Export CSV
          </a>
        }
      />
      <div className="mb-4">
        <Notice>These are self-reported tendencies, not a medical assessment or a pulse diagnosis. Use them to start a conversation.</Notice>
      </div>
      <nav aria-label="Filter results" className="mb-4 flex flex-wrap gap-1 text-sm">
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/constitution" : `/admin/constitution?filter=${f}`}
            aria-current={f === filter ? "page" : undefined}
            className={`rounded-hair px-3 py-1.5 ${f === filter ? "bg-nordic font-bold text-cream" : "text-nordic hover:bg-nordic/10"}`}
          >
            {FILTERS[f].label}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <EmptyState>No submissions match.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Submitted (IST)</th>
              {DOSHAS.map((d) => (
                <th key={d} className="capitalize">
                  {d}
                </th>
              ))}
              <th>Leaning</th>
              <th>Contact</th>
              <th>Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const res = doshaResult(r.result);
              return (
                <tr key={r._id.toString()}>
                  <td className="whitespace-nowrap">{fmtDateTime(r.createdAt)}</td>
                  {DOSHAS.map((d) => (
                    <td key={d} className={`tabular-nums ${res.dominant === d ? "font-bold text-nordic" : ""}`}>
                      {res[d] ?? "—"}
                      {res[d] !== undefined && "%"}
                    </td>
                  ))}
                  <td className="capitalize">{res.dominant ?? "—"}</td>
                  <td>
                    {r.contactEmail ? (
                      <a href={`mailto:${r.contactEmail}`} className="text-nordic underline decoration-keppel underline-offset-4">
                        {r.contactEmail}
                      </a>
                    ) : (
                      <span className="text-ink/50">none</span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-col items-start gap-1">
                      {r.followedUp ? (
                        <Badge tone="success">Followed up</Badge>
                      ) : r.followUpRequested ? (
                        <Badge tone="warning">Requested</Badge>
                      ) : (
                        <Badge>Not requested</Badge>
                      )}
                      <ActionButton
                        url={`/api/admin/constitution/${r._id.toString()}`}
                        method="PATCH"
                        body={{ followedUp: !r.followedUp }}
                        label={r.followedUp ? "Undo" : "Mark followed up"}
                        variant="ghost"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Pagination page={page} pages={pages} hrefFor={hrefFor} />
    </>
  );
}

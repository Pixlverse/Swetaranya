import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { LifestyleCheckResult } from "@/models";
import { LIFESTYLE_AREAS } from "@/lib/constants";
import { Badge, EmptyState, Notice, Pagination, PageHeader, Table, buttonClass } from "@/components/admin/ui";
import { fmtDateTime } from "@/components/admin/format";
import { ActionButton } from "@/components/admin/actions";

export const metadata = { title: "Lifestyle Check results" };
const PER_PAGE = 50;

const FILTERS = {
  all: { label: "All", query: {} },
  requested: { label: "Follow-up requested", query: { followUpRequested: true, followedUp: { $ne: true } } },
  done: { label: "Followed up", query: { followedUp: true } },
} as const;
type Filter = keyof typeof FILTERS;

export default async function LifestyleResultsPage({ searchParams }: { searchParams: Promise<{ filter?: string; page?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const filter: Filter = sp.filter && sp.filter in FILTERS ? (sp.filter as Filter) : "all";
  const page = Math.max(1, Number.parseInt(sp.page ?? "", 10) || 1);
  await connectDB();
  const query = FILTERS[filter].query;
  const [total, rows] = await Promise.all([
    LifestyleCheckResult.countDocuments(query),
    LifestyleCheckResult.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .lean(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/lifestyle${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Lifestyle Check results"
        description={`${total} submission${total === 1 ? "" : "s"}. Percentages are self-reported balance per area (higher is steadier).`}
        actions={
          <a href="/api/admin/lifestyle/export" className={buttonClass.secondary} download>
            Export CSV
          </a>
        }
      />
      <div className="mb-4">
        <Notice>These are self-awareness snapshots, not medical assessments. Use them to start a conversation, never as a diagnosis.</Notice>
      </div>
      <nav aria-label="Filter results" className="mb-4 flex flex-wrap gap-1 text-sm">
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/lifestyle" : `/admin/lifestyle?filter=${f}`}
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
              <th>Overall</th>
              {LIFESTYLE_AREAS.map((a) => (
                <th key={a} className="capitalize">
                  {a}
                </th>
              ))}
              <th>Contact</th>
              <th>Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const scores = (r.scorePercentages ?? {}) as Record<string, number | undefined>;
              return (
                <tr key={r._id.toString()}>
                  <td className="whitespace-nowrap">{fmtDateTime(r.createdAt)}</td>
                  <td className="font-bold tabular-nums">{r.overallPercentage ?? "—"}%</td>
                  {LIFESTYLE_AREAS.map((a) => (
                    <td key={a} className={`tabular-nums ${(scores[a] ?? 100) < 40 ? "font-bold text-clay" : ""}`}>
                      {scores[a] ?? "—"}
                    </td>
                  ))}
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
                        url={`/api/admin/lifestyle/${r._id.toString()}`}
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

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PageContent } from "@/models";
import { PAGE_DEFAULTS } from "@/content/pages";
import { Badge, PageHeader, Table } from "@/components/admin/ui";
import { fmtDateTime } from "@/components/admin/format";
import { NewPageKeyForm } from "@/components/admin/PageSectionsEditor";
import { PAGE_META, pageLabel } from "@/components/admin/page-meta";

export const metadata = { title: "Page sections" };

export default async function PagesAdminPage() {
  await requireAdmin();
  await connectDB();
  const docs = await PageContent.find().select("pageKey sections updatedAt").lean();
  const byKey = new Map(docs.map((d) => [d.pageKey, d]));
  const keys = [...new Set([...Object.keys(PAGE_DEFAULTS), ...docs.map((d) => d.pageKey)])];

  return (
    <>
      <PageHeader
        title="Page sections"
        description="Editable copy for Home, About, Your Stay and other pages. Edits are layered over the built-in defaults, so anything left alone keeps following the code."
      />
      <Table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Public URL</th>
            <th>Type</th>
            <th>Edited sections</th>
            <th>Last edited (IST)</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => {
            const doc = byKey.get(k);
            const builtIn = k in PAGE_DEFAULTS;
            return (
              <tr key={k}>
                <td>
                  <Link href={`/admin/pages/${k}`} className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                    {pageLabel(k)}
                  </Link>
                  <div className="text-xs text-ink/60">{k}</div>
                </td>
                <td>
                  {PAGE_META[k] ? (
                    <a href={PAGE_META[k].href} target="_blank" rel="noreferrer" className="text-nordic underline decoration-keppel underline-offset-4">
                      {PAGE_META[k].href}
                    </a>
                  ) : (
                    <span className="text-ink/50">—</span>
                  )}
                </td>
                <td>{builtIn ? <Badge tone="info">Built-in</Badge> : <Badge>Custom</Badge>}</td>
                <td className="tabular-nums">{doc?.sections.length ?? 0}</td>
                <td className="whitespace-nowrap">{doc ? fmtDateTime(doc.updatedAt) : <span className="text-ink/50">using defaults</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="mt-6 max-w-md">
        <NewPageKeyForm existing={keys} />
      </div>
    </>
  );
}

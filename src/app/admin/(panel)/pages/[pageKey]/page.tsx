import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PageContent } from "@/models";
import { PAGE_DEFAULTS } from "@/content/pages";
import { pageKeySchema } from "@/lib/validation/admin";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { PageSectionsEditor, type EditorSection } from "@/components/admin/PageSectionsEditor";
import { plain } from "@/lib/serialize";
import { PAGE_META, pageLabel } from "@/components/admin/page-meta";

export const metadata = { title: "Edit page sections" };

export default async function EditPageSectionsPage({ params }: { params: Promise<{ pageKey: string }> }) {
  await requireAdmin();
  const { pageKey } = await params;
  if (!pageKeySchema.safeParse(pageKey).success) notFound();
  await connectDB();
  const doc = await PageContent.findOne({ pageKey }).lean();
  const defaults = (PAGE_DEFAULTS as Record<string, Record<string, Record<string, unknown>>>)[pageKey];
  const stored = new Map(
    ((doc?.sections ?? []) as { key: string; data?: unknown }[]).map((s) => [s.key, (s.data ?? {}) as Record<string, unknown>] as const),
  );

  // Built-in sections show their effective content (defaults with stored edits layered on top, as the site renders them).
  const sections: EditorSection[] = [
    ...Object.entries(defaults ?? {}).map(([key, def]) => ({ key, builtIn: true, data: { ...def, ...(stored.get(key) ?? {}) }, defaults: def })),
    ...[...stored].filter(([key]) => !defaults || !(key in defaults)).map(([key, data]) => ({ key, builtIn: false, data, defaults: null })),
  ];
  const meta = PAGE_META[pageKey];

  return (
    <>
      <PageHeader
        title={pageLabel(pageKey)}
        description={
          defaults
            ? "Built-in page. Sections cannot be removed, only edited or reset to their defaults. Only changes from the defaults are stored."
            : "Custom page key. Add any sections your page components read."
        }
        actions={
          <>
            {meta && (
              <ButtonLink variant="secondary" href={meta.href} target="_blank">
                View on site
              </ButtonLink>
            )}
            <ButtonLink variant="secondary" href="/admin/pages">
              Back to pages
            </ButtonLink>
          </>
        }
      />
      <PageSectionsEditor pageKey={pageKey} builtInPage={Boolean(defaults)} exists={Boolean(doc)} initial={plain(sections)} />
    </>
  );
}

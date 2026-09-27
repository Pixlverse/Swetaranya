import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { JournalPost } from "@/models";
import { PHYSICIAN_NAME } from "@/lib/constants";
import { objectIdSchema } from "@/lib/validation/admin";
import { ButtonLink, Notice, PageHeader } from "@/components/admin/ui";
import { istDateTimeInput } from "@/components/admin/format";
import { JournalForm } from "@/components/admin/JournalForm";

export const metadata = { title: "Edit post" };

export default async function EditJournalPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin();
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!objectIdSchema.safeParse(id).success) notFound();
  await connectDB();
  const p = await JournalPost.findById(id).lean();
  if (!p) notFound();
  return (
    <>
      <PageHeader
        title={p.title}
        description="Edit Journal post"
        actions={
          <>
            {p.published && (
              <ButtonLink variant="secondary" href={`/journal/${p.slug}`} target="_blank">
                View on site
              </ButtonLink>
            )}
            <ButtonLink variant="secondary" href="/admin/journal">
              Back to Journal
            </ButtonLink>
          </>
        }
      />
      {created && (
        <div className="mb-4">
          <Notice>Post created.</Notice>
        </div>
      )}
      <JournalForm
        id={id}
        initialSlug={p.slug}
        initial={{
          title: p.title,
          category: p.category,
          excerpt: p.excerpt ?? "",
          body: p.body,
          author: p.author ?? PHYSICIAN_NAME,
          publishedAt: istDateTimeInput(p.publishedAt ?? new Date()),
          tags: (p.tags ?? []).join(", "),
          published: p.published ?? true,
        }}
      />
    </>
  );
}

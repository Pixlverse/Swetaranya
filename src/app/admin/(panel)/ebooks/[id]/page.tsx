import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Ebook, EbookDownload } from "@/models";
import { objectIdSchema } from "@/lib/validation/admin";
import { ButtonLink, Notice, PageHeader } from "@/components/admin/ui";
import { EbookForm } from "@/components/admin/EbookForm";

export const metadata = { title: "Edit e-book" };

export default async function EditEbookPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin();
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!objectIdSchema.safeParse(id).success) notFound();
  await connectDB();
  const [e, downloads] = await Promise.all([Ebook.findById(id).lean(), EbookDownload.countDocuments({ ebookId: id })]);
  if (!e) notFound();
  return (
    <>
      <PageHeader
        title={e.title}
        description="Edit e-book"
        actions={
          <>
            <ButtonLink variant="secondary" href={`/admin/ebooks/downloads?ebook=${id}`}>
              Downloads ({downloads})
            </ButtonLink>
            {e.published && (
              <ButtonLink variant="secondary" href="/ebooks" target="_blank">
                View on site
              </ButtonLink>
            )}
            <ButtonLink variant="secondary" href="/admin/ebooks">
              Back to e-books
            </ButtonLink>
          </>
        }
      />
      {created && (
        <div className="mb-4">
          <Notice>E-book created.</Notice>
        </div>
      )}
      <EbookForm
        id={id}
        initialSlug={e.slug}
        initial={{
          title: e.title,
          subtitle: e.subtitle ?? "",
          description: e.description ?? "",
          contents: e.contents ?? [],
          cover: { url: e.cover?.url ?? "", alt: e.cover?.alt ?? "" },
          fileUrl: e.fileUrl ?? "",
          pages: e.pages ?? null,
          requiresEmail: e.requiresEmail ?? true,
          order: e.order ?? 0,
          published: e.published ?? true,
        }}
      />
    </>
  );
}

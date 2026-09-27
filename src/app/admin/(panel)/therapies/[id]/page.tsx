import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Therapy } from "@/models";
import { objectIdSchema } from "@/lib/validation/admin";
import { ButtonLink, Notice, PageHeader } from "@/components/admin/ui";
import { TherapyForm } from "@/components/admin/TherapyForm";

export const metadata = { title: "Edit therapy" };

export default async function EditTherapyPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin();
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!objectIdSchema.safeParse(id).success) notFound();
  await connectDB();
  const t = await Therapy.findById(id).lean();
  if (!t) notFound();
  return (
    <>
      <PageHeader
        title={t.name}
        description="Edit therapy"
        actions={
          <>
            {t.published && (
              <ButtonLink variant="secondary" href={`/treatments/therapies/${t.slug}`} target="_blank">
                View on site
              </ButtonLink>
            )}
            <ButtonLink variant="secondary" href="/admin/therapies">
              Back to therapies
            </ButtonLink>
          </>
        }
      />
      {created && (
        <div className="mb-4">
          <Notice>Therapy created.</Notice>
        </div>
      )}
      <TherapyForm
        id={id}
        initialSlug={t.slug}
        initial={{
          name: t.name,
          malayalamName: t.malayalamName ?? "",
          category: t.category,
          summary: t.summary,
          description: t.description,
          duration: t.duration,
          image: { url: t.image?.url ?? "", alt: t.image?.alt ?? "" },
          order: t.order ?? 0,
          published: t.published ?? true,
        }}
      />
    </>
  );
}

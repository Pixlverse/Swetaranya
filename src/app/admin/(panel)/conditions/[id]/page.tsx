import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Condition, Therapy } from "@/models";
import { objectIdSchema } from "@/lib/validation/admin";
import { ButtonLink, Notice, PageHeader } from "@/components/admin/ui";
import { ConditionForm } from "@/components/admin/ConditionForm";

export const metadata = { title: "Edit condition" };

export default async function EditConditionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin();
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!objectIdSchema.safeParse(id).success) notFound();
  await connectDB();
  const [c, therapies] = await Promise.all([
    Condition.findById(id).lean(),
    Therapy.find().sort({ category: 1, order: 1 }).select("name category").lean(),
  ]);
  if (!c) notFound();
  return (
    <>
      <PageHeader
        title={c.name}
        description="Edit condition"
        actions={
          <>
            {c.published && (
              <ButtonLink variant="secondary" href={`/treatments/conditions/${c.slug}`} target="_blank">
                View on site
              </ButtonLink>
            )}
            <ButtonLink variant="secondary" href="/admin/conditions">
              Back to conditions
            </ButtonLink>
          </>
        }
      />
      {created && (
        <div className="mb-4">
          <Notice>Condition created.</Notice>
        </div>
      )}
      <ConditionForm
        id={id}
        initialSlug={c.slug}
        therapies={therapies.map((t) => ({ id: t._id.toString(), name: t.name, category: t.category }))}
        initial={{
          name: c.name,
          summary: c.summary,
          approach: c.approach ?? "",
          whatToExpect: c.whatToExpect ?? "",
          heroImage: { url: c.heroImage?.url ?? "", alt: c.heroImage?.alt ?? "" },
          faqs: ((c.faqs ?? []) as { question: string; answer: string }[]).map((f) => ({ question: f.question, answer: f.answer })),
          relatedTherapies: ((c.relatedTherapies ?? []) as { toString(): string }[]).map((t) => t.toString()),
          seoTitle: c.seoTitle ?? "",
          seoDescription: c.seoDescription ?? "",
          order: c.order ?? 0,
          published: c.published ?? true,
        }}
      />
    </>
  );
}

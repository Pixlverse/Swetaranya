import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Testimonial } from "@/models";
import { objectIdSchema } from "@/lib/validation/admin";
import { ButtonLink, Notice, PageHeader } from "@/components/admin/ui";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin();
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!objectIdSchema.safeParse(id).success) notFound();
  await connectDB();
  const t = await Testimonial.findById(id).lean();
  if (!t) notFound();
  return (
    <>
      <PageHeader title={t.patientName} description="Edit testimonial" actions={<ButtonLink variant="secondary" href="/admin/testimonials">Back to testimonials</ButtonLink>} />
      {created && (
        <div className="mb-4">
          <Notice>Testimonial created.</Notice>
        </div>
      )}
      <TestimonialForm
        id={id}
        isPlaceholder={Boolean(t.isPlaceholder)}
        initial={{
          patientName: t.patientName,
          country: t.country,
          condition: t.condition ?? "",
          quote: t.quote,
          consentGiven: Boolean(t.consentGiven),
          published: Boolean(t.published),
          media: ((t.media ?? []) as { kind?: string | null; url?: string | null; alt?: string | null }[]).map((m) => ({ kind: (m.kind ?? "image") as "image" | "video", url: m.url ?? "", alt: m.alt ?? "" })),
        }}
      />
    </>
  );
}

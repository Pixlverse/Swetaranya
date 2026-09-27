import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Therapy } from "@/models";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { ConditionForm } from "@/components/admin/ConditionForm";

export const metadata = { title: "New condition" };

export default async function NewConditionPage() {
  await requireAdmin();
  await connectDB();
  const therapies = await Therapy.find().sort({ category: 1, order: 1 }).select("name category").lean();
  return (
    <>
      <PageHeader title="New condition" actions={<ButtonLink variant="secondary" href="/admin/conditions">Back to conditions</ButtonLink>} />
      <ConditionForm
        initialSlug=""
        therapies={therapies.map((t) => ({ id: t._id.toString(), name: t.name, category: t.category }))}
        initial={{
          name: "",
          summary: "",
          approach: "",
          whatToExpect: "",
          heroImage: { url: "", alt: "" },
          faqs: [],
          relatedTherapies: [],
          seoTitle: "",
          seoDescription: "",
          order: 0,
          published: false,
        }}
      />
    </>
  );
}

import { requireAdmin } from "@/lib/auth";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { TherapyForm } from "@/components/admin/TherapyForm";

export const metadata = { title: "New therapy" };

export default async function NewTherapyPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New therapy" actions={<ButtonLink variant="secondary" href="/admin/therapies">Back to therapies</ButtonLink>} />
      <TherapyForm
        initialSlug=""
        initial={{
          name: "",
          malayalamName: "",
          category: "individual",
          summary: "",
          description: "",
          duration: "",
          image: { url: "", alt: "" },
          order: 0,
          published: false,
        }}
      />
    </>
  );
}

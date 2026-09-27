import { requireAdmin } from "@/lib/auth";
import { PHYSICIAN_NAME } from "@/lib/constants";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { istDateTimeInput } from "@/components/admin/format";
import { JournalForm } from "@/components/admin/JournalForm";

export const metadata = { title: "New post" };

export default async function NewJournalPostPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New Journal post" actions={<ButtonLink variant="secondary" href="/admin/journal">Back to Journal</ButtonLink>} />
      <JournalForm
        initialSlug=""
        initial={{
          title: "",
          category: "living-ayurveda",
          excerpt: "",
          body: "",
          author: PHYSICIAN_NAME,
          publishedAt: istDateTimeInput(),
          tags: "",
          published: false,
        }}
      />
    </>
  );
}

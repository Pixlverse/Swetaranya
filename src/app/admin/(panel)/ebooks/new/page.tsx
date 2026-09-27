import { requireAdmin } from "@/lib/auth";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { EbookForm } from "@/components/admin/EbookForm";

export const metadata = { title: "New e-book" };

export default async function NewEbookPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New e-book" actions={<ButtonLink variant="secondary" href="/admin/ebooks">Back to e-books</ButtonLink>} />
      <EbookForm
        initialSlug=""
        initial={{
          title: "",
          subtitle: "",
          description: "",
          contents: [],
          cover: { url: "", alt: "" },
          fileUrl: "",
          pages: null,
          requiresEmail: true,
          order: 0,
          published: false,
        }}
      />
    </>
  );
}

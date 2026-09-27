import { requireAdmin } from "@/lib/auth";
import { VIDEO_CATEGORIES } from "@/models";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { VideoForm } from "@/components/admin/VideoForm";
import { videoCategoryOptions } from "@/components/admin/video-categories";

export const metadata = { title: "New video" };

export default async function NewVideoPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New video" actions={<ButtonLink variant="secondary" href="/admin/videos">Back to videos</ButtonLink>} />
      <VideoForm
        initialSlug=""
        categories={videoCategoryOptions(VIDEO_CATEGORIES)}
        initial={{
          title: "",
          description: "",
          category: "life-at-swetaranya",
          url: "",
          thumbnail: { url: "", alt: "" },
          duration: "",
          chapters: [],
          featured: false,
          order: 0,
          published: false,
        }}
      />
    </>
  );
}

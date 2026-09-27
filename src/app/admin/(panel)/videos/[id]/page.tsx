import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { VIDEO_CATEGORIES, Video } from "@/models";
import { objectIdSchema } from "@/lib/validation/admin";
import { ButtonLink, Notice, PageHeader } from "@/components/admin/ui";
import { VideoForm } from "@/components/admin/VideoForm";
import { videoCategoryOptions } from "@/components/admin/video-categories";

export const metadata = { title: "Edit video" };

export default async function EditVideoPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin();
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!objectIdSchema.safeParse(id).success) notFound();
  await connectDB();
  const v = await Video.findById(id).lean();
  if (!v) notFound();
  return (
    <>
      <PageHeader
        title={v.title}
        description="Edit video"
        actions={
          <>
            {v.published && (
              <ButtonLink variant="secondary" href="/experience" target="_blank">
                View on site
              </ButtonLink>
            )}
            <ButtonLink variant="secondary" href="/admin/videos">
              Back to videos
            </ButtonLink>
          </>
        }
      />
      {created && (
        <div className="mb-4">
          <Notice>Video created.</Notice>
        </div>
      )}
      <VideoForm
        id={id}
        initialSlug={v.slug}
        categories={videoCategoryOptions(VIDEO_CATEGORIES)}
        initial={{
          title: v.title,
          description: v.description ?? "",
          category: v.category,
          url: v.url ?? "",
          thumbnail: { url: v.thumbnail?.url ?? "", alt: v.thumbnail?.alt ?? "" },
          duration: v.duration ?? "",
          chapters: ((v.chapters ?? []) as { title: string; seconds: number; body?: string | null }[]).map((c) => ({ title: c.title, seconds: c.seconds, body: c.body ?? "" })),
          featured: v.featured ?? false,
          order: v.order ?? 0,
          published: v.published ?? true,
        }}
      />
    </>
  );
}

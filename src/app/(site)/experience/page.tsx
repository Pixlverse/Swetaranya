import type { Metadata } from "next";
import { ChapteredVideo } from "@/components/experience/ChapteredVideo";
import { VideoLibrary } from "@/components/experience/VideoLibrary";
import { PrimaryLink, TextLink } from "@/components/site/Buttons";
import { getVideos } from "@/lib/queries";
import { VIDEO_CATEGORIES } from "@/models/Video";
import { EXPERIENCE_VIDEO_URL, VIDEO_CHAPTERS } from "@/content/video";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Experience Swetaranya",
  description: "Films from Swetaranya — a chaptered film of a stay, and a library on treatments, daily life and learning Ayurveda.",
};

export default async function ExperiencePage() {
  const videos = await getVideos();
  const featured = videos.find((v) => v.featured);
  const library = videos.filter((v) => v !== featured);
  // Until a featured film is set in admin, fall back to the planned chapter outline.
  const chapters = featured?.chapters.length ? featured.chapters : VIDEO_CHAPTERS.map((c) => ({ title: c.title, seconds: c.seconds, body: c.body }));

  return (
    <>
      <section className="on-dark bg-nordic text-cream">
        <div className="mx-auto max-w-[88rem] px-5 pb-20 pt-14 sm:px-8 md:pb-24 md:pt-20">
          <div className="mb-12 grid gap-6 md:grid-cols-12">
            <h1 className="text-[clamp(2.2rem,4.43vw,3.8rem)] leading-[0.95] tracking-[-0.02em] text-cream md:col-span-7">
              {featured?.title ?? "A stay here, from the gate to the evening lamp"}
            </h1>
            <p className="self-end text-[1.05rem] text-cream/75 md:col-span-4 md:col-start-9">
              {featured?.description ||
                "Filmed at Swetaranya with our own family and guests who agreed to be seen. Watch it straight through, or choose the chapter you are curious about."}
            </p>
          </div>
          <ChapteredVideo chapters={chapters} url={featured?.url ?? EXPERIENCE_VIDEO_URL} title={featured?.title ?? "The Swetaranya film"} />
        </div>
      </section>

      {library.length > 0 && (
        <section className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 md:py-24" aria-labelledby="library-heading">
          <div className="mb-10 grid gap-6 md:grid-cols-12">
            <h2 id="library-heading" className="text-[clamp(1.9rem,3.32vw,2.6rem)] md:col-span-6">
              More from the house
            </h2>
            <p className="self-end text-ink/75 md:col-span-5 md:col-start-8">Short films on treatments, daily life and the ideas behind them.</p>
          </div>
          <VideoLibrary videos={library} categories={VIDEO_CATEGORIES} />
        </section>
      )}

      <section className="mx-auto flex max-w-[88rem] flex-col gap-8 border-t border-nordic/10 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-2xl font-heading text-[clamp(1.65rem,2.58vw,2.1rem)] leading-tight text-nordic">
          A film can only show so much. The rest is easier to explain in a conversation.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <TextLink href="/a-day-at-swetaranya">A day, hour by hour</TextLink>
          <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/brand/MediaImage";
import { Placeholder } from "@/components/brand/Placeholder";
import { playable } from "@/lib/video";
import type { VideoView } from "@/lib/queries";

/**
 * The library: film frames rather than cards — a 16:9 still, the duration set on it, title beneath.
 * Category filter is plain text. Videos play in a native <dialog> (focus-trapped, Esc to close).
 */
export function VideoLibrary({ videos, categories }: { videos: VideoView[]; categories: readonly { slug: string; label: string }[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [playing, setPlaying] = useState<VideoView | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (playing && !d.open) d.showModal();
    if (!playing && d.open) d.close();
  }, [playing]);

  const present = categories.filter((c) => videos.some((v) => v.category === c.slug));
  const shown = filter === "all" ? videos : videos.filter((v) => v.category === filter);
  const label = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div>
      {present.length > 1 && (
        <div role="group" aria-label="Filter videos" className="flex flex-wrap gap-x-6 gap-y-2 border-y border-nordic/15 py-4 text-[0.95rem]">
          {[{ slug: "all", label: "Everything" }, ...present].map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={filter === c.slug}
              onClick={() => setFilter(c.slug)}
              className="text-ink/65 hover:text-nordic aria-pressed:font-bold aria-pressed:text-nordic aria-pressed:underline aria-pressed:decoration-keppel aria-pressed:decoration-2 aria-pressed:underline-offset-8"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((v) => (
          <li key={v._id}>
            <button type="button" onClick={() => setPlaying(v)} className="group block w-full text-left" aria-label={`Play ${v.title}`}>
              <span className="relative block">
                <MediaImage image={v.thumbnail} label={v.title} captionAt="top" className="aspect-video w-full" sizes="(min-width: 1024px) 30vw, 90vw" />
                <span aria-hidden className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center rounded-pill bg-nordic/85 transition-transform duration-500 ease-calm group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-cream">
                    <path d="M7 4.5v15l12-7.5z" />
                  </svg>
                </span>
                {v.duration && <span className="absolute bottom-3 right-3 bg-nordic/85 px-2 py-0.5 text-[0.78rem] tabular-nums text-cream">{v.duration}</span>}
              </span>
              <span className="mt-4 block text-[0.82rem] font-bold text-terracotta">{label(v.category)}</span>
              <span className="mt-1 block font-heading text-[1.45rem] leading-snug text-nordic transition-colors group-hover:text-keppel">{v.title}</span>
              {v.description && <span className="mt-1.5 line-clamp-2 block text-[0.95rem] text-ink/70">{v.description}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setPlaying(null)}
        onClick={(e) => e.target === dialog.current && setPlaying(null)}
        aria-label={playing?.title ?? "Video"}
        className="m-auto w-[min(64rem,94vw)] bg-transparent p-0 backdrop:bg-ink/80"
      >
        {playing && <Player video={playing} onClose={() => setPlaying(null)} />}
      </dialog>
    </div>
  );
}

function Player({ video, onClose }: { video: VideoView; onClose: () => void }) {
  const p = playable(video.url);
  return (
    <div className="on-dark bg-nordic p-3 sm:p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <p className="font-heading text-[1.3rem] text-cream">{video.title}</p>
        <button type="button" onClick={onClose} className="shrink-0 rounded-pill border border-cream/40 px-4 py-1.5 text-[0.9rem] text-cream hover:bg-cream hover:text-nordic" autoFocus>
          Close
        </button>
      </div>
      {p.kind === "file" ? (
        <video src={p.src} controls autoPlay playsInline className="aspect-video w-full bg-ink" />
      ) : p.kind === "youtube" || p.kind === "vimeo" ? (
        <iframe src={p.src(0, true)} title={video.title} className="aspect-video w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      ) : (
        <Placeholder label={`${video.title} — video to come`} tone="dark" className="aspect-video w-full" />
      )}
    </div>
  );
}

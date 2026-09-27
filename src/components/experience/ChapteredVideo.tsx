"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Placeholder } from "@/components/brand/Placeholder";
import { formatSeconds, playable } from "@/lib/video";

type Chapter = { title: string; seconds: number; body?: string };

/** Featured film with chapters. Works with a direct file, a YouTube/Vimeo link, or — until one exists — a placeholder. */
export function ChapteredVideo({ chapters, url, title }: { chapters: Chapter[]; url: string | null; title: string }) {
  const [active, setActive] = useState(0);
  const [embedStart, setEmbedStart] = useState<{ at: number; autoplay: boolean }>({ at: 0, autoplay: false });
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const p = playable(url);

  // Follow native playback so the chapter list stays in step with the film.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onTime = () => {
      const idx = chapters.findLastIndex((c) => v.currentTime >= c.seconds);
      if (idx >= 0) setActive(idx);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [chapters]);

  const choose = (i: number) => {
    setActive(i);
    if (p.kind === "file" && video.current) {
      video.current.currentTime = chapters[i].seconds;
      void video.current.play().catch(() => {});
    } else if (p.kind === "youtube" || p.kind === "vimeo") {
      setEmbedStart({ at: chapters[i].seconds, autoplay: true });
    }
  };

  const current = chapters[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {p.kind === "file" ? (
          <video ref={video} src={p.src} controls playsInline preload="metadata" className="aspect-video w-full bg-ink" aria-label={title} />
        ) : p.kind === "youtube" || p.kind === "vimeo" ? (
          <iframe
            key={`${embedStart.at}-${embedStart.autoplay}`}
            src={p.src(embedStart.at, embedStart.autoplay)}
            title={title}
            className="aspect-video w-full bg-ink"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <Placeholder label={`${title}${current ? ` — chapter: ${current.title.toLowerCase()}` : ""}`} tone="dark" className="aspect-video w-full" />
        )}
        {current && (
          <div className="mt-6 min-h-[4.5rem]" aria-live="polite">
            <p className="font-heading text-[1.6rem] text-cream">{current.title}</p>
            {current.body && <p className="mt-1 text-cream/75">{current.body}</p>}
          </div>
        )}
      </div>

      {chapters.length > 0 && (
        <nav aria-label="Film chapters" className="lg:col-span-4">
          <ol className="border-t border-cream/15">
            {chapters.map((c, i) => {
              const selected = i === active;
              return (
                <li key={`${c.seconds}-${c.title}`} className="relative border-b border-cream/15">
                  {selected && <motion.span layoutId="chapter-marker" className="absolute inset-y-0 left-0 w-[3px] bg-keppel" transition={{ duration: reduce ? 0 : 0.35 }} />}
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    aria-current={selected ? "true" : undefined}
                    className={`flex w-full items-baseline gap-5 py-4 pl-5 pr-2 text-left transition-colors ${selected ? "text-cream" : "text-cream/65 hover:text-cream"}`}
                  >
                    <span className="w-10 shrink-0 text-[0.9rem] tabular-nums text-keppel">{formatSeconds(c.seconds)}</span>
                    <span className="font-heading text-[1.2rem] leading-snug">{c.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );
}

/** Turn a stored video URL into something playable: a YouTube/Vimeo embed, a direct file, or nothing yet. */
export type Playable = { kind: "youtube" | "vimeo"; src: (startSeconds?: number, autoplay?: boolean) => string } | { kind: "file"; src: string } | { kind: "none" };

export function playable(url: string | null | undefined): Playable {
  const u = url?.trim();
  if (!u) return { kind: "none" };
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    return { kind: "youtube", src: (start = 0, autoplay = false) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&start=${Math.floor(start)}${autoplay ? "&autoplay=1" : ""}` };
  }
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    const id = vm[1];
    return { kind: "vimeo", src: (start = 0, autoplay = false) => `https://player.vimeo.com/video/${id}?dnt=1${autoplay ? "&autoplay=1" : ""}#t=${Math.floor(start)}s` };
  }
  return { kind: "file", src: u };
}

export const formatSeconds = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

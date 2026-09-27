import Image from "next/image";
import { Placeholder } from "./Placeholder";

type Shape = "rect" | "leaf" | "drop" | "arch";
const FRAME: Record<Shape, string> = { rect: "", leaf: "frame-leaf", drop: "frame-drop", arch: "rounded-t-[999px] overflow-hidden" };

/**
 * A real photograph when admin has set one, otherwise the honest placeholder. Keeps the same frame
 * silhouette either way. Cloudinary images go through next/image optimisation; other hosts are
 * shown as-is (no optimisation) so an arbitrary pasted URL can't break the page.
 */
export function MediaImage({
  image,
  label,
  shape = "rect",
  className = "",
  tone = "light",
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
  captionAt = "bottom",
}: {
  image?: { url?: string | null; alt?: string | null } | null;
  label: string;
  shape?: Shape;
  className?: string;
  tone?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
  /** Placeholder caption position, e.g. "top" when a play button sits bottom-left. */
  captionAt?: "bottom" | "top";
}) {
  const url = image?.url?.trim();
  if (!url) return <Placeholder label={label} shape={shape} tone={tone} captionAt={captionAt} className={className} />;
  const optimisable = url.startsWith("/") || url.includes("res.cloudinary.com");
  return (
    <div className={`relative overflow-hidden ${FRAME[shape]} ${className}`}>
      <Image src={url} alt={image?.alt || label} fill sizes={sizes} priority={priority} unoptimized={!optimisable} className="object-cover" />
    </div>
  );
}

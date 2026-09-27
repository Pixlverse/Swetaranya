import { useId } from "react";

/**
 * Obvious photo placeholder. Real photographs of Swetaranya replace these — never stock imagery.
 * `shape` picks the frame so different content types keep their own silhouettes.
 */
export function Placeholder({
  label,
  className = "",
  shape = "rect",
  tone = "light",
  captionAt = "bottom",
}: {
  label: string;
  className?: string;
  shape?: "rect" | "leaf" | "drop" | "arch";
  tone?: "light" | "dark";
  captionAt?: "bottom" | "top";
}) {
  const id = useId().replace(/:/g, "");
  const frame = { rect: "", leaf: "frame-leaf", drop: "frame-drop", arch: "rounded-t-[999px]" }[shape];
  const colors = tone === "light" ? "bg-cream text-nordic border-nordic/25" : "bg-nordic text-cream/80 border-cream/20";
  return (
    <div role="img" aria-label={`Photograph to come: ${label}`} className={`relative overflow-hidden border ${colors} ${frame} ${className}`}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={`h${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeOpacity="0.13" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#h${id})`} />
      </svg>
      {/* Curved frames clip corners, so their caption sits centred rather than bottom-left. */}
      <div className={`absolute inset-0 flex p-4 sm:p-5 ${shape !== "rect" ? "items-center justify-center text-center" : captionAt === "top" ? "items-start justify-end" : "items-end"}`}>
        <p className={`max-w-[26ch] text-[0.8rem] leading-snug ${tone === "light" ? "bg-cream/90" : "bg-nordic/90"} px-2.5 py-1.5`}>
          <span className="font-bold">Photograph to come:</span> {label}
        </p>
      </div>
    </div>
  );
}

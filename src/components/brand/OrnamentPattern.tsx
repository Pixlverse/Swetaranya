import { useId, type ReactNode } from "react";

/** A petal pointing up from the origin, `len` long. */
const petal = (len: number, w = 0.34) =>
  `M0 0 C${len * w} ${-len * 0.35} ${len * w * 0.7} ${-len * 0.85} 0 ${-len} C${-len * w * 0.7} ${-len * 0.85} ${-len * w} ${-len * 0.35} 0 0Z`;

/** Coiled scroll, as in Kerala temple carving and kolam — nested half-arcs. */
const spiral = (r: number) => `M${-r} 0 a${r} ${r} 0 1 1 ${2 * r} 0 a${r * 0.72} ${r * 0.72} 0 1 1 ${-r * 1.44} 0 a${r * 0.45} ${r * 0.45} 0 1 1 ${r * 0.9} 0 a${r * 0.22} ${r * 0.22} 0 1 1 ${-r * 0.44} 0`;

/** Paisley: the brand's drop with its tip curled over. */
const PAISLEY = "M0 22 C-17 22 -19 1 -7 -11 C0 -18 11 -22 15 -31 C14 -16 19 -5 14 7 C10 16 6 22 0 22Z M0 14 C-9 14 -10 3 -4 -4 C1 -9 7 -12 9 -18 C9 -9 11 -2 8 5 C6 10 4 14 0 14Z";

const Ring = ({ n, r, children }: { n: number; r: number; children: (i: number) => ReactNode }) => (
  <>{Array.from({ length: n }, (_, i) => <g key={i} transform={`rotate(${(360 / n) * i}) translate(0 ${-r})`}>{children(i)}</g>)}</>
);

function Medallion({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Ring n={8} r={0}>{() => <path d={petal(r)} />}</Ring>
      <Ring n={8} r={0}>{() => <path d={petal(r * 0.62, 0.3)} transform="rotate(22.5)" />}</Ring>
      <circle r={r * 0.18} />
      <circle r={r * 1.12} strokeDasharray="0.01 4.6" strokeWidth="2" strokeLinecap="round" />
      <circle r={r * 1.26} />
      {/* scalloped outer edge */}
      <Ring n={20} r={r * 1.26}>{() => <path d={`M${-r * 0.2} 0 a${r * 0.2} ${r * 0.2} 0 0 1 ${r * 0.4} 0`} />}</Ring>
      <Ring n={20} r={r * 1.62}>{() => <circle r={0.9} />}</Ring>
    </g>
  );
}

/**
 * Seamless ornamental ground drawn from brand shapes — medallions of eight petals, paisleys (the drop,
 * curled), coiled scrolls and vines — in the spirit of Kerala temple carving and kolam. Line-only,
 * static and very faint: texture for a calm surface, never a focal point. Motifs that cross a tile edge
 * are drawn on both sides so the pattern joins seamlessly.
 */
export function OrnamentPattern({
  className = "",
  tone = "nordic",
  opacity = 0.055,
  scale = 1,
}: {
  className?: string;
  tone?: "nordic" | "keppel" | "cream";
  opacity?: number;
  scale?: number;
}) {
  const id = useId().replace(/:/g, "");
  const stroke = { nordic: "stroke-nordic", keppel: "stroke-keppel", cream: "stroke-cream" }[tone];
  const T = 220;
  const S = T * scale;
  // everything drawn at the tile's origin is repeated at the 8 neighbouring offsets so edges join
  const offsets = [-T, 0, T].flatMap((dx) => [-T, 0, T].map((dy) => [dx, dy]));

  const tile = (
    <>
      <Medallion x={110} y={110} r={36} />
      <Medallion x={0} y={0} r={22} />
      {/* paisleys on the diagonals, curling around the centre */}
      {[45, 135, 225, 315].map((a) => (
        <g key={a} transform={`translate(110 110) rotate(${a}) translate(0 -80) rotate(${-20})`}>
          <path d={PAISLEY} />
          <path d={spiral(4)} transform="translate(-2 4)" />
        </g>
      ))}
      {/* scrolls with leafy vines on the edge midpoints */}
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`translate(110 110) rotate(${a}) translate(0 -110)`}>
          <path d={spiral(16)} />
          <path d="M16 2 C28 10 34 22 30 36" />
          <path d="M-16 2 C-28 -6 -34 -18 -30 -32" />
          <path d={petal(10, 0.45)} transform="translate(30 36) rotate(160)" />
          <path d={petal(10, 0.45)} transform="translate(-30 -32) rotate(-20)" />
        </g>
      ))}
    </>
  );

  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden style={{ opacity }}>
      <defs>
        <pattern id={`orn${id}`} width={S} height={S} patternUnits="userSpaceOnUse">
          <g transform={`scale(${scale})`} fill="none" strokeWidth="1" className={stroke}>
            {offsets.map(([dx, dy]) => (
              <g key={`${dx},${dy}`} transform={`translate(${dx} ${dy})`}>
                {tile}
              </g>
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#orn${id})`} />
    </svg>
  );
}

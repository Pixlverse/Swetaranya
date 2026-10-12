import { useId } from "react";

/* One 220-unit tile of overlapping medallions: [cx, cy, radius], drawn back to front.
   Every medallion is also drawn at the 8 neighbouring offsets so the tile repeats seamlessly. */
const CIRCLES: [number, number, number][] = [
  [40, 30, 46],
  [150, 20, 38],
  [110, 95, 52],
  [20, 130, 40],
  [200, 110, 44],
  [70, 190, 48],
  [175, 195, 40],
  [125, 165, 22],
  [60, 95, 18],
  [190, 60, 16],
  [95, 35, 14],
  [15, 75, 12],
  [150, 125, 13],
  [25, 205, 14],
  [215, 165, 12],
  [110, 215, 11],
];

const r2 = (v: number) => Math.round(v * 100) / 100;

/** One medallion: a ground-coloured disc banded with solid rings and rings of dots, like the reference print. */
function Medallion({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // Bands from the outside in: alternating a solid line and a ring of dots.
  const bands = r > 30 ? [1, 0.86, 0.72, 0.58, 0.44, 0.3, 0.16] : r > 15 ? [1, 0.78, 0.56, 0.34, 0.14] : [1, 0.66, 0.33];
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--rp-ground)" />
      {bands.map((f, k) => {
        const rr = r * f;
        if (k % 2 === 0) return <circle key={k} cx={cx} cy={cy} r={rr} fill="none" stroke="var(--rp-line)" strokeWidth={k === 0 ? 1.4 : 1} />;
        const n = Math.max(8, Math.round((2 * Math.PI * rr) / 4.2));
        return (
          <g key={k} fill="var(--rp-line)">
            {Array.from({ length: n }, (_, j) => {
              const a = (j / n) * Math.PI * 2;
              return <circle key={j} cx={r2(cx + Math.cos(a) * rr)} cy={r2(cy + Math.sin(a) * rr)} r={r > 30 ? 1.15 : 0.9} />;
            })}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={Math.max(1.5, r * 0.06)} fill="var(--rp-line)" />
    </g>
  );
}

/**
 * A dense, tone-on-tone field of overlapping medallions — concentric circles banded with solid and
 * dotted rings, like a block-printed temple textile. Ground and line are two close tints of the brand
 * colours, so the pattern reads as texture rather than decoration.
 */
export function RipplePattern({
  className = "",
  scale = 1,
  ground = "color-mix(in srgb, var(--color-keppel) 5%, var(--color-cream))",
  line = "color-mix(in srgb, var(--color-keppel) 14%, var(--color-cream))",
}: {
  className?: string;
  scale?: number;
  ground?: string;
  line?: string;
}) {
  const id = useId().replace(/:/g, "");
  const T = 220;
  const offsets = [-T, 0, T].flatMap((dx) => [-T, 0, T].map((dy) => [dx, dy]));

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
      style={{ ["--rp-ground" as string]: ground, ["--rp-line" as string]: line }}
    >
      <defs>
        <pattern id={`rip${id}`} width={T * scale} height={T * scale} patternUnits="userSpaceOnUse">
          <rect width={T * scale} height={T * scale} fill="var(--rp-ground)" />
          <g transform={`scale(${scale})`}>
            {CIRCLES.map(([cx, cy, r], i) =>
              offsets.map(([dx, dy]) => <Medallion key={`${i}:${dx},${dy}`} cx={cx + dx} cy={cy + dy} r={r} />),
            )}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#rip${id})`} />
    </svg>
  );
}

/**
 * A dense, hand-drawn-feeling mandala in line-art: many fine rings of petals, buds, dots and scallops, like the
 * printed mandalas on Kerala temple cloth. Meant to sit large and faint behind text, partly off the edge.
 */
export function OrnateMandala({ className = "" }: { className?: string }) {
  const ring = (n: number, offset = 0) => Array.from({ length: n }, (_, i) => (360 / n) * i + offset);
  /** A pointed lotus petal from the origin up to (0, -len). */
  const petal = (len: number, w: number) =>
    `M0 0C${len * w} ${-len * 0.3} ${len * w * 0.8} ${-len * 0.8} 0 ${-len}C${-len * w * 0.8} ${-len * 0.8} ${-len * w} ${-len * 0.3} 0 0Z`;
  /** A rounded scallop between two angles' worth of arc, bulging outwards. */
  const scallop = (r: number, half: number, bulge: number) => {
    const a = (half * Math.PI) / 180;
    const x = r * Math.sin(a);
    const y = -r * Math.cos(a);
    return `M${-x} ${y}Q0 ${-r - bulge} ${x} ${y}`;
  };
  /** A small three-lobed bud, like a jasmine flower seen from the side. */
  const bud = "M0 0C3 -4 4 -9 0 -14C-4 -9 -3 -4 0 0ZM0 -4C5 -6 9 -5 10 -9C5 -11 2 -8 0 -4ZM0 -4C-5 -6 -9 -5 -10 -9C-5 -11 -2 -8 0 -4Z";
  const dot = (r: number) => <circle r={r} fill="currentColor" stroke="none" />;

  return (
    <svg viewBox="-300 -300 600 600" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Outer rim: large scalloped arches with a petal and a dot in each. */}
      {ring(24).map((a) => (
        <g key={`rim${a}`} transform={`rotate(${a})`}>
          <path d={scallop(262, 7.5, 26)} />
          <path d={scallop(262, 5, 14)} />
          <path d={petal(30, 0.32)} transform="translate(0 -250)" />
          <g transform="translate(0 -292)">{dot(2.2)}</g>
        </g>
      ))}
      <circle r="262" />
      <circle r="254" />

      {/* Dotted band. */}
      {ring(96).map((a) => (
        <g key={`d1${a}`} transform={`rotate(${a}) translate(0 -244)`}>
          {dot(1.6)}
        </g>
      ))}
      <circle r="234" />

      {/* Ring of 32 long petals, each with a vein and a bud at its foot. */}
      {ring(32).map((a) => (
        <g key={`lp${a}`} transform={`rotate(${a})`}>
          <path d={petal(56, 0.26)} transform="translate(0 -176)" />
          <path d="M0 -180V-222" />
          <path d={bud} transform="translate(0 -172) scale(0.7)" />
        </g>
      ))}
      <circle r="172" />
      <circle r="166" />

      {/* Zig-zag band, like a woven border. */}
      <path
        d={ring(64)
          .map((a, i) => {
            const r = i % 2 ? 150 : 162;
            const t = (a * Math.PI) / 180;
            return `${i ? "L" : "M"}${(r * Math.sin(t)).toFixed(1)} ${(-r * Math.cos(t)).toFixed(1)}`;
          })
          .join("") + "Z"}
      />
      <circle r="148" />

      {/* Ring of 16 broad lotus petals, each holding a smaller one. */}
      {ring(16, 11.25).map((a) => (
        <g key={`mp${a}`} transform={`rotate(${a})`}>
          <path d={petal(74, 0.42)} transform="translate(0 -72)" />
          <path d={petal(50, 0.36)} transform="translate(0 -76)" />
          <path d={petal(26, 0.3)} transform="translate(0 -80)" />
          <g transform="translate(0 -138)">{dot(1.8)}</g>
        </g>
      ))}

      {/* Small dots between the broad petals. */}
      {ring(16).map((a) => (
        <g key={`d2${a}`} transform={`rotate(${a}) translate(0 -118)`}>
          {dot(2.4)}
        </g>
      ))}
      <circle r="72" />
      {ring(48).map((a) => (
        <g key={`d3${a}`} transform={`rotate(${a}) translate(0 -64)`}>
          {dot(1.3)}
        </g>
      ))}
      <circle r="56" />

      {/* Inner lotus: two rings of petals around a seed. */}
      {ring(12).map((a) => (
        <path key={`ip${a}`} d={petal(54, 0.38)} transform={`rotate(${a})`} />
      ))}
      {ring(12, 15).map((a) => (
        <path key={`ip2${a}`} d={petal(36, 0.36)} transform={`rotate(${a})`} />
      ))}
      <circle r="12" />
      <circle r="6" />
      {dot(2.4)}
    </svg>
  );
}

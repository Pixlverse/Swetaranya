/** A lotus mandala in line-art: petal rings, a dotted kolam ring and a scalloped rim. */
export function LotusMandala({ className = "" }: { className?: string }) {
  const petal = (len: number, w: number) => `M0 0C${len * w} ${-len * 0.35} ${len * w * 0.75} ${-len * 0.82} 0 ${-len}C${-len * w * 0.75} ${-len * 0.82} ${-len * w} ${-len * 0.35} 0 0Z`;
  const ring = (n: number, offset = 0) => Array.from({ length: n }, (_, i) => (360 / n) * i + offset);
  return (
    <svg viewBox="-160 -160 320 320" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      {ring(16).map((a) => (
        <circle key={`s${a}`} r="14" transform={`rotate(${a}) translate(0 -142)`} />
      ))}
      <circle r="128" />
      {ring(48).map((a) => (
        <circle key={`d${a}`} r="1.6" fill="currentColor" stroke="none" transform={`rotate(${a}) translate(0 -116)`} />
      ))}
      {ring(16, 11.25).map((a) => (
        <path key={`o${a}`} d={petal(104, 0.3)} transform={`rotate(${a})`} />
      ))}
      {ring(8).map((a) => (
        <path key={`m${a}`} d={petal(78, 0.36)} transform={`rotate(${a})`} />
      ))}
      {ring(8, 22.5).map((a) => (
        <path key={`i${a}`} d={petal(48, 0.34)} transform={`rotate(${a})`} />
      ))}
      <circle r="12" />
      <circle r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

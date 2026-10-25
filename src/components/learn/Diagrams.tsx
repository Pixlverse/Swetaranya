/**
 * Small line diagrams for the Balance chapter. They carry no words beyond the ones in the copy,
 * and use only brand line colours, so they read as illustration rather than charts.
 */

/** Agni: a steady flame drawn as rings around a warm centre. */
export function AgniMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={className}>
      {[54, 42, 30].map((r, i) => (
        <circle key={r} cx="60" cy="60" r={r} fill="none" stroke="var(--color-blush)" strokeOpacity={0.25 + i * 0.2} strokeWidth="1.2" />
      ))}
      <path d="M60 34c9 11 15 19 15 29a15 15 0 0 1-30 0c0-10 6-18 15-29Z" fill="var(--color-blush)" fillOpacity="0.85" />
      <path d="M60 52c4 5 7 9 7 13a7 7 0 0 1-14 0c0-4 3-8 7-13Z" fill="var(--color-cream)" fillOpacity="0.9" />
    </svg>
  );
}

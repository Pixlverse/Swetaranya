import { SYMBOL } from "./brandmark-paths";

/**
 * Loader made from the brand symbol. Pure SVG + CSS (keyframes in globals.css) so it animates
 * before hydration — the splash depends on that. The air lines trace in and fill, the drop breathes,
 * the land holds still; then it eases back and loops. Reduced motion: a still symbol.
 */
export function SymbolLoader({ className = "h-16 w-16", label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex flex-col items-center">
      <svg viewBox={SYMBOL.viewBox} className={`overflow-visible text-keppel ${className}`} aria-hidden>
        {SYMBOL.air.map((d, i) => (
          <path key={i} d={d} pathLength={1} className="ld-air" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
        <path d={SYMBOL.drop} className="ld-drop" />
        {SYMBOL.land.map((d, i) => (
          <path key={i} d={d} className="ld-land" />
        ))}
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

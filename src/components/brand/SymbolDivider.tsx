import { BrandSymbol } from "./BrandSymbol";

/** The symbol as a section break. Draws once when it enters view — the site's one recurring motif. */
export function SymbolDivider({ tone = "keppel", className = "" }: { tone?: "keppel" | "cream" | "terracotta"; className?: string }) {
  const color = { keppel: "text-keppel", cream: "text-cream/70", terracotta: "text-terracotta" }[tone];
  const rule = { keppel: "bg-keppel/40", cream: "bg-cream/25", terracotta: "bg-terracotta/40" }[tone];
  return (
    <div className={`flex items-center gap-5 ${className}`} aria-hidden>
      <span className={`h-px flex-1 ${rule}`} />
      <BrandSymbol className={`h-9 w-9 ${color}`} mode="draw" inView />
      <span className={`h-px flex-1 ${rule}`} />
    </div>
  );
}

/**
 * A gap the client still has to fill (a figure, a distance, a facility). It shows exactly what the
 * content document says, marked so it can never be mistaken for final copy. Use tone="dark" on nordic.
 */
export function Pending({ children, className = "", tone = "light" }: { children: React.ReactNode; className?: string; tone?: "light" | "dark" }) {
  const colors = tone === "dark" ? "border-blush/60 bg-blush/10 text-blush" : "border-terracotta/60 bg-blush/15 text-clay";
  return (
    <span title="To be confirmed by Swetaranya" className={`rounded-[0.35em] border border-dashed px-1.5 py-0.5 text-[0.92em] ${colors} ${className}`}>
      {children}
    </span>
  );
}

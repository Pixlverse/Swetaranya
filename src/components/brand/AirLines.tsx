import { SYMBOL } from "./brandmark-paths";

/**
 * The symbol's air lines, enlarged and cropped into a surface graphic — the way the brand guide's
 * mockups use them (letterhead, linen, signage). Always static and quiet, so the animated symbol
 * stays the single motion motif.
 */
export function AirLines({ className = "", tone = "keppel" }: { className?: string; tone?: "keppel" | "cream" | "nordic" }) {
  const fill = { keppel: "fill-keppel", cream: "fill-cream", nordic: "fill-nordic" }[tone];
  return (
    <svg viewBox="2 0 44 40" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none ${className}`} aria-hidden>
      <path d={SYMBOL.air[0]} className={fill} />
    </svg>
  );
}

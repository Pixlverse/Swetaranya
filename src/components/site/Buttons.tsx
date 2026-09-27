import Link from "next/link";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

/** The one filled button on the site. Reserved for "Talk to the Physician" and form submits. */
export function PrimaryLink({ className = "", ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-pill bg-keppel px-6 py-3 text-[0.95rem] font-bold text-white transition-[background-color,transform] duration-300 ease-calm hover:bg-nordic active:translate-y-px ${className}`}
    />
  );
}

/** Outlined secondary action. */
export function OutlineLink({ className = "", tone = "dark", ...props }: LinkProps & { tone?: "dark" | "light" }) {
  const colors = tone === "dark" ? "border-nordic text-nordic hover:bg-nordic hover:text-cream" : "border-cream text-cream hover:bg-cream hover:text-nordic";
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-pill border px-6 py-3 text-[0.95rem] font-bold transition-colors duration-300 ease-calm ${colors} ${className}`}
    />
  );
}

/** Plain text link with a keppel underline that thickens on hover. */
export function TextLink({ className = "", ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`font-bold text-nordic underline decoration-keppel decoration-2 underline-offset-[6px] transition-[text-decoration-thickness,color] hover:decoration-[3px] ${className}`}
    />
  );
}

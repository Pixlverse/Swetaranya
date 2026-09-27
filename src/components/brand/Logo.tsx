import Image from "next/image";

/**
 * Official logo files supplied in /public. They have an opaque off-white ground (#F9FAF7), so on
 * dark surfaces they sit inside a `bg-logo-ground` shape of exactly that colour, clipped to the
 * shape (the emblem fills its circle) so no square edge shows. Never place them directly on nordic.
 */
export const LOGOS = {
  primary: { src: "/primary-logo.png", width: 1656, height: 1242, alt: "Swetāranya Ayurvedaśram" },
  secondary: { src: "/secondary-logo.png", width: 1826, height: 624, alt: "Swetāranya Ayurvedaśram" },
  wordmark: { src: "/wordmark.png", width: 2514, height: 420, alt: "Swetāranya" },
  emblem: { src: "/emblem.png", width: 904, height: 876, alt: "Swetāranya Ayurvedaśram emblem" },
} as const;

type Variant = keyof typeof LOGOS;

export function BrandLogo({
  variant,
  className = "",
  priority = false,
  decorative = false,
  sizes,
}: {
  variant: Variant;
  className?: string;
  priority?: boolean;
  /** Set when a parent link already carries the accessible name. */
  decorative?: boolean;
  sizes?: string;
}) {
  const logo = LOGOS[variant];
  return (
    <Image
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={decorative ? "" : logo.alt}
      priority={priority}
      sizes={sizes ?? "240px"}
      className={className}
    />
  );
}

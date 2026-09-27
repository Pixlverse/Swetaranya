import Image from "next/image";
import { BrandSymbol } from "@/components/brand/BrandSymbol";

/** A book, not a card: spine line, slight depth. Typeset stand-in cover until a real one is uploaded. */
export function BookCover({ title, subtitle, cover, className = "" }: { title: string; subtitle?: string; cover?: { url?: string | null; alt?: string | null } | null; className?: string }) {
  const url = cover?.url?.trim();
  return (
    <div className={`relative aspect-[3/4] overflow-hidden rounded-r-soft shadow-[10px_14px_28px_-16px] shadow-nordic/60 ${className}`}>
      {url ? (
        <Image src={url} alt={cover?.alt || `Cover of ${title}`} fill sizes="(min-width: 768px) 280px, 60vw" unoptimized={!url.includes("res.cloudinary.com") && !url.startsWith("/")} className="object-cover" />
      ) : (
        <div className="on-dark flex h-full flex-col justify-between bg-nordic p-6 pl-8 text-cream" role="img" aria-label={`Cover of ${title}`}>
          <BrandSymbol className="h-10 w-10 text-keppel" />
          <div>
            <p className="font-heading text-[1.55rem] leading-tight text-cream">{title}</p>
            {subtitle && <p className="mt-2 text-[0.8rem] text-cream/70">{subtitle}</p>}
          </div>
          <p className="text-[0.7rem] tracking-wide text-cream/50">Swetāranya</p>
        </div>
      )}
      {/* spine */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-ink/25" />
      <span aria-hidden className="absolute inset-y-0 left-3 w-px bg-cream/25" />
    </div>
  );
}

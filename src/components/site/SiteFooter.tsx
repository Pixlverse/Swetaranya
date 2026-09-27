import Link from "next/link";
import { BrandLogo } from "@/components/brand/Logo";
import { AirLines } from "@/components/brand/AirLines";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-nordic text-cream">
      <AirLines className="absolute -right-[8%] -top-1/3 h-[120%] w-[45%] opacity-[0.06]" tone="keppel" />
      <div className="relative mx-auto max-w-[88rem] px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Link href="/" aria-label="Swetāranya Ayurvedaśram — home" className="inline-block h-28 w-28 overflow-hidden rounded-pill bg-logo-ground">
              <BrandLogo variant="emblem" decorative sizes="112px" className="h-full w-full object-cover" />
            </Link>
            <p className="mt-6 max-w-md font-heading text-[1.6rem] leading-snug text-cream">
              A traditional Ayurvedic home in Kerala, where one comes to experience and learn Ayurveda.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-[0.95rem]">
            <div>
              <h2 className="mb-4 font-body text-sm font-bold text-keppel">Contact</h2>
              <address className="not-italic leading-relaxed text-cream/80">
                Swetaranya
                <br />
                Kerala, India
                <br />
                <span className="text-cream/55">(full address to come)</span>
              </address>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="mailto:care@swetaranya.com" className="hover:text-keppel">care@swetaranya.com</a>
                </li>
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-keppel">
                    WhatsApp us
                  </a>
                </li>
              </ul>
            </div>
            <nav aria-label="Footer">
              <h2 className="mb-4 font-body text-sm font-bold text-keppel">Useful</h2>
              <ul className="space-y-2 text-cream/85">
                <li><Link href="/talk-to-the-physician" className="hover:text-keppel">Talk to the Physician</Link></li>
                <li><Link href="/book-a-consultation" className="hover:text-keppel">Book a consultation</Link></li>
                <li><Link href="/a-day-at-swetaranya" className="hover:text-keppel">A day at Swetaranya</Link></li>
                <li><Link href="/ebooks" className="hover:text-keppel">Guides to take home</Link></li>
                <li><Link href="/constitution-check" className="hover:text-keppel">Know your constitution</Link></li>
                <li><Link href="/lifestyle-check" className="hover:text-keppel">Lifestyle Check</Link></li>
                <li><Link href="/faqs" className="hover:text-keppel">FAQs</Link></li>
                <li><Link href="/privacy" className="hover:text-keppel">Privacy</Link></li>
                <li><Link href="/medical-disclaimer" className="hover:text-keppel">Medical disclaimer</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-16 border-t border-cream/15 pt-6 text-[0.82rem] leading-relaxed text-cream/60 lg:flex lg:justify-between lg:gap-12">
          <p className="max-w-3xl">{MEDICAL_DISCLAIMER}</p>
          <p className="mt-4 shrink-0 lg:mt-0">© {year} Swetaranya</p>
        </div>
      </div>
    </footer>
  );
}

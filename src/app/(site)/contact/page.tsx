import type { Metadata } from "next";
import { CONTACT_EMAIL, CONTACT_PAGE_LINES } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Contact", description: "Phone numbers, WhatsApp and email for Swetaranya." };

/**
 * The numbers are the page: each set large in Fraunces so it can be read and tapped from a phone, with its
 * hours or purpose beneath exactly as the client gave it. Email and WhatsApp follow on a hairline.
 */
export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8 md:pt-20">
      <h1 className="text-[clamp(2.1rem,4.04vw,3.1rem)]">Contact</h1>

      <ul className="mt-10 divide-y divide-nordic/12 border-y border-nordic/12">
        {CONTACT_PAGE_LINES.map((l) => (
          <li key={l.tel} className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <a
              href={`tel:${l.tel}`}
              className="font-heading text-[clamp(1.7rem,3.2vw,2.3rem)] leading-tight tracking-[-0.02em] text-nordic underline decoration-keppel/0 decoration-2 underline-offset-[6px] transition-colors hover:decoration-keppel focus-visible:decoration-keppel"
            >
              {l.number}
            </a>
            <span className="text-[1rem] text-ink/70">{l.note}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-10 space-y-3 text-[1.05rem]">
        <li>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-nordic underline decoration-keppel decoration-2 underline-offset-4 hover:text-keppel">
            {CONTACT_EMAIL}
          </a>
        </li>
        <li>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-nordic underline decoration-keppel decoration-2 underline-offset-4 hover:text-keppel">
            WhatsApp us
          </a>
        </li>
      </ul>
    </article>
  );
}

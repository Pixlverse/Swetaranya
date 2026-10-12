import type { Metadata } from "next";
import { BookConsultation } from "@/components/booking/BookConsultation";
import { OrnamentPattern } from "@/components/brand/OrnamentPattern";
import { TextLink } from "@/components/site/Buttons";
import { PHYSICIAN_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: `Choose a time for an online or in-person consultation with ${PHYSICIAN_NAME} at Swetaranya.`,
};

export default function BookConsultationPage() {
  return (
    <div className="mx-auto grid max-w-[88rem] gap-14 px-5 pb-24 pt-10 sm:px-8 md:pt-16 lg:grid-cols-12">
      <aside className="lg:col-span-4">
        <div className="relative isolate overflow-hidden rounded-soft bg-keppel/10 p-8 lg:sticky lg:top-32">
          <OrnamentPattern opacity={0.06} className="-z-10" />
          <h1 className="text-[clamp(2rem,3.5vw,2.8rem)] leading-[0.98]">Book a consultation</h1>
          <p className="mt-5 text-ink/80">
            About 45 minutes with {PHYSICIAN_NAME}, online or at Swetaranya. Bring your questions, and any reports you have — you&apos;ll get a
            private link to share them after booking.
          </p>
          <p className="mt-4 text-[0.88rem] text-ink/60">Placeholder: consultation fee policy to be confirmed.</p>
          <div className="mt-8 border-t border-nordic/15 pt-6">
            <p className="text-[0.95rem] text-ink/75">Not sure yet, or writing for someone else?</p>
            <TextLink href="/talk-to-the-physician" className="mt-2 inline-block">
              Write to the physician instead
            </TextLink>
          </div>
        </div>
      </aside>
      <section className="lg:col-span-7 lg:col-start-6" aria-label="Booking">
        <BookConsultation />
      </section>
    </div>
  );
}

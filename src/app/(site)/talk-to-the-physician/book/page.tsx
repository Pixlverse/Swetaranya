import type { Metadata } from "next";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { PrimaryLink } from "@/components/site/Buttons";
import { verifyToken } from "@/lib/tokens";
import { connectDB } from "@/lib/db";
import { AvailabilitySlot, ConsultationBooking, Enquiry } from "@/models";
import { PHYSICIAN_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Choose a consultation time", robots: { index: false } };

export default async function BookPage({ searchParams }: PageProps<"/talk-to-the-physician/book">) {
  const { t } = await searchParams;
  const token = Array.isArray(t) ? t[0] : t;
  const enquiryId = verifyToken(token, "booking");

  await connectDB();
  const enquiry = enquiryId ? await Enquiry.findById(enquiryId).select("name consultationMode").lean() : null;

  if (!token || !enquiry) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <h1 className="text-[clamp(2rem,3.5vw,2.8rem)]">This booking link isn&apos;t valid any more.</h1>
        <p className="mt-6 text-[1.05rem] text-ink/75">
          Booking links last two weeks. Write to us again and we&apos;ll send you a new one — or simply reply to our email.
        </p>
        <PrimaryLink href="/talk-to-the-physician" className="mt-8">Talk to the Physician</PrimaryLink>
      </div>
    );
  }

  const existing = await ConsultationBooking.findOne({ enquiryId, cancelled: false }).lean();
  const existingSlot = existing ? await AvailabilitySlot.findById(existing.slotId).select("startTime mode").lean() : null;

  return (
    <div className="mx-auto grid max-w-[88rem] gap-12 px-5 pb-24 pt-14 sm:px-8 md:pt-20 lg:grid-cols-12">
      <header className="lg:col-span-4">
        <h1 className="text-[clamp(2.1rem,3.77vw,3.1rem)] leading-[0.98]">Choose a time to talk</h1>
        <p className="mt-6 text-[1.05rem] text-ink/80">
          Your first consultation with {PHYSICIAN_NAME} lasts about 45 minutes. Bring your questions, and any reports you have.
        </p>
        <p className="mt-4 text-[0.9rem] text-ink/60">Placeholder: confirm consultation fee policy with the Swetaranya team before launch.</p>
      </header>
      <section className="lg:col-span-7 lg:col-start-6" aria-label="Available times">
        {existing && existingSlot ? (
          <div>
            <p className="font-heading text-[1.8rem] text-nordic">You already have a consultation booked.</p>
            <p className="mt-3 text-ink/75">
              {new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: existing.timezone }).format(existingSlot.startTime)} ({existing.timezone.replace(/_/g, " ")}).
              To change it, reply to our email or message us on WhatsApp.
            </p>
          </div>
        ) : (
          <SlotPicker token={token} defaultMode={enquiry.consultationMode as "online" | "in_person"} name={enquiry.name} />
        )}
      </section>
    </div>
  );
}

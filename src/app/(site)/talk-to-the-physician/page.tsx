import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Placeholder } from "@/components/brand/Placeholder";
import { HELP_TOPICS, PHYSICIAN_NAME } from "@/lib/constants";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Talk to the Physician",
  description: "Write to Dr. Thrivikraman Veluthat at Swetaranya. A member of the family replies personally, usually within a day.",
};

/** Map a condition name passed from a condition page (?topic=) onto one of the form's help topics. */
function topicFrom(raw: string | string[] | undefined) {
  const t = (Array.isArray(raw) ? raw[0] : raw)?.toLowerCase() ?? "";
  const rules: [RegExp, (typeof HELP_TOPICS)[number]][] = [
    [/back|neck/, "Back or neck pain"],
    [/arthritis|joint/, "Arthritis or joint pain"],
    [/parkinson/, "Parkinsonism"],
    [/sleep|insomnia|stress/, "Sleep, stress or anxiety"],
    [/weight|obesity/, "Weight and metabolism"],
  ];
  return rules.find(([re]) => re.test(t))?.[1];
}

export default async function TalkPage({ searchParams }: PageProps<"/talk-to-the-physician">) {
  const { topic } = await searchParams;
  const retentionDays = Number(process.env.REPORT_RETENTION_DAYS ?? 365);

  return (
    <div className="mx-auto grid max-w-[88rem] gap-14 px-5 pb-24 pt-14 sm:px-8 md:pt-20 lg:grid-cols-12">
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <h1 className="text-[clamp(2.8rem,6.4vw,5.2rem)] leading-[0.96] tracking-[-0.02em]">Write to us as you would to a doctor you trust.</h1>
          <div className="mt-10 flex items-start gap-5">
            <Placeholder label={`${PHYSICIAN_NAME}`} shape="drop" className="aspect-[4/5] w-24 shrink-0" />
            <p className="font-heading text-[1.2rem] italic leading-snug text-nordic">
              &ldquo;Tell me what is troubling you, in your own words. I read every message myself before we reply.&rdquo;
              <span className="mt-2 block font-body text-[0.9rem] not-italic text-ink/65">{PHYSICIAN_NAME}</span>
            </p>
          </div>
          <div className="mt-12 border-t border-nordic/15 pt-6">
            <h2 className="font-body text-[0.95rem] font-bold text-keppel">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {[
                "A personal reply by email or WhatsApp, usually within a day.",
                "A first consultation — online or in person — at a time that suits you.",
                "If Swetaranya is right for you, we plan your stay together.",
              ].map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="font-heading text-[1.4rem] leading-none text-keppel">{i + 1}</span>
                  <span className="text-ink/80">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-[0.95rem] text-ink/70">
              Already know you&apos;d like to talk?{" "}
              <Link href="/book-a-consultation" className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                Book a consultation time
              </Link>
              .
            </p>
            <p className="mt-3 text-[0.95rem] text-ink/70">
              Prefer WhatsApp?{" "}
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-nordic underline decoration-keppel underline-offset-4">
                Message us directly
              </a>
              .
            </p>
          </div>
        </div>
      </aside>
      <section className="lg:col-span-6 lg:col-start-7" aria-label="Enquiry form">
        <EnquiryForm initialTopic={topicFrom(topic)} retentionDays={retentionDays} />
      </section>
    </div>
  );
}

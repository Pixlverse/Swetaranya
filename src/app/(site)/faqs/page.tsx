import type { Metadata } from "next";
import { FaqAccordion } from "@/components/treatments/FaqAccordion";
import { PrimaryLink } from "@/components/site/Buttons";
import { getPageContent } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "FAQs", description: "Answers to common questions about consultations, travel and staying at Swetaranya." };

export default async function FaqsPage() {
  const c = await getPageContent("faqs");
  // Questions are one flat editable list; the "group" field decides which heading they sit under.
  const groups = new Map<string, { question: string; answer: string }[]>();
  for (const q of c.questions.items) groups.set(q.group || "General", [...(groups.get(q.group || "General") ?? []), q]);

  return (
    <div className="mx-auto max-w-[88rem] px-5 pb-24 pt-14 sm:px-8 md:pt-20">
      <h1 className="max-w-3xl text-[clamp(2.1rem,3.96vw,3.3rem)] leading-[0.98]">{c.intro.heading}</h1>
      <div className="mt-14 space-y-16">
        {[...groups.entries()].map(([group, items], i) => (
          <section key={group} className="grid gap-6 md:grid-cols-12" aria-labelledby={`faq-group-${i}`}>
            <h2 id={`faq-group-${i}`} className="text-[1.8rem] md:col-span-4">
              {group}
            </h2>
            <div className="md:col-span-8">
              <FaqAccordion faqs={items} />
            </div>
          </section>
        ))}
      </div>
      <div className="mt-20 flex flex-col gap-6 border-t border-nordic/10 pt-10 md:flex-row md:items-center md:justify-between">
        <p className="font-heading text-[1.7rem] text-nordic">Something not answered here?</p>
        <PrimaryLink href="/talk-to-the-physician">Talk to the Physician</PrimaryLink>
      </div>
    </div>
  );
}

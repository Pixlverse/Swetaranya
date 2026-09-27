import type { Metadata } from "next";
import { LIFESTYLE_CHECK_DISCLAIMER, MEDICAL_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = { title: "Medical disclaimer" };

export default function MedicalDisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8 md:pt-20">
      <h1 className="text-[clamp(2.6rem,6vw,4.6rem)]">Medical disclaimer</h1>
      <div className="prose-swet mt-10">
        <p className="font-heading text-[1.4rem] leading-snug text-nordic">{MEDICAL_DISCLAIMER}</p>
        <h2>No promises of results</h2>
        <p>Ayurveda can help many people, but no treatment works the same way for everyone. We do not claim to cure any disease, and we will not promise outcomes. Descriptions of conditions and therapies on this site explain our approach; they are not a guarantee.</p>
        <h2>Your existing care</h2>
        <p>Please do not stop or change any prescribed medication without speaking to the doctor who prescribed it. Our physician plans care alongside your existing treatment.</p>
        <h2>The Lifestyle Check</h2>
        <p>{LIFESTYLE_CHECK_DISCLAIMER}</p>
        <h2>Guest stories</h2>
        <p>Stories on this site are shared by real guests with their written consent. They describe individual experiences, which will differ from yours.</p>
      </div>
    </article>
  );
}

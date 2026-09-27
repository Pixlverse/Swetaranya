import type { Metadata } from "next";
import { ConstitutionCheck } from "@/components/constitution/ConstitutionCheck";

export const metadata: Metadata = {
  title: "Know Your Constitution",
  description: "Twelve questions on body, digestion, sleep and temperament that show which of Vata, Pitta and Kapha may lead in you — a self-reflection, not a diagnosis.",
};

export default function ConstitutionCheckPage() {
  return (
    <div className="mx-auto max-w-[88rem] px-5 pb-24 pt-10 sm:px-8 md:pt-16">
      <ConstitutionCheck />
    </div>
  );
}

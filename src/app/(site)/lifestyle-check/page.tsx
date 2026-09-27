import type { Metadata } from "next";
import { LifestyleCheck } from "@/components/lifestyle/LifestyleCheck";

export const metadata: Metadata = {
  title: "Lifestyle Check",
  description: "Eight questions about sleep, food, digestion, movement, stress, routine, rest and energy — a self-awareness snapshot, not a diagnosis.",
};

export default function LifestyleCheckPage() {
  return (
    <div className="mx-auto max-w-[88rem] px-5 pb-24 pt-14 sm:px-8 md:pt-20">
      <LifestyleCheck />
    </div>
  );
}

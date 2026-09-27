import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NotFoundContent } from "@/components/site/NotFoundContent";

/** Unmatched URLs don't pass through the (site) layout, so this brings the site chrome with it. */
export default function RootNotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-[60vh] pt-24 sm:pt-28">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}

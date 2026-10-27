import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageTransition } from "@/components/site/PageTransition";
import { UtmCapture } from "@/components/site/UtmCapture";
import { SiteSplash } from "@/components/site/SiteSplash";
import { FloatingBook } from "@/components/site/FloatingBook";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteSplash />
      <UtmCapture />
      <SiteHeader />
      {/* The nav floats over the page; this offset keeps content clear of it (and of the top bar on wide screens). */}
      <main id="main" className="min-h-[60vh] pt-24 sm:pt-28 min-[1360px]:pt-36">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <FloatingBook />
    </>
  );
}

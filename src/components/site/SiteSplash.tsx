import { SymbolLoader } from "@/components/brand/SymbolLoader";
import { BrandLogo } from "@/components/brand/Logo";
import { SplashController } from "./SplashController";

/**
 * First-visit splash. Server-rendered so it covers the page from the first paint; the inline script
 * runs before the splash is parsed and hides it for anyone who has already seen it this session,
 * so repeat loads never flash. SplashController lifts it once the page has loaded.
 */
export function SiteSplash() {
  return (
    <>
      <script
        // Runs during HTML parsing, before the splash element below exists.
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("swet_splash")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.splash="seen"}catch(e){}`,
        }}
      />
      <div id="site-splash" className="site-splash fixed inset-0 z-[80] grid place-items-center bg-cream" aria-hidden>
        <div className="flex flex-col items-center gap-6">
          <SymbolLoader className="h-24 w-24 sm:h-28 sm:w-28" label="Opening Swetāranya" />
          <BrandLogo variant="wordmark" priority sizes="200px" className="h-7 w-auto opacity-80 sm:h-8" />
        </div>
      </div>
      <SplashController />
    </>
  );
}

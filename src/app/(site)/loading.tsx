import { SymbolLoader } from "@/components/brand/SymbolLoader";

/** Shown while a page's data loads on navigation. */
export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5">
      <SymbolLoader className="h-16 w-16" label="Loading the page" />
    </div>
  );
}

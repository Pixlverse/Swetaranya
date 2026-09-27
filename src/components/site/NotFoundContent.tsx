import { BrandLogo } from "@/components/brand/Logo";
import { TextLink } from "@/components/site/Buttons";

export function NotFoundContent() {
  return (
    <div className="mx-auto flex max-w-[88rem] flex-col items-start px-5 py-24 sm:px-8 md:py-32">
      <BrandLogo variant="primary" sizes="160px" className="h-28 w-auto" />
      <h1 className="mt-10 max-w-2xl text-[clamp(2.4rem,6vw,4.6rem)] leading-[1]">This room doesn&apos;t seem to exist.</h1>
      <p className="mt-6 max-w-lg text-ink/75">The page may have moved. The rest of the house is still here.</p>
      <TextLink href="/" className="mt-8">Back to the beginning</TextLink>
    </div>
  );
}

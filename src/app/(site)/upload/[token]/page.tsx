import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { UploadGrant } from "@/models";
import { sha256 } from "@/lib/tokens";
import { StandaloneUploader } from "@/components/enquiry/StandaloneUploader";
import { TextLink } from "@/components/site/Buttons";

export const metadata: Metadata = { title: "Upload medical reports privately", robots: { index: false, follow: false } };

export default async function UploadPage({ params }: PageProps<"/upload/[token]">) {
  const { token } = await params;
  await connectDB();
  const grant = await UploadGrant.exists({ tokenHash: sha256(token), usedAt: null, expiresAt: { $gt: new Date() } });
  const retentionDays = Number(process.env.REPORT_RETENTION_DAYS ?? 365);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-14 sm:px-8 md:pt-20">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] leading-[1]">Share your reports privately</h1>
      {grant ? (
        <>
          <p className="mt-6 text-[1.05rem] text-ink/80">
            This page sends a report straight to private, encrypted storage. Only the physician can open it. The link works once, so if you have
            several reports, please combine them into one PDF — or reply to our email and we&apos;ll send another link.
          </p>
          <div className="mt-10 border-t border-nordic/15 pt-10">
            <StandaloneUploader token={token} retentionDays={retentionDays} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 text-[1.05rem] text-ink/80">
            This upload link has already been used or has expired. For your privacy, each link works only once. Reply to our email or message us
            on WhatsApp and we&apos;ll send a new one.
          </p>
          <TextLink href="/talk-to-the-physician" className="mt-8 inline-block">Contact us</TextLink>
        </>
      )}
    </div>
  );
}

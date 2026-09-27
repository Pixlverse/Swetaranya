import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy", description: "How Swetaranya handles your personal and medical information." };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8 md:pt-20">
      <h1 className="text-[clamp(2.6rem,6vw,4.6rem)]">Privacy</h1>
      <p className="mt-4 border border-dashed border-terracotta p-4 text-[0.92rem] text-ink/75">
        Placeholder policy — to be reviewed by Swetaranya&apos;s legal adviser before launch.
      </p>
      <div className="prose-swet mt-10">
        <h2>What we collect</h2>
        <p>When you write to us, we keep what you share: your name, country, WhatsApp number, email, what you need help with, and any message. If you take the Lifestyle Check, we keep your answers, and your email only if you give it.</p>
        <h2>Medical reports</h2>
        <p>Reports you upload are stored in a private, encrypted storage bucket separate from the rest of the website. They can only be opened by our physician through short-lived secure links, and are kept only for the retention period shown when you upload them, after which they are deleted.</p>
        <h2>How we use it</h2>
        <p>Only to reply to you, and to plan your consultation or stay. We do not sell or share your information.</p>
        <h2>Where you came from</h2>
        <p>We note which link or campaign brought you to the site (for example, a search or a social post) so we understand how people find us. This is stored with your enquiry.</p>
        <h2>Your choices</h2>
        <p>You can ask us to show you, correct or delete what we hold about you at any time by writing to care@swetaranya.com.</p>
      </div>
    </article>
  );
}

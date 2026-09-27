import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Swetaranya admin" },
  robots: { index: false, follow: false },
};

/** Admin is a tool, not a brand surface: sans only (Orkney), including headings (globals.css sets h1–h4 to the Taviraj serif). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream font-body text-ink [&_:is(h1,h2,h3,h4)]:font-body [&_:is(h1,h2,h3,h4)]:font-bold [&_:is(h1,h2,h3,h4)]:tracking-normal">
      {children}
    </div>
  );
}

import type { Metadata } from "next";
import { Taviraj } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Brand typography (Brand Guidelines v01, p.12): Taviraj for titles and headings, Orkney for body.
const taviraj = Taviraj({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-taviraj",
  display: "swap",
});

// Orkney (SIL OFL) is not on Google Fonts, so it is self-hosted.
const orkney = localFont({
  src: [
    { path: "../fonts/orkney/Orkney-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/orkney/Orkney-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/orkney/Orkney-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/orkney/Orkney-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/orkney/Orkney-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-orkney",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Swetaranya — a traditional Ayurvedic home in Kerala",
    template: "%s — Swetaranya",
  },
  description:
    "A traditional Ayurvedic home in Kerala where one comes to experience and learn Ayurveda, led by Chief Physician Dr. Thrivikraman Veluthat.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${taviraj.variable} ${orkney.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

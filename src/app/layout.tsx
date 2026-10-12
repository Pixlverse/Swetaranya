import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Headings: Clarity City (SIL OFL, VMware). Not on Google Fonts, so it is self-hosted like Orkney.
const clarityCity = localFont({
  src: [
    { path: "../fonts/clarity-city/ClarityCity-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/clarity-city/ClarityCity-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/clarity-city/ClarityCity-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/clarity-city/ClarityCity-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/clarity-city/ClarityCity-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-clarity-city",
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
    <html lang="en" className={`${clarityCity.variable} ${orkney.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

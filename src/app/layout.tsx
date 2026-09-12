import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const sans = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const display = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://balloons-frc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BALLOONS | FRC Team · TED Antalya Koleji",
  description:
    "BALLOONS is the rookie FIRST Robotics Competition team at TED Antalya Koleji in Antalya, Türkiye.",
  openGraph: {
    title: "BALLOONS | FRC Team · TED Antalya Koleji",
    description: "Rookie FRC team at TED Antalya Koleji. Looking for season partners.",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: "BALLOONS | FRC Team · TED Antalya Koleji",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}

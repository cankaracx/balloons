import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Change this to your real domain after deploying.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://balloons-frc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BALLOONS · Rookie FRC Robotics Team — TED Antalya Koleji",
    template: "%s · BALLOONS Robotics",
  },
  description:
    "BALLOONS is the rookie FIRST Robotics Competition team of TED Antalya Koleji — young engineers building something prestigious from the ground up. Become a founding sponsor.",
  keywords: [
    "BALLOONS",
    "FRC",
    "FIRST Robotics Competition",
    "TED Antalya Koleji",
    "robotics team",
    "Antalya",
    "rookie team",
    "STEM",
    "sponsorship",
  ],
  openGraph: {
    type: "website",
    title: "BALLOONS · Rookie FRC Robotics Team",
    description:
      "TED Antalya Koleji's rookie FRC team — building our future one mechanism, one idea, and one bold dream at a time.",
    siteName: "BALLOONS Robotics",
  },
  twitter: {
    card: "summary_large_image",
    title: "BALLOONS · Rookie FRC Robotics Team",
    description: "Young engineers building something prestigious from the ground up. Become a founding sponsor.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsTeam",
  name: "BALLOONS Robotics",
  sport: "FIRST Robotics Competition",
  memberOf: { "@type": "EducationalOrganization", name: "TED Antalya Koleji" },
  foundingDate: "2026",
  location: { "@type": "Place", address: "Antalya, Türkiye" },
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://balloons-frc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BALLOONS — Rookie FRC Robotics Team · TED Antalya Koleji",
  description:
    "BALLOONS is the rookie FIRST Robotics Competition team at TED Antalya Koleji. Small by design, built to expand — and looking for founding sponsors.",
  openGraph: {
    title: "BALLOONS — Rookie FRC Robotics Team",
    description: "Small by design, built to expand. Meet our rookie FRC team and become a founding sponsor.",
    type: "website",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "BALLOONS — Rookie FRC Robotics Team" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

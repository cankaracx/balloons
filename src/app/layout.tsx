import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://balloons-frc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BALLOONS — TED Antalya Koleji",
  description: "FRC team at TED Antalya Koleji, Antalya.",
  openGraph: {
    title: "BALLOONS — TED Antalya Koleji",
    description: "FRC team at TED Antalya Koleji, Antalya.",
    type: "website",
    url: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

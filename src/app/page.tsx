import type { Metadata } from "next";
import { loadData } from "@/lib/store";
import { isAuthenticated } from "@/lib/guard";
import { pick } from "@/lib/i18n";
import Site from "@/components/site/Site";
import JsonLd from "@/components/site/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await loadData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balloons-zeta.vercel.app";
  const title = `${data.brand.name} — Rookie FRC Robotics Team · TED Antalya Koleji`;
  const description = pick(data.hero.sub, "en");
  const teamNo = data.brand.teamNumber?.trim();
  const descWithTeam = teamNo ? `${description} FRC Team ${teamNo}.` : description;

  return {
    title,
    description: descWithTeam,
    openGraph: {
      title: `${data.brand.name} — Rookie FRC Robotics Team`,
      description: descWithTeam,
      type: "website",
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.brand.name} — Rookie FRC Robotics Team`,
      description: descWithTeam,
    },
  };
}

export default async function HomePage() {
  const data = await loadData();
  const canEdit = await isAuthenticated();
  return (
    <>
      <JsonLd data={data} />
      <Site data={data} canEdit={canEdit} />
    </>
  );
}
